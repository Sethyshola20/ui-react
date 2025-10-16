import z from "zod";

export const optionFormSchema = z.object({
  spot:z.number(),
  strike:z.number(),
  rate:z.number(),
  volatility:z.number(),
  maturity:z.number(),
  steps:z.number().optional(),
  type:z.enum(["call", "put"]),
  
})

export type BSParams = z.infer<typeof optionFormSchema>

export type OptionPriceResponse = {
  data:{
    delta:number | null,
    vega:number | null,
    price:number | null,
    ts_server:number
  },
  type:string
}

export type Pricing = {
    delta:number | null,
    vega:number | null,
    price:number | null,
    ts_server:number
    params:BSParams
}
export interface DualPricing {
  call: Pricing;
  put: Pricing;
}
