import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseAmount, summarize } from './domain.mjs';
test('valores monetários são convertidos em centavos sem ponto flutuante', () => {
  assert.equal(parseAmount('12,34'), 1234);
  assert.equal(parseAmount('12'), 1200);
  assert.throws(() => parseAmount('0'));
  assert.throws(() => parseAmount('12,345'));
  assert.throws(() => parseAmount('-1'));
});
test('resumo separa receitas e despesas e calcula saldo', () => {
  assert.deepEqual(summarize([{kind:'receita',amount:10000},{kind:'despesa',amount:2500}]), {income:10000,expense:2500,balance:7500});
});
test('valores acima do limite do banco são recusados', () => {
  assert.throws(() => parseAmount('30000000'));
});