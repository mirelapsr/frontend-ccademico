import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RotaProtegida from "./components/rotas/RotaProtegida";
import LayoutPrincipal from "./components/layout/LayoutPrincipal";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaPerfil from "./pages/PaginaPerfil";
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
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />

          <Route element={<RotaProtegida />}>
            <Route path="/" element={<LayoutPrincipal />}>
              <Route index element={<Dashboard />} />
              <Route path="perfil" element={<PaginaPerfil />} />
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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;