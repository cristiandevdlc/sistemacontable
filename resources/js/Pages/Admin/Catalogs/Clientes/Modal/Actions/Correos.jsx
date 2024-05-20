import Datatable from '@/components/Datatable';
import request, { noty, regex } from '@/utils';
import { useState, useEffect } from 'react';

const Correos = ({ data }) => {
	const [clientEmails, setClientEmails] = useState([])

	const fetchClientEmails = async () => {
		const response = await request(route('correos-clientes.show', data.cliente_idCliente))
		response.push({
			correoCliente_idCliente: '',
			correoCliente_correo: ''
		})
		setClientEmails(response)
	}

	useEffect(() => {
		fetchClientEmails()
	}, [])

	const deleteEmail = async (id) => {
		if (id) {
			await request(route('correos-clientes.destroy', id), 'DELETE', {}, { enabled: true, success: { message: 'Eliminacion exitosa' }, error: { message: 'Error al eliminar registro' } })
			fetchClientEmails()
		} else
			noty('Este correo no está registrado', 'error')
	}

	const updateEmail = async (e) => {
		if (e.newData) {
			if (!regex.email.test(e.newData?.correoCliente_correo)) {
				noty('Correo no valido', 'error')
				return
			}

			const newData = { ...e.oldData, ...e.newData, correoCliente_idCliente: data.cliente_idCliente }
			const ruta = newData.correoCliente_idCorreoCliente ? route('correos-clientes.update', newData.correoCliente_idCorreoCliente) : route('correos-clientes.store');
			const metodo = newData.correoCliente_idCorreoCliente ? 'PUT' : 'POST';
			await request(ruta, metodo, newData).then(() => {
				fetchClientEmails()
			})
		}
	};

	return (
		<Datatable
			searcher={false}
			virtual={true}
			// onRowRemoving={()=>{}}
			handleRowUpdating={updateEmail}
			editingMode={{ mode: "cell", allowUpdating: true }}
			data={clientEmails}
			columns={[
				{ header: "Email", accessor: 'correoCliente_correo' },
				{
					header: "Acciones", cell: (eprops) => eprops.item.correoCliente_correo && (
						<>
							<span
								className='material-icons'
								onClick={() => {
									deleteEmail(eprops.item.correoCliente_idCorreoCliente)
								}}
							>
								delete
							</span>
						</>
					)
				},
			]}
		/>
	)

}

export default Correos