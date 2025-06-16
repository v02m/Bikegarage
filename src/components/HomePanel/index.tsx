// src/components/HomePanel.tsx
import React from "react";
import { Panel, PanelHeader, Group, Cell, Button } from "@vkontakte/vkui";

// Типизация пропсов для HomePanel
interface HomePanelProps {
  id: string;
  setActivePanel: (panelId: string) => void;
}

const HomePanel: React.FC<HomePanelProps> = ({ id, setActivePanel }) => (
  <Panel id={id}>
    <PanelHeader>Мой Велогараж</PanelHeader>
    <Group>
      <Cell>Добро пожаловать в VK Mini App!</Cell>
      <Cell>Тут будет наш велогараж.</Cell>
      <Cell>
        <Button onClick={() => setActivePanel("calculator")}>
          Перейти к Калькулятору
        </Button>
      </Cell>
    </Group>
  </Panel>
);

export default HomePanel;
