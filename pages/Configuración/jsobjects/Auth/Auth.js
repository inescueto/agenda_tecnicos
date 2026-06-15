export default {
  verificarAcceso: () => {
    return checkUser.run().then(() => {
      const rol = checkUser.data[0]?.rol;
      // Si NO es administrador ni coordinador, redirige de inmediato a Mi Perfil
      if (rol !== 'Administrador' && rol !== 'Coordinador' && rol !== 'Admin') {
        navigateTo('Mi Perfil');
      }
    });
  }
}
