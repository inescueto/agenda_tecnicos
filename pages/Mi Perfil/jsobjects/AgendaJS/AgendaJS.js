export default {
	generarCalendarioMensual: () => {
		const datos = getMiAgenda.data || [];
		const offset = appsmith.store.mesOffset || 0;
		const mesReferencia = moment().add(offset, 'months');
		const inicioMes = mesReferencia.clone().startOf('month').startOf('isoWeek');
		const finMes = mesReferencia.clone().endOf('month').endOf('isoWeek');
		
		let fechaCursor = inicioMes.clone();
		const semanas = [];

		const coloresTurnos = {
			"Mañana": { bg: "#FEF9C3", border: "#EAB308", text: "#854D0E" },
			"Tarde":  { bg: "#FFEDD5", border: "#F97316", text: "#9A3412" },
			"Noche":  { bg: "#DBEAFE", border: "#2563EB", text: "#1E40AF" }
		};

		for (let s = 0; s < 6; s++) {
			if (fechaCursor.isAfter(finMes)) break;
			let semana = { "Semana": "Semana " + fechaCursor.format('DD/MM') };
			
			for (let i = 0; i < 7; i++) {
				const fechaString = fechaCursor.format('YYYY-MM-DD');
				const diaNombre = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][i];
				const asig = datos.find(d => moment(d.fecha).format('YYYY-MM-DD') === fechaString);
				const fechaDia = fechaCursor.format('DD/MM');
				
								if (asig) {
					const col = coloresTurnos[asig.turno] || { bg: "#F3F4F6", border: "#94A3B8", text: "#1E293B" };
					
					// --- NUEVA LÓGICA: Sala siempre + (Especialidad) si existe ---
					const textoEspecialidad = (asig.especialidad && asig.especialidad.trim() !== "") 
						? ` (${asig.especialidad})` 
						: "";
					const tituloAMostrar = `${asig.sala}${textoEspecialidad}`;

					const textoCompañero = asig.compañero ? `<br><span style="color: ${col.text}CC; font-size: 9px; font-weight: 500;">👤 ${asig.compañero}</span>` : "";

					semana[diaNombre] = `
						<div style="min-height: 70px; line-height: 1.1; background-color: ${col.bg}; border-left: 4px solid ${col.border}; padding: 4px 6px; border-radius: 4px; margin: 2px;">
							<div style="font-size: 9px; color: ${col.text}AA; margin-bottom: 2px;">${fechaDia}</div>
							<b style="color: ${col.text}; font-size: 10px; text-transform: uppercase;">${tituloAMostrar}</b><br>
							<small style="font-weight: 800; color: ${col.text};">${asig.turno}</small>
							${textoCompañero}
						</div>`;
				}else {
					semana[diaNombre] = `<div style="min-height: 70px; line-height: 1.1; opacity: 0.6; padding: 4px 6px;"><div style="font-size: 9px; color: #adb5bd; margin-bottom: 4px;">${fechaDia}</div><div style="color: #94a3b8; font-size: 10px; margin-top: 10px;">☕ Libre</div></div>`;
				}
				fechaCursor.add(1, 'days');
			}
			semanas.push(semana);
		}
		return semanas;
	}
}
