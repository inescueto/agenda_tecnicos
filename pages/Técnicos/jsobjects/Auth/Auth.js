export default {
  verificarAcceso: () => {
    return checkUser.run().then(() => {
      const rol = checkUser.data[0]?.rol;
      // Si NO es administrador ni coordinador, redirige de inmediato a Mi Perfil
      if (rol !== 'Administrador' && rol !== 'Coordinador' && rol !== 'Admin') {
        navigateTo('Mi Perfil');
      }
    });
  },
	 // Función para saber si es Administrador (necesaria para el botón de añadir y acciones de la tabla)
  isAdmin: () => {
    return checkUser.data[0]?.rol === 'Administrador';
  },
  // Función para saber si es Coordinador (necesaria para habilitar los botones de la tabla)
  isCoordinador: () => {
    const rol = checkUser.data[0]?.rol;
    return rol === 'Admin' || rol === 'Coordinador';
  }
}

