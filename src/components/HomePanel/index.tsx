// src/components/HomePanel/index.tsx
import React from "react";
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Text,
  Button,
  Cell,
  Spacing,
} from "@vkontakte/vkui";

interface HomePanelProps {
  id: string;
  setActivePanel: (panelId: string) => void;
}

const HomePanel: React.FC<HomePanelProps> = ({ id, setActivePanel }) => {
  return (
    <Panel id={id}>
      <PanelHeader>Мой Велогараж</PanelHeader>
      <Group>
        <Div style={{ textAlign: "center", padding: "20px" }}>
          <Spacing size={16} />
          <Text weight="2" style={{ fontSize: "1.2em" }}>
            Добро пожаловать в Велогараж!
          </Text>
          <Text weight="1" style={{ marginTop: "5px" }}>
            Здесь будут инструменты для каждого райдера.
          </Text>
        </Div>
      </Group>

      <Group>
        <Cell>
          <Button
            size="l"
            stretched
            onClick={() => setActivePanel("calculator")}
          >
            Калькулятор передач
          </Button>
        </Cell>
        <Cell>
          <Button size="l" stretched onClick={() => setActivePanel("theory")}>
            Энциклопедия Велосипеда
          </Button>
        </Cell>
        <Cell>
          <Button size="l" stretched onClick={() => setActivePanel("mybike")}>
            Мой Байк
          </Button>
        </Cell>
        <Cell>
          <Button
            size="l"
            stretched
            onClick={() => setActivePanel("workshops")}
          >
            Веломастерские
          </Button>
        </Cell>
      </Group>
    </Panel>
  );
};

export default HomePanel;
