import API_URL from "../api/apiEntidades";

async function handleResponse(response, errorMessage) {
  const text = await response.text();

  if (!response.ok) {
    console.error("Error del backend:", text);
    throw new Error(text || errorMessage || `Error ${response.status}`);
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const listarEntidades = async () => {
  const response = await fetch(API_URL);
  return await handleResponse(response, "No se pudieron cargar las entidades");
};

export const buscarEntidadPorId = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await handleResponse(response, "No se encontró la entidad");
};

export const guardarEntidad = async (entidad) => {
  console.log("Entidad enviada al backend:", entidad);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entidad),
  });

  return await handleResponse(response, "No se pudo guardar la entidad");
};

export const actualizarEntidad = async (id, entidad) => {
  console.log("Entidad actualizada enviada:", entidad);

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entidad),
  });

  return await handleResponse(response, "No se pudo actualizar la entidad");
};

export const eliminarEntidad = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Error al eliminar entidad:", error);
    throw new Error(error || "No se pudo eliminar la entidad");
  }

  return true;
};

export const existeEntidad = async (id) => {
  const entidades = await listarEntidades();

  return entidades.some(
    (item) =>
      Number(item.entidad ?? item.Entidad) === Number(id)
  );
};