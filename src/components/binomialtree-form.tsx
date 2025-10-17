"use client";

import React, { useEffect, useRef } from "react";
import { CardTitle } from "@/components/ui/card";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import { paramsEqual } from "@/utlis";
import { priceOptionUseCase } from "@/use-cases/options";
import { BSParams } from "@/types/options";

function BinomialFieldsForm({ form }: { form: UseFormReturn<Omit<BSParams, "type">> }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {["spot", "strike", "rate", "volatility", "maturity", "steps"].map((name) => {
        const minMaxStep: Record<string, [number, number, number]> = {
          spot: [1, 7000, 0.01],
          strike: [1, 10000, 0.01],
          rate: [0, 1, 0.0001],
          volatility: [0.01, 1, 0.0001],
          maturity: [0.01, 10, 0.01],
          steps: [10, 1000, 1],
        };
        const [min, max, step] = minMaxStep[name];
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as "spot" | "strike" | "rate" | "volatility" | "maturity" | "steps"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {name.charAt(0).toUpperCase() + name.slice(1)}:
                  <span className="font-mono">
                    <Input
                      className="border-none bg-muted"
                      type="number"
                      min={min}
                      max={max}
                      step={step}
                      value={field.value ?? min}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={min}
                    max={max}
                    step={step}
                    value={[field.value ?? min]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}

export default function BinomialTreeForm({ onResult }: { onResult?: (res: any) => void }) {
  const form = useForm<Omit<BSParams, "type">>({
    defaultValues: {
      spot: 100,
      strike: 100,
      rate: 0.05,
      volatility: 0.2,
      maturity: 1,
      steps: 100,
    },
  });

  const spot = form.watch("spot");
  const strike = form.watch("strike");
  const rate = form.watch("rate");
  const volatility = form.watch("volatility");
  const maturity = form.watch("maturity");
  const steps = form.watch("steps");

  const lastSentRef = useRef<Partial<Omit<BSParams, "type">> | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const params = { spot, strike, rate, volatility, maturity, steps };
    
    if (lastSentRef.current && paramsEqual(lastSentRef.current, params)) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      lastSentRef.current = params;

      try {

        const [callRes, putRes] = await Promise.all([
          priceOptionUseCase({ data: { ...params, type: "call" } }),
          priceOptionUseCase({ data: { ...params, type: "put" } }),
        ]);

        const result = {
          call: { ...callRes.data, params: { ...params, type: "call" } },
          put: { ...putRes.data, params: { ...params, type: "put" } },
        };

        onResult?.(result);

        toast.success(
          `Updated Call $${result.call.price?.toPrecision(4)} / Put $${result.put.price?.toPrecision(4)}`
        );
      } catch (err) {
        lastSentRef.current = null;
        toast.error(err instanceof Error ? err.message : "Pricing error");
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [spot, strike, rate, volatility, maturity, steps, onResult]);

  return (
    <>
      <CardTitle className="text-xl font-semibold text-center mb-2">
        Binomial Tree
      </CardTitle>
      <Form {...form}>
        <form className="p-4">
          <BinomialFieldsForm form={form} />
        </form>
      </Form>
    </>
  );
}
