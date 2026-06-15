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
    // Si MySQL mete un nulo o el objeto está vacío, no pintamos nada
    if (!obj || !obj.label) return "";

    const label = obj.label; 
    const parent = obj.parent?.toLowerCase().trim() || "default";
    
    // Diccionario de colores basado en el PARENT
    const colores = {
      tc: { bg: "#D1FAE5", text: "#047857" },        // Verde
      rm: { bg: "#DBEAFE", text: "#1E40AF" },        // Azul
      urgencias: { bg: "#FFEDD5", text: "#C2410C" }, // Naranja
      quirofano: { bg: "#EDE9FE", text: "#7E57C2" }, // Morado
      general: { bg: "#FCE7F3", text: "#BE185D" },   // Rosa
			default: { bg: "#F3F4F6", text: "#4B5563" }    // Gris
    };

    const estilo = colores[parent] || colores.default;

    // Utilizamos el parent
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
			white-space: normal;       
			max-width: 100%;
      border: 1px solid ${estilo.text}25;
    ">${label}</span>`; 
  },

  formatoLista: (lista) => {
    if (!lista) return "";
    
    // Convertimos a array si MySQL lo devuelve como string
    let datos = typeof lista === 'string' ? JSON.parse(lista) : lista;
    
    if (!Array.isArray(datos)) return "";

    // Filtramos nulos y generamos los badges
    return datos
      .filter(item => item !== null && item.label !== null)
      .map(item => this.badge(item))
      .join("");
  }
}