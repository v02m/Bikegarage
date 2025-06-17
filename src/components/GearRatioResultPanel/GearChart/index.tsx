// src/components/GearRatioResultPanel/GearChart/index.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Div,
  Group,
  Text,
  Title,
  Slider,
  FormItem,
  Input,
} from "@vkontakte/vkui";

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

import {
  performGearCalculations,
  type GearCalculation,
} from "../../../utils/bikeCalculations";

interface GearChartProps {
  data: GearCalculation[]; // Исходные данные со всеми расчетами для дефолтного каденса
  initialCadence: number; // Изначальный каденс, пришедший из формы
  onCadenceChange: (newCadence: number) => void;
  calculatedWheelDiameter: number;
  initialChainrings: number[];
  initialCassette: number[];
}

const GearChart: React.FC<GearChartProps> = ({
  data, // Используется для типа, но не для фактического рендера
  initialCadence,
  onCadenceChange, // Сейчас не используется для проброса наверх
  calculatedWheelDiameter,
  initialChainrings,
  initialCassette,
}) => {
  // Состояние для текущего каденса, который пользователь может менять
  const [currentCadence, setCurrentCadence] = useState<number>(initialCadence);

  // Когда initialCadence меняется (например, из формы), обновляем currentCadence
  useEffect(() => {
    setCurrentCadence(initialCadence);
  }, [initialCadence]);

  // Пересчитываем данные для графика каждый раз, когда меняется currentCadence или исходные данные
  const recalculatedData = useMemo(() => {
    const newCalculations = performGearCalculations(
      initialChainrings,
      initialCassette,
      calculatedWheelDiameter,
      currentCadence
    );
    return newCalculations.results;
  }, [
    initialChainrings,
    initialCassette,
    calculatedWheelDiameter,
    currentCadence,
  ]);

  const chartData = useMemo(() => {
    const groupedByFrontTeeth = recalculatedData.reduce((acc, current) => {
      if (!acc[current.frontTeeth]) {
        acc[current.frontTeeth] = {};
      }
      acc[current.frontTeeth][current.gearRatio.toFixed(2)] = current.speedKmh;
      return acc;
    }, {} as { [frontTeeth: number]: { [gearRatio: string]: number } });

    const allGearRatios = Array.from(
      new Set(recalculatedData.map((d) => d.gearRatio.toFixed(2)))
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
  }, [recalculatedData]);

  const uniqueFrontTeeth = useMemo(() => {
    return Array.from(new Set(recalculatedData.map((d) => d.frontTeeth))).sort(
      (a, b) => a - b
    );
  }, [recalculatedData]);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00bcd4"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentGearRatio = label;
      const matchingGears = recalculatedData.filter(
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
            Передаточное отношение: {currentGearRatio}
          </Text>
          {payload.map((pld: any, index: number) => {
            const frontTeeth = pld.dataKey.split("_")[2];
            const gear = matchingGears.find(
              (g) => g.frontTeeth === Number(frontTeeth)
            );
            return (
              <div key={index} style={{ color: pld.stroke }}>
                <Text weight="1">Перед: {frontTeeth}Т</Text>
                <Text weight="1">Зад: {gear?.rearTeeth}Т</Text>
                <Text weight="1">Скорость: {pld.value?.toFixed(1)} км/ч</Text>
              </div>
            );
          })}
        </Div>
      );
    }
    return null;
  };

  const handleCadenceChange = (value: number) => {
    setCurrentCadence(value);
    // onCadenceChange(value); // Можно включить, если нужно передавать каденс в родителя
  };

  const handleCadenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCurrentCadence(value);
    }
  };

  return (
    <Group header={<Title level="2">Графики скорости</Title>}>
      <Div>
        <Text weight="1" style={{ marginBottom: 10 }}>
          Скорость (км/ч) для каждой комбинации при каденсе {currentCadence}{" "}
          об/мин:
        </Text>

        <FormItem top="Каденс (об/мин)">
          <Slider
            min={30}
            max={120}
            step={1}
            value={currentCadence}
            onChange={handleCadenceChange}
          />
          <Input
            type="number"
            value={currentCadence}
            onChange={handleCadenceInputChange}
            style={{ width: "80px", marginTop: "10px" }}
          />
        </FormItem>

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
