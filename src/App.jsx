import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExamBooking from './pages/ExamBooking';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyAppointments from './pages/MyAppointments'; 
import AdminDashboard from './pages/AdminDashboard'; 
import DoctorAgenda from './pages/DoctorAgenda'; 
import DoctorProfile from './pages/DoctorProfile';
import ExamesDetalhes from './pages/ExamesDetalhes';
import ExamsList from './pages/ExamsList';
import MedicalRecord from './pages/MedicalRecord';
import MyPatients from './pages/MyPatients';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';

function App() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  return (
    <Router basename="/saude-digital-app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meus-agendamentos" element={<MyAppointments />} />
        <Route path="/medico/:id" element={<DoctorProfile />} />

        {/* COLOQUE A ROTA DE EXAME AQUI (ANTES DO *) */}
        <Route path="/exame/:id" element={<ExamBooking />} />

        <Route 
          path="/admin" 
          element={usuarioLogado?.role === 'secretaria' ? <AdminDashboard /> : <Navigate to="/" />} 
        />

        <Route 
          path="/agenda-medica" 
          element={usuarioLogado?.role === 'medico' ? <DoctorAgenda /> : <Navigate to="/" />} 
        />
        
        {/* O ASTERISCO PRECISA SER SEMPRE O ÚLTIMO DA LISTA */}
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/exames" element={<ExamsList />} /> {/* Uma página simples com as categorias */}
        <Route path="/exame-detalhes/:id" element={<ExamesDetalhes />} />

        <Route path="/atendimento/:id" element={<MedicalRecord />} />

        <Route path="/meus-pacientes" element={<MyPatients />} />

        <Route path="/gestao-usuarios" element={<UserManagement />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;