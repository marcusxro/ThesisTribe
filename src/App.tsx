import React, { FormEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SearchedItem from './pages/SearchedItem';

const App:React.FC= () => {


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/search/:query/:page' element={<SearchedItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
