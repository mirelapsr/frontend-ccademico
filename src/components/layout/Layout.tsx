import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

const ITENS_MENU = [
  { rota: "/", rotulo: "Dashboard" },
  { rota: "/escolas", rotulo: "Escolas" },
  { rota: "/periodos", rotulo: "Períodos" },
  { rota: "/professores", rotulo: "Professores" },
  { rota: "/materias", rotulo: "Matérias" },
  { rota: "/turmas", rotulo: "Turmas" },
  { rota: "/grades", rotulo: "Grade Curricular" },
  { rota: "/avaliacoes", rotulo: "Avaliações" },
  { rota: "/alunos", rotulo: "Alunos" },
  { rota: "/responsaveis", rotulo: "Responsáveis" },
  { rota: "/vinculos", rotulo: "Vínculos" },
  { rota: "/matriculas", rotulo: "Matrículas" },
  { rota: "/frequencias", rotulo: "Frequência" },
  { rota: "/notas", rotulo: "Notas" },
  { rota: "/boletins", rotulo: "Boletim" },
  { rota: "/pagamentos", rotulo: "Pagamentos" },
];

function Layout() {
  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <div className="layout__marca">
          <p className="layout__marca-eyebrow">Controle Acadêmico</p>
          <h1 className="layout__marca-titulo">Portal Escolar</h1>
        </div>

        <nav className="layout__menu" aria-label="Navegação principal">
          {ITENS_MENU.map((item) => (
            <NavLink
              key={item.rota}
              to={item.rota}
              end={item.rota === "/"}
              className={({ isActive }) =>
                isActive ? "layout__link layout__link--ativo" : "layout__link"
              }
            >
              {item.rotulo}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="layout__conteudo">
        <div className="layout__conteudo-interno">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;