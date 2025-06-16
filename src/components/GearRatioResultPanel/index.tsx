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
import type { CalculatorInputData } from "../CalculatorPanel";
import {
  performGearCalculations,
  type AllGearCalculations,
  type GearCalculation,
} from "../../utils/bikeCalculations";

interface GearRatioResultPanelProps {
  id: string;
  setActivePanel: (panelId: string) => void;
  calculatedData: CalculatorInputData | null; // Входные данные для расчетов
}

const GearRatioResultPanel: React.FC<GearRatioResultPanelProps> = ({
  id,
  setActivePanel,
  calculatedData,
}) => {
  // Используем useMemo, чтобы пересчеты происходили только при изменении calculatedData
  const results: AllGearCalculations | null = useMemo(() => {
    if (!calculatedData) {
      return null;
    }
    // Если данные есть, выполняем расчеты
    return performGearCalculations(
      calculatedData.chainrings,
      calculatedData.cassette,
      calculatedData.wheelDiameter,
      calculatedData.cadence
    );
  }, [calculatedData]); // Зависимость useMemo

  // Если данных нет, показываем сообщение или возвращаемся к калькулятору
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
          {" "}
          {/* Делаем таблицу прокручиваемой по горизонтали */}
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

      <Group header={<Title level="2">Графики (Скоро)</Title>}>
        <Cell>Здесь будут крутые графики скорости и других параметров!</Cell>
        {/* Placeholder для будущих графиков */}
        <Div
          style={{
            height: "200px",
            backgroundColor: "var(--vkui--color_background_secondary)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--vkui--color_text_secondary)",
          }}
        >
          Место для графика
        </Div>
      </Group>

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
