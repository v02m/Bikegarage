// src/App.tsx
import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  View,
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitLayout,
  SplitCol,
  Panel,
  Group,
  Cell,
  Button,
  PanelHeader,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import HomePanel from "./components/HomePanel";
import CalculatorPanel from "./components/CalculatorPanel";
import GearRatioResultPanel from "./components/GearRatioResultPanel";

import type { CalculatorInputData } from "./components/CalculatorPanel/CalculatorInputForm";

// --- Заглушки для новых панелей ---
const TheoryPanel: React.FC<{
  id: string;
  setActivePanel: (panelId: string) => void;
}> = ({ id, setActivePanel }) => (
  <Panel id={id}>
    <PanelHeader>Энциклопедия Велосипеда</PanelHeader>
    <Group>
      <Cell>Здесь будет глоссарий и статьи по теории велосипеда.</Cell>
      <Cell>
        <Button onClick={() => setActivePanel("home")}>На главную</Button>
      </Cell>
    </Group>
  </Panel>
);

const MyBikePanel: React.FC<{
  id: string;
  setActivePanel: (panelId: string) => void;
}> = ({ id, setActivePanel }) => (
  <Panel id={id}>
    <PanelHeader>Мой Байк</PanelHeader>
    <Group>
      <Cell>
        Здесь будет информация о вашем велосипеде, компонентах и апгрейдах.
      </Cell>
      <Cell>
        <Button onClick={() => setActivePanel("home")}>На главную</Button>
      </Cell>
    </Group>
  </Panel>
);

const WorkshopsPanel: React.FC<{
  id: string;
  setActivePanel: (panelId: string) => void;
}> = ({ id, setActivePanel }) => (
  <Panel id={id}>
    <PanelHeader>Веломастерские</PanelHeader>
    <Group>
      <Cell>Здесь будет список веломастерских.</Cell>
      <Cell>
        <Button onClick={() => setActivePanel("home")}>На главную</Button>
      </Cell>
    </Group>
  </Panel>
);
// --- Конец заглушек ---

const App = () => {
  const [activePanel, setActivePanel] = useState("home");
  const [fetchedUser, setUser] = useState(null);
  const [scheme, setScheme] = useState("vkcom_light");

  // --- НОВОЕ СОСТОЯНИЕ ДЛЯ КАЛЬКУЛЯТОРА ---
  const [calculatorFormData, setCalculatorFormData] =
    useState<CalculatorInputData>({
      chainrings: [30, 32], // <-- Начальные значения
      cassette: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28, 32], // <-- Начальные значения
      wheelDiameter: 622, // <-- ETRTO for 700c (дорожный)
      cadence: 90,
    });
  // --- КОНЕЦ НОВОГО СОСТОЯНИЯ ---

  const [calculatedData, setCalculatedData] =
    useState<CalculatorInputData | null>(null);

  const goToResults = (data: CalculatorInputData) => {
    // При расчете, сохраняем данные и переходим на панель результатов
    setCalculatedData(data);
    setActivePanel("results");
  };

  useEffect(() => {
    // fetchData(); // Закомментируем, если не используем bridge активно для дебага
  }, []);

  return (
    <ConfigProvider scheme={scheme}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol autoSpaced>
              <View activePanel={activePanel}>
                <HomePanel id="home" setActivePanel={setActivePanel} />
                <CalculatorPanel
                  id="calculator"
                  setActivePanel={setActivePanel}
                  onCalculate={goToResults}
                  // --- ПЕРЕДАЁМ НОВОЕ СОСТОЯНИЕ В КАЛЬКУЛЯТОР ---
                  initialFormData={calculatorFormData}
                  onFormChange={setCalculatorFormData}
                />
                <GearRatioResultPanel
                  id="results"
                  setActivePanel={setActivePanel}
                  calculatedData={calculatedData}
                />
                {/* Новые заглушки панелей */}
                <TheoryPanel id="theory" setActivePanel={setActivePanel} />
                <MyBikePanel id="mybike" setActivePanel={setActivePanel} />
                <WorkshopsPanel
                  id="workshops"
                  setActivePanel={setActivePanel}
                />
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
