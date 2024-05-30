import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

import './App.css';
import SignupPage from "./pages/SignupPage";
import DailyWeight from "./pages/DailyWeight";
import DailyDiet from "./pages/DailyDiet";
import Dashboard from "./pages/Dashboard";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import FitRoom from "./pages/FitRoom";

function App() {

  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
      <Route  path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home"  element={<HomePage />}>
          <Route index element={<Dashboard />} />
          <Route path="dailyWeight" element={<DailyWeight />} />
          <Route path="dailyDiet" element={<DailyDiet />} />
          <Route path="fitRoom" element={<FitRoom />} />
        </Route>
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
