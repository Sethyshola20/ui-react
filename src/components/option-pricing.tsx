"use client";

import { useState } from "react";
import BSForm from "./bs-form";
import BinomialTreeForm from "./binomialtree-form";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import OptionPriceHeatmap from "./option-heatmap";
import { DualPricing } from "@/types/options";

export default function OptionPricingDashboard() {
  const [pricer, setPricer] = useState<"bs" | "binomial">("bs");
  const [result, setResult] = useState<DualPricing>();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-100 p-6 border-r flex flex-col">
        <Tabs value={pricer} onValueChange={v => setPricer(v as "bs" | "binomial")}>
          <TabsList className="items-center flex gap-2 ">
            <TabsTrigger value="bs">European</TabsTrigger>
            <TabsTrigger value="binomial">American</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-8 flex-1">
          {pricer === "bs" ? (
            <BSForm onResult={setResult} />
          ) : (
            <BinomialTreeForm onResult={setResult} />
          )}
        </div>
      </aside>

      <main className="flex-1 p-8 flex flex-col items-center">
        {result && (
          <>
            <div className="flex gap-4 p-2">
              <div className="text-center bg-green-500 text-white p-2 shadow">
                <strong>CALL VALUE</strong>
                <br />${result.call.price?.toPrecision(4)}
              </div>
              <div className="text-center bg-red-500 text-white p-2 shadow">
                <strong>PUT VALUE</strong>
                <br />${result.put.price?.toPrecision(4)}
              </div>
            </div>

            <div className="flex gap-2 bg-muted p-2 text-sm">
              <div>
                Δ<sub>call</sub>: <b>{result.call.delta?.toPrecision(4) ?? "N/A"}</b>
              </div>
              <div>
                Δ<sub>put</sub>: <b>{result.put.delta?.toPrecision(4) ?? "N/A"}</b>
              </div>
              <div>
                Vega: <b>{result.call.vega?.toPrecision(4) ?? "N/A"}</b>
              </div>
            </div>

            <OptionPriceHeatmap
              pricer={pricer}
              params={result.call}
            />
          </>
        )}
      </main>
    </div>
  );
}
