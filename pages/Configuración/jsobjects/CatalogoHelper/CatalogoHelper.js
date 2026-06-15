export default {
	guardar: async () => {
		try {
			if (appsmith.store.is_editing_catalogo) {
				await updateCapacitacion.run();
				showAlert('Capacitación actualizada correctamente', 'success');
			} else {
				await addCapacitacion.run();
				showAlert('Nueva capacitación añadida', 'success');
			}
			await getCatCapacitaciones.run();
			closeModal('ModalCapacitacion');
		} catch (error) {
			showAlert('Error al guardar: ' + error.message, 'error');
		}
	},
	
	borrar: async () => {
		try {
			await deleteCapacitacion.run();
			showAlert('Capacitación eliminada', 'success');
			await getCatCapacitaciones.run();
			closeModal('ModalConfirmarBorradoCat');
		} catch (error) {
			showAlert('Error al borrar: ' + error.message, 'error');
		}
	},
	
	abrirNuevo: () => {
		storeValue('is_editing_catalogo', false);
		resetWidget('ModalCapacitacion', true);
		showModal('ModalCapacitacion');
	},
	
	abrirEditar: (row) => {
		storeValue('is_editing_catalogo', true);
		showModal('ModalCapacitacion');
	}
}
