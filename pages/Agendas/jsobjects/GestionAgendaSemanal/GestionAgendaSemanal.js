export default {
	async procesarClickCid(idAgenda, idMaquina, dia, turno, modalidad, estado) {
		if (estado === 1) {
            showAlert("Atención: Esta agenda está marcada como CERRADA", "warning");
        }

		// Guardamos el día y el turno en el store
		await storeValue("diaSeleccionado", dia);
		await storeValue("turnoSeleccionado", turno);

		// Llamamos a la edición pasándole el día como 5º parámetro
		await GestionAgenda.editarAgenda(
			idAgenda, 
			idMaquina, 
			turno, 
			modalidad,
			dia
		);
	},

	async refrescarVistas() {
		await Promise.all([
			getAgendas.run(),
			getAgendaSemanal.run()
		]);
	}
}
