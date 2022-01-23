import React from "react";
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
  return (
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
  );
}

export default App;
