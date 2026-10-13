import {it,expect} from 'vitest';import {askSchema} from '../lib/validation';
it('rejects missing/untrusted calculation contexts',()=>expect(askSchema.safeParse({question:'hello'}).success).toBe(false));
it('rejects negative financial values',()=>expect(askSchema.safeParse({question:'hello',demo:true,context:{recommended:'A',alternatives:[],ongoing:-1,gross:0,fee:0,fxCost:0,interestCost:0,benefits:0,assumptions:[]}}).success).toBe(false));
