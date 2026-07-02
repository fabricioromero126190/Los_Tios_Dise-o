import { useEffect, useState } from "react";
import {
  listarMeses,
  buscarMesPorId,
  guardarMes,
  actualizarMes,
  eliminarMes,
} from "../../services/mesServices";
import "./mes.css";

function Mes() {
  const [meses, setMeses] = useState([]);
  const [mesCodigo, setMesCodigo] = useState("");
  const [nommes, setNommes] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [idBuscar, setIdBuscar] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("");

  const cargarMeses = async () => {
    const datos = await listarMeses();
    setMeses(datos);
    setMesSeleccionado(null);
  };

  useEffect(() => {
    cargarMeses();
  }, []);

  const buscar = async () => {
    if (idBuscar === "") {
      alert("Ingrese un código");
      return;
    }

    try {
      const dato = await buscarMesPorId(idBuscar);
      setMeses([dato]);
      setMesSeleccionado(null);
    } catch {
      alert("Mes no encontrado");
    }
  };

  const nuevo = () => {
    setModoFormulario("nuevo");
    setMesCodigo("");
    setNommes("");
    setMesSeleccionado(null);
    setMostrarFormulario(true);
  };

  const editar = () => {
    if (!mesSeleccionado) {
      alert("Seleccione un registro");
      return;
    }

    setModoFormulario("editar");
    setMesCodigo(mesSeleccionado.mes);
    setNommes(mesSeleccionado.nommes);
    setMostrarFormulario(true);
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (mesCodigo === "" || nommes.trim() === "") {
      alert("Complete todos los campos");
      return;
    }

    const mes = {
      mes: Number(mesCodigo),
      nommes: nommes,
    };

    try {
      if (modoFormulario === "nuevo") {
        await guardarMes(mes);
      } else {
        await actualizarMes(mesSeleccionado.mes, mes);
      }

      setMostrarFormulario(false);
      setMesCodigo("");
      setNommes("");
      setMesSeleccionado(null);
      cargarMeses();
    } catch (error) {
      console.error("Error al guardar mes:", error);
      alert("No se pudo guardar el mes. Revise consola o backend.");
    }
  };

  const abrirEliminar = () => {
    if (!mesSeleccionado) {
      alert("Seleccione un registro para eliminar");
      return;
    }

    setMostrarEliminar(true);
  };

  const eliminar = async () => {
    try {
      await eliminarMes(mesSeleccionado.mes);
      setMostrarEliminar(false);
      setMesSeleccionado(null);
      cargarMeses();
    } catch (error) {
      console.error("Error al eliminar mes:", error);
      alert("No se pudo eliminar el mes");
    }
  };

  const seleccionar = () => {
    if (!mesSeleccionado) {
      alert("Seleccione un registro");
      return;
    }

    alert(`Mes seleccionado: ${mesSeleccionado.mes} - ${mesSeleccionado.nommes}`);
  };

  return (
    <div className="mes-page">
      <div className="mes-panel">
        <div className="mes-header">ADMINISTRACIÓN DE MES</div>

        <div className="mes-busqueda">
          <input
            type="number"
            placeholder="Buscar por código"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />

          <button onClick={buscar}>Buscar</button>

          <button onClick={cargarMeses}>Mostrar Todos</button>
        </div>

        <div className="tabla-contenedor">
          <table className="mes-tabla">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Nombre del Mes</th>
              </tr>
            </thead>

            <tbody>
              {meses.length > 0 ? (
                meses.map((mes) => (
                  <tr
                    key={mes.mes}
                    onClick={() => setMesSeleccionado(mes)}
                    className={
                      mesSeleccionado?.mes === mes.mes
                        ? "fila-seleccionada"
                        : ""
                    }
                  >
                    <td>{mes.mes}</td>
                    <td>{mes.nommes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay meses registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="botones-panel">
          <button onClick={nuevo}>Nuevo</button>
          <button onClick={editar}>Editar</button>
          <button onClick={abrirEliminar}>Eliminar</button>
          <button onClick={seleccionar}>Seleccionar</button>
          <button onClick={() => window.history.back()}>Salir</button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="modal-header">
              {modoFormulario === "nuevo" ? "NUEVO MES" : "EDITAR MES"}
            </div>

            <form className="modal-formulario" onSubmit={guardar}>
              <label>Código del mes</label>
              <input
                type="number"
                value={mesCodigo}
                onChange={(e) => setMesCodigo(e.target.value)}
                placeholder="Ejemplo: 1"
                disabled={modoFormulario === "editar"}
              />

              <label>Nombre del mes</label>
              <input
                type="text"
                value={nommes}
                onChange={(e) => setNommes(e.target.value)}
                placeholder="Ejemplo: Enero"
              />

              <div className="modal-botones">
                <button type="submit">
                  {modoFormulario === "nuevo" ? "Guardar" : "Actualizar"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setMesCodigo("");
                    setNommes("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarEliminar && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="modal-header">ELIMINAR MES</div>

            <p className="modal-texto">
              ¿Desea eliminar el mes <b>{mesSeleccionado?.nommes}</b>?
            </p>

            <div className="modal-botones">
              <button onClick={eliminar}>Sí</button>

              <button onClick={() => setMostrarEliminar(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mes;