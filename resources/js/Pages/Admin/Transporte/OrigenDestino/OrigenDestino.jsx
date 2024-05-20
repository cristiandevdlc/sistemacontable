import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng, } from "react-google-places-autocomplete";
import TextInput from '@/components/TextInput'
import request from '@/utils'
import { useForm } from '@inertiajs/react'
import { useEffect, useState, useRef } from 'react'
import { useCallback } from 'react'
import SelectComp from '@/components/SelectComp';
import LoadingDiv from '@/components/LoadingDiv';

const OrigenDestino = () => {
    const { data, setData } = useForm({ idDistancia: '', idOrigen: '', idDestino: '', DistanciaOrigenDestino: '', TiempoPromedio: '' })
    const [action, setAction] = useState('create')
    const [destinos, setDestinos] = useState([])
    const [origenes, setOrigenes] = useState([])
    const [origenSeleccionado, setOrigenSeleccionado] = useState([])
    const [destinoSeleccionado, setDestinoSeleccionado] = useState([])
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [directions, setDirections] = useState(null);
    const [locationOne, setLocationOne] = useState('')
    const [locationTwo, setLocationTwo] = useState('')
    const [mapsIsLoaded, setMapsIsLoaded] = useState(false)
    const [refreshMapEffect, setRefreshMapEffect] = useState(0)
    const [state, setState] = useState({ loading: true })
    const mapRef = useRef(null);
    const defaultCenter = { lat: 25.535299, lng: -103.375681 }
    const mapStyles = { width: "100%", height: "100%", borderRadius: '10px' };

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
    }, []);

    function obtenerMinutos(cadena) {
        let dias = 0;
        let horas = 0;
        let minutos = 0;
        const diasRegex = /(\d+)\s*día/;
        const horasRegex = /(\d+)\s*h/;
        const minutosRegex = /(\d+)\s*min/;
        const diasMatch = cadena.match(diasRegex);
        const horasMatch = cadena.match(horasRegex);
        const minutosMatch = cadena.match(minutosRegex);
        if (diasMatch) {
            dias = parseInt(diasMatch[1], 10);
        }

        if (horasMatch) {
            horas = parseInt(horasMatch[1], 10);
        }

        if (minutosMatch) {
            minutos = parseInt(minutosMatch[1], 10);
        }
        const totalMinutos = (dias * 24 * 60) + (horas * 60) + minutos;
        return totalMinutos;
    }

    const renderDirections = () => {
        if (locationOne === '') {
            return
        }
        if (locationTwo === '') {
            return
        }
        if (locationOne !== null && locationTwo !== null) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route({
                origin: locationOne,
                destination: locationTwo,
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                    const { distance: dist, duration: dur } = result.routes[0].legs[0];
                    setData({ ...data, DistanciaOrigenDestino: Math.floor(Number(dist.text.replace(/[^\d.]/g, ''))), TiempoPromedio: obtenerMinutos(dur.text) })
                    setDistance(dist.text);
                    setDuration(dur.text);
                } else {
                    console.error(`Error fetching directions ${result}`);
                }
            });
        }
    };

    const fetchOrigenDestino = async () => {
        const destinosRes = await request(route('transporte-destino.index'))
        const origenesRes = await request(route('transporte-origen.index'))
        const destinos = destinosRes.map((item) => {
            return { ...item, toSelect: item.RFCDestino + ' - ' + item.NombreRFCDestino }
        })
        const origenes = origenesRes.map((item) => {
            return { ...item, toSelect: item.RFCOrigen + ' - ' + item.NombreRFCOrigen }
        })
        setOrigenes(origenes)
        setDestinos(destinos)
    }

    const handlePlaceSelect = (place) => {
        geocodeByAddress(place)
            .then((results) => {
                if (results && results.length > 0) {
                    const firstResult = results[0];
                    return getLatLng(firstResult);
                } else {
                    console.log("no se hizo el getLatLng")
                }
            })
    }

    const verificarRelacion = async () => {
        const response = await request(route('transporte-origen-destino.show', `${origenSeleccionado[0].idOrigen},${destinoSeleccionado[0].idDestino}`))
        if (Object.keys(response).length !== 0) {
            setData({ idDistancia: response?.idDistancia || '', idOrigen: response?.idOrigen || '', idDestino: response?.idDestino || '', DistanciaOrigenDestino: response?.DistanciaOrigenDestino || '', TiempoPromedio: response?.TiempoPromedio || '' })
            setAction('edit')
        } else {
            setAction('create')

        }
    }

    const seleccionarOrigen = (item) => {
        setOrigenSeleccionado(item)
        setData({ ...data, idOrigen: item.idOrigen })
        setLocationOne(`${item.Calle} ${item.NumExterior}, ${item.colonia.Colonia_Nombre}, ${item.municipio.descripcionMunicipio}, ${item.estado.descripcionEstado}, ${item.pais.descripcionPais}`)
    }

    const seleccionarDestino = (item) => {
        setDestinoSeleccionado(item)
        setData({ ...data, idDestino: item.idDestino })
        setLocationTwo(`${item.Calle} ${item.NumExterior}, ${item.colonia.Colonia_Nombre}, ${item.municipio.descripcionMunicipio}, ${item.estado.descripcionEstado}, ${item.pais.descripcionPais}`)
    }

    const resetData = () => {
        setData({ idDistancia: '', idOrigen: '', idDestino: '', DistanciaOrigenDestino: '', TiempoPromedio: '' })
    }

    const submit = async () => {
        if (action === 'create') {
            await request(route('transporte-origen-destino.store'), 'POST', data)
            fetchOrigenDestino()
            resetData()
            setOrigenSeleccionado([])
            setDestinoSeleccionado([])
        } else if (action === 'edit') {
            await request(route('transporte-origen-destino.update', data.idDistancia), 'PUT', data)
            fetchOrigenDestino()
            resetData()
            setOrigenSeleccionado([])
            setDestinoSeleccionado([])
            setAction('create')
        }
    }

    useEffect(() => {
        if (data.TiempoPromedio === '' && data.DistanciaOrigenDestino === '') {
            setOrigenSeleccionado([])
            setDestinoSeleccionado([])
            setAction('create')
        }
    }, [data.TiempoPromedio, data.DistanciaOrigenDestino])

    useEffect(() => {
        fetchOrigenDestino()
    }, [])

    useEffect(() => {
        if (origenes && destinos) setState({ ...state, loading: false })
    }, [origenes, destinos])

    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.Map) {
            setRefreshMapEffect(refreshMapEffect + 1)
            return;
        } else {
            setMapsIsLoaded(true)
            renderDirections()
        }
    }, [locationOne, locationTwo, refreshMapEffect]);

    useEffect(() => {
        if (origenSeleccionado.length > 0 && destinoSeleccionado.length > 0) {
            setData({ ...data, idDestino: destinoSeleccionado[0].idDestino, idOrigen: origenSeleccionado[0].idOrigen })
            verificarRelacion()
        }
    }, [destinoSeleccionado, origenSeleccionado])

    return (
        <div className='relative h-[100%] pb-4 px-3 overflow-auto blue-scroll'>
            {state.loading && <LoadingDiv />}
            {!state.loading &&
                <div className='flex gap-6 sm:flex-col md:flex-row'>
                    <div className='flex flex-col min-w-[30vh] gap-4'>
                        <div className='border-2 w-full shadow-md px-4 pb-3 rounded-xl'>
                            <SelectComp
                                label="Origen"
                                virtual={true}
                                options={origenes}
                                value={origenSeleccionado.idOrigen || ''}
                                data="toSelect"
                                valueKey="idOrigen"
                                onChangeFunc={(origen, obj) => {
                                    // console.log(obj)
                                    seleccionarOrigen(obj)
                                }}
                            />
                            <SelectComp
                                label="Destino"
                                virtual={true}
                                options={destinos}
                                value={destinoSeleccionado.idDestino || ''}
                                data="toSelect"
                                valueKey="idDestino"
                                onChangeFunc={(destino, obj) => {
                                    seleccionarDestino(obj)
                                }}
                            />
                            <TextInput
                                label="Tiempo en minutos"
                                type="text"
                                value={data.TiempoPromedio || duration.replace(/[^\d.]/g, '') || ''}
                                onChange={(e) => setData({ ...data, TiempoPromedio: e.target.value })}
                                className="texts"
                            />
                            <TextInput
                                label="Distancia en KM"
                                type="text"
                                value={data.DistanciaOrigenDestino || distance.replace(/[^\d.]/g, '') || ""}
                                onChange={(e) => setData({ ...data, DistanciaOrigenDestino: e.target.value })}
                                className="texts"
                            />
                            {
                                action === 'create' ? (
                                    <div className='w-full'>
                                        <button className='bg-[#1B2654] text-white rounded-[10px] mt-5 w-full block py-2' onClick={submit} >Crear</button>
                                    </div>
                                ) : (
                                    <div className='w-full'>
                                        <button className='bg-[#1B2654] text-white rounded-[10px] mt-5 w-full block py-2' onClick={submit} >Editar</button>
                                    </div>
                                )
                            }
                            <div className='w-full'>
                                <button className='bg-[#FC4C02] text-white rounded-[10px] mt-5 w-full block py-2' onClick={() => {
                                    resetData()
                                    setDuration('')
                                    setDistance('')
                                    setDirections(null)
                                    setOrigenSeleccionado([])
                                    setDestinoSeleccionado([])
                                    setAction('create')
                                }} >Limpiar selección</button>
                            </div>
                        </div>
                    </div>
                    {/* <div className='col-span-3'>
                    <div>
                        <h3 className='text-center text-2xl'>Ubicación de origen</h3>
                    </div>
                    <Datatable
                        tableId="tablaOrigenes"
                        data={origenes}
                        rowId="idOrigen"
                        virtual={true}
                        selection='single'
                        columns={[{ header: 'RFC Destino', accessor: 'RFCOrigen' }, { header: 'Descripcion', accessor: 'NombreRFCOrigen' },]}
                        selectedData={[origenSeleccionado[0]?.idOrigen]}
                        selectionFunc={seleccionarOrigen}
                    />
                </div>
                <div className='col-span-3'>
                    <div>
                        <h3 className='text-center text-2xl'>Ubicación destino</h3>
                    </div>
                    <Datatable
                        tableId="tablaDestinos"
                        data={destinos}
                        rowId="idDestino"
                        virtual={true}
                        selection='single'
                        columns={[{ header: 'RFC Destino', accessor: 'RFCDestino' }, { header: 'Descripcion', accessor: 'NombreRFCDestino' },]}
                        selectedData={[destinoSeleccionado[0]?.idDestino]}
                        selectionFunc={seleccionarDestino}
                    />
                </div> */}
                    <div className='border-2 w-full sm:h-[70vh] md:h-[90vh] shadow-sm rounded-xl p-2'>
                        <div className='pb-6  hidden'>
                            <GooglePlacesAutocomplete selectProps={{ onChange: handlePlaceSelect }} apiKey="AIzaSyDiRJzPGa1pnDYNn7fLzoVKI6xhZDP5bm4" />
                        </div>
                        {
                            mapsIsLoaded && (
                                <GoogleMap mapContainerStyle={mapStyles} zoom={5} center={defaultCenter} onLoad={onLoad}>
                                    {directions && <DirectionsRenderer directions={directions} />}
                                </GoogleMap>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default OrigenDestino