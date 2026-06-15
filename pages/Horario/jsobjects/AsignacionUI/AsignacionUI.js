export default {
	// Para los avatares y textos
	obtenerIniciales: (nombre) => {
		if (!nombre) return "";
		return nombre.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
	},

	obtenerColorAvatar: (id) => {
		const colores = ["#0EA5E9", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];
		return colores[id % colores.length] || "#0EA5E9";
	},

	// Para el contenedor del día (Lunes, Martes...)
	obtenerEstiloDia: (idAgenda, idTecnico1, nombreFestivo, enMantenimiento) => {
		if (nombreFestivo) {
            return {
                fondo: "#FEEBC8", // Naranja
                borde: "1.5px solid #F59E0B", // Ámbar
                texto: "#B45309", // Marrón cálido
                label: "FESTIVO"
            };
        }
		
		if (enMantenimiento) {
            return {
                fondo: "#D8DEE3", // Gris mas oscuro
                borde: "1.5px solid #FCA5A5", // Borde coral suave
                texto: "#991B1B", // Rojo oscuro
                label: "MANTENIMIENTO"
            };
        }
		
		if (!idAgenda) return { fondo: "#F1F5F9", borde: "none", cursor: "not-allowed" };
		
		if (!idTecnico1) {
            return {
                fondo: "#E3F2FD", // Azul Aire (Llamada a la acción)
                borde: "1.5px solid #2196F3", // Azul Eléctrico
                texto: "#1976D2",
                label: "+ Asignar"
            };
        }

        // 3. Si ya hay personal (Asignado/Gestionado)
        return {
            fondo: "#ECEFF1", // Gris Azulado (Tarea finalizada, pasa a segundo plano)
            borde: "1px solid #90A4AE", // Pizarra suave
            texto: "#455A64",
            label: "Editar"
        };
	},

	// Para etiquetas o headers dinámicos
	obtenerCabecera: (numeroDia, nombreDia) => {
		return nombreDia + " " + moment(DateSelect.selectedDate)
			.startOf('isoWeek')
			.add(numeroDia, 'days')
			.format('DD/MM');
	}
}