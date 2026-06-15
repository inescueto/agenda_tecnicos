export default {
	  badgeEstado: (texto, config = {}) => {
    const valor = texto?.toLowerCase();

    const mapa = config.mapa || {};
    const estilo = mapa[valor] || config.default || {
      bg: "#F3F4F6",
      text: "#111827"
    };

    return `<span style="
      background-color: ${estilo.bg};
      color: ${estilo.text};
      padding: 0.1px 8px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      
    ">
      ${texto}
    </span>`;
  },
	
  badge: (obj) => {
    if (!obj || !obj.label) return "";
    const label = obj.label; 
    const parent = obj.parent?.toLowerCase().trim() || "default";
    
    const colores = {
      tc: { bg: "#D1FAE5", text: "#047857" },        // Verde
      rm: { bg: "#DBEAFE", text: "#1E40AF" },        // Azul
      urgencias: { bg: "#FFEDD5", text: "#C2410C" }, // Naranja
      quirofano: { bg: "#EDE9FE", text: "#7E57C2" }, // Morado
      general: { bg: "#FCE7F3", text: "#BE185D" },   // Rosa
      default: { bg: "#F3F4F6", text: "#4B5563" }    // Gris
    };

    const estilo = colores[parent] || colores.default;

    return `<span style="
      background-color: ${estilo.bg};
      color: ${estilo.text};
      padding: 2px 10px;
      border-radius: 7px;
      font-size: 11px;
      font-weight: 600;
      line-height: 22px;
      display: inline-block;
			width: auto;
			white-space: nowrap;
      margin: 2px;
      text-transform: uppercase;
      border: 1px solid ${estilo.text}25;
    ">${label}</span>`; 
  },
	
	
	     pintarCapacitaciones: (data) => {
    if (!data || data.length === 0) return "<i style='color: #9ca3af;'>Sin capacitaciones registradas</i>";

    const maquinas = data.filter(c => c.modalidad);
    const horarios = data.filter(c => !c.modalidad && (c.nombre_categoria === 'Horario' || c.nombre_categoria === 'Disponibilidad'));
    const otras    = data.filter(c => !c.modalidad && c.nombre_categoria !== 'Horario' && c.nombre_categoria !== 'Disponibilidad');
    
    let html = "<div>";
    
    // Bloque Máquinas
    if (maquinas.length > 0) {
      
			// Título categorías
      html += `<div style="text-align: left; font-size: 10px; color: #94a3b8; font-weight: bold; margin-bottom: 6px;">Especialidades Técnicas	</div>`;
			
      // Badges 
      html += "<div style='display: flex; flex-wrap: wrap; justify-content: flex-end; margin-bottom: 30px; width: 100%;'>" + 
              maquinas.map(c => this.badge({ label: c.nombre_requisito, parent: c.modalidad })).join('') + 
              "</div>";
    }

    // Bloque Horarios
    if (horarios.length > 0) {
			
      // Título 
      html += `<div style="text-align: left; font-size: 10px; color: #94a3b8; font-weight: bold; margin-bottom: 6px;">Turnos y Disponibilidad	</div>`;
			
      // Badges
      html += "<div style='display: flex; flex-wrap: wrap; justify-content: flex-end; margin-bottom: 30px; width: 100%;'>" + 
              horarios.map(c => this.badge({ label: c.nombre_requisito, parent: 'default' })).join('') + 
              "</div>";
    }
    
    // Bloque Otros
    if (otras.length > 0) {
      // Título a la IZQUIERDA
      html += `<div style="text-align: left; font-size: 10px; color: #94a3b8; font-weight: bold; margin-bottom: 6px;">Otras Aptitudes</div>`;
      // Badges a la DERECHA
      html += "<div style='display: flex; flex-wrap: wrap; justify-content: flex-end; width: 100%;'>" + 
              otras.map(c => this.badge({ label: c.nombre_requisito, parent: 'default' })).join('') + 
              "</div>";
    }
    
    html += "</div>";
    return html;
  }


}
