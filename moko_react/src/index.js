import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from './App';
import Video from './Video';
import Settings from './Settings';
//import reportWebVitals from './reportWebVitals';

document.body.style.margin = 0;

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/video" element={<Video />}></Route>
      <Route path="/settings" element={<Settings />}></Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);