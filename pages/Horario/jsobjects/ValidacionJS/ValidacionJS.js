export default {
	
	configuracionHorarios: {
		"Mañana": { inicio: "08:00:00", fin: "15:00:00" },
		"Tarde":  { inicio: "15:00:00", fin: "22:00:00" },
		"Noche":  { inicio: "22:00:00", fin: "08:00:00" }
	},

	validarDiaCorrecto: (fechaSeleccionada, diaAgenda) => {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    
    const fecha = new Date(fechaSeleccionada);
   
    const nombreDiaFecha = diasSemana[fecha.getDay()];
    
    
    return nombreDiaFecha === diaAgenda;
},
	
	
	// Función para obtener las horas según el turno guardado en el store
	obtenerHorasActuales: () => {
		const turno = appsmith.store.turnoSel; 
		
		// Buscamos en el diccionario. Si no existe, devolvemos un valor por defecto.
		return this.configuracionHorarios[turno] || { inicio: "00:00:00", fin: "00:00:00" };
	},
	
	
	
	// 1. Gestionar la selección/deselección con el Checkbox
	// Se llama desde el onCheckChange del Checkbox en la lista de aptos
	toggleTecnico: async (tecnico, estaMarcado_ignorado) => {
		
    // 1. Obtenemos lo que hay o array vacío (limpio)
    let actuales = [...(appsmith.store.tecnicosElegidos || [])];
    
    // Aseguramos que sea un array y no un string por error
    if (!Array.isArray(actuales)) actuales = [];

    const index = actuales.findIndex(t => String(t.id) === String(tecnico.id_tecnico));

    if (index === -1) {
        // No está en la lista -> Añadimos
            if (actuales.length < 2) {
                actuales.push({ id: tecnico.id_tecnico, nombre: tecnico.nombre });
            } else {
                showAlert("Máximo 2 técnicos por turno", "warning");
              
        }
    } else {
        // Ya está en la lista -> Lo quitamos (Deseleccionar)
        actuales.splice(index, 1);
    }

    // 2. Guardamos y forzamos actualización
    await storeValue('tecnicosElegidos', actuales, false);
},
	
	
	// 2. Función para el botón "Confirmar Asignación"
	confirmarAsignacion: async () => {
    const elegidos = appsmith.store.tecnicosElegidos || [];
    const turno = appsmith.store.turnoSel;

    if (elegidos.length === 0) {
        return showAlert("Selecciona al menos 1 técnico", "error");
    }

    // 1. Calculamos y guardamos las horas
    const horas = this.configuracionHorarios[turno] || { inicio: "00:00:00", fin: "00:00:00" };
    await storeValue('horaInicioSel', horas.inicio);
    await storeValue('horaFinSel', horas.fin);

    try {
        // 2. Ejecutamos la inserción (la query ya tiene el DELETE incluido arriba)
        await insertAsignacion.run();
        
        showAlert("Asignación guardada con éxito para " + elegidos.length + " técnico(s)", "success");
        
        // 3. Limpieza y refresco
        await storeValue('tecnicosElegidos', []); 
        closeModal('ModalAsignacion');
        
        // Ejecutamos la carga de la planificación principal
        await getPlanificacion.run(); 
        
    } catch (error) {
        showAlert("Error al guardar: " + error.message, "error");
    }
},
	
	

	// 3. Función auxiliar para saber si un botón debe estar deshabilitado
	puedeGuardar: () => {
		const seleccionados = appsmith.store.tecnicosElegidos || [];
		return seleccionados.length > 0;
	}
}