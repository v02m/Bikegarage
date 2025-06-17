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
} from "@vkontakte/vkui"; // <-- Добавляем Panel, Group, Cell, Button, PanelHeader для заглушек
import "@vkontakte/vkui/dist/vkui.css";

import HomePanel from "./components/HomePanel";
import CalculatorPanel from "./components/CalculatorPanel";
import GearRatioResultPanel from "./components/GearRatioResultPanel";

import type { CalculatorInputData } from "./components/CalculatorPanel/CalculatorInputForm"; // <-- Важно: импортируем тип для данных калькулятора

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
  const [fetchedUser, setUser] = useState(null); // Пока не используем, но держим
  const [scheme, setScheme] = useState("vkcom_light"); // Можно менять тему

  // Для перехода на панель результатов после расчета
  const [calculatedData, setCalculatedData] =
    useState<CalculatorInputData | null>(null);

  const goToResults = (data: CalculatorInputData) => {
    setCalculatedData(data);
    setActivePanel("results");
  };

  useEffect(() => {
    async function fetchData() {
      // Это для VK Mini App специфичных вызовов
      // const user = await bridge.send('VKWebAppGetUserInfo');
      // setUser(user);
    }
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
