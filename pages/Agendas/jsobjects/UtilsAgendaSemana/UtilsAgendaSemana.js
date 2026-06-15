export default {
	mapaCache: {},

	async cargarDatos() {
		await getTodasAgendas.run();
		this.mapaCache = {}; 
		
		// BLINDAJE: Evita error en carga si getTodasAgendas.data es undefined
		(getTodasAgendas.data || []).forEach(agenda => {
			const llave = `${agenda.id_maquina}-${agenda.dias}-${agenda.turno}`;
			this.mapaCache[llave] = agenda;
		});
		
		return this.mapaCache;
	},

	obtenerColor(idMaquina, dia, turno) {
		const llave = `${idMaquina}-${dia}-${turno}`;
		const registro = this.mapaCache[llave];
		
		if (!registro) return "#F1F5F9"; // Gris (Vacío)
		return registro.estado === "Abierto" ? "#BBF7D0" : "#FECACA"; // Verde o Rojo
	},
	 
	async alPulsar(idMaquina, dia, turno, modalidad) {
		showModal('ModalGestionAgenda');
		
		const llave = `${idMaquina}-${dia}-${turno}`;
		const registro = this.mapaCache[llave];
		
		await storeValue("diaSeleccionado", dia);
		await storeValue("turnoSeleccionado", turno);

		// Llamamos a la edición pasándole el día como 5º parámetro
		await GestionAgenda.editarAgenda(
			registro ? registro.id_agenda : null,
			idMaquina,
			turno,
			modalidad,
			dia
		);
	},
	async guardarCambios() {
        try {
            // Lógica de guardado...
            await getAgendas.run(); 
            await getAgendaSemanal.run();
            await this.cargarDatos(); // ¡AÑADIDO! Actualiza el mapa interno para que no se quede gris

        } catch (error) {
            showAlert("Error al guardar cambios: " + error.message, "error");
        }
    },

    async ejecutarBorrado() {
        try {
            const idABorrar = appsmith.store.idGestion;
            if (!idABorrar) return showAlert("Selecciona una agenda válida", "warning");

            // Limpieza transaccional manual en cascada
            await deleteRequisitos.run({ "id": idABorrar });
            await deleteAsignaciones.run({ "id": idABorrar });
            await deleteAgenda.run({ "id": idABorrar });

            showAlert("Agenda eliminada correctamente", "success");
            
            closeModal('ModalConfirmarBorrado');
            closeModal('ModalGestionAgenda'); 
            
            await getAgendas.run(); 
            await getAgendaSemanal.run(); 
            await this.cargarDatos(); // ¡AÑADIDO! Actualiza el mapa interno
        } catch (error) {
            showAlert("Error al eliminar la agenda: " + error.message, "error");
        }
    }
	
}
