export default {
	proyectarSemanaSiguiente: async () => {
		// 1. Validaciones iniciales de UI
		if (!DateSelect.selectedDate) {
			return showAlert("Por favor, selecciona una fecha en el calendario para usar como modelo.", "warning");
		}
		
		const fechaInicio = moment(DateSelect.selectedDate).startOf('isoWeek').format("YYYY-MM-DD");
		const fechaFin = moment(DateSelect.selectedDate).endOf('isoWeek').format("YYYY-MM-DD");
		
		// 2. Determinar el alcance de la proyección
		let numSemanas = 2;
		const tabSeleccionada = TabsProyeccion.selectedTab;

		if (tabSeleccionada === "15 días") 
			numSemanas = 2;
		if (tabSeleccionada === "2 meses") 
			numSemanas = 8;
		

		// 3. Obtener las asignaciones modelo de la base de datos
		const asignacionesModelo = await getAsignacionesPlantilla.run({ 
			inicio: fechaInicio, 
			fin: fechaFin 
		});

		if (!asignacionesModelo || asignacionesModelo.length === 0) {
			return showAlert("No hay datos en la semana seleccionada para usar como plantilla.", "warning");
		}

		// 4. Construcción de la matriz de promesas
		// En lugar de esperar una por una, las metemos todas en un array para lanzarlas en paralelo
		let tareas = [];

		for (let i = 1; i <= numSemanas; i++) {
			for (let asig of asignacionesModelo) {
				tareas.push(
					insertAsignacionMasiva.run({
						id_agenda: asig.id_agenda,
						id_t1: asig.id_tecnico1 || null, 
						id_t2: asig.id_tecnico2 || null,
						fecha: moment(asig.fecha).add(i, 'weeks').format("YYYY-MM-DD"),
						h_i: asig.hora_inicio,
						h_f: asig.hora_fin
					})
				);
			}
		}

		// 5. Ejecución concurrente
		try {
			// Mostramos un aviso de que el proceso ha comenzado si son muchos registros
			if (tareas.length > 100) {
				showAlert(`Procesando ${tareas.length} registros...`, "info");
			}

			// Promise.all lanza todas las peticiones simultáneamente
			await Promise.all(tareas);

			showAlert(`¡Éxito! Proyección de ${tabSeleccionada} completada (${tareas.length} registros).`, "success");
			
			// 6. Navegación al resultado (primera semana proyectada)
			const primeraFechaNueva = moment(DateSelect.selectedDate).add(1, 'weeks').format("YYYY-MM-DD");
			navigateTo("Horario", { "fecha": primeraFechaNueva });

		} catch (error) {
			// Si falla alguna, capturamos el error
			showAlert("Error en la proyección masiva: " + error.message, "error");
			console.error("Detalle del error:", error);
		}
	},
	

	resetearProyeccion: async () => {
    const fechaFin = moment(DateSelect.selectedDate).endOf("isoWeek").format("YYYY-MM-DD");
    
    // Validación de seguridad (Previene el error 'Invalid date')
    if (fechaFin === "Invalid date") {
        return showAlert("Por favor, selecciona una fecha válida en el calendario.", "warning");
    }
     
    closeModal("ModalResetearProyeccion");
    try {
        await deleteAsignacionMasiva.run({ "fechaLimite": fechaFin });
        showAlert("Proyecciones futuras eliminadas. Ya puedes volver a generar.", "success");
    } catch (error) {
        showAlert("Error al limpiar: " + error.message, "error");
    }
}
}