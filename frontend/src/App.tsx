import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Equipamiento from "./pages/Equipamiento";
import Prestamos from "./pages/Prestamos";

export default function App() {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/equipamiento">Equipamiento</NavLink>
        <NavLink to="/prestamos">Préstamos</NavLink>
      </nav>
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
