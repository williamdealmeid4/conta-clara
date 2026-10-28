import express from 'express';
import pg from 'pg';
import { parseAmount, summarize } from './domain.mjs';
if (!process.env.DATABASE_URL) throw new Error('Defina DATABASE_URL antes de iniciar.');
const pool = new pg.Pool({connectionString:process.env.DATABASE_URL});
const app = express();
app.use(express.json({limit:'32kb'})); app.use(express.static('public'));
app.get('/api/entries', async (req,res) => {
  const month=String(req.query.month || '');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return res.status(400).json({error:'Informe um mês válido.'});
  try {
    const result=await pool.query("SELECT id,description,category,kind,amount,to_char(entry_date, 'YYYY-MM-DD') AS date FROM entries WHERE entry_date >= $1::date AND entry_date < ($1::date + interval '1 month') ORDER BY entry_date DESC,id DESC",[`${month}-01`]);
    return res.json({entries:result.rows, summary:summarize(result.rows)});
  } catch { return res.status(500).json({error:'Não foi possível consultar os lançamentos.'}); }
});
app.post('/api/entries', async (req,res) => {
  const {description, category, kind, value, date}=req.body ?? {};
  if (typeof description !== 'string' || !description.trim() || description.trim().length>120 || typeof category !== 'string' || !category.trim() || category.trim().length>80 || !['receita','despesa'].includes(kind) || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({error:'Confira os campos do lançamento.'});
  const parsedDate=new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0,10)!==date) return res.status(400).json({error:'Informe uma data válida.'});
  let amount:number; try {amount=parseAmount(value);} catch {return res.status(400).json({error:'Informe um valor positivo válido.'});}
  try { const result=await pool.query('INSERT INTO entries(description,category,kind,amount,entry_date) VALUES($1,$2,$3,$4,$5) RETURNING id',[description.trim(),category.trim(),kind,amount,date]); return res.status(201).json(result.rows[0]); }
  catch {return res.status(500).json({error:'Não foi possível salvar o lançamento.'});}
});
app.listen(Number(process.env.PORT || 3001),'127.0.0.1',()=>console.log('Finanças em http://127.0.0.1:3001'));