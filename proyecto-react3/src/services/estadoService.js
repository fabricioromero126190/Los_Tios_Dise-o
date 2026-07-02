import API_URL from "../api/apiEstado";

export const listarEstados = async () => {
  const respuesta = await fetch(`https://fuerza-g-grupo-1-2.onrender.com/api/estado`);
  return await respuesta.json();
};
export const buscarEstadoPorId = async (id) => {
  const respuesta = await fetch(`https://fuerza-g-grupo-1-2.onrender.com/api/estado/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se encontró el estado");
  }

  return await respuesta.json();
};
export const guardarEstado = async (estado) => {
  const respuesta = await fetch(`https://fuerza-g-grupo-1-2.onrender.com/api/estado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estado),
  });

  return await respuesta.json();
};

export const eliminarEstado = async (id) => {
  await fetch(`https://fuerza-g-grupo-1-2.onrender.com/api/estado/${id}`, {
    method: "DELETE",
  });
};

export const actualizarEstado = async (id, estado) => {
  const respuesta = await fetch(`https://fuerza-g-grupo-1-2.onrender.com/api/estado/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estado),
  });

  return await respuesta.json();
};
