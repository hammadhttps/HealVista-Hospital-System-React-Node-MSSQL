import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Patient from './patient';
import Ward from './ward';
import Ambu from './ambu';  // Renamed component
import Fin  from './fin';
import Med from './med';
import Lab from './lab';
import Doctors from './doc';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/ward" element={<Ward />} />
        <Route path="/ambu" element={<Ambu />} />  {/* Updated route */}
        <Route path="/fin" element={<Fin />} />
        <Route path="/med" element={<Med />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/doc" element={<Doctors />} />
      </Routes>
    </Router>
  );
}

export default App;
