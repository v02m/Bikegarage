// src/components/CalculatorPanel/CalculatorInputForm/index.tsx
import React, { useState, useEffect } from "react";
import {
  Group,
  Input,
  Button,
  FormItem,
  Textarea,
  Radio,
  SimpleCell,
  Slider,
  Header,
  Div,
  Text,
} from "@vkontakte/vkui";

// Тип данных, которые будет возвращать форма
export interface CalculatorInputData {
  chainrings: number[];
  cassette: number[];
  wheelDiameter: number;
  cadence: number;
}

interface CalculatorInputFormProps {
  onCalculate: (data: CalculatorInputData) => void; // <-- Вот он, onCalculate
}

const CalculatorInputForm: React.FC<CalculatorInputFormProps> = ({
  onCalculate,
}) => {
  const [chainringsInput, setChainringsInput] = useState("30,32");
  const [cassetteInput, setCassetteInput] = useState(
    "11,12,13,14,15,17,19,21,23,25,28,32"
  );
  const [wheelSizeOption, setWheelSizeOption] = useState("700c"); // '700c', '29', '27.5', '26', 'custom'
  const [customWheelDiameter, setCustomWheelDiameter] = useState("622"); // ETRTO 622 for 700c
  const [cadence, setCadence] = useState(90); // Default cadence

  // Обновляем customWheelDiameter при изменении wheelSizeOption
  useEffect(() => {
    switch (wheelSizeOption) {
      case "700c":
        setCustomWheelDiameter("622"); // ETRTO for 700c (road)
        break;
      case "29":
        setCustomWheelDiameter("622"); // ETRTO for 29" (MTB)
        break;
      case "27.5":
        setCustomWheelDiameter("584"); // ETRTO for 27.5" / 650B
        break;
      case "26":
        setCustomWheelDiameter("559"); // ETRTO for 26"
        break;
      // 'custom' case doesn't change customWheelDiameter automatically
    }
  }, [wheelSizeOption]);

  const handleFormCalculate = () => {
    const chainrings = chainringsInput
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    const cassette = cassetteInput
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    const finalWheelDiameter = parseInt(customWheelDiameter, 10);

    const formData: CalculatorInputData = {
      chainrings,
      cassette,
      wheelDiameter: finalWheelDiameter,
      cadence: cadence,
    };

    console.log("Данные для расчета получены из формы:", formData);
    // Вызываем пропс onCalculate, передавая ему собранные данные
    onCalculate(formData); // <--- Вот здесь был onCalculateAndNavigate
  };

  return (
    // <FormLayout
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //     handleFormCalculate();
    //   }}
    // >
    <Group
      mode="card"
      onSubmit={(e) => {
        e.preventDefault();
        handleFormCalculate();
      }}
    >
      {" "}
      {/* <--- Изменил с FormLayout на Group */}
      <FormItem
        top="Передние звезды (зубья, через запятую)"
        htmlFor="chainrings"
      >
        <Textarea
          id="chainrings"
          value={chainringsInput}
          onChange={(e) => setChainringsInput(e.target.value)}
          placeholder="Например: 50,34"
        />
      </FormItem>
      <FormItem top="Задние звезды (зубья, через запятую)" htmlFor="cassette">
        <Textarea
          id="cassette"
          value={cassetteInput}
          onChange={(e) => setCassetteInput(e.target.value)}
          placeholder="Например: 11,12,13,14,15,17,19,21,23,25,28,32"
        />
      </FormItem>
      <FormItem top="Размер колеса">
        <Radio
          name="wheelSize"
          value="700c"
          checked={wheelSizeOption === "700c"}
          onChange={(e) => setWheelSizeOption(e.target.value)}
        >
          700c (шоссе)
        </Radio>
        <Radio
          name="wheelSize"
          value="29"
          checked={wheelSizeOption === "29"}
          onChange={(e) => setWheelSizeOption(e.target.value)}
        >
          29" (MTB)
        </Radio>
        <Radio
          name="wheelSize"
          value="27.5"
          checked={wheelSizeOption === "27.5"}
          onChange={(e) => setWheelSizeOption(e.target.value)}
        >
          27.5" (MTB / 650B)
        </Radio>
        <Radio
          name="wheelSize"
          value="26"
          checked={wheelSizeOption === "26"}
          onChange={(e) => setWheelSizeOption(e.target.value)}
        >
          26" (MTB)
        </Radio>
        <Radio
          name="wheelSize"
          value="custom"
          checked={wheelSizeOption === "custom"}
          onChange={(e) => setWheelSizeOption(e.target.value)}
        >
          Свой (ETRTO диаметр обода в мм)
        </Radio>
      </FormItem>
      {wheelSizeOption === "custom" && (
        <FormItem top="Диаметр обода ETRTO (мм)">
          <Input
            type="number"
            value={customWheelDiameter}
            onChange={(e) => setCustomWheelDiameter(e.target.value)}
            placeholder="Например: 622"
          />
        </FormItem>
      )}
      <FormItem top="Каденс (об/мин)">
        <Header
          mode="primary"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Text>{cadence} об/мин</Text>
        </Header>
        <Slider
          min={30}
          max={120}
          step={1}
          value={cadence}
          onChange={setCadence}
        />
        <Div>
          <Input
            type="number"
            value={cadence}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                setCadence(value);
              }
            }}
            style={{ width: "80px", marginTop: "10px" }}
          />
        </Div>
      </FormItem>
      <FormItem>
        <Button size="l" stretched onClick={handleFormCalculate}>
          Рассчитать передачи
        </Button>
      </FormItem>
    </Group>
  );
};

export default CalculatorInputForm;
