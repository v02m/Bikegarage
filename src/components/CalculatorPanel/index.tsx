// src/components/CalculatorPanel/index.tsx
import React from "react";
import { Panel, PanelHeader, Group, Cell, Button } from "@vkontakte/vkui";

// Импортируем нашу новую форму
import CalculatorInputForm from "./CalculatorInputForm";

// Определение типов данных, которые будет возвращать форма
// Этот интерфейс теперь экспортируется из CalculatorInputForm
// Мы его повторно не объявляем, а импортируем для использования
import type { CalculatorInputData } from "./CalculatorInputForm"; // Импорт типа из CalculatorInputForm

interface CalculatorPanelProps {
  id: string;
  onCalculateAndNavigate: (data: CalculatorInputData) => void;
  initialValues: CalculatorInputData | null; // Новый пропс для начальных значений
}

const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  id,
  onCalculateAndNavigate,
  initialValues,
}) => {
  const handleFormCalculate = (data: CalculatorInputData) => {
    console.log("Данные для расчета получены из формы:", data);
    onCalculateAndNavigate(data); // Используем пропс для передачи данных и смены панели
  };

  return (
    <Panel id={id}>
      <PanelHeader>Калькулятор передач</PanelHeader>

      {/* Используем наш новый компонент формы и передаем ему колбэк и начальные значения */}
      <CalculatorInputForm
        onCalculate={handleFormCalculate}
        initialValues={initialValues}
      />

      {/* Кнопка "Вернуться на Главную" здесь не нужна, так как мы переходим сюда с главной,
          а отсюда - на экран результатов. Возврат на главную будет с экрана результатов
          или напрямую из App.tsx через setActivePanel, если это понадобится.
          Пока оставляем, чтобы избежать регрессий, если она где-то еще нужна. */}
      <Group>
        <Cell>
          <Button
            onClick={() =>
              onCalculateAndNavigate(
                initialValues || {
                  chainrings: [],
                  cassette: [],
                  wheelDiameter: 0,
                  cadence: 0,
                }
              )
            }
          >
            Вернуться на Главную (без сохранения новых данных)
          </Button>
        </Cell>
      </Group>
    </Panel>
  );
};

export default CalculatorPanel;
