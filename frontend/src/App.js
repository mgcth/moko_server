import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Home, AddCamera, Camera } from './Home.js';
import Settings from './Settings.js';
import AppHeader from './Header.js';
import AppFooter from './Footer.js';

function App() {
  const [servers, setServers] = useState({})

  return (
    <div className="App">
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="" element={<Home servers={servers} setServers={setServers} />} />
          <Route path="settings" element={<Settings />} />
          <Route path="camera" element={<Camera />} />
          <Route path="add-camera" element={<AddCamera />} />
        </Routes>
        <AppFooter />
      </BrowserRouter>
    </div>
  );
}

export default App;
