import {describe,it,expect} from 'vitest';
import {cards} from '../data/cards';
import {demoProfile,evaluate,rank,bestForPurchase,breakEven} from '../lib/engine';
const find=(id:string)=>cards.find(c=>c.id===id)!;
describe('VALORA deterministic economics',()=>{
 it('subtracts annual fees exactly',()=>{const p={...demoProfile,spending:Object.fromEntries(Object.keys(demoProfile.spending).map(k=>[k,0])) as typeof demoProfile.spending,foreignMonthly:0,bonusEligible:false,trips:0,loungeVisits:0};expect(evaluate(find('grove'),p).ongoing).toBe(-65)});
 it('applies category multiplier and cap with 1x after cap',()=>{const p={...demoProfile,spending:{...demoProfile.spending,groceries:1000}};expect(evaluate(find('grove'),p).breakdown.groceries).toBeCloseTo(9000*.04+3000*.01)});
 it('deducts FX fees without duplicate rewards',()=>{const p={...demoProfile,foreignMonthly:100};const e=evaluate(find('aurora'),p);expect(e.fxCost).toBeCloseTo(30);expect(e.gross).toBe(evaluate(find('aurora'),{...p,foreignMonthly:0}).gross)});
 it('keeps bonus only in first year when threshold met',()=>{const e=evaluate(find('summit'),demoProfile);expect(e.firstYear-e.ongoing).toBeCloseTo(e.bonus, 2);expect(e.eligibleBonus).toBe(true)});
 it('excludes ineligible welcome bonuses',()=>{const e=evaluate(find('summit'),{...demoProfile,bonusEligible:false});expect(e.bonus).toBe(0);expect(e.firstYear).toBe(e.ongoing)});
 it('models interest only if balance carried',()=>{const a=evaluate(find('aurora'),{...demoProfile,payInFull:false,balance:3000});expect(a.interestCost).toBeCloseTo(3000*find('aurora').apr);expect(evaluate(find('aurora'),demoProfile).interestCost).toBe(0)});
 it('caps usable travel benefits',()=>{const p={...demoProfile,trips:0,loungeVisits:0};expect(evaluate(find('summit'),p).benefitValue).toBe(0)});
 it('keeps business and personal card rankings separate',()=>{expect(rank(cards,demoProfile).every(x=>x.card.kind==='consumer')).toBe(true);expect(rank(cards,{...demoProfile,business:true}).every(x=>x.card.kind==='business')).toBe(true)});
 it('respects annual fee tolerance',()=>{expect(rank(cards,{...demoProfile,annualFeeLimit:0}).every(x=>x.card.annualFee===0)).toBe(true)});
 it('chooses among owned cards only',()=>{const r=bestForPurchase(cards,demoProfile,'groceries',100);expect(r.length).toBe(2);expect(r.every(x=>demoProfile.wallet.includes(x.card.id))).toBe(true)});
 it('computes break even as competing net minus premium net',()=>{const b=breakEven(find('summit'),find('quiet'),demoProfile);const diff=evaluate(find('summit'),demoProfile).ongoing-evaluate(find('quiet'),demoProfile).ongoing;expect(b.difference).toBeCloseTo(diff);expect(b.additionalValueRequired).toBe(Math.max(0,-diff))});
 it('does not mutate profile during evaluation',()=>{const before=JSON.stringify(demoProfile);rank(cards,demoProfile);expect(JSON.stringify(demoProfile)).toBe(before)});
});
describe('wallet-only mode and numerical boundaries',()=>{
 it('ranks only existing cards when not shopping for new cards',()=>{const r=rank(cards,{...demoProfile,newCard:false});expect(r.every(x=>demoProfile.wallet.includes(x.card.id))).toBe(true)});
 it('never fabricates a purchase reward for zero amount',()=>{expect(bestForPurchase(cards,demoProfile,'dining',0)).toEqual([])});
 it('recalculates when spending changes',()=>{const before=evaluate(find('grove'),demoProfile).ongoing;const after=evaluate(find('grove'),{...demoProfile,spending:{...demoProfile.spending,groceries:950}}).ongoing;expect(after).toBeGreaterThan(before)});
});
