import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import styled from 'styled-components'
import Home from './Home';
import Video from './Video';
import Settings from './Settings';
import AppHeader from './Header';
//import reportWebVitals from './reportWebVitals';

document.body.style.margin = 0;

const AppDiv = styled.div`
  font-family: Helvetica;
`

ReactDOM.render(
  <AppDiv className="App">
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="" element={<Home />}></Route>
        <Route path="video" element={<Video />}></Route>
        <Route path="settings" element={<Settings />}></Route>
      </Routes>
    </BrowserRouter>
  </AppDiv>,
  document.getElementById('root')
);