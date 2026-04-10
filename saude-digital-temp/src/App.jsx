import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DoctorProfile from './pages/DoctorProfile';
import MyAppointments from './pages/MyAppointments';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medico/:id" element={<DoctorProfile />} />
        <Route path="/meus-agendamentos" element={<MyAppointments />} />
        <Route path="/meus-agendamentos" element={<MyAppointments />} />
        <Route path="/" element={<Home />} />
        <Route path="/medico/:id" element={<DoctorProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;