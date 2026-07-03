import API_URL from "../api/apiMes";

export const listarMeses = async () => {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    const error = await respuesta.text();
    console.error("Error al listar meses:", error);
    throw new Error(error);
  }

  return await respuesta.json();
};

export const buscarMesPorId = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`);

  if (!respuesta.ok) {
    const error = await respuesta.text();
    console.error("Error al buscar mes:", error);
    throw new Error("No se encontró el mes");
  }

  return await respuesta.json();
};

export const guardarMes = async (mes) => {
  console.log("Datos enviados al backend:", mes);

  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mes),
  });

  if (!respuesta.ok) {
    const error = await respuesta.text();
    console.error("Error del backend al guardar:", error);
    throw new Error(error);
  }

  return await respuesta.json();
};

export const actualizarMes = async (id, mes) => {
  console.log("Datos enviados para actualizar:", mes);

  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mes),
  });

  if (!respuesta.ok) {
    const error = await respuesta.text();
    console.error("Error del backend al actualizar:", error);
    throw new Error(error);
  }

  return await respuesta.json();
};

export const eliminarMes = async (id) => {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    const error = await respuesta.text();
    console.error("Error del backend al eliminar:", error);
    throw new Error(error);
  }
};