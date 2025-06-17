// src/components/GearRatioResultPanel/index.tsx
import React, { useMemo } from "react";
import {
  Panel,
  PanelHeader,
  Group,
  Cell,
  Button,
  Div,
  SimpleCell,
  Text,
  Title,
  Tooltip, // <-- Импортируем Tooltip
  VisuallyHidden, // <-- Возможно пригодится для доступности, но можно и без него
} from "@vkontakte/vkui";

import type { CalculatorInputData } from "../CalculatorPanel/CalculatorInputForm";
import {
  performGearCalculations,
  type AllGearCalculations,
} from "../../utils/bikeCalculations";

import GearChart from "./GearChart";

interface GearRatioResultPanelProps {
  id: string;
  setActivePanel: (panelId: string) => void;
  calculatedData: CalculatorInputData | null;
}

const GearRatioResultPanel: React.FC<GearRatioResultPanelProps> = ({
  id,
  setActivePanel,
  calculatedData,
}) => {
  const results: AllGearCalculations | null = useMemo(() => {
    if (!calculatedData) {
      return null;
    }
    return performGearCalculations(
      calculatedData.chainrings,
      calculatedData.cassette,
      calculatedData.wheelDiameter,
      calculatedData.cadence
    );
  }, [calculatedData]);

  const handleChartCadenceChange = (newCadence: number) => {
    if (calculatedData) {
      console.log("Каденс изменен в GearChart на:", newCadence);
    }
  };

  if (!calculatedData || !results) {
    return (
      <Panel id={id}>
        <PanelHeader>Результаты расчета передач</PanelHeader>
        <Group>
          <Cell>
            Данные для расчета не найдены. Пожалуйста, вернитесь к калькулятору.
          </Cell>
          <Cell>
            <Button onClick={() => setActivePanel("calculator")}>
              Перейти к Калькулятору
            </Button>
          </Cell>
        </Group>
      </Panel>
    );
  }

  return (
    <Panel id={id}>
      <PanelHeader>Результаты расчета передач</PanelHeader>

      <Group header={<Title level="2">Входные данные</Title>}>
        <SimpleCell>
          Передние звезды:{" "}
          <Text weight="2">{results.chainrings.join(", ")}</Text>
        </SimpleCell>
        <SimpleCell>
          Задние звезды: <Text weight="2">{results.cassette.join(", ")}</Text>
        </SimpleCell>
        <SimpleCell>
          Диаметр колеса (введено):{" "}
          <Text weight="2">{calculatedData.wheelDiameter} мм</Text>
        </SimpleCell>
        <SimpleCell>
          Окружность колеса (рассчитано):{" "}
          <Text weight="2">{results.wheelCircumferenceMm.toFixed(2)} мм</Text>
        </SimpleCell>
        <SimpleCell>
          Каденс: <Text weight="2">{results.cadence} об/мин</Text>
        </SimpleCell>
      </Group>

      <Group header={<Title level="2">Таблица передач</Title>}>
        <Div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid var(--vkui--color_separator_primary)",
                }}
              >
                <th style={{ padding: "8px" }}>Передние звезды (Система)</th>
                <th style={{ padding: "8px" }}>Задние звезды (Кассета)</th>
                <th style={{ padding: "8px" }}>Передаточное</th>
                <th style={{ padding: "8px" }}>
                  <Tooltip text="Расстояние, которое проезжает велосипед за один полный оборот педалей (колесо делает N оборотов, где N = передаточное отношение). Также известно как 'Rollout'.">
                    <span>Development (м)</span>
                  </Tooltip>{" "}
                  {/* <-- ВСЁ В ОДНУ СТРОКУ, без пробелов и переносов */}
                </th>
                <th style={{ padding: "8px" }}>Скорость (км/ч)</th>
                <th style={{ padding: "8px" }}>
                  <Tooltip text="Историческая мера 'тяжести' передачи. Представляет собой диаметр 'виртуального' колеса, которое проезжает то же расстояние за один оборот педалей, что и текущая передача. Чем больше значение, тем 'тяжелее' передача.">
                    <span>Gear Inches (дюймы)</span>
                  </Tooltip>{" "}
                  {/* <-- ВСЁ В ОДНУ СТРОКУ, без пробелов и переносов */}
                </th>
              </tr>
            </thead>
            <tbody>
              {results.results.map((gear, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom:
                      "1px solid var(--vkui--color_separator_primary)",
                  }}
                >
                  <td style={{ padding: "8px" }}>{gear.frontTeeth}</td>
                  <td style={{ padding: "8px" }}>{gear.rearTeeth}</td>
                  <td style={{ padding: "8px" }}>{gear.gearRatio}</td>
                  <td style={{ padding: "8px" }}>{gear.development}</td>
                  <td style={{ padding: "8px" }}>{gear.speedKmh}</td>
                  <td style={{ padding: "8px" }}>{gear.gearInches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Div>
      </Group>

      <GearChart
        data={results.results}
        initialCadence={results.cadence}
        onCadenceChange={handleChartCadenceChange}
        calculatedWheelDiameter={calculatedData.wheelDiameter}
        initialChainrings={calculatedData.chainrings}
        initialCassette={calculatedData.cassette}
      />

      <Group>
        <Cell>
          <Button onClick={() => setActivePanel("calculator")}>
            Вернуться к Калькулятору
          </Button>
        </Cell>
      </Group>
    </Panel>
  );
};

export default GearRatioResultPanel;
