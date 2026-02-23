import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import HorsesListPage from "./pages/HorsesListPage";
import HorseDetailPage from "./pages/HorseDetailPage";
import BreedingPage from "./pages/BreedingPage";
import StallionsPage from "./pages/StallionsPage";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/hastar" element={<HorsesListPage />} />
        <Route path="/hastar/:id" element={<HorseDetailPage />} />
        <Route path="/avel" element={<BreedingPage />} />
        <Route path="/hingstar" element={<StallionsPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
