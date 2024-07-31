import React, { FormEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SearchedItem from './pages/SearchedItem';
import BookFinder from './pages/BookFinder';
import SearchedBook from './pages/SearchedBook';
import ViewBook from './pages/ViewBook';
import CitationGenerator from './pages/CitationGenerator';
import SignIn from './pages/SignIn';
import CreateAccount from './pages/CreateAccount';
import SaveDatas from './pages/SaveDatas';
import Home from './pages/Home';
import ScrollToTop from './comp/ScrollToTop';
import ForgotPass from './comp/ForgotPass';
import ForgotPassword from './pages/ForgotPassword';

const App:React.FC= () => {


  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Article' element={<Homepage />} />
          

          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<CreateAccount />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/search/:query/:page' element={<SearchedItem />} />

          <Route path='/book-finder/' element={<BookFinder />} />
          <Route path='/saved-datas' element={<SaveDatas />} />

          <Route path='/search-book/:bookQuery/:page' element={<SearchedBook />} />
          <Route path='/searched-book/:bookID' element={<ViewBook />} />


          <Route path='/citation-generator' element={<CitationGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
