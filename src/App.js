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

function App() {

  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        <Route path="/home" element={<HomePage />}>
          <Route index element={<Dashboard />} />
          <Route path="dailyWeight" element={<DailyWeight />} />
          <Route path="dailyDiet" element={<DailyDiet />} />
        </Route>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
