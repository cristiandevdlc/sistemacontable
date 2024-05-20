import Datatable from '@/components/Datatable'

import LoadingDiv from '@/components/LoadingDiv'
import TextInput from '@/components/TextInput'
import { useForm } from '@inertiajs/react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, Chip } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import request from '@/utils';
import DialogComp from '@/components/DialogComp'

const CatalogoDescripcionSistemas = () => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [action, setAction] = useState("create");
	const [Descripcion, setDescripcion] = useState([]);
	const [erros, setErrors] = useState([]);
	const { data, setData } = useForm({
		DescripcionRevision: "",
		estatus: 1,
		prioridad: "",
	});
	const descripcionActivo = Descripcion.filter(item => item.estatus === '0');
	const descripcionInactivo = Descripcion.filter(item => item.estatus === '1');
	const descripcionFinal = descripcionInactivo.concat(descripcionActivo);

	const getDescripcion = async () => {
		const response = await fetch(route("conceptosRevision.index"));
		const data = await response.json();

		data.sort((a, b) => a.prioridad - b.prioridad);
		setDescripcion(data);
	};
	const validateForm = () => {
		let isValid = true;
		const newErrors = {};
		if (data.nivelGasolina === "") {
			newErrors.nivelGasolina = "El campo es requerido";
			isValid = false;
		}
		setErrors(newErrors);
		return isValid;
	};

	const submit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		const ruta = action === "create"
			? route("conceptosRevision.store")
			: route("conceptosRevision.update", data.idConceptoRevision);
		const method = action === "create" ? "POST" : "PUT";
		await request(ruta, method, data).then(() => {
			getDescripcion();
			setOpen(!open);
		});
	};

	useEffect(() => {
		if (Descripcion.length === 0) {
			getDescripcion();
		}
		setLoading(false);
	}, []);

	const handleCloseModal = () => {
		setOpen(false);
		setErrors({});
	};

	return (
		<div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
			{loading && <LoadingDiv />}
			{descripcionFinal.length > 0 && (
				<div className='sm:h-[97%] md:h-[90%]'>
					<Datatable
						add={() => {
							setAction('create')
							setData({
	
								DescripcionRevision: "",
								estatus: "",
								prioridad: "",
							})
							setOpen(true)
						}}
						data={descripcionFinal}
						columns={[
							{ header: 'Descripcion Revision', accessor: 'DescripcionRevision' },
							{
								header: 'Activo', accessor: 'estatus', cell: eprops => eprops.item.estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />)
							},
							{ header: 'Prioridad', accessor: 'prioridad' },
							{
								header: "Acciones",
								edit: (eprops) => {
									setAction('edit')
									setData({ ...eprops.item })
									setOpen(true)
								},
							}
						]}
					/>
				</div>
			)}
			
            <DialogComp
                dialogProps={{
                    model: 'descripcion de revisión',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        type: "text",
                        fieldKey: "DescripcionRevision",
                        value: data.DescripcionRevision,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                DescripcionRevision: e.target.value,
                            }),
                    },
                    {
                        label: "Prioridad",
                        input: true,
                        type: "number",
                        fieldKey: "prioridad",
                        value: data.prioridad,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                prioridad: e.target.value,
                            }),
                    },
					{
						label: "Activo",
						check: true,
						fieldKey: 'estatus',
						checked: data.estatus,
						style: 'justify-center',
						onChangeFunc: (e) => setData({
							...data,
							estatus: e.target.checked ? "1" : "0",
						})
					},
                ]}
                errors={erros}
            />
			{/* <Dialog open={open} onClose={handleCloseModal} maxWidth="lg" fullWidth>
				<DialogTitle>
					{action === 'create' ? 'Crear Descripcion' : 'Editar Descripcion'}
				</DialogTitle>
				<DialogContent>
					<form className='py-3'>
						<TextInput className="block w-full mt-4 texts" type="text" label="Descripción" name="Descripción" value={data.DescripcionRevision} isFocused={true} maxLength="150"
							onChange={(e) => {
								setData({ ...data, DescripcionRevision: e.target.value })
							}}
						/>

						<TextInput className="w-full mt-4 texts" type="text" label="Prioridad" value={data.prioridad} isFocused={true} maxLength="50"
							onChange={(e) => {
								setData({ ...data, prioridad: e.target.value })
							}}
						/>
						<div className="flex justify-center items-center mt-4">
							<FormControlLabel
								label="Activo"
								labelPlacement='start'
								control={
									<Checkbox
										sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
										checked={Number(data.estatus) === 1 ? true : false}
										onChange={(e) => setData({ ...data, estatus: e.target.checked ? 1 : 0 })}
									/>
								}
							/>
						</div>
					</form>
				</DialogContent>
				<DialogActions className={'mt-4'}>
					<Button color='error' onClick={handleCloseModal}>Cancelar</Button>
					<Button color={(action === 'create') ? 'success' : 'warning'} onClick={submit}>
						{(action === 'create') ? 'Crear' : 'Actualizar'}
					</Button>
				</DialogActions>
			</Dialog> */}
		</div>
	)
}
export default CatalogoDescripcionSistemas;