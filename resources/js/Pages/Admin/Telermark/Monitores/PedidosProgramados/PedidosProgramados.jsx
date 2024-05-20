import Datatable from '@/components/Datatable';
import LoadingDiv from '@/components/LoadingDiv';
import request from '@/utils';
import React, { useEffect, useState } from 'react'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grow, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import SelectComp from '@/components/SelectComp';
import { Link } from 'react-router-dom';
import { useForm } from '@inertiajs/react';
import TextInput from '@/components/TextInput';
import ServiciosTransitoDialog from '../ServiciosTransito/ServiciosTransitoDialog';
// import ServiciosTransitoDialog from './ServiciosTransitoDialog';

// pedidos programados
const PedidosProgramados = () => {
	const [state, setState] = useState({
		loading: true,
		open: false,
		action: '',
		pedidos: null,
		check: false,
		vendedor: null,
		tipoServicio: null,
		motivoCan: null,
		operadora: null,
		// estatus: null
	})
	const [filters, setFilters] = useState({
		fechaPedido: '',
		IdPersona: 0,
		IdServicio: 0,
		IdOperadora: 0,
		estatusid: 0
	})
	const [filteredData, setFilteredData] = useState()
	const { data, setData } = useForm({})
	const estatus = [
		{ id: 1, estatus: "Normal" },
		{ id: 2, estatus: "Por vencer" },
		{ id: 3, estatus: "Vencido" },
	]

	const fetchdata = async () => {
		const response = await request(route("servicios-en-transito", {estatus:[4]}), "GET");
		// console.log('response', response)
		setState({ ...state, pedidos: response.pedidos, loading: false });
	};

	const getSelectOptions = async () => {
		const [vendedorResponse, tipoServicioResponse, operadoraResponse, motivoCanResponse/* , estatusResponse */] = await Promise.all([
			fetch(route("personas.index")).then(response => response.json()),
			fetch(route("tipos-servicios.index")).then(response => response.json()),
			fetch(route("usuarios.index")).then(response => response.json()),
			fetch(route("motivos-cancelacion.index")).then(response => response.json()),
			// fetch(route("estatus-pedidos")).then(response => response.json())
		]);
		setState({ ...state, vendedor: vendedorResponse, tipoServicio: tipoServicioResponse, operadora: operadoraResponse, motivoCan: motivoCanResponse/* , estatus: estatusResponse */ })
	}

	const HtmlTooltip = styled(({ className, ...props }) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: '#C4CCF1',
			color: 'rgba(0, 0, 0, 0.87)',
			minWidth: 400,
			fontSize: theme.typography.pxToRem(12),
			border: '1px solid #dadde9',
			padding: 12,
			borderRadius: 12,
			boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.30)',
		},
	}));

	const search = () => {
		if (filters.fechaPedido || filters.IdPersona || filters.IdServicio || filters.IdOperadora || filters.estatusid) {
			const filtered = state.pedidos.filter((item) => {
				const filterFechaPedido = !filters.fechaPedido || item.fecha.split(" ")[0] === filters.fechaPedido.toString();
				const filterIdPersona = !filters.IdPersona || item.IdVendedor.toString() === filters.IdPersona.toString();
				const filterTipoServicio = !filters.IdServicio || item.IdServicio.toString() === filters.IdServicio.toString();
				const filterUsuarioId = !filters.IdOperadora || item.IdOperadora.toString() === filters.IdOperadora.toString();
				const filterEstatusId = !filters.estatusid || item.estatusTiempos.toString() === filters.estatusid.toString();
				return filterFechaPedido && filterIdPersona && filterTipoServicio && filterUsuarioId && filterEstatusId;
			});
			setFilteredData(filtered);
		} else {
			setFilteredData(state.pedidos);
		}
	};

	const handleCloseModal = () => {
		setState({ ...state, open: false, action: '', check: false });
		setData({})
		// setErrors({});
	};

	const submit = async () => {
		if (state.action === 'surtir') {
			await request(
				route('pedidos-detalle.update', data.detalles.pedidoDetallesId),
				"PUT",
				{ ...data, estatus: 2, detalles: { ...data.detalles, estatus: 2 } })
				.then(() => {
					handleCloseModal()
					fetchdata()
				})
		}
		if (state.action === 'cancelar') {
			await request(
				route('pedidos-detalle.update', data.detalles.pedidoDetallesId),
				"PUT",
				{ ...data, estatus: 3, detalles: { ...data.detalles, estatus: 3 } })
				.then(() => {
					handleCloseModal()
					fetchdata()
				})
		}
	}

	const envioFunc = async () => {
		if (data.detalles.enviado.toString() === "1") {
			setState({ ...state, open: true })
		} else {
			await request(
				route('pedidos-detalle.update', data.detalles.pedidoDetallesId),
				"PUT",
				{ ...data, detalles: { ...data.detalles, enviado: 1 } })
				.then(() => {
					fetchdata()
				})
		}
	}

	const surtirCancelarPedido = async () => {
		setState({ ...state, open: true })
	}

	useEffect(() => {
		if (!state.vendedor && !state.tipoServicio && !state.operadora && !state.motivoCan) {
			getSelectOptions()
		}
		if (!state.pedidos) {
			fetchdata()
		}
		search()
		// console.log('state', state)
	}, [state])

	useEffect(() => {
		// console.log('data', data)
		if (state.action === "envio") envioFunc()
		if (state.action === "surtir" || state.action === "cancelar") surtirCancelarPedido()
	}, [data])

	// useEffect(() => {
	// 	console.log('data', data)
	// }, [data])

	return (
		<>
			{state.loading && <LoadingDiv />}
			{(filteredData && !state.loading) && <>
				<div className='flex gap-6 pt-6'>
					<TextInput
						type="date"
						className="block w-full"
						min="1800-01-01"
						max={new Date().toISOString().split("T")[0]}
						value={filters.fechaPedido || new Date().toISOString().split("T")[0]}
						onChange={(event) =>
							setFilters({
								...filters,
								fechaPedido: event.target.value,
							})
						}
						style={{
							borderRadius: "50px",
							padding: "15px",
						}} // Añade el border-radius
					/>
					<SelectComp
						// className={"h-10"}
						label="Vendedor"
						firstOption={true}
						firstLabel={"Todos"}
						options={state.vendedor}
						value={filters.IdPersona || ''}
						data="Nombres"
						valueKey="IdPersona"
						onChangeFunc={(value) => setFilters({ ...filters, IdPersona: value })}
					/>
					<SelectComp
						// className={"h-10"}
						label="Tipo"
						firstOption={true}
						firstLabel={"Todos"}
						options={state.tipoServicio}
						value={filters.IdServicio || ''}
						data="tipoServicio_descripcion"
						valueKey="tipoServicio_idTipoServicio"
						onChangeFunc={(value) => setFilters({ ...filters, IdServicio: value })}
					/>
					<SelectComp
						// className={"h-10"}
						label="Operadora"
						firstOption={true}
						firstLabel={"Todos"}
						options={state.operadora}
						value={filters.IdOperadora || ''}
						data="usuario_nombre"
						valueKey="usuario_idUsuario"
						onChangeFunc={(value) => setFilters({ ...filters, IdOperadora: value })}
					/>
					<SelectComp
						// className={"h-10"}
						label="Activo"
						firstOption={true}
						firstLabel={"Todos"}
						options={estatus}
						value={filters.estatusid || ''}
						data="estatus"
						valueKey="id"
						onChangeFunc={(value) => setFilters({ ...filters, estatusid: value })}
					/>
					<Button onClick={search}>Buscar</Button>
					{data.pedidoId &&
						<ServiciosTransitoDialog
							open={state.open}
							handleCloseModal={handleCloseModal}
							action={state.action}
							motivosCancelacion={state.motivoCan}
							submit={submit}
							options={state.vendedor}
							pedido={data}
							check={state.check}
							onChangeVendedor={(value) => setData({ ...data, IdVendedor: value })}
							onChangeCheck={(e) => setState({ ...state, check: e.target.checked })}
							onChangeRemision={(e) => setData({ ...data, detalles: { ...data.detalles, remision: e.target.value } })}
							onChangeMotivoCanId={(value) => setData({ ...data, detalles: { ...data.detalles, motivocancelacionid: value } })}
							onChangeMotivoCanDes={e => setData({ ...data, detalles: { ...data.detalles, descripcionCancelacion: e.target.value } })}
							onChangeClaveSup={(e) => setData({ ...data, claveSupervisor: e.target.value })}
							onChangeServicio={(e) => setData({ ...data, detalles: { ...data.detalles, servicio: data.detalles.servicio + ' ' + e.target.value } })}
						/>
					}
				</div>
				<Datatable
					data={filteredData}
					searcher={false}
					rowClass={(eprops) => {
						return eprops.item.estatusTiempos === 1
							? "bg-[green] text-[#E5E5E5]" // Verde
							: eprops.item.estatusTiempos === 2
								? "bg-[#FBD413]" // Amarillo
								: "bg-[#CE2929] text-[#E5E5E5]"; // Rojo
					}}
					columns={[
						{ header: "Fecha", accessor: "fecha" },
						{ header: "Teléfono", accessor: "telefono" },
						{ header: "Cliente", accessor: "cliente" },
						{ header: "Colonia", accessor: "colonia" },
						{ header: "Dirección", accessor: "direccion" },
						{ header: "Producto", accessor: "servicio" },
						{ header: "Tiempo", accessor: "tiempoTranscurrido" },
						{ header: "Operadora", accessor: "operadora" },
						{
							header: " ", cell: eprops => (
								<>
									<div className='flex gap-3 text-black'>
										<div>
											<HtmlTooltip
												arrow
												placement='left'
												title={
													<React.Fragment>
														<Typography color="inherit">Detalle de la orden</Typography>
														<Divider />
														<div className='grid w-full grid-cols-2 gap-3 pt-2 overflow-x-hidden overflow-y-auto'>
															<div className='flex flex-col'>
																<span>Fecha creación:</span>
															</div>
															<div className='flex flex-col'>
																<span className='flex-grow'>{eprops.item.detalles.fechaCreacion ?? "-"}</span>
															</div>
															<div className='flex flex-col'>
																<span>Dirección:</span>
															</div>
															<div className='flex flex-col'>
																<span className='flex-grow'>{eprops.item.direccion ?? '-'}</span>
															</div>
															<div className='flex flex-col'>
																<span>Entre calles:</span>
															</div>
															<div className='flex flex-col'>
																<span className='flex-grow'>{eprops.item.detalles.calle1} y {eprops.item.detalles.calle2}</span>
															</div>
															<div className='flex flex-col'>
																<span>Vendedor:</span>
															</div>
															<div className='flex flex-col'>
																<span className='flex-grow'>{eprops.item.detalles.nombresVendedor ?? '-'}</span>
															</div>
															<div className='flex flex-col'>
																<span>Ruta:</span>
															</div>
															<div className='flex flex-col'>
																<span className='flex-grow'>{eprops.item.detalles.nombreRuta ?? '-'}</span>
															</div>
															<div className='flex flex-col'>
																<span>Unidad:</span>
															</div>
															<div className='flex flex-col'>
																<span className='flex-grow'>{eprops.item.detalles.numComercialUnidad ?? '-'}</span>
															</div>
															<div className='flex flex-col'>
																<span>Información:</span>
															</div>
															<div className='flex flex-col'>
																<span className='flex-grow'>{eprops.item.detalles.servicio}</span>
															</div>
														</div>
													</React.Fragment>
												}
											>
												<InfoIcon />
											</HtmlTooltip>
										</div>
										<div>
											<Link to={'/clientes-pedidos'} state={{ item: eprops.item, showPedido: false }}>
												<PersonIcon />
											</Link>
										</div>
										<div>
											<Link to={'/clientes-pedidos'} state={{ item: eprops.item, showPedido: true }}>
												<DescriptionIcon className='rounded-full cursor-pointer' />
											</Link>
										</div>
										<div>
											<DownloadDoneIcon
												className='rounded-full cursor-pointer'
												onClick={() => {
													setData({ ...eprops.item, tipo: 'surtir' })
													setState({ ...state, action: 'surtir' })
												}}
											/>
										</div>
										<div>
											<ClearIcon
												className='rounded-full cursor-pointer'
												onClick={() => {
													setData({ ...eprops.item, tipo: 'cancelar' })
													setState({ ...state, action: 'cancelar' })
												}}
											/>
										</div>
										<div>
											<CheckCircleOutlineIcon
												onClick={() => {
													setData({ ...eprops.item, tipo: 'envio' })
													setState({ ...state, action: 'envio' })
												}}
												className={(eprops.item.detalles.enviado.toString() === '0' ? 'bg-gray-300 ' : 'bg-[green] ') + 'rounded-full cursor-pointer'} />
										</div>
									</div>
								</>
							)
						}
					]}
				/>
			</>
			}
		</>
	)
}

export default PedidosProgramados
