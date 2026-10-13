import { spendingKeys, type Card, type Profile, type Evaluation, type Category } from './types';
export const money=(n:number)=>new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(n);
export const demoProfile: Profile={name:'Alex Morgan',country:'CA',currency:'CAD',persona:'everyday',spending:{groceries:650,dining:320,gas:130,transit:120,travel:220,shopping:260,subscriptions:85,other:300},foreignMonthly:75,trips:2,loungeVisits:1,rewardPreference:'cashback',annualFeeLimit:250,payInFull:true,balance:0,bonusEligible:true,wallet:['aurora','quiet'],airline:'No preference',hotel:'No preference',simplicity:60,newCard:true,business:false};
export const travelerProfile: Profile={...demoProfile,name:'Jordan Lee',persona:'traveler',spending:{...demoProfile.spending,travel:1250,dining:480},foreignMonthly:450,trips:6,loungeVisits:4,rewardPreference:'travel',wallet:['summit','aurora']};
export const founderProfile: Profile={...demoProfile,name:'Taylor Chen',persona:'founder',business:true,spending:{groceries:0,dining:330,gas:220,transit:100,travel:650,shopping:980,subscriptions:1200,other:700},foreignMonthly:300,trips:4,loungeVisits:2,rewardPreference:'flexible',wallet:['ledger'],bonusEligible:true};
export const monthlyTotal=(p:Profile)=>spendingKeys.reduce((s,k)=>s+(p.spending[k]||0),0);
const positive=(n:number)=>Number.isFinite(n)?Math.max(0,n):0;
export function evaluate(card:Card,p:Profile): Evaluation {
  const breakdown:Record<string,number>={}; let gross=0;
  for(const key of spendingKeys){
    const annual=positive(p.spending[key])*12;
    const capped=Math.min(annual,card.cap[key]??Infinity);
    // Spend beyond category cap earns 1x. 1 unit at base CAD redemption value.
    const value=(capped*card.earn[key]+(annual-capped))*card.base;
    breakdown[key]=value;gross+=value;
  }
  // Foreign spend is a subset of category spend: FX costs apply, no second rewards allocation.
  const fxCost=positive(p.foreignMonthly)*12*card.fxFee;
  // Simple illustrative interest model: average carried balance * disclosed annual APR.
  const interestCost=p.payInFull?0:positive(p.balance)*card.apr;
  const benefitValue=card.benefits.reduce((s,b)=>{
    const units=b.requiresTravel?Math.min(b.max,positive(p.trips),positive(p.loungeVisits||0)+(b.name.toLowerCase().includes('credit')?positive(p.trips):0)):b.max;
    return s+positive(b.value)*units;
  },0);
  const ongoing=gross-card.annualFee-fxCost-interestCost+benefitValue;
  const eligibleBonus=p.bonusEligible&&card.bonus>0&&monthlyTotal(p)*12>=card.minSpend;
  const bonus=eligibleBonus?card.bonus:0;
  return {card,gross,fee:card.annualFee,fxCost,interestCost,benefitValue,ongoing,firstYear:ongoing+bonus,bonus,eligibleBonus,breakdown,uncertainties:[...(benefitValue?['Benefits assume full eligible use at fictional face values.']:[]),...(p.payInFull?[]:['Interest model is illustrative; actual daily balance calculations differ.'])]};
}
export function eligible(cards:Card[],p:Profile){return cards.filter(c=>c.kind===(p.business?'business':'consumer')&&c.annualFee<=p.annualFeeLimit);}
export function rank(cards:Card[],p:Profile){return eligible(cards,p).filter(c=>p.newCard||p.wallet.includes(c.id)).map(c=>evaluate(c,p)).sort((a,b)=>b.ongoing-a.ongoing);}
export function bestForPurchase(cards:Card[],p:Profile,category:Category,amount:number){
  if(!(amount>0))return [];
  return cards.filter(c=>p.wallet.includes(c.id)&&c.kind===(p.business?'business':'consumer')).map(card=>{
    const prior=p.spending[category]*12;
    const cap=card.cap[category]??Infinity;
    const enhanced=Math.min(amount,Math.max(0,cap-prior));
    const reward=(enhanced*card.earn[category]+(amount-enhanced))*card.base;
    return {card,reward,rate:reward/amount};
  }).sort((a,b)=>b.reward-a.reward);
}
export function breakEven(card:Card,alternative:Card,p:Profile){
  const a=evaluate(card,p),b=evaluate(alternative,p);
  return {difference:a.ongoing-b.ongoing,additionalValueRequired:Math.max(0,b.ongoing-a.ongoing),annualFeeDifference:card.annualFee-alternative.annualFee};
}
