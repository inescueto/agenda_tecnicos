export default {
	obtenerEstiloMaquina: (modalidadMaquina) => {
		// 1. Diccionario de colores para las modalidades que ya conoces
		const coloresConfigurados = {
			"TC": "#86EFAC",
			"RM": "#93C5FD",
			"URGENCIAS": "#FDBA74",
			"QUIROFANO": "#C4B5FD",
			"GENERAL": "#F9A8D4"
		};

		// 2. Traemos la lista de todas las modalidades reales que hay en la base de datos
		// Esto es lo que automatiza el proceso
		const modalidadesEnDB = getModalidades.data.map(m => m.nombre_modalidad);

		// 3. Caso A: Es una de tus modalidades con color específico
		if (coloresConfigurados[modalidadMaquina]) {
			return `0 0 0px 2px ${coloresConfigurados[modalidadMaquina]}`;
		} 
		
		// 4. Caso B: No tiene color en el código, pero SÍ existe en la base de datos (Modalidad Nueva)
		if (modalidadesEnDB.includes(modalidadMaquina)) {
			return "0 0 8px 1px #F3F4F6"; // Sombra gris para las nuevas
		}
	},
	
	obtenerContenidoMaquina: (maquina, modalidad) => {
		const mod = modalidad ? modalidad.toString().trim().toUpperCase() : "";
		const nombresLargos = {
			"RM": "RESONANCIA MAGNÉTICA",
			"TC": "TAC",
			"GENERAL": "RADIOLOGÍA GENERAL",
			"QUIROFANO": "ÁREA QUIRÚRGICA",
			"URGENCIAS": "URGENCIAS"
		};
		
		const subtitulo = nombresLargos[mod] || modalidad || "";

		// Devolvemos el nombre de la máquina y el HTML debajo
		return maquina + "<div style='color: #64748b; font-size: 14px; font-weight: 400; margin-top: 4px;'>" + subtitulo + "</div>";
		
	}
}