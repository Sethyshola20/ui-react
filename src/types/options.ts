import z from "zod";

export const optionFormSchema = z.object({
  spot:z.number(),
  strike:z.number(),
  rate:z.number(),
  volatility:z.number(),
  maturity:z.number(),
  type:z.enum(["call", "put"])
})

export type BSParams = z.infer<typeof optionFormSchema>

export type OptionPriceResponse = {
  data :{
    delta:number | null,
    vega:number | null,
    price:number | null,
    ts_server:number
  },
  type:string
}