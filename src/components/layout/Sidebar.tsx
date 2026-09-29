import { NavLink } from "react-router-dom";
import logoBrasao from "../../assets/logo-brasao.jpg";
import "./Sidebar.css";

interface ItemMenu {
  rota: string;
  rotulo: string;
}

const ITENS_MENU: ItemMenu[] = [
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

interface SidebarProps {
  aberta: boolean;
}

function Sidebar({ aberta }: SidebarProps) {
  return (
    <aside className={aberta ? "sidebar" : "sidebar sidebar--colapsada"}>
      <div className="sidebar__marca">
        {aberta ? (
          <div className="sidebar__marca-texto">
            <span className="sidebar__marca-eyebrow">Controle Acadêmico</span>
            <h1 className="sidebar__marca-titulo">Portal Escolar</h1>
          </div>
        ) : (
          <img src={logoBrasao} alt="Portal Escolar" className="sidebar__marca-brasao" />
        )}
      </div>

      <nav className="sidebar__menu" aria-label="Navegação principal">
        {ITENS_MENU.map((item) => (
          <NavLink
            key={item.rota}
            to={item.rota}
            end={item.rota === "/"}
            title={item.rotulo}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--ativo" : "sidebar__link"
            }
          >
            <span className="sidebar__link-texto">{item.rotulo}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;