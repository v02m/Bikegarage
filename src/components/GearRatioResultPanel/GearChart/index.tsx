// src/components/GearRatioResultPanel/GearChart/index.tsx
import React, { useMemo } from "react";
import { Div, Group, Text, Title } from "@vkontakte/vkui";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import type { GearCalculation } from "../../../utils/bikeCalculations";

interface GearChartProps {
  data: GearCalculation[];
  cadence: number;
}

const GearChart: React.FC<GearChartProps> = ({ data, cadence }) => {
  console.log("GearChart: props.data (исходные данные):", data);

  const chartData = useMemo(() => {
    const groupedByFrontTeeth = data.reduce((acc, current) => {
      if (!acc[current.frontTeeth]) {
        acc[current.frontTeeth] = {};
      }
      acc[current.frontTeeth][current.gearRatio.toFixed(2)] = current.speedKmh;
      return acc;
    }, {} as { [frontTeeth: number]: { [gearRatio: string]: number } });

    const allGearRatios = Array.from(
      new Set(data.map((d) => d.gearRatio.toFixed(2)))
    ).sort();

    return allGearRatios.map((ratio) => {
      const entry: { gearRatio: string; [key: string]: number | string } = {
        gearRatio: ratio,
      };
      Object.keys(groupedByFrontTeeth).forEach((frontTeeth) => {
        const speed = groupedByFrontTeeth[Number(frontTeeth)][ratio];
        if (speed !== undefined) {
          entry[`speed_front_${frontTeeth}`] = speed;
        }
      });
      return entry;
    });
  }, [data]);

  const uniqueFrontTeeth = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.frontTeeth))).sort(
      (a, b) => a - b
    );
  }, [data]);

  console.log(
    "GearChart: chartData (преобразованные данные для Recharts):",
    chartData
  );
  console.log(
    "GearChart: uniqueFrontTeeth (уникальные передние звезды):",
    uniqueFrontTeeth
  );

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00bcd4"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentGearRatio = label;
      const matchingGears = data.filter(
        (d) => d.gearRatio.toFixed(2) === currentGearRatio
      );

      return (
        <Div
          style={{
            backgroundColor: "var(--vkui--color_background)",
            padding: "10px",
            border: "1px solid var(--vkui--color_border)",
            borderRadius: "8px",
          }}
        >
          <Text weight="2" style={{ marginBottom: 5 }}>
            {" "}
            {/* ИСПРАВЛЕНО: {2} на "2" */}
            Передаточное отношение: {currentGearRatio}
          </Text>
          {payload.map((pld: any, index: number) => {
            const frontTeeth = pld.dataKey.split("_")[2];
            const gear = matchingGears.find(
              (g) => g.frontTeeth === Number(frontTeeth)
            );
            return (
              <div key={index} style={{ color: pld.stroke }}>
                <Text weight="1">Перед: {frontTeeth}Т</Text>{" "}
                {/* ИСПРАВЛЕНО: {1} на "1" */}
                <Text weight="1">Зад: {gear?.rearTeeth}Т</Text>{" "}
                {/* ИСПРАВЛЕНО: {1} на "1" */}
                <Text weight="1">
                  Скорость: {pld.value?.toFixed(1)} км/ч
                </Text>{" "}
                {/* ИСПРАВЛЕНО: {1} на "1" */}
              </div>
            );
          })}
        </Div>
      );
    }
    return null;
  };

  return (
    <Group header={<Title level="2">Графики скорости</Title>}>
      <Div>
        <Text weight="1" style={{ marginBottom: 10 }}>
          {" "}
          {/* ИСПРАВЛЕНО: {1} на "1" */}
          Скорость (км/ч) для каждой комбинации при каденсе {cadence} об/мин:
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="gearRatio"
              label={{
                value: "Передаточное отношение",
                position: "insideBottom",
                offset: -5,
              }}
              tickFormatter={(tick) => parseFloat(tick).toFixed(2)}
            />
            <YAxis
              label={{
                value: "Скорость (км/ч)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {uniqueFrontTeeth.map((frontTeeth, index) => (
              <Line
                key={`line-${frontTeeth}`}
                type="monotone"
                dataKey={`speed_front_${frontTeeth}`}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                name={`Передняя ${frontTeeth}Т`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Div>
    </Group>
  );
};

export default GearChart;
