import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./LayoutPrincipal.css";

function LayoutPrincipal() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  function alternarSidebar() {
    setSidebarAberta((atual) => !atual);
  }

  return (
    <div className="layout-principal">
      <Sidebar aberta={sidebarAberta} />

      <div className="layout-principal__area">
        <TopBar sidebarAberta={sidebarAberta} aoAlternarSidebar={alternarSidebar} />

        <main className="layout-principal__conteudo">
          <div className="layout-principal__conteudo-interno">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default LayoutPrincipal;