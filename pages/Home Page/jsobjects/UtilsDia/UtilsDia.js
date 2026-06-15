export default {
    // Función para el color de los cuadritos del Dashboard (Vista Global)
    obtenerColorDiaGlobal: (nombreDia) => {
        // 1. Buscamos la fila correspondiente al día en los resultados de la query
        const datos = getResumenSemanal.data.find(d => d.dias === nombreDia);

        // 2. Definimos nuestra paleta de colores (puedes ajustarlos a tu gusto)
        const colores = {
            EXITO: "#D1FAE5",      // Verde (Completado)
            ADVERTENCIA: "#FEF3C7", // Amarillo (Incompleto)
            PELIGRO: "#FEE2E2",     // Rojo (Vacío)
            VACIO: "#F3F4F6"        // Gris (Sin agenda configurada)
        };

        // 3. Lógica de decisión
        // Si no existe el día en la query o no hay huecos totales definidos
        if (!datos || Number(datos.huecos_totales) === 0) {
            return colores.VACIO;
        }

        const totales = Number(datos.huecos_totales);
        const cubiertos = Number(datos.huecos_cubiertos);

        // Caso: No se ha asignado a nadie en ningún turno
        if (cubiertos === 0) {
            return colores.PELIGRO;
        }

        // Caso: Hay gente, pero faltan máquinas por cubrir en algún turno
        if (cubiertos < totales) {
            return colores.ADVERTENCIA;
        }

        // Caso: Todo perfecto (cubiertos >= totales)
        return colores.EXITO;
    },

    // Tip Pro: Función para el texto de progreso (opcional para poner dentro del cuadro)
    obtenerProgresoTexto: (nombreDia) => {
        const datos = getResumenSemanal.data.find(d => d.dias === nombreDia);
        if (!datos || Number(datos.huecos_totales) === 0) return "Sin actividad";
        return `${datos.huecos_cubiertos} / ${datos.huecos_totales}`;
    }
}