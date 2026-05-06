import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ExamBooking from './pages/ExamBooking';
import MyAppointments from './pages/MyAppointments'; 
import DoctorProfile from './pages/DoctorProfile';
import ExamesDetalhes from './pages/ExamesDetalhes';
import ExamsList from './pages/ExamsList';
import MedicalRecord from './pages/MedicalRecord';
import UserManagement from './pages/UserManagement';
import AgendaMedica from './pages/AgendaMedica'; 
import MeusPacientes from './pages/MeusPacientes';
import DashboardSecretaria from './pages/DashboardSecretaria';
import CadastroPacientes from './pages/CadastroPacientes';
import { Toaster } from 'react-hot-toast';

function App() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  return (
    <Router basename="/saude-digital-app">
      {/* O Toaster fica aqui, fora das rotas, para aparecer em qualquer página */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* --- ROTAS DO PACIENTE --- */}
          <Route path="/exames" element={<ExamsList />} />
          <Route path="/exame-detalhes/:id" element={<ExamesDetalhes />} />
          <Route path="/exame/:id" element={<ExamBooking />} />
          <Route path="/meus-agendamentos" element={<MyAppointments />} />
          <Route path="/medico/:id" element={<DoctorProfile />} />

          {/* --- ROTAS DO MÉDICO --- */}
          <Route 
            path="/agenda-medica" 
            element={usuarioLogado?.role === 'medico' ? <AgendaMedica /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/meus-pacientes" 
            element={usuarioLogado?.role === 'medico' ? <MeusPacientes /> : <Navigate to="/login" />} 
          />
          <Route path="/atendimento/:id" element={<MedicalRecord />} />

          {/* --- ROTAS DA SECRETÁRIA --- */}
          <Route 
            path="/dashboard-secretaria" 
            element={usuarioLogado?.role === 'secretaria' ? <DashboardSecretaria /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/cadastro-pacientes" 
            element={usuarioLogado?.role === 'secretaria' ? <CadastroPacientes /> : <Navigate to="/login" />} 
          />
          <Route path="/gestao-usuarios" element={<UserManagement />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;