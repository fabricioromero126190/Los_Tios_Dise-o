import { useState } from "react";
import "./login.css";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ingresar = (e) => {
    e.preventDefault();

    if (usuario === "admin" && password === "admin") {
      setError("");
      onLogin();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-vsiaf-page">
      <div className="login-vsiaf-contenedor">
        <div className="login-titulo-superior">
          INGRESE SU IDENTIFICACION
        </div>

        <div className="login-banner">
          <div className="login-bandera"></div>

          <div className="login-logo-texto">
            <h1>V.S.I.A.F</h1>
            <p>Sistema de Activos Fijos</p>
          </div>
        </div>

        <div className="login-centro">
          <form className="login-cuadro" onSubmit={ingresar}>
            <div className="login-cuadro-titulo">
              <span>Login</span>
              <div className="linea-login"></div>
            </div>

            <div className="login-fila">
              <label>Nombre del Usuario:</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            <div className="login-fila">
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <div className="login-nota">
              <b>NOTA:</b> Es sensible al contexto

              <button type="submit">Aceptar</button>
            </div>
          </form>
        </div>

        <div className="login-footer">
          <p>VSIAF versión 3.2</p>
          <p>Copyright © 1999-2013 DGSGIF</p>
          <p>Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}

export default Login;