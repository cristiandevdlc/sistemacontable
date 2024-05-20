import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { Chip } from "@mui/material";

const intMotivoEntradaSalida = {
	idMotivoEntradaSalida: "",
	idTipoServicio: "",
	tipoEntradaSalida: "1",
	descripcion: "",
	estatus: '1'
}
const MotivoEntradaSalidaRules = {
	idTipoServicio: 'required',
	tipoEntradaSalida: 'required',
	descripcion: 'required',
}

const actions = {
	create: 0,
	update: 1,
}

const MotivoEntradaSalida = () => {
	const [data, setData] = useState(intMotivoEntradaSalida);
	const [states, setStates] = useState({
		action: actions.create,
		tipoServicios: [],
		motivosES: [],
		loading: true,
		open: false,
		errors: {},
	})

	const getAllData = async (newState = {}) => {
		const [
			motivosES,
			tipoServicios
		] = await Promise.all([
			request(route('motivo-entrada-salida.index')),
			request(route('tipos-servicios.index'))
		])

		setStates({
			...states,
			...newState,
			motivosES: motivosES,
			tipoServicios: tipoServicios,
			loading: false
		})
	}

	const handleOpen = (action = actions.create) => setStates({ ...states, open: !states.open, action: action });

	const submit = async () => {
		const validator = validateInputs(MotivoEntradaSalidaRules, data)

		if (!validator.isValid) {
			setStates({ ...states, errors: validator.errors })
			return
		}
		const ruta = states.action ? route("motivo-entrada-salida.update", data.idmotivoentradasalida) : route("motivo-entrada-salida.store")
		const method = states.action ? "PUT" : "POST"

		await request(ruta, method, data)
		setData(intMotivoEntradaSalida)
		getAllData({ open: !states.open, errors: {} })
	}

	useEffect(() => {
		getAllData()
	}, []);

	return (
		<div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
			{states.loading && <LoadingDiv />}
			{!states.loading && (
				<div className='sm:h-[97%] md:h-[90%]'>
					<Datatable
						add={() => {
							setData(intMotivoEntradaSalida)
							handleOpen()
						}}
						data={states.motivosES}
						columns={[
							{ header: "Descripción", accessor: "descripcion" },
							{ header: "TIpo", cell: ({ item }) => item.tipoEntradaSalida == 1 ? 'ENTRADA' : 'SALIDA' },
							{ header: "Nombre de servicio", cell: ({ item }) => item.tipo_servicios?.tipoServicio_descripcion },
							{
								header: 'Activo',
								cell: (eprops) => <>{eprops.item.estatus == 1 ? (<Chip label="SI" color="success" size="small" />) : (<Chip label="NO" color="error" size="small" />)}</>
							},
							{
								header: "Acciones",
								edit: ({ item }) => {
									setData(item)
									handleOpen(actions.update)
								}
							},
						]}
					/>
				</div>
			)}

			<DialogComp
				dialogProps={{
					model: 'motivo entrada/salida',
					width: 'sm',
					openState: states.open,
					actionState: states.action ? 'edit' : 'create',
					openStateHandler: () => handleOpen(states.action),
					onSubmitState: () => submit
				}}
				fields={[
					{
						label: "Descripcion",
						input: true,
						type: "text",
						fieldKey: "descripcion",
						value: data.descripcion,
						onChangeFunc: (e) => setData({
							...data,
							descripcion: e.target.value,
						}),
					},
					{
						select: true,

						label: "Tipo de Registro",
						value: data.tipoEntradaSalida,
						onChangeFunc: (e) => setData({
							...data,
							tipoEntradaSalida: e
						}),
						options: [
							{ id: '1', value: 'Entrada' },
							{ id: '2', value: 'Salida' }
						],
						data: 'value',
						valueKey: 'id'
					},
					{
						label: "Tipo Servicio",
						select: true,
						fieldKey: "idTipoServicio",
						value: data.idTipoServicio,
						options: states.tipoServicios,
						valueKey: 'tipoServicio_idTipoServicio',
						data: 'tipoServicio_descripcion',
						onChangeFunc: (e) => setData({
							...data,
							idTipoServicio: e,
						}),
					},
					{
						label: "Activo",
						check: true,
						fieldKey: 'estatus',
						checked: data.estatus,
						style: 'justify-center mt-5',
						onChangeFunc: (e) => setData({
							...data,
							estatus: e.target.checked ? "1" : "0",
						}),
					},
				]}
				errors={states.errors}
			/>
		</div>
	);
};
export default MotivoEntradaSalida;