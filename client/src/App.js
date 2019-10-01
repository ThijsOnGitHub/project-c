import React from 'react';
import logo from './logo.svg';
import './App.css';
import DataTest from "./Pages/DataTest";
import addStringFunctions from "./Values/addStringFunctions";

function App() {
  // this programm adds new string functions
  addStringFunctions()
  return (
    <DataTest/>
  );
}

export default App;
