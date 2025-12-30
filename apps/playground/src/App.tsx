import { type JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import BadgeDemo from "./pages/Badge";
import ButtonDemo from "./pages/Button";
import CardDemo from "./pages/Card";
import CodeDemo from "./pages/Code";
import InputDemo from "./pages/Input";
import MenuDemo from "./pages/Menu";
import ModalDemo from "./pages/Modal";
import StackDemo from "./pages/Stack";
import TableDemo from "./pages/Table";
import TabsDemo from "./pages/Tabs";
import TextDemo from "./pages/Text";
import TooltipDemo from "./pages/Tooltip";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BadgeDemo />} path="/badge" />
        <Route element={<ButtonDemo />} path="/button" />
        <Route element={<CardDemo />} path="/card" />
        <Route element={<CodeDemo />} path="/code" />
        <Route element={<InputDemo />} path="/input" />
        <Route element={<MenuDemo />} path="/menu" />
        <Route element={<ModalDemo />} path="/modal" />
        <Route element={<StackDemo />} path="/stack" />
        <Route element={<TableDemo />} path="/table" />
        <Route element={<TabsDemo />} path="/tabs" />
        <Route element={<TextDemo />} path="/text" />
        <Route element={<TooltipDemo />} path="/tooltip" />
        <Route element={<ButtonDemo />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}
