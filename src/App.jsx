import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importe sua Navbar aqui
import Home from './pages/Home';
import Register from './pages/Register';
import DoctorProfile from './pages/DoctorProfile';
import MyAppointments from './pages/MyAppointments';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      {/* A Navbar PRECISA estar aqui dentro, ANTES das Routes */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/medico/:id" element={<DoctorProfile />} />
        <Route path="/meus-agendamentos" element={<MyAppointments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;