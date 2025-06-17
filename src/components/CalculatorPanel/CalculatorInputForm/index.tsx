// src/components/CalculatorPanel/CalculatorInputForm/index.tsx
import React, { useEffect } from "react"; // Убрали useState, так как состояние теперь в App.tsx
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
  onCalculate: (data: CalculatorInputData) => void;
  // --- НОВЫЕ ПРОПСЫ ДЛЯ УПРАВЛЕНИЯ СОСТОЯНИЕМ ---
  initialFormData: CalculatorInputData;
  onFormChange: (data: CalculatorInputData) => void;
}

const CalculatorInputForm: React.FC<CalculatorInputFormProps> = ({
  onCalculate,
  initialFormData,
  onFormChange,
}) => {
  // Больше не используем локальные useState для chainringsInput, cassetteInput, wheelSizeOption, customWheelDiameter, cadence.
  // Вместо этого используем initialFormData из пропсов.

  // Helper для обновления части состояния
  const updateFormData = (key: keyof CalculatorInputData, value: any) => {
    onFormChange({
      ...initialFormData,
      [key]: value,
    });
  };

  // Эффект для установки customWheelDiameter при изменении wheelSizeOption
  useEffect(() => {
    let newWheelDiameter = initialFormData.wheelDiameter; // Сохраняем текущее, если не меняется
    let wheelSizeOption = "custom"; // Определяем опцию на основе diameter

    switch (initialFormData.wheelDiameter) {
      case 622:
        if (initialFormData.chainrings[0] === 50)
          wheelSizeOption = "700c"; // Пытаемся угадать 700c или 29
        else wheelSizeOption = "29";
        break;
      case 584:
        wheelSizeOption = "27.5";
        break;
      case 559:
        wheelSizeOption = "26";
        break;
      default:
        wheelSizeOption = "custom"; // Если не стандартный
    }

    // Это состояние теперь хранится внутри CalculatorInputForm,
    // но его можно было бы тоже поднять в App.tsx, если бы была необходимость
    // сохранять выбранную опцию колеса (700c, 29, custom) между сессиями.
    // Пока оставим его локальным для удобства.
    const currentWheelOption =
      initialFormData.wheelDiameter === 622
        ? initialFormData.chainrings[0] === 50
          ? "700c"
          : "29"
        : initialFormData.wheelDiameter === 584
        ? "27.5"
        : initialFormData.wheelDiameter === 559
        ? "26"
        : "custom";

    // Для выбора radio-кнопки по текущему значению wheelDiameter
    // Эта логика немного сложна, потому что Radio-кнопки не имеют "value" как Input
    // VKUI Radio требует, чтобы checked управлялся извне.
    // Поэтому мы будем вычислять 'wheelSizeOption' на основе initialFormData.wheelDiameter
    // и затем использовать это для установки checked.
    // Если пользователь выберет Radio, мы обновим wheelDiameter и
    // при необходимости переключим его в 'custom', если он введет что-то другое.
  }, [initialFormData.wheelDiameter, initialFormData.chainrings]); // Зависит от wheelDiameter и chainrings для определения 700c/29

  const handleWheelSizeOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedOption = e.target.value;
    let newWheelDiameter = initialFormData.wheelDiameter; // Сохраняем текущее, если не стандартное

    switch (selectedOption) {
      case "700c":
        newWheelDiameter = 622;
        break;
      case "29":
        newWheelDiameter = 622;
        break;
      case "27.5":
        newWheelDiameter = 584;
        break;
      case "26":
        newWheelDiameter = 559;
        break;
      // В случае 'custom', ничего не меняем, пользователь вводит вручную
    }
    updateFormData("wheelDiameter", newWheelDiameter);
  };

  const handleFormCalculate = () => {
    const chainrings = initialFormData.chainrings;
    const cassette = initialFormData.cassette;
    const finalWheelDiameter = initialFormData.wheelDiameter;
    const finalCadence = initialFormData.cadence;

    const formData: CalculatorInputData = {
      chainrings,
      cassette,
      wheelDiameter: finalWheelDiameter,
      cadence: finalCadence,
    };

    console.log("Данные для расчета получены из формы:", formData);
    onCalculate(formData);
  };

  // Вычисляем текущую выбранную опцию для радио-кнопок
  const getSelectedWheelOption = (diameter: number): string => {
    switch (diameter) {
      case 622:
        // 700c и 29" имеют одинаковый ETRTO 622.
        // Для упрощения, можно считать 700c, если это изначально шоссейные звезды
        // или 29" в другом случае. Это не идеально, но для выбора radio-кнопки достаточно.
        return initialFormData.chainrings[0] === 50 ? "700c" : "29";
      case 584:
        return "27.5";
      case 559:
        return "26";
      default:
        return "custom";
    }
  };
  const currentWheelSizeOption = getSelectedWheelOption(
    initialFormData.wheelDiameter
  );

  return (
    <Group
      mode="card"
      onSubmit={(e) => {
        e.preventDefault();
        handleFormCalculate();
      }}
    >
      <FormItem
        top="Передние звезды (зубья, через запятую)"
        htmlFor="chainrings"
      >
        <Textarea
          id="chainrings"
          value={initialFormData.chainrings.join(",")} // Используем значение из пропсов
          onChange={(e) =>
            updateFormData(
              "chainrings",
              e.target.value
                .split(",")
                .map(Number)
                .filter((n) => !isNaN(n))
            )
          } // Обновляем через onFormChange
          placeholder="Например: 50,34"
        />
      </FormItem>

      <FormItem top="Задние звезды (зубья, через запятую)" htmlFor="cassette">
        <Textarea
          id="cassette"
          value={initialFormData.cassette.join(",")} // Используем значение из пропсов
          onChange={(e) =>
            updateFormData(
              "cassette",
              e.target.value
                .split(",")
                .map(Number)
                .filter((n) => !isNaN(n))
            )
          } // Обновляем через onFormChange
          placeholder="Например: 11,12,13,14,15,17,19,21,23,25,28,32"
        />
      </FormItem>

      <FormItem top="Размер колеса">
        <Radio
          name="wheelSize"
          value="700c"
          checked={currentWheelSizeOption === "700c"}
          onChange={handleWheelSizeOptionChange}
        >
          700c (шоссе)
        </Radio>
        <Radio
          name="wheelSize"
          value="29"
          checked={currentWheelSizeOption === "29"}
          onChange={handleWheelSizeOptionChange}
        >
          29" (MTB)
        </Radio>
        <Radio
          name="wheelSize"
          value="27.5"
          checked={currentWheelSizeOption === "27.5"}
          onChange={handleWheelSizeOptionChange}
        >
          27.5" (MTB / 650B)
        </Radio>
        <Radio
          name="wheelSize"
          value="26"
          checked={currentWheelSizeOption === "26"}
          onChange={handleWheelSizeOptionChange}
        >
          26" (MTB)
        </Radio>
        <Radio
          name="wheelSize"
          value="custom"
          checked={currentWheelSizeOption === "custom"}
          onChange={handleWheelSizeOptionChange}
        >
          Свой (ETRTO диаметр обода в мм)
        </Radio>
      </FormItem>

      {currentWheelSizeOption === "custom" && (
        <FormItem top="Диаметр обода ETRTO (мм)">
          <Input
            type="number"
            value={initialFormData.wheelDiameter.toString()} // Используем значение из пропсов
            onChange={(e) =>
              updateFormData("wheelDiameter", parseInt(e.target.value, 10))
            } // Обновляем через onFormChange
            placeholder="Например: 622"
          />
        </FormItem>
      )}

      <FormItem top="Каденс (об/мин)">
        <Header
          mode="primary"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Text>{initialFormData.cadence} об/мин</Text>{" "}
          {/* Используем значение из пропсов */}
        </Header>
        <Slider
          min={30}
          max={120}
          step={1}
          value={initialFormData.cadence} // Используем значение из пропсов
          onChange={(value) => updateFormData("cadence", value)} // Обновляем через onFormChange
        />
        <Div>
          <Input
            type="number"
            value={initialFormData.cadence} // Используем значение из пропсов
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value)) {
                updateFormData("cadence", value); // Обновляем через onFormChange
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
