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
} from "@vkontakte/vkui";

// Импортируем типы и функции для расчета
import type { CalculatorInputData } from "../CalculatorPanel/CalculatorInputForm";
import {
  performGearCalculations,
  type AllGearCalculations,
} from "../../utils/bikeCalculations";

// Импортируем наш новый компонент графика
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
        </SimpleCell>{" "}
        {/* ИСПРАВЛЕНО */}
        <SimpleCell>
          Задние звезды: <Text weight="2">{results.cassette.join(", ")}</Text>
        </SimpleCell>{" "}
        {/* ИСПРАВЛЕНО */}
        <SimpleCell>
          Диаметр колеса (введено):{" "}
          <Text weight="2">{calculatedData.wheelDiameter} мм</Text>{" "}
          {/* ИСПРАВЛЕНО */}
        </SimpleCell>
        <SimpleCell>
          Окружность колеса (рассчитано):{" "}
          <Text weight="2">{results.wheelCircumferenceMm.toFixed(2)} мм</Text>{" "}
          {/* ИСПРАВЛЕНО */}
        </SimpleCell>
        <SimpleCell>
          Каденс: <Text weight="2">{results.cadence} об/мин</Text>
        </SimpleCell>{" "}
        {/* ИСПРАВЛЕНО */}
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
                <th style={{ padding: "8px" }}>Перед</th>
                <th style={{ padding: "8px" }}>Зад</th>
                <th style={{ padding: "8px" }}>Передаточное</th>
                <th style={{ padding: "8px" }}>Развитие (м)</th>
                <th style={{ padding: "8px" }}>Скорость (км/ч)</th>
                <th style={{ padding: "8px" }}>Gear Inches (дюймы)</th>
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

      <GearChart data={results.results} cadence={results.cadence} />

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
