import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PaginaEscolas from "./pages/PaginaEscolas";
import PaginaAlunos from "./pages/PaginaAlunos";
import PaginaTurmas from "./pages/PaginaTurmas";
import PaginaMatriculas from "./pages/PaginaMatriculas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="escolas" element={<PaginaEscolas />} />
          <Route path="alunos" element={<PaginaAlunos />} />
          <Route path="turmas" element={<PaginaTurmas />} />
          <Route path="matriculas" element={<PaginaMatriculas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
