import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Home, AddCamera, Camera } from './Home';
import Settings from './Settings';
import AppHeader from './Header';
import AppFooter from './Footer';

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
          <Route path="add-camera" element={<AddCamera servers={servers} />} />
        </Routes>
        <AppFooter />
      </BrowserRouter>
    </div>
  );
}

export default App;
