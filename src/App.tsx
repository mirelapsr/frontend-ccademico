import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PaginaEscolas from "./pages/PaginaEscolas";
import PaginaAlunos from "./pages/PaginaAlunos";
import PaginaTurmas from "./pages/PaginaTurmas";
import PaginaMatriculas from "./pages/PaginaMatriculas";
import PaginaProfessores from "./pages/PaginaProfessores";
import PaginaMaterias from "./pages/PaginaMaterias";
import PaginaPeriodos from "./pages/PaginaPeriodos";
import PaginaResponsaveis from "./pages/PaginaResponsaveis";
import PaginaVinculos from "./pages/PaginaVinculos";
import PaginaPagamentos from "./pages/PaginaPagamentos";
import PaginaGrades from "./pages/PaginaGrades";
import PaginaAvaliacoes from "./pages/PaginaAvaliacoes";
import PaginaFrequencias from "./pages/PaginaFrequencias";
import PaginaNotas from "./pages/PaginaNotas";
import PaginaBoletins from "./pages/PaginaBoletins";

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
          <Route path="professores" element={<PaginaProfessores />} />
          <Route path="materias" element={<PaginaMaterias />} />
          <Route path="periodos" element={<PaginaPeriodos />} />
          <Route path="responsaveis" element={<PaginaResponsaveis />} />
          <Route path="vinculos" element={<PaginaVinculos />} />
          <Route path="pagamentos" element={<PaginaPagamentos />} />
          <Route path="grades" element={<PaginaGrades />} />
          <Route path="avaliacoes" element={<PaginaAvaliacoes />} />
          <Route path="frequencias" element={<PaginaFrequencias />} />
          <Route path="notas" element={<PaginaNotas />} />
          <Route path="boletins" element={<PaginaBoletins />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;