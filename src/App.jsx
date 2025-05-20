// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HexGrid from './components/HexGrid';
import FixedMapDebug from './components/FixedMapDebug';

export default function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Main Map</Link>
          <Link to="/fixed-map">Fixed Test Map</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HexGrid />} />
          <Route path="/fixed-map" element={<FixedMapDebug />} />
        </Routes>
      </div>
    </Router>
  );
}

