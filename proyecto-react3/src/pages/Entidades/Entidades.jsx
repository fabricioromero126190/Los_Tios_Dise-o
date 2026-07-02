import { useEffect, useState } from "react";

import {
  listarEntidades,
  buscarEntidadPorId,
  guardarEntidad,
  actualizarEntidad,
  eliminarEntidad,
  existeEntidad,
} from "../../services/EntidadesService";

import "./Entidades.css";

const entidadInicial = {
  gestion: "",
  entidad: "",
  desc_ent: "",
  sigla_ent: "",
  sector_ent: "",
  subsec_ent: "",
  area_ent: "",
  subareaent: "",
  nivel_inst: "",
};

function Entidades() {
  const [entidades, setEntidades] = useState([]);
  const [formulario, setFormulario] = useState(entidadInicial);
  const [idEditar, setIdEditar] = useState(null);
  const [idBuscar, setIdBuscar] = useState("");
  const [entidadSeleccionada, setEntidadSeleccionada] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("");
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const cargarEntidades = async () => {
    const datos = await listarEntidades();
    setEntidades(datos);
    setEntidadSeleccionada(null);
  };

  useEffect(() => {
    cargarEntidades();
  }, []);

  const toNumber = (value) => {
    return value === "" ? null : Number(value);
  };

  const crearPayload = () => {
    return {
      gestion: toNumber(formulario.gestion),
      entidad: toNumber(formulario.entidad),
      desc_ent: formulario.desc_ent,
      sigla_ent: formulario.sigla_ent,
      sector_ent: toNumber(formulario.sector_ent),
      subsec_ent: toNumber(formulario.subsec_ent),
      area_ent: toNumber(formulario.area_ent),
      subareaent: toNumber(formulario.subareaent),
      nivel_inst: toNumber(formulario.nivel_inst),
    };
  };

  const actualizarCampo = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const buscarPorId = async () => {
    if (idBuscar === "") {
      alert("Ingrese un codigo para buscar");
      return;
    }

    try {
      const dato = await buscarEntidadPorId(idBuscar);
      setEntidades([dato]);
      setEntidadSeleccionada(null);
    } catch (error) {
      alert("No se encontro una entidad con ese ID");
    }
  };

  const seleccionarFila = (entidad) => {
    setEntidadSeleccionada(entidad);
  };

  const nuevo = () => {
    setModoFormulario("nuevo");
    setIdEditar(null);
    setFormulario(entidadInicial);
    setMostrarFormulario(true);
  };

  const editarSeleccionado = () => {
    if (entidadSeleccionada === null) {
      alert("Seleccione una entidad de la tabla");
      return;
    }

    setModoFormulario("editar");
    setIdEditar(entidadSeleccionada.entidad);
    setFormulario({
      gestion: entidadSeleccionada.gestion ?? "",
      entidad: entidadSeleccionada.entidad ?? "",
      desc_ent: entidadSeleccionada.desc_ent ?? "",
      sigla_ent: entidadSeleccionada.sigla_ent ?? "",
      sector_ent: entidadSeleccionada.sector_ent ?? "",
      subsec_ent: entidadSeleccionada.subsec_ent ?? "",
      area_ent: entidadSeleccionada.area_ent ?? "",
      subareaent: entidadSeleccionada.subareaent ?? "",
      nivel_inst: entidadSeleccionada.nivel_inst ?? "",
    });
    setMostrarFormulario(true);
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (formulario.gestion === "" || formulario.entidad === "" || formulario.desc_ent.trim() === "") {
      alert("Ingrese gestion, entidad y descripcion");
      return;
    }

    const payload = crearPayload();

    if (modoFormulario === "nuevo") {
      const existe = await existeEntidad(payload.entidad);

      if (existe) {
        alert("Ya existe una entidad con ese ID");
        return;
      }

      await guardarEntidad(payload);
    } else {
      await actualizarEntidad(idEditar, payload);
    }

    setMostrarFormulario(false);
    setFormulario(entidadInicial);
    setIdEditar(null);
    setEntidadSeleccionada(null);
    cargarEntidades();
  };

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setFormulario(entidadInicial);
    setIdEditar(null);
  };

  const eliminarSeleccionado = () => {
    if (entidadSeleccionada === null) {
      alert("Seleccione una entidad para eliminar");
      return;
    }

    setMostrarEliminar(true);
  };

  const confirmarEliminar = async () => {
    await eliminarEntidad(entidadSeleccionada.entidad);
    setMostrarEliminar(false);
    setEntidadSeleccionada(null);
    cargarEntidades();
  };

  const cancelarEliminar = () => {
    setMostrarEliminar(false);
  };

  const seleccionarEntidad = () => {
    if (entidadSeleccionada === null) {
      alert("Seleccione una entidad de la tabla");
      return;
    }

    alert(
      "Entidad seleccionada: " +
        entidadSeleccionada.entidad +
        " - " +
        entidadSeleccionada.desc_ent
    );
  };

  const salir = () => {
    navigate(-1);
  };

  return (
    <div className="entidades-page">
      <div className="entidades-panel">
        <div className="entidades-header">ADMINISTRACION DE ENTIDADES</div>

        <div className="entidades-busqueda">
          <input
            type="number"
            placeholder="Buscar por codigo"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />

          <button type="button" onClick={buscarPorId}>
            Buscar
          </button>

          <button type="button" onClick={cargarEntidades}>
            Mostrar todos
          </button>
        </div>

        <div className="tabla-contenedor">
          <table className="entidades-tabla">
            <thead>
              <tr>
                <th>entidad</th>
                <th>gestion</th>
                <th>desc_ent</th>
                <th>sigla_ent</th>
                <th>sector_ent</th>
                <th>subsec_ent</th>
                <th>area_ent</th>
                <th>subareaent</th>
                <th>nivel_inst</th>
              </tr>
            </thead>

            <tbody>
              {entidades.length > 0 ? (
                entidades.map((item) => (
                  <tr
                    key={item.entidad}
                    onClick={() => seleccionarFila(item)}
                    className={
                      entidadSeleccionada?.entidad === item.entidad
                        ? "fila-seleccionada"
                        : ""
                    }
                  >
                    <td>{item.entidad}</td>
                    <td>{item.gestion}</td>
                    <td>{item.desc_ent}</td>
                    <td>{item.sigla_ent}</td>
                    <td>{item.sector_ent}</td>
                    <td>{item.subsec_ent}</td>
                    <td>{item.area_ent}</td>
                    <td>{item.subareaent}</td>
                    <td>{item.nivel_inst}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No hay entidades registradas</td>
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

          <button type="button" onClick={seleccionarEntidad}>
            Seleccionar
          </button>

          <button type="button" onClick={salir}>
            Salir
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="modal-fondo">
          <div className="modal-caja modal-caja-entidades">
            <div className="modal-header">
              {modoFormulario === "nuevo" ? "NUEVA ENTIDAD" : "EDITAR ENTIDAD"}
            </div>

            <form onSubmit={guardar} className="modal-formulario entidades-formulario-modal">
              <label>Gestion:</label>
              <input type="number" name="gestion" value={formulario.gestion} onChange={actualizarCampo} autoFocus required />

              <label>Entidad:</label>
              <input type="number" name="entidad" value={formulario.entidad} onChange={actualizarCampo} disabled={modoFormulario === "editar"} required />

              <label>Descripcion:</label>
              <input type="text" name="desc_ent" value={formulario.desc_ent} onChange={actualizarCampo} required />

              <label>Sigla:</label>
              <input type="text" name="sigla_ent" value={formulario.sigla_ent} onChange={actualizarCampo} />

              <label>Sector:</label>
              <input type="number" name="sector_ent" value={formulario.sector_ent} onChange={actualizarCampo} />

              <label>Subsector:</label>
              <input type="number" name="subsec_ent" value={formulario.subsec_ent} onChange={actualizarCampo} />

              <label>Area:</label>
              <input type="number" name="area_ent" value={formulario.area_ent} onChange={actualizarCampo} />

              <label>Subarea:</label>
              <input type="number" name="subareaent" value={formulario.subareaent} onChange={actualizarCampo} />

              <label>Nivel Institucion:</label>
              <input type="number" name="nivel_inst" value={formulario.nivel_inst} onChange={actualizarCampo} />

              <div className="modal-botones entidades-modal-botones">
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
            <div className="modal-header">ELIMINAR ENTIDAD</div>

            <p className="modal-texto">
              Seguro que desea eliminar la entidad{" "}
              <b>{entidadSeleccionada?.desc_ent}</b>?
            </p>

            <div className="modal-botones">
              <button type="button" onClick={confirmarEliminar}>
                Si, eliminar
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

export default Entidades;
