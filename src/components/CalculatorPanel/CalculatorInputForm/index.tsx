// src/components/CalculatorPanel/CalculatorInputForm/index.tsx
import React, { useState, useEffect } from "react"; // Добавлен useEffect
import {
  Group,
  FormLayoutGroup,
  FormItem,
  Input,
  Textarea,
  Button,
  Title,
  Spacing,
  Cell,
} from "@vkontakte/vkui";

// Определение типов данных, которые будет возвращать форма
// Экспортируем CalculatorInputData, чтобы другие компоненты могли его импортировать
export interface CalculatorInputData {
  chainrings: number[];
  cassette: number[];
  wheelDiameter: number;
  cadence: number;
}

// Определение пропсов для компонента формы
interface CalculatorInputFormProps {
  onCalculate: (data: CalculatorInputData) => void;
  initialValues: CalculatorInputData | null; // Новый пропс для начальных значений
}

const CalculatorInputForm: React.FC<CalculatorInputFormProps> = ({
  onCalculate,
  initialValues,
}) => {
  // Состояния для входных данных калькулятора
  const [chainringsInput, setChainringsInput] = useState("30,42"); // Передние звезды, через запятую
  const [cassetteInput, setCassetteInput] = useState(
    "11,13,15,18,21,24,28,32,36,40,46"
  ); // Задние звезды, через запятую
  const [wheelDiameterMm, setWheelDiameterMm] = useState("700"); // Диаметр колеса в мм
  const [cadence, setCadence] = useState("90"); // Каденс в об/мин

  // Используем useEffect для установки начальных значений, если они были переданы
  useEffect(() => {
    if (initialValues) {
      setChainringsInput(initialValues.chainrings.join(","));
      setCassetteInput(initialValues.cassette.join(","));
      setWheelDiameterMm(String(initialValues.wheelDiameter)); // Число в строку
      setCadence(String(initialValues.cadence)); // Число в строку
    }
  }, [initialValues]); // Эффект срабатывает при изменении initialValues

  // Функция для обработки расчета
  const handleCalculate = () => {
    // Парсинг входных данных
    const parsedChainrings = chainringsInput
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);
    const parsedCassette = cassetteInput
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);
    const parsedWheelDiameter = Number(wheelDiameterMm);
    const parsedCadence = Number(cadence);

    // Базовая валидация (можно расширить)
    if (
      parsedChainrings.length === 0 ||
      parsedCassette.length === 0 ||
      isNaN(parsedWheelDiameter) ||
      parsedWheelDiameter <= 0 ||
      isNaN(parsedCadence) ||
      parsedCadence <= 0
    ) {
      alert("Пожалуйста, введите корректные данные для всех полей!");
      return;
    }

    // Вызываем колбэк с собранными и отпарсенными данными
    onCalculate({
      chainrings: parsedChainrings,
      cassette: parsedCassette,
      wheelDiameter: parsedWheelDiameter,
      cadence: parsedCadence,
    });
  };

  return (
    <Group header={<Title level="2">Ввод данных</Title>}>
      <FormLayoutGroup mode="vertical">
        <FormItem
          top="Передние звезды (кол-во зубьев, через запятую)"
          htmlFor="chainrings"
        >
          <Textarea
            id="chainrings"
            value={chainringsInput}
            onChange={(e) => setChainringsInput(e.target.value)}
            placeholder="Например: 30,42"
          />
        </FormItem>

        <FormItem
          top="Задние звезды (кол-во зубьев, через запятую)"
          htmlFor="cassette"
        >
          <Textarea
            id="cassette"
            value={cassetteInput}
            onChange={(e) => setCassetteInput(e.target.value)}
            placeholder="Например: 11,13,15,18,21,24,28,32,36,40,46"
          />
        </FormItem>

        <FormItem top="Диаметр колеса (в мм)" htmlFor="wheelDiameter">
          <Input
            id="wheelDiameter"
            type="number"
            value={wheelDiameterMm}
            onChange={(e) => setWheelDiameterMm(e.target.value)}
            placeholder="Например: 700 (для 700с)"
          />
        </FormItem>

        <FormItem top="Каденс (об/мин)" htmlFor="cadence">
          <Input
            id="cadence"
            type="number"
            value={cadence}
            onChange={(e) => setCadence(e.target.value)}
            placeholder="Например: 90"
          />
        </FormItem>
      </FormLayoutGroup>
      <Spacing size={16} />
      <Cell>
        <Button size="l" stretched onClick={handleCalculate}>
          Рассчитать
        </Button>
      </Cell>
    </Group>
  );
};

export default CalculatorInputForm;
