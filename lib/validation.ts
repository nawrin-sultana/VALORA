import {z} from 'zod';
const finite=z.number().finite().min(0).max(1000000);
export const askSchema=z.object({question:z.string().trim().min(1).max(800),context:z.object({recommended:z.string().max(100),alternatives:z.array(z.string().max(120)).max(4),ongoing:finite,gross:finite,fee:finite,fxCost:finite,interestCost:finite,benefits:finite,assumptions:z.array(z.string().max(200)).max(12)}),demo:z.boolean()});
