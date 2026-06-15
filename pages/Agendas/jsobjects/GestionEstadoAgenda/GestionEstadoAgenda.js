export default {
	
	async cambiarEstado(id, estadoActual) {
		
		// Validación agenda
		if (!id) {
			return showAlert("No hay ninguna agenda programada aquí", "warning");
		}

		// Nuevo estado
		const proximoEstado = (estadoActual === "Cerrado") ? "Abierto" : "Cerrado";

		try {
			// Ejecutar query pasando los parámetros
			await updateEstadoAgenda.run({ 
				id: id, 
				nuevoEstado: proximoEstado 
			});

			// Refrescamos los datos 
			await getAgendas.run();
			await getAgendaSemanal.run();

			// Feedback visual 
			const mensaje = proximoEstado === "Cerrado" ? "Agenda cerrada" : "Agenda abierta";
			showAlert(mensaje, "success");

		} catch (error) {
			showAlert("Error en la base de datos: " + error.message, "error");
		}
	}
}