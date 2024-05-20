import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";

const intNivelCarburacion = {
	idNivelCarburacion: "",
	nivelCarburacion: "",
}
const nivelCarburacionRules = { nivelCarburacion: "required" }

const actions = {
	create: 0,
	update: 1,
}

const NivelCarburacion = () => {
	const [data, setData] = useState(intNivelCarburacion);
	const [states, setStates] = useState({
		action: actions.create,
		nivelesCarburacion: [],
		loading: true,
		open: false,
		errors: {},
	})

	const getAllData = async (newState = {}) => {
		const nivelesCarburacion = await request(route('nivel-carburacion.index'))

		setStates({
			...states,
			...newState,
			nivelesCarburacion: nivelesCarburacion,
			loading: false
		})
	}

	const handleOpen = (action = actions.create) => setStates({ ...states, open: !states.open, action: action });

	const submit = async () => {
		const validator = validateInputs(nivelCarburacionRules, data)

		if (!validator.isValid) {
			setStates({ ...states, errors: validator.errors })
			return
		}
		const ruta = states.action ? route("nivel-carburacion.update", data.idNivelCarburacion) : route("nivel-carburacion.store")
		const method = states.action ? "PUT" : "POST"

		await request(ruta, method, data)
		setData(intNivelCarburacion)
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
							setData(intNivelCarburacion)
							handleOpen()
						}}
						data={states.nivelesCarburacion}
						columns={[
							{ header: "Nivel", accessor: "nivelCarburacion" },
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
					model: 'nivel de carburacion',
					width: 'xs',
					openState: states.open,
					actionState: states.action ? 'edit' : 'create',
					openStateHandler: () => handleOpen(states.action),
					onSubmitState: () => submit
				}}
				fields={[
					{
						label: "Nivel",
						input: true,
						type: "number",
						fieldKey: "nivelCarburacion",
						value: data.nivelCarburacion,
						onChangeFunc: (e) =>
							setData({
								...data,
								nivelCarburacion: e.target.value,
							}),
					}
				]}
				errors={states.errors}
			/>
		</div>
	);
};
export default NivelCarburacion;