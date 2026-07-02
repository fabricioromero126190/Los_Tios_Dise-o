import API_URL from "../api/apiCtaPar";

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

export const listarCtaPar = async () => {
  const response = await fetch(API_URL);
  return await handleResponse(response, "No se pudieron cargar los registros");
};

export const buscarCtaParPorId = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return await handleResponse(response, "No se encontró el registro");
};

export const guardarCtaPar = async (ctaPar) => {
  console.log("CtaPar enviada al backend:", ctaPar);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ctaPar),
  });

  return await handleResponse(response, "No se pudo guardar el registro");
};

export const actualizarCtaPar = async (id, ctaPar) => {
  console.log("CtaPar actualizada enviada:", ctaPar);

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ctaPar),
  });

  return await handleResponse(response, "No se pudo actualizar el registro");
};

export const eliminarCtaPar = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Error al eliminar:", error);
    throw new Error(error || "No se pudo eliminar el registro");
  }

  return true;
};