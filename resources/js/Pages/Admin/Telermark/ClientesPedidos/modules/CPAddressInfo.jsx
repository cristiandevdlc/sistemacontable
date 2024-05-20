import { Navigation, Info, List, Search, WrongLocation, EditNote, Add, DeleteSweep } from '@mui/icons-material';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { intAddressData, intClienteData, intStateModule } from "../intClientePedidos";
import { disabledColor, firstObj, noty, primaryColor, secondaryColor } from "@/utils";
import { ControlPanelComp } from "@/components/ControlPanelComp";
import '../../../../../../sass/TabsEncuesta/_tabs.scss';
import { FieldDrawer } from "@/components/DialogComp";
import { ButtonComp } from "@/components/ButtonComp";
import Datatable from '@/components/Datatable';
import { useRef, useEffect } from 'react';
import { Request } from "@/core/Request";
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
const addressCtrl = { add: 0, list: 1, search: 2 }

export default function CPAddressInfo({
    data = intAddressData,
    setData = () => { },
    state = intStateModule,
    setState = () => { },
    clientData = intClienteData,
    setClientData = () => { },
    tabsControl = () => { }
}) {
    const [clientesRes, setClientesRes] = useState([])
    const [busqueda, setBusqueda] = useState({ calle: '', numeroExterior: '' })
    const mapRef = useRef(null)

    const openMapDialog = () => {
        setData(intAddressData)
        setState({ ...state, openGeolocation: true })
    }

    const controlProps = (item) => ({
        onChange: (event) => setState({ ...state, controlAddress: event.target?.value }),
        checked: state.controlAddress == item,
        value: item,
        name: "id",
    });

    const onChangeAddress = ({ selectedRowKeys = [] }) => {
        if (selectedRowKeys.length > 0) {
            const selected = selectedRowKeys[0];
            setData({ ...selected, ColoniaId: selected.ColoniaId, saved: true })
            tabsControl(addressCtrl.add)
        }
    }

    const requestAddress = async (client = clientData) => {
        const { lat, lng, status } = await getLatLong()

        const reqBody = { ...data, clientePedidosId: client.clientePedidosId }
        const response = await Request._post(route('direccion-pedidos.store'),
            !status ? reqBody : { ...reqBody, latitud: lat, longitud: lng },
            {
                success: { message: 'Dirección guardada' },
                error: { message: 'Error al guardar dirección' }
            }
        )
        response.productos && setState({ ...state, products: response.productos })
        response.direccion && setData({ ...data, ...response.direccion, saved: true })
    }

    const getLatLong = async () => {
        try {
            const mainCity = state.cities.find(city => city.idMunicipio == data.municipio)?.descripcionMunicipio
            const mainState = state.states.find(city => city.idEstado == data.estado)?.descripcionEstado
            const stringData = `${data.calle} ${data.zipCode}, ${mainCity}, ${mainState}`
            const res = await geocodeByAddress(stringData)

            const { lat, lng } = await getLatLng(firstObj(res))
            return { lat, lng, status: true }
        } catch (error) {
            return { lat: null, lng: null, status: false }
        }
    }

    const saveAddress = async () => {
        if (clientData.clientePedidosId) {
            await requestAddress(clientData)
        } else {
            const cliRes = await Request._post(route('clientes-pedidos.store'), clientData, {
                error: { message: 'Error al crear cliente' }
            })
            if (cliRes.cliente) {
                setClientData({ ...data, ...cliRes.cliente, saved: true })
                await requestAddress(cliRes.cliente)
            }
        }
    }

    const editAddress = async () => {
        const { lat, lng, status } = await getLatLong()

        const reqBody = { ...data }
        const response = await Request._put(route('direccion-pedidos.update', data.direccionPedidosId),
            !status ? reqBody : { ...reqBody, latitud: lat, longitud: lng },
            {
                success: { message: 'Dirección actualizada' },
                error: { message: 'Error al guardar dirección' }
            }
        )
        response.productos && setState({ ...state, products: response.productos })
    }

    const searchClientAddress = async () => {
        const response = await Request._post(route('clientes-pedidos.search'), busqueda,
            { error: { message: "No se encontraron registros." }, success: { message: "Registros obtenidos." } }
        )
        setClientesRes(response.clientes)
    }

    const selectClientAddress = (item) => {
        setClientData({ ...clientData, telefono: item.telefono })
    }

    const initializeMap = (latitud = 1.1111, longitud = 1.1111) => {
        try {
            const newMap = new google.maps.Map(mapRef.current, {
                center: { lat: latitud, lng: longitud },
                zoom: 19,
            });
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                initializeMap()
            }, 2000)
        }
    }, [mapRef]);

    return (
        <>
            <div className="grid grid-cols-6 w-full p-2 gap-x-2 ">
                <div className="col-span-full">
                    <div className="flex flex-col p-2 text-center gap-2">
                        <ControlPanelComp
                            option1='Dirección'
                            option2='Ver Direcciones'
                            option3='Buscar'
                            icon1={(<Navigation />)}
                            icon2={(<List />)}
                            icon3={(<Search />)}
                            controlProps={controlProps}
                        />
                    </div>
                </div>
                {(state.controlAddress == addressCtrl.add) && <>
                    <div className="col-span-full grid grid-cols-12 gap-x-2">
                        <div className="flex col-span-full justify-between">
                            <div className="flex flex-col justify-center">
                                <span className="text-xl mt-2">Dirección</span>
                                {/* <span className="text-xl mt-2">Dirección: {data.direccionPedidosId}</span> */}
                            </div>
                            <div className="col-span-full flex gap-2">
                                <ButtonComp onClick={() => setData(intAddressData)} tooltip={'Limpiar'} color='#036cf5' label={<DeleteSweep />} />
                                <ButtonComp
                                    onClick={() => openMapDialog()}
                                    tooltip={'Consultar geomapa'}
                                    disabled={data.saved}
                                    color={!data.saved ? '#0e4365' : disabledColor}
                                    label={<WrongLocation />}
                                />
                                <ButtonComp
                                    onClick={!data.saved ? saveAddress : editAddress}
                                    tooltip={!data.saved ? 'Guardar' : 'Editar'}
                                    color={!data.saved ? primaryColor : secondaryColor}
                                    label={!data.saved ? <Add /> : <EditNote />}
                                />
                            </div>
                        </div>
                        <FieldDrawer
                            fields={[
                                {
                                    input: true,
                                    label: 'Calle',
                                    value: data.calle || '',
                                    style: 'col-span-6',
                                    onChangeFunc: (e) => setData({ ...data, calle: e.target.value })
                                },
                                {
                                    input: true,
                                    label: 'No. Ext',
                                    value: data.numeroExterior || '',
                                    style: 'col-span-3',
                                    onChangeFunc: (e) => setData({ ...data, numeroExterior: e.target.value })
                                },
                                {
                                    input: true,
                                    label: 'No. Int',
                                    value: data.numeroInterior || '',
                                    style: 'col-span-3',
                                    onChangeFunc: (e) => setData({ ...data, numeroInterior: e.target.value })
                                },
                                {
                                    input: true,
                                    label: 'Entre calle',
                                    value: data.entrecalle1 || '',
                                    style: 'col-span-4',
                                    onChangeFunc: (e) => setData({ ...data, entrecalle1: e.target.value })
                                },
                                {
                                    input: true,
                                    label: 'Y calle',
                                    value: data.entrecalle2 || '',
                                    style: 'col-span-4',
                                    onChangeFunc: (e) => setData({ ...data, entrecalle2: e.target.value })
                                },
                                {
                                    input: true,
                                    label: 'C.P.',
                                    value: data.zipCode || '',
                                    style: 'col-span-4',
                                    onChangeFunc: (e) => {
                                        (e.target.value.length < 6) && setData({
                                            ...data,
                                            zipCode: e.target.value.replace(/\D/g, "").slice(0, 5),
                                            estado: '',
                                            municipio: '',
                                            ColoniaId: ''
                                        })
                                    }
                                },
                                {
                                    select: true,
                                    small: true,
                                    options: state.states,
                                    data: 'descripcionEstado',
                                    valueKey: 'idEstado',
                                    label: 'Estado.',
                                    value: data.estado,
                                    style: 'col-span-6',
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        estado: e,
                                        municipio: '',
                                        ColoniaId: ''
                                    })
                                },
                                {
                                    select: true,
                                    small: true,
                                    options: data.estado ? state.cities.filter(c => c.idestado == data.estado) : state.cities,
                                    data: 'descripcionMunicipio',
                                    valueKey: 'idMunicipio',
                                    label: 'Ciudad',
                                    value: data.municipio,
                                    style: 'col-span-6',
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        municipio: e,
                                        ColoniaId: ''
                                    })
                                },
                                {
                                    select: true,
                                    small: true,
                                    options: data.municipio ?
                                        state.suburbs.filter(s => {
                                            if (data.zipCode.length == 5)
                                                return s.Colonia_IdMunicipio == data.municipio && s.c_CodigoPostal == data.zipCode
                                            return s.Colonia_IdMunicipio == data.municipio
                                        })
                                        : state.suburbs,
                                    data: 'Colonia_Nombre',
                                    valueKey: 'Colonia_Id',
                                    label: 'Colonia.',
                                    value: data.ColoniaId,
                                    style: 'col-span-full',
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        ColoniaId: e
                                    })
                                },
                                {
                                    input: true,
                                    label: 'Referencias',
                                    value: data.Referencias || '',
                                    style: 'col-span-full',
                                    onChangeFunc: (e) => setData({ ...data, Referencias: e.target.value })
                                },
                            ]}
                        />
                    </div>
                </>}
                {(state.controlAddress == addressCtrl.list) && <>
                    <div id='addressTable' className='flex flex-col col-span-full '>
                        <Datatable
                            data={clientData.direccion_pedidos}
                            virtual={true}
                            selection={{ mode: 'single' }}
                            selectedData={clientData.direccion_pedidos
                                .filter(dp => dp.direccionPedidosId == data.direccionPedidosId)}
                            // selectionFunc={({ selectedRowKeys }) => setData(selectedRowKeys)}
                            selectionFunc={onChangeAddress}
                            columns={[
                                // { width: '38%', header: 'Direccion', accessor: 'direccionPedidosId' },
                                { width: '30%', header: 'Calle', accessor: 'calle' },
                                { width: '25%', header: 'Referencia', accessor: 'Referencias' },
                                { width: '25%', header: '# Ext', accessor: 'numeroExterior' },
                                {
                                    width: '20%', header: 'Acciones', cell: ({ item }) => <>
                                        <Tooltip title='Hacer pedido en ruta' >
                                            <Link to={'/pedidos-ruta'} state={{ item: item, showPedido: false }} >
                                                <span className='material-icons'>propane_tank</span>
                                            </Link>
                                        </Tooltip>
                                    </>
                                }
                            ]}
                        />
                    </div>
                </>}

                {(state.controlAddress == addressCtrl.search) && <>

                    <div className="col-span-full grid grid-cols-3 gap-x-2">
                        <FieldDrawer
                            fields={[
                                {
                                    input: true,
                                    label: "Calle",
                                    value: busqueda.calle || "",
                                    onChangeFunc: (e) => setBusqueda({ ...busqueda, calle: e.target.value })
                                },
                                {
                                    input: true,
                                    label: "Numero exterior",
                                    value: busqueda.numeroExterior || "",
                                    onChangeFunc: (e) => setBusqueda({ ...busqueda, numeroExterior: e.target.value })
                                },
                                {
                                    custom: true,
                                    customItem: (e) => {
                                        return <>
                                            <ButtonComp
                                                label={<div className='flex gap-2'><Search />buscar</div>}
                                                onClick={searchClientAddress}
                                            />
                                        </>
                                    }
                                },
                            ]}
                        />

                        <div className='my-3 col-span-full'>
                            <Datatable
                                data={clientesRes}
                                virtual={true}
                                searcher={false}
                                columns={[
                                    {
                                        header: "Cliente",
                                        accessor: ["Nombre", "Apellido1", "Apellido2"],
                                        width: '70%',
                                    },
                                    // { width: '70%', header: 'Cliente', accessor: 'direccionPedidosId' },
                                    {
                                        width: '30%', header: 'Acciones', cell: ({ item }) => <div>

                                            <Tooltip title='Seleccionar' >
                                                <button onClick={() => selectClientAddress(item)}>
                                                    <Add />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title={
                                                <div className='non-selectable' style={{ zoom: 1.5, }}>
                                                    <p>N° Exterior: {item.numeroExterior}</p>
                                                    <p>Colonia: {item.Colonia_Nombre}</p>
                                                    <p>Locacion: {item.descripcionMunicipio}</p>
                                                    <p>Estado: {item.descripcionEstado}</p>
                                                    <p>Empresa: {item.nombreNegocio}</p>
                                                </div>
                                            }>
                                                <Info />
                                            </Tooltip>
                                        </div>
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </>}
            </div>

            <div className='hidden'>
                <GooglePlacesAutocomplete
                    apiKey="AIzaSyDiRJzPGa1pnDYNn7fLzoVKI6xhZDP5bm4" // Reemplaza con tu clave de API de Google
                    placeholder="Escribe la dirección"
                />
                <div id="mapTemp" ref={mapRef} style={{ height: "600px", width: "100%" }} />
            </div>

        </>
    )
}