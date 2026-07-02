import { useEffect, useState } from "react";
import {
  listarCtaPar,
  buscarCtaParPorId,
  guardarCtaPar,
  actualizarCtaPar,
  eliminarCtaPar,
} from "../../services/ctaParService";
import "./CtaPar.css";

const estadoInicial = {
  Codcont: "",
  Partida: "",
  Gestion: "",
};

function CtaPar() {
  const [listaCtaPar, setListaCtaPar] = useState([]);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [idEditar, setIdEditar] = useState(null);
  const [idBuscar, setIdBuscar] = useState("");
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const cargarDatos = async () => {
    try {
      const datos = await listarCtaPar();
      setListaCtaPar(Array.isArray(datos) ? datos : []);
      setFilaSeleccionada(null);
    } catch (error) {
      console.error("Error al cargar Cta Par:", error);
      alert("No se pudieron cargar los registros");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const buscarPorId = async () => {
    if (idBuscar === "") {
      alert("Ingrese un código para buscar");
      return;
    }

    try {
      const dato = await buscarCtaParPorId(idBuscar);
      setListaCtaPar([dato]);
      setFilaSeleccionada(null);
    } catch (error) {
      console.error("Error al buscar:", error);
      alert("No se encontró un registro con ese código");
    }
  };

  const seleccionarFila = (item) => {
    setFilaSeleccionada(item);
  };

  const nuevo = () => {
    setModoFormulario("nuevo");
    setIdEditar(null);
    setFilaSeleccionada(null);
    setFormulario(estadoInicial);
    setMostrarFormulario(true);
  };

  const editarSeleccionado = () => {
    if (filaSeleccionada === null) {
      alert("Seleccione un registro de la tabla");
      return;
    }

    setModoFormulario("editar");
    setIdEditar(filaSeleccionada.Codcont);

    setFormulario({
      Codcont: filaSeleccionada.Codcont ?? "",
      Partida: filaSeleccionada.Partida ?? "",
      Gestion: filaSeleccionada.Gestion ?? "",
    });

    setMostrarFormulario(true);
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (
      formulario.Codcont === "" ||
      formulario.Partida === "" ||
      formulario.Gestion === ""
    ) {
      alert("Complete todos los campos");
      return;
    }

    const payload = {
      Codcont: Number(formulario.Codcont),
      Partida: Number(formulario.Partida),
      Gestion: Number(formulario.Gestion),
    };

    try {
      if (modoFormulario === "nuevo") {
        await guardarCtaPar(payload);
        alert("Registro guardado correctamente");
      } else {
        await actualizarCtaPar(idEditar, payload);
        alert("Registro actualizado correctamente");
      }

      setMostrarFormulario(false);
      setFormulario(estadoInicial);
      setIdEditar(null);
      setFilaSeleccionada(null);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar Cta Par:", error);
      alert("Ocurrió un error al guardar. Revisa la consola.");
    }
  };

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setFormulario(estadoInicial);
    setIdEditar(null);
  };

  const eliminarSeleccionado = () => {
    if (filaSeleccionada === null) {
      alert("Seleccione un registro para eliminar");
      return;
    }

    setMostrarEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarCtaPar(filaSeleccionada.Codcont);

      setMostrarEliminar(false);
      setFilaSeleccionada(null);
      cargarDatos();

      alert("Registro eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar");
    }
  };

  const cancelarEliminar = () => {
    setMostrarEliminar(false);
  };

  const seleccionar = () => {
    if (filaSeleccionada === null) {
      alert("Seleccione un registro de la tabla");
      return;
    }

    alert(
      `Seleccionado: Codcont ${filaSeleccionada.Codcont} - Partida ${filaSeleccionada.Partida} - Gestión ${filaSeleccionada.Gestion}`
    );
  };

  const salir = () => {
    window.history.back();
  };

  return (
    <div className="ctapar-page">
      <div className="ctapar-panel">
        <div className="ctapar-header">ADMINISTRACIÓN DE CTA PAR</div>

        <div className="ctapar-busqueda">
          <input
            type="number"
            placeholder="Buscar por código"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />

          <button type="button" onClick={buscarPorId}>
            Buscar
          </button>

          <button type="button" onClick={cargarDatos}>
            Mostrar todos
          </button>
        </div>

        <div className="tabla-contenedor">
          <table className="ctapar-tabla">
            <thead>
              <tr>
                <th>Codcont</th>
                <th>Partida</th>
                <th>Gestión</th>
              </tr>
            </thead>

            <tbody>
              {listaCtaPar.length > 0 ? (
                listaCtaPar.map((item) => (
                  <tr
                    key={item.Codcont}
                    onClick={() => seleccionarFila(item)}
                    className={
                      filaSeleccionada?.Codcont === item.Codcont
                        ? "fila-seleccionada"
                        : ""
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.Codcont}</td>
                    <td>{item.Partida}</td>
                    <td>{item.Gestion}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No hay registros</td>
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

          <button type="button" onClick={seleccionar}>
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
              {modoFormulario === "nuevo" ? "NUEVO REGISTRO" : "EDITAR REGISTRO"}
            </div>

            <form onSubmit={guardar} className="modal-formulario">
              <label>Codcont:</label>
              <input
                type="number"
                name="Codcont"
                value={formulario.Codcont}
                onChange={actualizarCampo}
                disabled={modoFormulario === "editar"}
                autoFocus
                required
              />

              <label>Partida:</label>
              <input
                type="number"
                name="Partida"
                value={formulario.Partida}
                onChange={actualizarCampo}
                required
              />

              <label>Gestión:</label>
              <input
                type="number"
                name="Gestion"
                value={formulario.Gestion}
                onChange={actualizarCampo}
                required
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
            <div className="modal-header">ELIMINAR REGISTRO</div>

            <p className="modal-texto">
              ¿Seguro que desea eliminar el registro con Codcont{" "}
              <b>{filaSeleccionada?.Codcont}</b>?
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

export default CtaPar;