import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from './components/header/header';
import Home from './pages/Home/Home';
import './App.css'

function App() {
  
  return (
    <BrowserRouter>

  <Header />

    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
