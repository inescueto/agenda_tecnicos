export default {
	htmlTurno: (currentItem, turnoNombre) => {
		if (!currentItem) return "";

		const turno = (turnoNombre || "").toLowerCase();
		const idAgenda = currentItem?.[`id_agenda_${turno}`];
		
		if (!idAgenda) {
			return `<div style="text-align:left;font-family:Inter,sans-serif;min-height:20px;"></div>`;
		}
		
		const nombre = currentItem?.nombre_maquina || "";
		const especialidad = currentItem?.[`esp_${turno}`] || "";
		const mod = currentItem?.modalidad || "";
		
		
		const estiloCaja = "display:block;width:100%;text-align:left;margin:0;padding:0;font-family:Inter,sans-serif;line-height:0.5;"; 
		
		
		const esImagen = (mod === 'TC' || mod === 'RM');
		
		if (esImagen) {
			return `
				<div style="${estiloCaja}">
					<div style="font-size:11px;color:#71717a;text-align:left;">${nombre}</div>
					<div style="font-size:16px;color:#000;font-weight:700;text-align:left;">${especialidad}</div>
					<div style="font-size:11px;color:#71717a;font-weight:400;text-align:left;">${turnoNombre}</div>
				</div>
			`;
		} else {
			return `
				<div style="${estiloCaja}">
					<div style="font-size:16px;color:#000;font-weight:700;text-align:left;">${nombre}</div>
					<div style="font-size:11px;color:#71717a;font-weight:400;text-align:left;">${turnoNombre}</div>
				</div>
			`;
		}
	}
}