import { NavLink } from "react-router-dom";
import logoBrasao from "../../assets/logo-brasao.jpg";
import iconeStats from "../../assets/icones-menu/stats.png";
import iconeSchool from "../../assets/icones-menu/school.png";
import iconeCalendarClock from "../../assets/icones-menu/calendar-clock.png";
import iconePersonChalkboard from "../../assets/icones-menu/person-chalkboard.png";
import iconeBookAlt from "../../assets/icones-menu/book-alt.png";
import iconeUsersClass from "../../assets/icones-menu/users-class.png";
import iconeTimeWatchCalendar from "../../assets/icones-menu/time-watch-calendar.png";
import iconeTest from "../../assets/icones-menu/test.png";
import iconeStudent from "../../assets/icones-menu/student.png";
import iconeFamily from "../../assets/icones-menu/family.png";
import iconeUserLink from "../../assets/icones-menu/user-link.png";
import iconeDegreeCredential from "../../assets/icones-menu/degree-credential.png";
import iconeTaskChecklist from "../../assets/icones-menu/task-checklist.png";
import iconeHundredPoints from "../../assets/icones-menu/hundred-points.png";
import iconeNewspaperOpen from "../../assets/icones-menu/newspaper-open.png";
import iconeWalletArrow from "../../assets/icones-menu/wallet-arrow.png";
import "./Sidebar.css";

interface ItemMenu {
  rota: string;
  rotulo: string;
  /** URL do PNG (resolvida pelo Vite no import). */
  icone: string;
}

const ITENS_MENU: ItemMenu[] = [
  { rota: "/", rotulo: "Dashboard", icone: iconeStats },
  { rota: "/escolas", rotulo: "Escolas", icone: iconeSchool },
  { rota: "/periodos", rotulo: "Períodos", icone: iconeCalendarClock },
  { rota: "/professores", rotulo: "Professores", icone: iconePersonChalkboard },
  { rota: "/materias", rotulo: "Matérias", icone: iconeBookAlt },
  { rota: "/turmas", rotulo: "Turmas", icone: iconeUsersClass },
  { rota: "/grades", rotulo: "Grade Curricular", icone: iconeTimeWatchCalendar },
  { rota: "/avaliacoes", rotulo: "Avaliações", icone: iconeTest },
  { rota: "/alunos", rotulo: "Alunos", icone: iconeStudent },
  { rota: "/responsaveis", rotulo: "Responsáveis", icone: iconeFamily },
  { rota: "/vinculos", rotulo: "Vínculos", icone: iconeUserLink },
  { rota: "/matriculas", rotulo: "Matrículas", icone: iconeDegreeCredential },
  { rota: "/frequencias", rotulo: "Frequência", icone: iconeTaskChecklist },
  { rota: "/notas", rotulo: "Notas", icone: iconeHundredPoints },
  { rota: "/boletins", rotulo: "Boletim", icone: iconeNewspaperOpen },
  { rota: "/pagamentos", rotulo: "Pagamentos", icone: iconeWalletArrow },
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
            // Recolhida: o texto some, então o nome vem do tooltip nativo (title)
            // e do aria-label (leitores de tela precisam de um nome acessível).
            title={aberta ? undefined : item.rotulo}
            aria-label={item.rotulo}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--ativo" : "sidebar__link"
            }
          >
            <img src={item.icone} alt="" aria-hidden="true" className="sidebar__icone" />
            <span className="sidebar__link-texto">{item.rotulo}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
