import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import Home from './Home';
import Cameras from './Cameras';
import Settings from './Settings';
import AppHeader from './Header';
//import reportWebVitals from './reportWebVitals';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: #fafafa;
    font-family: Roboto, sans-serif;
  }
`

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <div className="App">
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="" element={<Home />}></Route>
          <Route path="cameras" element={<Cameras />}></Route>
          <Route path="settings" element={<Settings />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  </React.Fragment>,
  document.getElementById('root')
);