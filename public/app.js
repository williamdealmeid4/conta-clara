const $=selector=>document.querySelector(selector);
const money=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const now=new Date();
const localDate=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
$('#month').value=localDate.slice(0,7);
$('#form').elements.date.value=localDate;
async function request(path, options={}) { const response=await fetch(path,{headers:{'Content-Type':'application/json'},...options}); const data=await response.json(); if(!response.ok) throw new Error(data.error || 'Não foi possível concluir a operação.'); return data; }
async function refresh(){
  const data=await request(`/api/entries?month=${encodeURIComponent($('#month').value)}`);
  $('#balance').textContent=money.format(data.summary.balance/100); $('#income').textContent=money.format(data.summary.income/100); $('#expense').textContent=money.format(data.summary.expense/100);
  const list=$('#entries'); list.replaceChildren();
  for(const entry of data.entries){
    const li=document.createElement('li'), info=document.createElement('div'), title=document.createElement('strong'), detail=document.createElement('small'), value=document.createElement('span');
    info.className='entry-info'; title.textContent=entry.description; const [year,month,day]=entry.date.split('-'); detail.textContent=`${entry.category} · ${day}/${month}/${year}`;
    value.className=`entry-value ${entry.kind==='receita'?'income':''}`; value.textContent=`${entry.kind==='receita'?'+':'−'} ${money.format(entry.amount/100)}`; info.append(title,detail); li.append(info,value); list.append(li);
  }
  $('#empty').hidden=data.entries.length>0;
}
$('#month').addEventListener('change',()=>refresh().catch(error=>$('#message').textContent=error.message));
$('#form').addEventListener('submit',async event=>{event.preventDefault(); const form=event.currentTarget, values=new FormData(form); try{ await request('/api/entries',{method:'POST',body:JSON.stringify(Object.fromEntries(values))}); $('#month').value=String(values.get('date')).slice(0,7); form.reset(); form.elements.date.value=localDate; await refresh(); $('#message').textContent='Lançamento adicionado.'; }catch(error){$('#message').textContent=error.message;} });
refresh().catch(error=>$('#message').textContent=error.message);