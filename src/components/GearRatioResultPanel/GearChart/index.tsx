// src/components/GearRatioResultPanel/GearChart/index.tsx
import React from "react";
import { Div, Text, Title } from "@vkontakte/vkui";

// Импортируем компоненты для графиков из Recharts
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

// Импортируем тип GearCalculation из наших утилит расчета
import type { GearCalculation } from "../../../utils/bikeCalculations";

// Определяем пропсы для нашего компонента графика
interface GearChartProps {
  data: GearCalculation[]; // Массив данных для графика
  cadence: number; // Каденс, чтобы отобразить его в заголовке
}

const GearChart: React.FC<GearChartProps> = ({ data, cadence }) => {
  return (
    <Group header={<Title level="2">Графики скорости</Title>}>
      <Div>
        <Text weight="regular" style={{ marginBottom: 10 }}>
          Скорость (км/ч) для каждой передачи при каденсе {cadence} об/мин:
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data} // Используем переданный пропс data
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Ось X: Передаточное отношение */}
            <XAxis
              dataKey="gearRatio"
              label={{
                value: "Передаточное отношение",
                position: "insideBottom",
                offset: -5,
              }}
            />
            {/* Ось Y: Скорость в км/ч */}
            <YAxis
              label={{
                value: "Скорость (км/ч)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="speedKmh"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Скорость (км/ч)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Div>
    </Group>
  );
};

export default GearChart;
