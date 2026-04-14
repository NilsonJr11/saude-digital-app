import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import DoctorProfile from './pages/DoctorProfile';
import MyAppointments from './pages/MyAppointments';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      {/* A estrutura abaixo (flex flex-col min-h-screen) garante que:
        1. A Navbar fique no topo.
        2. O conteúdo (main) ocupe o espaço restante.
        3. O Footer fique sempre no final da página.
      */}
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar /> 
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/medico/:id" element={<DoctorProfile />} />
            <Route path="/meus-agendamentos" element={<MyAppointments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;