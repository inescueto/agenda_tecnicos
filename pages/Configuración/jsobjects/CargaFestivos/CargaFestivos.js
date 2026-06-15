export default {
    importarFestivos: async () => {
        const datos = FilePickerFestivos.files[0].data;
        
        if (datos.length === 0) {
            return showAlert("El archivo está vacío o no se ha cargado", "warning");
        }
console.log("Primera fila detectada:", datos[0]);
        // Usamos un bucle para recorrer el archivo
        for (let fila of datos) {
					
					 const fechaFormateada = moment(fila.fecha_festivo, "DD/MM/YYYY").format("YYYY-MM-DD");
            // "fecha" y "descripcion" deben ser los nombres de las columnas en tu Excel/CSV
            await insertFestivo.run({
                fecha: fechaFormateada,
                descripcion: fila.festividad
            });
        }

        showAlert("¡Éxito! Se han cargado " + datos.length + " festivos.", "success");
        
        // Refrescamos la tabla para que Josepe vea los cambios al momento
        await getFestivos.run();
        
        // Limpiamos el FilePicker para la próxima vez
        resetWidget("FilePickerFestivos");
    }
}

