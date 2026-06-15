export default {
    async confirmarEdicion() {
       try{
            // 1. Verificación de seguridad básica
            if (!appsmith.store.id_editar) {
                return showAlert("No se encontró el ID del técnico", "error");
            }

            // 2. ACTUALIZAMOS DATOS MAESTROS Y CAPACITACIONES (TRANSACCIÓN ÚNICA)
            // Esta query ahora tiene un START TRANSACTION y hace todo a la vez
            await updateCapacitaciones.run();
            
            // 3. REFRESCO Y CIERRE
            // Traemos los datos frescos a la tabla principal de la app
            await getPersonal.run();
            
            showAlert("¡Técnico actualizado correctamente!", "success");
            closeModal("ModalEditar");
            
			 } catch (error) {
            showAlert("Error al guardar: " + error.message, "error");
        }
    }
}