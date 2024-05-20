
import { DataGrid, Column, Scrolling, Editing } from 'devextreme-react/data-grid';
import Imagen from '../../Telermark/Localizacion-gps/img/camion.png';
import '../../../../../sass/TablesComponent/_tablesStyle.scss';
import { ButtonComp } from "@/components/ButtonComp";
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import SelectComp from '@/components/SelectComp';
import TextInput from '@/components/TextInput';
import { useEffect } from 'react'
import { useState } from 'react'
import request, { noty } from '@/utils';
import React from 'react'
import Tooltip from '@mui/material/Tooltip/Tooltip'
import LoadingDiv from '@/components/LoadingDiv';
import { Divider } from '@mui/material';

export default function Precios() {
	const [state, setState] = useState({ loading: true, info: false })
	const [precios, setPrecios] = useState();
	const [show, setshowdata] = useState(false)
	const [selectedItemKeys, setSelectedItemKeys] = useState([]);
	const [zonaselect, setZonaselect] = useState();
	const [data, setData] = useState({ zona: 0, fecha: new Date().toISOString().split('T')[0] });
	const [Datos, setDatos] = useState({ Estado: "-", Municipio: "-", Precio: "-", precioKilo: "-" });
	const [productos, setProductos] = useState([])

	const dataSource = new DataSource({
		store: new ArrayStore({
			data: precios,
		})
	});

	const fetchdata = async () => getPreciosfiltro();

	const getMenuName = async () => {
		try {
			// Obtener la ruta actual
			const rutaCompleta = location.pathname;
			const segmentos = rutaCompleta.split('/');
			const nombreModulo = segmentos[segmentos.length - 1]
			await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
		} catch (error) { }
	};

	const updateValue = async (e) => {
		console.log(e)

		const productId = e.key.producto_idProducto;
		const param = e.newData.historico_precio;
		const informacionfilterzona = {
			historico_precio: param,
			precioProducto_fecha: data.fecha,
			zona: data.zona,
			IdProducto: productId,
			federal_entity: Datos.Estado,
			township: Datos.Municipio,

		}
		await request(route("UpdatePrecio"), 'POST', informacionfilterzona, { enabled: true, error: { message: 'Ocurrió un error al actualizar el registro.', type: 'error' }, success: { message: "Registro actualizado.", type: 'info' } })
	};

	const getProductos = async () => {
		const responseE = await fetch(route("productos.index"));
		const dataE = await responseE.json();
		setProductos(dataE);
	};

	const getPreciosfiltro = async () => {
		const response = await fetch(route("zonas.index"));
		const data = await response.json();
		setZonaselect(data);
	};

	const submitFilterZona = async (e) => {
		setState({ ...state, info: true })
		try {
			const informacionfilterzona = { zona: data.zona, fecha: data.fecha };
			const [requestDataInfo, requestData] = await Promise.all([
				request(route("filterZone"), 'POST', informacionfilterzona, { enabled: true }),
				request(route("precios-zona"), 'POST', informacionfilterzona, { enabled: true })
			])
			setshowdata(true)
			setPrecios(requestData)
			MostrarPrecios(requestDataInfo);
			noty('Registros obtenidos.', 'success')
		} catch {
			noty('Ocurrió un error al obtener los datos.', 'error')
		}
		setState({ ...state, info: false })
	};

	const MostrarPrecios = async (e) => {

		const dataApi = {
			federal_entity: e.descripcionEstado,
			township: e.descripcionMunicipio,
			zona: e.zona_idZona,
			date: data.fecha
		};
		const requestData = await request(route("PrecioZona"), 'POST', dataApi, { enabled: true, error: { message: 'No se logro la peticion', type: 'error' } })
		console.log("requestPrecio", requestData);
		setDatos({ Estado: requestData.entidad_federativa, Municipio: requestData.municipio, Precio: requestData.precio_lt, precioKilo: requestData.precio_kg });
	}

	const actualizarPrecio = async () => {
		const dataApi = { federal_entity: Datos.Estado, township: Datos.Municipio, zona: data.zona };
		await request(route("PrecioLitro"), 'POST', dataApi, { enabled: true, error: { message: 'No se logro la peticion', type: 'error' }, success: { message: "Se actualizaron los precios", type: 'success' } })

		setPrecios(precios);
		submitFilterZona(data.zona);
	};

	useEffect(() => {
		fetchdata();
		getProductos()
	}, [data])

	useEffect(() => {
		if (zonaselect) setState({ ...state, loading: false })
	}, [zonaselect])

	return (
		<div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
			{state.loading && <LoadingDiv />}
			{!state.loading &&
				<div className='flex gap-6 sm:flex-col md:flex-row'>
					<div className="flex flex-col gap-4 min-w-[35vh]">
						<div className='border-2 w-full shadow-md px-4 pb-3 rounded-xl'>
							<SelectComp
								label="Zona"
								options={zonaselect}
								value={data.zona || ''}
								onChangeFunc={(newValue) =>
									setData({
										...data,
										zona: newValue,
									})
								} data="zona_descripcion"
								valueKey="zona_idZona"
							/>
							<TextInput
								label={'Fecha'}
								type="date"
								value={data.fecha || new Date().toISOString().split('T')[0]}
								max={new Date().toISOString().split('T')[0]} // Establece el atributo 'max' con la fecha actual
								onChange={(newDate) => {
									setData({
										...data,
										fecha: newDate.target.value,
									})
								}}
							/>
							<ButtonComp onClick={submitFilterZona} label={'Buscar'} />
							<ButtonComp onClick={actualizarPrecio} label={'Actualizar precios'} />
						</div>
						<div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white gap-2">
							<div className='flex justify-between'>
								<span>Estado</span>
								<span>{Datos.Estado}</span>
							</div>
							<Divider color='#5F6C91' />
							<div className='flex justify-between'>
								<span>Municipio</span>
								<span>{Datos.Municipio}</span>
							</div>
							<Divider color='#5F6C91' />
							<div className='flex justify-between'>
								<span>Precio Litro</span>
								<span>{Datos.Precio}</span>
							</div>
							<Divider color='#5F6C91' />
							<div className='flex justify-between'>
								<span>Precio Kilo</span>
								<span>{Datos.precioKilo}</span>
							</div>
						</div>
					</div>
					{(show && precios) ? (
						<div className="">
							<div className="virtualTable blue-scroll max-h-[92%] monitor-table">
								<DataGrid
									dataSource={dataSource}
									selectedRowKeys={selectedItemKeys}
									showRowLines={true}
									id={'datagrid'}
									className='sm:min-w-[10px]'
									showColumnLines={true}
									elementAttr={{ class: 'data-table' }}
									showBorders={true}
									columnAutoWidth={false}
									// elementAttr={{ class: 'data-table' }}
									onRowUpdating={updateValue}
									onCellPrepared={(e) => {
										if (e.rowType === 'header') {
											e.cellElement.setAttribute('data-label', e.column.caption);
										} else {
											e.cellElement.setAttribute('data-label', e.column.caption);
										}
									}}
								>
									<Scrolling mode="virtual" />
									<Editing mode="cell" allowUpdating={true} />
									<Column allowResizing={false} name='button-producto' data-label={'producto'} dataField="producto_nombre" caption="producto" allowEditing={false} valueExpr="producto_nombre" displayExpr="producto_nombre" />
									<Column allowResizing={false} dataField="unidadMedida_nombre" data-label={'Unidad de medida'} caption="Unidad de medida" allowEditing={false} valueExpr="unidadMedida_nombre" displayExpr="unidadMedida_nombre" />
									<Column
										dataField="historico_precio"
										caption="Precio $"
										allowEditing={true}
										data-label="Precio $"
										allowResizing={false}
										valueExpr="historico_precio"
										displayExpr={(data) => `$${data.historico_precio}`}
									/>
								</DataGrid>
							</div>
						</div>
					) : (state.info ? (
						<div className='flex items-center justify-center place-content-center w-full h-[90vh]'>
							<LoadingDiv />
						</div>
					) : (
						<div className='flex items-center justify-center place-content-center w-full h-[90vh]'>
							<img
								src={Imagen}
								alt=""
								className='non-selectable'
								style={{
									textAlign: 'center',
									width: '400px',
									height: 'auto'
								}}
							/>
						</div>
					))}
				</div>
			}
		</div >
	);
}