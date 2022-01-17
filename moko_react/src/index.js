import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { createGlobalStyle } from 'styled-components'
import { Home, AddCamera, Camera } from './Home';
import Settings from './Settings';
import AppHeader from './Header';
import AppFooter from './Footer';

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
          <Route path="/*" element={<Home />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="camera-x" element={<Camera />} />
          <Route path="add-camera" element={<AddCamera />} />
        </Routes>
        <AppFooter />
      </BrowserRouter>
    </div>
  </React.Fragment>,
  document.getElementById('root')
);