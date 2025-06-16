import React, { useState, useEffect } from "react";
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  PanelHeader,
  usePlatform,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import bridge from "@vkontakte/vk-bridge";
import type { VKBridgeEvent } from "@vkontakte/vk-bridge";

// Импортируем наши компоненты из их папок
import HomePanel from "./components/HomePanel";
import CalculatorPanel from "./components/CalculatorPanel";
import GearRatioResultPanel from "./components/GearRatioResultPanel";

// Импортируем тип CalculatorInputData из CalculatorInputForm
import type { CalculatorInputData } from "./components/CalculatorPanel/CalculatorInputForm";

const App: React.FC = () => {
  const platform = usePlatform();
  const [activePanel, setActivePanel] = useState("home"); // Управляет активной панелью

  const [scheme, setScheme] = useState<string | null>(null);
  // Состояние для хранения данных калькулятора, которые будут передаваться между панелями
  const [calculatorInput, setCalculatorInput] =
    useState<CalculatorInputData | null>(null);
  // Состояние для хранения РАССЧИТАННЫХ данных, которые передаются на экран результатов
  const [calculatedResultsData, setCalculatedResultsData] =
    useState<CalculatorInputData | null>(null);

  useEffect(() => {
    bridge.send("VKWebAppInit");

    const handleUpdateConfig = (event: VKBridgeEvent<any>) => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      if (event.detail.type === "VKWebAppUpdateConfig") {
        const data = event.detail.data as { scheme?: string };
        if (data.scheme) {
          setScheme(data.scheme);
        }
      }
    };

    bridge.subscribe(handleUpdateConfig);

    return () => {
      bridge.unsubscribe(handleUpdateConfig);
    };
  }, []);

  const currentScheme = scheme || "vkcom_light";
  const header =
    platform !== "vkcom" ? <PanelHeader delimiter="none" /> : undefined;

  // Эта функция теперь отвечает за:
  // 1. Сохранение введенных значений формы в состояние `calculatorInput` (для сохранения на сессию)
  // 2. Сохранение этих же значений в `calculatedResultsData` (для передачи на экран результатов)
  // 3. Переход на панель результатов
  const handleCalculateAndNavigate = (data: CalculatorInputData) => {
    setCalculatorInput(data); // Сохраняем введенные данные
    setCalculatedResultsData(data); // Передаем эти же данные для расчетов на странице результатов
    setActivePanel("gear_results"); // Переходим на панель результатов
  };

  return (
    <AppRoot>
      <SplitLayout header={header}>
        <SplitCol autoSpaced>
          <View activePanel={activePanel}>
            {/* HomePanel просто переключает активную панель */}
            <HomePanel id="home" setActivePanel={setActivePanel} />

            {/* CalculatorPanel принимает функцию, которая получает данные и меняет панель,
                а также передает начальные значения для формы */}
            <CalculatorPanel
              id="calculator"
              onCalculateAndNavigate={handleCalculateAndNavigate}
              initialValues={calculatorInput} // Передаем сохраненные значения
            />

            {/* GearRatioResultPanel принимает сохраненные данные для отображения и расчетов */}
            <GearRatioResultPanel
              id="gear_results"
              setActivePanel={setActivePanel} // Передаем setActivePanel для кнопки "Назад"
              calculatedData={calculatedResultsData} // Передаем данные для расчетов
            />
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};

export default App;
