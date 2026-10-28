export function parseAmount(input) {
  if (typeof input !== 'string' || !/^\d{1,9}([,.]\d{1,2})?$/.test(input)) throw new Error('Valor inválido');
  const [whole, fraction=''] = input.replace(',', '.').split('.');
  const cents=Number(whole)*100+Number(fraction.padEnd(2,'0'));
  if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 2147483647) throw new Error('Valor inválido');
  return cents;
}
export function summarize(entries) {
  let income=0, expense=0;
  for (const entry of entries) { if (entry.kind === 'receita') income+=entry.amount; else if (entry.kind === 'despesa') expense+=entry.amount; }
  return {income,expense,balance:income-expense};
}