"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { BSParams, optionFormSchema } from "@/types/options";
import { Input } from "./ui/input";
import { useOptionPricing } from "@/hooks/useOptionPricing";
import { toast } from "sonner";

type Props = {
  onSubmit: (params: BSParams) => void;
};

const defaultValues = {
  spot: 100,
  strike: 100,
  rate: 0.05,
  volatility: 0.2,
  maturity: 1,
};

function BSFieldsForm({ form }: { form: UseFormReturn<Omit<BSParams, "type">> }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Spot Price */}
      <FormField
        control={form.control}
        name="spot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Spot Price: <span className="font-mono"><Input
              type="number"
              min={1}
              max={7000}
              step={0.01}
              value={field.value ?? 100}
              onChange={e => field.onChange(Number(e.target.value))}
            /></span>
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="spot"
                render={({ field }) => (
                  <Slider
                    min={1}
                    max={7000}
                    step={0.01}
                    value={[field.value ?? 100]}
                    onValueChange={vals => field.onChange(vals[0])}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Strike Price */}
      <FormField
        control={form.control}
        name="strike"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Strike Price: <span className="font-mono"><Input
              type="number"
              min={1}
              max={10000}
              step={0.01}
              value={field.value ?? 100}
              onChange={e => field.onChange(Number(e.target.value))}
            /></span>
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="strike"
                render={({ field }) => (
                  <Slider
                    min={1}
                    max={10000}
                    step={0.01}
                    value={[field.value ?? 100]}
                    onValueChange={vals => field.onChange(vals[0])}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Risk-free Rate */}
      <FormField
        control={form.control}
        name="rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Risk-free Rate: <span className="font-mono">{field.value}</span>
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={0.2}
                    step={0.0001}
                    value={[field.value ?? 0.05]}
                    onValueChange={vals => field.onChange(vals[0])}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Volatility */}
      <FormField
        control={form.control}
        name="volatility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Volatility: <span className="font-mono">{field.value}</span>
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="volatility"
                render={({ field }) => (
                  <Slider
                    min={0.01}
                    max={1}
                    step={0.0001}
                    value={[field.value ?? 0.2]}
                    onValueChange={vals => field.onChange(vals[0])}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Maturity */}
      <FormField
        control={form.control}
        name="maturity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Time to Maturity (years): <span className="font-mono">{field.value}</span>
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="maturity"
                render={({ field }) => (
                  <Slider
                    min={0.01}
                    max={10}
                    step={0.01}
                    value={[field.value ?? 1]}
                    onValueChange={vals => field.onChange(vals[0])}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function BSForm() {
  const [tab, setTab] = React.useState<"call" | "put">("call");
  const form = useForm<Omit<BSParams, "type">>({
    resolver: zodResolver(optionFormSchema.omit({ type: true })),
    defaultValues,
  });

  const priceOptionMutation = useOptionPricing()

  async function handleSubmit(data: Omit<BSParams, "type">) {
   priceOptionMutation.mutate({...data, type: tab}, {
      onSuccess: (res)=>{
        if (res?.type === "price_result") {
            toast(
              <div>
                <div className="font-semibold">Option Price Result</div>
                <div>Price: {res.data.price ?? "N/A"}</div>
                <div>Delta: {res.data.delta ?? "N/A"}</div>
                <div>Vega: {res.data.vega ?? "N/A"}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Server time: {new Date(res.data.ts_server).toLocaleString()}
                </div>
              </div>
            );
          } else {
            toast.error("Invalid response from server.");
          }
      },
      onError: (error: unknown) => {
          toast.error(error instanceof Error ? error.message : "An error occurred while sharing the password.",);
      }
    })
  }

  return (
    <Card className="max-w-md mx-auto mt-8 shadow-lg">
      <Tabs value={tab} onValueChange={v => setTab(v as "call" | "put")} className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Black-Scholes Option Pricing
          </CardTitle>
          <TabsList className="w-full mt-4">
            <TabsTrigger value="call" className="w-1/2">Call</TabsTrigger>
            <TabsTrigger value="put" className="w-1/2">Put</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value="call">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4">
              <CardContent>
                <BSFieldsForm form={form} />
              </CardContent>
              <CardFooter className="mt-4">
                <Button type="submit" className="w-full">
                  Price Option
                </Button>
              </CardFooter>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="put">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4">
              <CardContent>
                <BSFieldsForm form={form} />
              </CardContent>
              <CardFooter className="mt-4">
                <Button type="submit" className="w-full">
                  Price Option
                </Button>
              </CardFooter>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}