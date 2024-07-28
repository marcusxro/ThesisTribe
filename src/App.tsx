import React, { FormEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SearchedItem from './pages/SearchedItem';
import BookFinder from './pages/BookFinder';
import SearchedBook from './pages/SearchedBook';

const App:React.FC= () => {


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/search/:query/:page' element={<SearchedItem />} />
          <Route path='/book-finder/' element={<BookFinder />} />

          <Route path='/search-book/:bookQuery/:page' element={<SearchedBook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
