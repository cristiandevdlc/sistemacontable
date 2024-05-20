import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";

const intNivelGasolina = {
	idNivelGasolina: "",
	nivelGasolina: "",
}
const nivelGasolinaRules = { nivelGasolina: "required" }

const actions = {
	create: 0,
	update: 1,
}

const NivelGasolina = () => {
	const [data, setData] = useState(intNivelGasolina);
	const [states, setStates] = useState({
		action: actions.create,
		nivelesGasolina: [],
		loading: true,
		open: false,
		errors: {},
	})

	const getAllData = async (newState = {}) => {
		const nivelesGasolina = await request(route('nivel-gasolina.index'))

		setStates({
			...states,
			...newState,
			nivelesGasolina: nivelesGasolina,
			loading: false
		})
	}

	const handleOpen = (action = actions.create) => setStates({ ...states, open: !states.open, action: action });

	const submit = async () => {
		const validator = validateInputs(nivelGasolinaRules, data)

		if (!validator.isValid) {
			setStates({ ...states, errors: validator.errors })
			return
		}
		const ruta = states.action ? route("nivel-gasolina.update", data.idNivelGasolina) : route("nivel-gasolina.store")
		const method = states.action ? "PUT" : "POST"

		await request(ruta, method, data)
		setData(intNivelGasolina)
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
							setData(intNivelGasolina)
							handleOpen()
						}}
						data={states.nivelesGasolina}
						columns={[
							{ header: "Nivel de gasolina", accessor: "nivelGasolina" },
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
					model: 'nivel de gasolina',
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
						fieldKey: "nivelGasolina",
						value: data.nivelGasolina,
						onChangeFunc: (e) =>
							setData({
								...data,
								nivelGasolina: e.target.value,
							}),
					}
				]}
				errors={states.errors}
			/>
		</div>
	);
};
export default NivelGasolina;