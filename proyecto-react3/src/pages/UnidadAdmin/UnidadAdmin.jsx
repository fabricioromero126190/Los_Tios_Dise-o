import { useEffect, useState } from "react";
import {
  obtenerUnidades,
  crearUnidad,
  actualizarUnidad,
  eliminarUnidad,
} from "../../services/unidadAdminService";
import "./UnidadAdmin.css";

function UnidadAdmin() {
  const [unidades, setUnidades] = useState([]);

  const [formulario, setFormulario] = useState({
    entidad: "",
    unidad: "",
    descrip: "",
    ciudad: "",
  });

  const [idEditar, setIdEditar] = useState(null);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("");

  useEffect(() => {
    cargarUnidades();
  }, []);

  const cargarUnidades = async () => {
    try {
      const data = await obtenerUnidades();
      setUnidades(Array.isArray(data) ? data : []);
      setUnidadSeleccionada(null);
    } catch (error) {
      console.error("Error al cargar unidades:", error);
      alert("No se pudieron cargar las unidades");
    }
  };

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const nuevo = () => {
    setModoFormulario("nuevo");
    setIdEditar(null);
    setUnidadSeleccionada(null);

    setFormulario({
      entidad: "",
      unidad: "",
      descrip: "",
      ciudad: "",
    });

    setMostrarFormulario(true);
  };

  const editar = () => {
    if (!unidadSeleccionada) {
      alert("Seleccione una unidad de la tabla");
      return;
    }

    setModoFormulario("editar");
    setIdEditar(unidadSeleccionada.unidad);

    setFormulario({
      entidad: unidadSeleccionada.entidad ?? "",
      unidad: unidadSeleccionada.unidad ?? "",
      descrip: unidadSeleccionada.descrip ?? "",
      ciudad: unidadSeleccionada.ciudad ?? "",
    });

    setMostrarFormulario(true);
  };

  const guardarUnidad = async (e) => {
    e.preventDefault();

    if (
      !formulario.entidad ||
      !formulario.unidad ||
      !formulario.descrip ||
      !formulario.ciudad
    ) {
      alert("Completa todos los campos");
      return;
    }

    const unidadEnviar = {
      entidad: Number(formulario.entidad),
      unidad: Number(formulario.unidad),
      descrip: formulario.descrip,
      ciudad: formulario.ciudad,
    };

    try {
      if (modoFormulario === "nuevo") {
        await crearUnidad(unidadEnviar);
        alert("Unidad guardada correctamente");
      } else {
        await actualizarUnidad(idEditar, unidadEnviar);
        alert("Unidad actualizada correctamente");
      }

      setMostrarFormulario(false);
      setIdEditar(null);
      setUnidadSeleccionada(null);

      setFormulario({
        entidad: "",
        unidad: "",
        descrip: "",
        ciudad: "",
      });

      cargarUnidades();
    } catch (error) {
      console.error("Error al guardar unidad:", error);
      alert("No se pudo guardar la unidad. Revisa la consola.");
    }
  };

  const abrirEliminar = () => {
    if (!unidadSeleccionada) {
      alert("Seleccione una unidad para eliminar");
      return;
    }

    setMostrarEliminar(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarUnidad(unidadSeleccionada.unidad);

      setMostrarEliminar(false);
      setUnidadSeleccionada(null);
      cargarUnidades();

      alert("Unidad eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar unidad:", error);
      alert("No se pudo eliminar la unidad");
    }
  };

  const seleccionar = () => {
    if (!unidadSeleccionada) {
      alert("Seleccione una unidad de la tabla");
      return;
    }

    alert(
      "Unidad seleccionada: " +
        "Entidad " +
        unidadSeleccionada.entidad +
        " - Unidad " +
        unidadSeleccionada.unidad +
        " - " +
        unidadSeleccionada.descrip +
        " - " +
        unidadSeleccionada.ciudad
    );
  };

  const limpiar = () => {
    setUnidadSeleccionada(null);
    setFormulario({
      entidad: "",
      unidad: "",
      descrip: "",
      ciudad: "",
    });
    setIdEditar(null);
  };

  const salir = () => {
    alert("Saliendo de Unidad Administrativa");
  };

  return (
    <div className="contenedor-unidad">
      <div className="titulo-principal">
        ADMINISTRACIÓN UNIDAD ADMINISTRATIVA
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-unidad">
          <thead>
            <tr>
              <th>ENTIDAD</th>
              <th>UNIDAD</th>
              <th>DESCRIPCIÓN</th>
              <th>CIUDAD</th>
            </tr>
          </thead>

          <tbody>
            {unidades.length > 0 ? (
              unidades.map((item) => (
                <tr
                  key={`${item.entidad}-${item.unidad}`}
                  onClick={() => setUnidadSeleccionada(item)}
                  className={
                    unidadSeleccionada?.entidad === item.entidad &&
                    unidadSeleccionada?.unidad === item.unidad
                      ? "fila-seleccionada"
                      : ""
                  }
                >
                  <td>{item.entidad}</td>
                  <td>{item.unidad}</td>
                  <td>{item.descrip}</td>
                  <td>{item.ciudad}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay unidades registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="botones">
        <button onClick={nuevo}>Nuevo</button>
        <button onClick={editar}>Editar</button>
        <button onClick={abrirEliminar}>Eliminar</button>
        <button onClick={seleccionar}>Seleccionar</button>
        <button onClick={limpiar}>Limpiar</button>
        <button onClick={salir}>Salir</button>
      </div>

      {mostrarFormulario && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="modal-header">
              {modoFormulario === "nuevo"
                ? "NUEVA UNIDAD ADMINISTRATIVA"
                : "EDITAR UNIDAD ADMINISTRATIVA"}
            </div>

            <form className="modal-formulario" onSubmit={guardarUnidad}>
              <label>Entidad:</label>
              <input
                type="number"
                name="entidad"
                placeholder="Ingrese entidad"
                value={formulario.entidad}
                onChange={manejarCambio}
                disabled={modoFormulario === "editar"}
              />

              <label>Unidad:</label>
              <input
                type="number"
                name="unidad"
                placeholder="Ingrese unidad"
                value={formulario.unidad}
                onChange={manejarCambio}
                disabled={modoFormulario === "editar"}
              />

              <label>Descripción:</label>
              <input
                type="text"
                name="descrip"
                placeholder="Ingrese descripción"
                value={formulario.descrip}
                onChange={manejarCambio}
              />

              <label>Ciudad:</label>
              <input
                type="text"
                name="ciudad"
                placeholder="Ingrese ciudad"
                value={formulario.ciudad}
                onChange={manejarCambio}
              />

              <div className="modal-botones">
                <button type="submit">
                  {modoFormulario === "nuevo" ? "Guardar" : "Actualizar"}
                </button>

                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
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
            <div className="modal-header">
              ELIMINAR UNIDAD ADMINISTRATIVA
            </div>

            <p className="modal-texto">
              ¿Desea eliminar la unidad{" "}
              <b>
                {unidadSeleccionada?.unidad} - {unidadSeleccionada?.descrip}
              </b>
              ?
            </p>

            <div className="modal-botones">
              <button onClick={confirmarEliminar}>Sí, eliminar</button>

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

export default UnidadAdmin;