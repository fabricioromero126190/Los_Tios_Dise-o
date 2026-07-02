import { useState } from "react";
import "./App.css";

import Login from "./pages/Login/Login";
import UnidadAdmin from "./pages/UnidadAdmin/UnidadAdmin";
import Estado from "./pages/Estado/Estado";
import Mes from "./pages/Mes/Mes";
import Entidades from "./pages/Entidades/Entidades";
import ObjGasto from "./pages/ObjGasto/ObjGasto";
import CtaPar from "./pages/CtaPar/CtaPar";

function App() {
  const [logueado, setLogueado] = useState(false);
  const [paginaActual, setPaginaActual] = useState("estado");

  const mostrarPagina = () => {
    if (paginaActual === "entidades") return <Entidades />;
    if (paginaActual === "estado") return <Estado />;
    if (paginaActual === "mes") return <Mes />;
    if (paginaActual === "objgasto") return <ObjGasto />;
    if (paginaActual === "unidadadmin") return <UnidadAdmin />;
    if (paginaActual === "ctapar") return <CtaPar />;
    return <Entidades />;
  };

  if (!logueado) {
    return <Login onLogin={() => setLogueado(true)} />;
  }

  return (
    <div className="vsiaf-container">
      <div className="vsiaf-card">
        <header className="vsiaf-header">
          <div className="vsiaf-logo">
            <div className="bandera"></div>
            <div>
              <h1>V.S.I.A.F</h1>
              <p>Sistema de Activos Fijos</p>
            </div>
          </div>
        </header>



        <div className="vsiaf-body">
          <aside className="vsiaf-menu">
            <h3>MENU PRINCIPAL</h3>

            <div className="vsiaf-menu-panel">
              <button className="menu-button" onClick={() => setPaginaActual("entidades")}>Entidades</button>
              <button className="menu-button" onClick={() => setPaginaActual("estado")}>Estado</button>
              <button className="menu-button" onClick={() => setPaginaActual("mes")}>Mes</button>
              <button className="menu-button" onClick={() => setPaginaActual("objgasto")}>Objeto de Gasto</button>
              <button className="menu-button" onClick={() => setPaginaActual("unidadadmin")}>Unidad Admin</button>
              <button className="menu-button" onClick={() => setPaginaActual("ctapar")}>Cta Par</button>
            </div>

            <div className="vsiaf-menu-footer">
              <button className="btn-cerrar-sesion" onClick={() => setLogueado(false)}>
                Cerrar sesión
              </button>
            </div>
          </aside>

          <main className="vsiaf-content">
                <div className="info-entidad-unidad">
                  <div>
                    <span className="label-info">ENTIDAD:</span>
                    <span className="codigo-info">0025</span>
                    <span className="texto-info">Ministerio de la Presidencia</span>
                  </div>

                  <div>
                    <span className="label-info">UNIDAD:</span>
                    <span className="codigo-info">0</span>
                  </div>
                </div>
{mostrarPagina()}


          </main>

        </div>
      </div>
    </div>
  );
}

export default App;