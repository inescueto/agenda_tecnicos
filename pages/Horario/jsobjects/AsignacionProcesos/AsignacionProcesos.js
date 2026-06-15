export default {
	configuracionHorarios: {
		"Mañana": { inicio: "08:00:00", fin: "15:00:00" },
		"Tarde":  { inicio: "15:00:00", fin: "22:00:00" },
		"Noche":  { inicio: "22:00:00", fin: "08:00:00" }
	}, 


	diasMapa: { "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6, "Domingo": 7 },

	calcularFechaExacta: (fechaRef, diaObjetivo) => {
		const fecha = new Date(fechaRef);
		const diaActual = fecha.getDay() === 0 ? 7 : fecha.getDay();
		const diferencia = this.diasMapa[diaObjetivo] - diaActual;
		fecha.setDate(fecha.getDate() + diferencia);
		return fecha.toISOString().split('T')[0];
	},

	formatearEncabezado: (nombreDia) => {
		const fechaISO = this.calcularFechaExacta(DateSelect.selectedDate, nombreDia);
		const partes = fechaISO.split('-'); // [año, mes, día]
		return `${nombreDia.toUpperCase()} ${partes[2]}/${partes[1]}`;
	},

	// Al hacer clic en cualquier día del List Widget
	prepararAsignacion: async (idAgenda, nombreDia, turno, tecnicosYaAsignados, nombreMaquina, especialidad, modalidad) => {
		if (tecnicosYaAsignados === 'MANTENIMIENTO') {
			return showAlert("Sala en mantenimiento técnico para este día", "error");
		}
		if (!idAgenda) return showAlert("No hay agenda configurada", "warning");

		const fechaReal = this.calcularFechaExacta(DateSelect.selectedDate, nombreDia);

		// Guardamos en el store para que el MODAL lo lea (Título, etc.)
		await storeValue('idAgendaSel', idAgenda);
		await storeValue('fechaSel', fechaReal);
		await storeValue('turnoSel', turno);
		await storeValue('diaNombre', nombreDia);
		await storeValue('maquinaNombre', nombreMaquina);
		await storeValue('tecnicosElegidos', tecnicosYaAsignados || []);
		await storeValue('especialidadSel', especialidad || "");
		await storeValue('modalidadSel', modalidad);

		// PASO CLAVE: Pasamos el idAgenda directamente a la query para que no dependa del store
		await getValidacionTecnicos.run({ idAgenda: idAgenda });

		showModal('ModalAsignacion');
	},

	// Lógica del Modal de Selección
	toggleTecnico: async (tecnico, estaMarcado_ignorado) => {
		let actuales = [...(appsmith.store.tecnicosElegidos || [])];
		if (!Array.isArray(actuales)) actuales = [];

		const index = actuales.findIndex(t => String(t.id) === String(tecnico.id_tecnico));

		if (index === -1) {
			if (actuales.length < 2) {
				actuales.push({ id: tecnico.id_tecnico, nombre: tecnico.nombre });
			} else {
				showAlert("Máximo 2 técnicos por turno", "warning");
			}
		} else {
			actuales.splice(index, 1);
		}
		await storeValue('tecnicosElegidos', actuales, false);
	},

	confirmarAsignacion: async () => {
		const turno = appsmith.store.turnoSel;
		const horas = this.configuracionHorarios[turno] || { inicio: "00:00:00", fin: "00:00:00" };

		await storeValue('horaInicioSel', horas.inicio);
		await storeValue('horaFinSel', horas.fin);

		try {
			await insertAsignacion.run();
			showAlert("Asignación guardada", "success");
			await storeValue('tecnicosElegidos', []);
			closeModal('ModalAsignacion');
			await getPlanificacion.run();
		} catch (error) {
			showAlert("Error: " + error.message, "error");
		}
	}
}
