export default {
  badge: (label, modalidad, categoria) => {
    if (!label) return "";
    
    // Si hay modalidad usa modalidad, si no, usa el nombre de la categoría (en minúsculas)
    const factorColor = modalidad ? modalidad.toLowerCase().trim() : categoria?.toLowerCase().trim();
    
    // Diccionario de colores
    const colores = {
      // Por Modalidad
      tc: { bg: "#D1FAE5", text: "#047857" },        // Verde
      rm: { bg: "#DBEAFE", text: "#1E40AF" },        // Azul
      urgencias: { bg: "#FFEDD5", text: "#C2410C" }, // Naranja
      quirofano: { bg: "#EDE9FE", text: "#7E57C2" }, // Morado
      general: { bg: "#FCE7F3", text: "#BE185D" },   // Rosa
     
      
      // Por Defecto (Si no coincide con nada)
      default: { bg: "#F3F4F6", text: "#4B5563" }    // Gris
    };

    const estilo = colores[factorColor] || colores.default;

    return `<span style="
      background-color: ${estilo.bg};
      color: ${estilo.text};
      padding: 0.1px 8px;
      border-radius: 7px;
      font-size: 12px;
      font-weight: 500;
			line-height: 22px;
      display: inline-block;
			margin: 2px;
      text-transform: uppercase;
      border: 1px solid ${estilo.text}25;
    ">${label}</span>`; 
  }
}
