import API_URL from "../api/apiObjGasto";

const leerRespuesta = async (respuesta) => {
  const texto = await respuesta.text();

  if (!respuesta.ok) {
    console.error("Error del backend:", texto);
    throw new Error(texto || "Error en la petición");
  }

  return texto ? JSON.parse(texto) : null;
};

export const listarObjGastos = async () => {
  const respuesta = await fetch(API_URL);
  return await leerRespuesta(respuesta);
};

export const buscarObjGastoPorId = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`);
  return await leerRespuesta(respuesta);
};

export const guardarObjGasto = async (objGasto) => {
  console.log("Objeto de gasto enviado:", objGasto);

  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objGasto),
  });

  return await leerRespuesta(respuesta);
};

export const actualizarObjGasto = async (id, objGasto) => {
  console.log("Objeto de gasto actualizado:", objGasto);

  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objGasto),
  });

  return await leerRespuesta(respuesta);
};

export const eliminarObjGasto = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return await leerRespuesta(respuesta);
};