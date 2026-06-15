export default {
    obtenerIcono: (id) => id ? "edit" : "plus",
    obtenerVarianteIcono: (id) => id ? "TERTIARY" : "PRIMARY",

    async editarAgenda(idAgenda, idMaquina, turno, modalidad, dia) {
        try {
            // Guardamos el día de forma inteligente
            const diaFinal = dia || SelectDia.selectedOptionLabel;
            await storeValue("diaSeleccionado", diaFinal);

            // Guardamos modalidad y refrescamos especialidades pasándole el parámetro inmediato
            await storeValue("modalidadFiltro", modalidad);
            await getEspecialidades.run({ "modalidad": modalidad }); 

            // Seteamos los valores básicos en el almacén de Appsmith
            await storeValue("idGestion", idAgenda); 
            await storeValue("maquinaId", idMaquina);
            await storeValue("turnoSeleccionado", turno);

                        if (idAgenda) {
                // 1. Obtenemos los requisitos pasándole el ID inmediato
                await getRequisitosAgenda.run({ "id": idAgenda });
                
                const idsRequisitos = (getRequisitosAgenda.data || []).map(r => r.id_requisito);
                await storeValue("requisitosActuales", idsRequisitos);

                // 2. 🔥 TRAEMOS TODAS LAS AGENDAS Y BUSCAMOS DE FORMA GLOBAL E INDEPENDIENTE DEL DÍA
                await getTodasAgendas.run();
                const datosAgenda = (getTodasAgendas.data || []).find(a => a.id_agenda === idAgenda);

                // Obtenemos la especialidad directamente del registro de la base de datos
                const idEsp = datosAgenda ? datosAgenda.id_especialidad : null;
                
                await storeValue("especialidadActual", idEsp);
            } else {
                await storeValue("especialidadActual", null);
                await storeValue("requisitosActuales", []);
            }

					
            // Limpiamos los widgets del modal
            resetWidget("MultiTreeRequisitos", true); 
            resetWidget("SelectEspecialidadModal", true);

            showModal('ModalGestionAgenda');
        } catch (error) {
            showAlert("Error al preparar el modal: " + error.message, "error");
        }
    },

    async guardarCambios() {
        try {
            const idEnStore = appsmith.store.idGestion;
            const modFiltro = appsmith.store.modalidadFiltro;
            let idAgendaFinal = idEnStore;

            // REGLA CLÍNICA: Solo leemos el selector si es TC o RM, de lo contrario forzamos null.
            const especialidadSeleccionada = (modFiltro === 'RM' || modFiltro === 'TC')
                ? (SelectEspecialidadModal.selectedOptionValue || null)
                : null;

            if (idEnStore) {
                // MODO EDICIÓN: Pasamos el parámetro 'especialidad'
                await updateAgenda.run({ 
                    "id": idEnStore, 
                    "especialidad": especialidadSeleccionada 
                });
            } else {
                // MODO CREACIÓN: Pasamos 'especialidad' como parámetro
                const res = await insertAgenda.run({ 
                    "especialidad": especialidadSeleccionada 
                });
                idAgendaFinal = res?.[0]?.id_agenda || res?.[0]?.id || res?.insertId;
            }

            if (idAgendaFinal) {
                // Siempre limpiamos y re-insertamos los requisitos asociados
                await deleteRequisitos.run({ "id": idAgendaFinal });
                
                const seleccionados = (MultiTreeRequisitos.selectedOptionValues || [])
                    .filter(valor => !isNaN(parseInt(valor)));

                for (const idReq of seleccionados) {
                    await insertRequisito.run({ 
                        "id_agenda": idAgendaFinal, 
                        "id_requisito": parseInt(idReq) 
                    });
                }
                showAlert("¡Guardado con éxito!", "success");
            }

            closeModal('ModalGestionAgenda');
            
            // Refrescar las tablas principales
            await getAgendas.run(); 
            await getAgendaSemanal.run();
	 			 	 await UtilsAgendaSemana.cargarDatos();

        } catch (error) {
            showAlert("Error al guardar cambios: " + error.message, "error");
        }
    },

    async ejecutarBorrado() {
        try {
            const idABorrar = appsmith.store.idGestion;
            if (!idABorrar) return showAlert("Selecciona una agenda válida", "warning");

            // Limpieza transaccional manual en cascada
            await deleteRequisitos.run({ "id": idABorrar });
            await deleteAsignaciones.run({ "id": idABorrar });
            await deleteAgenda.run({ "id": idABorrar });

            showAlert("Agenda eliminada correctamente", "success");
            
            closeModal('ModalConfirmarBorrado');
            closeModal('ModalGestionAgenda'); 
            
            await getAgendas.run(); 
            await getAgendaSemanal.run(); 
        } catch (error) {
            showAlert("Error al eliminar la agenda: " + error.message, "error");
        }
    }
}
