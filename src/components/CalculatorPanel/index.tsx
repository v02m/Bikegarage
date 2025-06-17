// src/components/CalculatorPanel/index.tsx
import React from "react";
import { Panel, PanelHeader, Group, Cell, Button } from "@vkontakte/vkui";

import CalculatorInputForm, {
  type CalculatorInputData,
} from "./CalculatorInputForm"; // <-- Важно: импортируем тип!

interface CalculatorPanelProps {
  id: string;
  setActivePanel: (panelId: string) => void;
  onCalculate: (data: CalculatorInputData) => void; // <- Пропс для передачи данных в App.tsx
}

const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  id,
  setActivePanel,
  onCalculate,
}) => {
  const handleCalculate = (data: CalculatorInputData) => {
    // Эта функция вызывается, когда CalculatorInputForm завершил расчет
    onCalculate(data); // Передаем данные наверх в App.tsx для сохранения и отображения в ResultPanel
  };

  return (
    <Panel id={id}>
      <PanelHeader>Калькулятор передач</PanelHeader>
      <Group>
        {/* Передаем функцию handleCalculate как пропс onCalculate в CalculatorInputForm */}
        <CalculatorInputForm onCalculate={handleCalculate} />
      </Group>
      <Group>
        <Cell>
          <Button onClick={() => setActivePanel("home")}>На главную</Button>
        </Cell>
      </Group>
    </Panel>
  );
};

export default CalculatorPanel;
