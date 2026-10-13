import {NextResponse} from 'next/server';
import OpenAI from 'openai';
import {askSchema} from '../../../lib/validation';
export async function POST(req:Request){
  try{
    const raw=await req.json();const parsed=askSchema.safeParse(raw);
    if(!parsed.success)return NextResponse.json({error:'Invalid or unsafe request payload.'},{status:400});
    const {question,context,demo}=parsed.data;
    if(!process.env.OPENAI_API_KEY || demo){
      return NextResponse.json({answer:`Your top evaluated option is ${context.recommended}, with estimated ongoing net value of CAD $${context.ongoing.toFixed(0)} per year. The model includes CAD $${context.gross.toFixed(0)} in gross rewards, CAD $${context.fee.toFixed(0)} in fees, CAD $${context.fxCost.toFixed(0)} in foreign transaction costs, CAD $${context.interestCost.toFixed(0)} in illustrative interest and CAD $${context.benefits.toFixed(0)} in potentially usable benefits. This is an illustrative calculation based on fictional cards, not a real financial recommendation. Your question was: “${question}”. Change your profile or open Evidence Ledger for more detail.`,mode:'demo'});
    }
    const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const response=await openai.responses.create({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions:'You are VALORA, a financial education explainer. Use ONLY provided calculation context. All card names and terms are FICTIONAL demo data. Never invent fees, rates, sources, eligibility, availability, approval odds, amounts or facts. Do not advise borrowing. State uncertainty where appropriate. If asked about real cards explain that verified live card data is not connected. Be concise and transparent.',input:`Verified locally calculated fictional demo context: ${JSON.stringify(context)}\nUser question: ${question}`});
    return NextResponse.json({answer:response.output_text||'No explanation returned.',mode:'ai'});
  }catch(e){return NextResponse.json({error:'Unable to generate a response. Check server configuration.'},{status:500});}
}
