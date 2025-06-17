// src/components/CalculatorPanel/index.tsx
import React from "react";
import { Panel, PanelHeader, Group, Cell, Button } from "@vkontakte/vkui";

import CalculatorInputForm, {
  type CalculatorInputData,
} from "./CalculatorInputForm";

interface CalculatorPanelProps {
  id: string;
  setActivePanel: (panelId: string) => void;
  onCalculate: (data: CalculatorInputData) => void;
  // --- НОВЫЕ ПРОПСЫ ---
  initialFormData: CalculatorInputData;
  onFormChange: (data: CalculatorInputData) => void;
}

const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  id,
  setActivePanel,
  onCalculate,
  initialFormData,
  onFormChange,
}) => {
  const handleCalculate = (data: CalculatorInputData) => {
    onCalculate(data);
  };

  return (
    <Panel id={id}>
      <PanelHeader>Калькулятор передач</PanelHeader>
      <Group>
        {/* ПЕРЕДАЕМ НОВЫЕ ПРОПСЫ В CalculatorInputForm */}
        <CalculatorInputForm
          onCalculate={handleCalculate}
          initialFormData={initialFormData} // <-- Передаем
          onFormChange={onFormChange} // <-- Передаем
        />
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
