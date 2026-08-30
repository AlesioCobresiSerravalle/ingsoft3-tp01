import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Equipamiento from "./pages/Equipamiento";
import Prestamos from "./pages/Prestamos";

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">CG</span>
          <div className="app-brand-text">
            <span className="app-brand-name">CampusGear</span>
            <span className="app-tagline">Gestión de equipamiento del laboratorio</span>
          </div>
        </div>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/equipamiento">Equipamiento</NavLink>
          <NavLink to="/prestamos">Préstamos</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipamiento" element={<Equipamiento />} />
          <Route path="/prestamos" element={<Prestamos />} />
        </Routes>
      </main>
    </>
  );
}
