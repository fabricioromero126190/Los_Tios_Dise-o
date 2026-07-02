import { useEffect, useState } from "react";
import {
  listarEstados,
  buscarEstadoPorId,
  guardarEstado,
  actualizarEstado,
  eliminarEstado,
} from "../../services/estadoService";

import "./estado.css";

function Estado() {
  const [estados, setEstados] = useState([]);
  const [nomestado, setNomestado] = useState("");
  const [idEditar, setIdEditar] = useState(null);
  const [idBuscar, setIdBuscar] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const cargarEstados = async () => {
    const datos = await listarEstados();
    setEstados(datos);
    setEstadoSeleccionado(null);
  };

  useEffect(() => {
    cargarEstados();
  }, []);

  const buscarPorId = async () => {
    if (idBuscar === "") {
      alert("Ingrese un código para buscar");
      return;
    }

    try {
      const dato = await buscarEstadoPorId(idBuscar);
      setEstados([dato]);
      setEstadoSeleccionado(null);
    } catch (error) {
      alert("No se encontró un estado con ese ID");
    }
  };

  const seleccionarFila = (estado) => {
    setEstadoSeleccionado(estado);
  };

  const nuevo = () => {
    setModoFormulario("nuevo");
    setIdEditar(null);
    setNomestado("");
    setMostrarFormulario(true);
  };

  const editarSeleccionado = () => {
    if (estadoSeleccionado === null) {
      alert("Seleccione un estado de la tabla");
      return;
    }

    setModoFormulario("editar");
    setIdEditar(estadoSeleccionado.codestado);
    setNomestado(estadoSeleccionado.nomestado);
    setMostrarFormulario(true);
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (nomestado.trim() === "") {
      alert("Ingrese el nombre del estado");
      return;
    }

    const estado = {
      nomestado: nomestado,
    };

    if (modoFormulario === "nuevo") {
      await guardarEstado(estado);
    } else {
      await actualizarEstado(idEditar, estado);
    }

    setMostrarFormulario(false);
    setNomestado("");
    setIdEditar(null);
    setEstadoSeleccionado(null);
    cargarEstados();
  };

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setNomestado("");
    setIdEditar(null);
  };

  const eliminarSeleccionado = () => {
    if (estadoSeleccionado === null) {
      alert("Seleccione un estado para eliminar");
      return;
    }

    setMostrarEliminar(true);
  };

  const confirmarEliminar = async () => {
    await eliminarEstado(estadoSeleccionado.codestado);

    setMostrarEliminar(false);
    setEstadoSeleccionado(null);
    cargarEstados();
  };

  const cancelarEliminar = () => {
    setMostrarEliminar(false);
  };

  const seleccionarEstado = () => {
    if (estadoSeleccionado === null) {
      alert("Seleccione un estado de la tabla");
      return;
    }

    alert(
      "Estado seleccionado: " +
        estadoSeleccionado.codestado +
        " - " +
        estadoSeleccionado.nomestado
    );
  };

  const salir = () => {
    alert("Saliendo de la administración de Estado");
  };

  return (
    <div className="estado-page">
      <div className="estado-panel">
        <div className="estado-header">ADMINISTRACIÓN DE ESTADO</div>

        <div className="estado-busqueda">
          <input
            type="number"
            placeholder="Buscar por código"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />

          <button type="button" onClick={buscarPorId}>
            Buscar
          </button>

          <button type="button" onClick={cargarEstados}>
            Mostrar todos
          </button>
        </div>

        <div className="tabla-contenedor">
          <table className="estado-tabla">
            <thead>
              <tr>
                <th>codestado</th>
                <th>nomestado</th>
              </tr>
            </thead>

            <tbody>
              {estados.length > 0 ? (
                estados.map((estado) => (
                  <tr
                    key={estado.codestado}
                    onClick={() => seleccionarFila(estado)}
                    className={
                      estadoSeleccionado?.codestado === estado.codestado
                        ? "fila-seleccionada"
                        : ""
                    }
                  >
                    <td>{estado.codestado}</td>
                    <td>{estado.nomestado}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No hay estados registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="botones-panel">
          <button type="button" onClick={nuevo}>
            Nuevo
          </button>

          <button type="button" onClick={editarSeleccionado}>
            Editar
          </button>

          <button type="button" onClick={eliminarSeleccionado}>
            Eliminar
          </button>

          <button type="button" onClick={seleccionarEstado}>
            Seleccionar
          </button>

          <button type="button" onClick={salir}>
            Salir
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="modal-header">
              {modoFormulario === "nuevo"
                ? "NUEVO ESTADO"
                : "EDITAR ESTADO"}
            </div>

            <form onSubmit={guardar} className="modal-formulario">
              <label>Nombre del estado:</label>

              <input
                type="text"
                placeholder="Ingrese nombre del estado"
                value={nomestado}
                onChange={(e) => setNomestado(e.target.value)}
                autoFocus
              />

              <div className="modal-botones">
                <button type="submit">
                  {modoFormulario === "nuevo" ? "Guardar" : "Actualizar"}
                </button>

                <button type="button" onClick={cancelarFormulario}>
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
            <div className="modal-header">ELIMINAR ESTADO</div>

            <p className="modal-texto">
              ¿Seguro que desea eliminar el estado{" "}
              <b>{estadoSeleccionado?.nomestado}</b>?
            </p>

            <div className="modal-botones">
              <button type="button" onClick={confirmarEliminar}>
                Sí, eliminar
              </button>

              <button type="button" onClick={cancelarEliminar}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estado;