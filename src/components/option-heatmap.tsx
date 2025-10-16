"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { priceOptionUseCase } from "@/use-cases/options";
import { Pricing } from "@/types/options";

type HeatmapCell = {
  spot: number;
  volatility: number;
  price: number | null;
};

const SingleHeatmapTable = React.memo(function SingleHeatmapTable({
  data,
  spotRange,
  volRange,
  label,
}: {
  data: HeatmapCell[];
  spotRange: number[];
  volRange: number[];
  label: string;
}) {
  const prices = useMemo(() => data.map((d) => d.price ?? 0), [data]);
  const minP = useMemo(() => Math.min(...prices), [prices]);
  const maxP = useMemo(() => Math.max(...prices), [prices]);

  const getColor = useCallback(
    (price: number | null) => {
      if (price == null) return "#999";
      const t = (price - minP) / (maxP - minP || 1);
      const hue = 240 - 240 * t; // blue→red
      return `hsl(${hue}, 70%, 50%)`;
    },
    [minP, maxP]
  );

  const grid = useMemo(
    () =>
      volRange.map((v) =>
        spotRange.map(
          (s) =>
            data.find((cell) => cell.spot === s && cell.volatility === v) ?? null
        )
      ),
    [data, volRange, spotRange]
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="text-center font-semibold mb-2">{label}</div>
      <table className="border-collapse w-full text-sm">
        <thead>
          <tr>
            <th className="p-1 text-center text-muted-foreground">
              Vol ↓ / Spot →
            </th>
            {spotRange.map((s) => (
              <th
                key={s}
                className="p-1 text-center text-xs font-mono text-muted-foreground"
              >
                {s.toFixed(0)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {volRange.map((v, rowIdx) => (
            <tr key={v}>
              <th className="p-1 text-right text-xs font-mono text-muted-foreground">
                {v.toFixed(3)}
              </th>
              {grid[rowIdx].map((cell, colIdx) => (
                <td
                  key={`${v}-${colIdx}`}
                  title={
                    cell?.price != null
                      ? `Spot: ${cell.spot.toFixed(2)}\nVol: ${cell.volatility.toFixed(
                          3
                        )}\nPrice: ${cell.price.toPrecision(4)}`
                      : "N/A"
                  }
                  className="p-1 text-center font-mono text-[10px] text-white"
                  style={{
                    backgroundColor: getColor(cell?.price ?? null),
                    minWidth: 36,
                    transition: "background-color 0.3s ease",
                  }}
                >
                  {cell?.price?.toPrecision(3) ?? "–"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default function OptionPriceHeatmap({
  pricer,
  params,
}: {
  pricer: "bs" | "binomial";
  params?: Pricing;
}) {
  const [callData, setCallData] = useState<HeatmapCell[]>([]);
  const [putData, setPutData] = useState<HeatmapCell[]>([]);

  const spotRange = useMemo(() => {
    if (!params) return [];
    const spot = params.params.spot;
    return Array.from({ length: 11 }, (_, i) => spot * (0.8 + i * 0.04));
  }, [params?.params.spot]);

  const volRange = useMemo(() => {
    if (!params) return [];
    const volatility = params.params.volatility;
    return Array.from({ length: 11 }, (_, i) => volatility * (0.5 + i * 0.05));
  }, [params?.params.volatility]);

  const computeHeatmap = useCallback(
    async (optionType: "call" | "put", updateFn: React.Dispatch<React.SetStateAction<HeatmapCell[]>>) => {
      if (!params) return;
      const { strike, rate, maturity } = params.params;
      for (const s of spotRange) {
        for (const v of volRange) {
          try {
            const res = await priceOptionUseCase({
              data: { spot: s, volatility: v, strike, rate, maturity, type: optionType },
            });
            updateFn((prev) => [
              ...prev,
              { spot: s, volatility: v, price: res.data.price },
            ]);
          } catch {
            updateFn((prev) => [
              ...prev,
              { spot: s, volatility: v, price: null },
            ]);
          }
          await new Promise((r) => setTimeout(r, 3));
        }
      }
    },
    [params, spotRange, volRange]
  );

  useEffect(() => {
    if (!params) return;
    setCallData([]);
    setPutData([]);
    computeHeatmap("call", setCallData);
    computeHeatmap("put", setPutData);
  }, [params, pricer, computeHeatmap]);

  if (!params)
    return (
      <div className="w-full max-w-4xl mt-8 text-center text-muted-foreground">
        Adjust parameters to see heatmaps.
      </div>
    );

  return (
    <div className="w-full max-w-5xl mt-8 flex flex-col gap-6">
      <div className="text-lg font-semibold text-center mb-2">
        Option Price Heatmaps 
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <SingleHeatmapTable
          data={callData}
          spotRange={spotRange}
          volRange={volRange}
          label="Call Option"
        />
        <SingleHeatmapTable
          data={putData}
          spotRange={spotRange}
          volRange={volRange}
          label="Put Option"
        />
      </div>
    </div>
  );
}
