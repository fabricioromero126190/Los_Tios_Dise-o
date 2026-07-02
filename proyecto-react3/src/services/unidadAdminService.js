import API_URL from "../api/apiUnidadAdmin";

const leerRespuesta = async (response) => {
  const texto = await response.text();

  if (!response.ok) {
    console.error("Error del backend:", texto);
    throw new Error(texto || "Error en la petición");
  }

  return texto ? JSON.parse(texto) : null;
};

export const obtenerUnidades = async () => {
  const response = await fetch(API_URL);
  return await leerRespuesta(response);
};

export const crearUnidad = async (unidad) => {
  console.log("Unidad enviada al backend:", unidad);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unidad),
  });

  return await leerRespuesta(response);
};

export const actualizarUnidad = async (id, unidad) => {
  console.log("Unidad actualizada enviada:", unidad);

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unidad),
  });

  return await leerRespuesta(response);
};

export const eliminarUnidad = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return await leerRespuesta(response);
};