import '../../../../../sass/FormsComponent/_checkbox.scss'
import SelectComp from '@/components/SelectComp';
import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, MarkerClusterer, Polyline } from "@react-google-maps/api";
import request from '@/utils';
import TextInput from "@/components/TextInput";

import imgPortatil10 from './img/P1.png'
import imgPortatil20 from './img/P2.png'
import imgPortatil30 from './img/45.png'
import imgPortatil45 from './img/P5.png'
import imgRecarga from './img/RE.png'
import imgServicio from './img/SE.png'
import imgCilindro from './img/CI.png'
import imgCarburacion from './img/CA.png'
import imgEstacionario from './img/E.png'
import imgMontacargas from './img/mm.png'

import SearchIcon from '@mui/icons-material/Search';
import LoadingDiv from "@/components/LoadingDiv";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Button, Dialog, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom'
export default function GeoMapa({ changeType }) {
    const { isLoaded } = useJsApiLoader({ id: "google-map-script", googleMapsApiKey: "AIzaSyDiRJzPGa1pnDYNn7fLzoVKI6xhZDP5bm4" });
    const [loading, setLoading] = useState(true)
    const [vendedores, setVendedores] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [estatus, setEstatus] = useState([]);
    const [locacion, setLocacion] = useState([]);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [markers, setMarkers] = useState([]);

    const [georeporte, setGeoreporte] = useState([]);
    const today = new Date().toISOString().split('T')[0];
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const minDate = oneMonthAgo.toISOString().split('T')[0];

    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const formatoFechaSQL = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fechaHoyString = hoy.toLocaleDateString('es-ES', formatoFechaSQL).split('/').reverse().join('-');
    const fechaAyerString = ayer.toLocaleDateString('es-ES', formatoFechaSQL).split('/').reverse().join('-');

    const [data, setData] = useState({ turno: 0, fecha: fechaAyerString, fecha2: fechaHoyString, vendedor: 0, unidad: 0, estatus: 0, producto: 0 });
    const [clusterActive, setClusterActive] = useState(true);

    const [servicios, setServicios] = useState([
        { id: 1, nombre: 'Portatil 10KG', imagen: imgPortatil10, status: 1 },
        { id: 2, nombre: 'Portatil 20KG', imagen: imgPortatil20, status: 1 },
        { id: 3, nombre: 'Portatil 30KG', imagen: imgPortatil30, status: 1 },
        { id: 4, nombre: 'Portatil 45KG', imagen: imgPortatil45, status: 1 },
        { id: 5, nombre: 'Cilindro M.', imagen: imgCilindro, status: 1 },
        { id: 6, nombre: 'Estacionario', imagen: imgEstacionario, status: 1 },
        { id: 7, nombre: 'Carburacion', imagen: imgCarburacion, status: 1 },
        { id: 8, nombre: 'Recarga', imagen: imgRecarga, status: 1 },
        { id: 9, nombre: 'Servicio T.', imagen: imgServicio, status: 1 },
        { id: 1039, nombre: 'Montacargas', imagen: imgMontacargas, status: 1 },
    ]);


    const GetVendedores = async () => {
        const requestData = await request(route("persona.vendedores"), 'GET')
        setVendedores(requestData);
    };
    const GetTurnos = async () => {
        const requestData = await request(route("turno.index"), 'GET')
        setTurnos(requestData);
    };
    const GetEstatus = async () => {
        const requestData = await request(route("estatus.index"), 'GET')
        setEstatus(requestData);
    };
    const GetServicios = async () => {
        const responseE = await fetch(route("productos.index"));
        const dataE = await responseE.json();
        const normalizeName = nombre => nombre.trim().toLowerCase();
        const serviciosActualizados = servicios.map(servicio => {
            const nombreServicioNormalizado = normalizeName(servicio.nombre);
            const productoEncontrado = dataE.find(producto => normalizeName(producto.producto_nombre) === nombreServicioNormalizado);
            return productoEncontrado ? { ...servicio, id: productoEncontrado.producto_idProducto } : servicio;
        });
        setServicios(serviciosActualizados);
    };

    const FiltroMarcador = async (e) => {
        const updatedServicios = servicios.map(s => (s.id === e ? { ...s, status: s.status === 1 ? 0 : 1 } : s));
        setServicios(updatedServicios);
        const idsServiciosConStatusUno = updatedServicios
            .filter(servicio => servicio.status === 1)
            .map(servicio => servicio.id);

        idsServiciosConStatusUno.length === 0
            ? setLocacion(georeporte)
            : setLocacion(georeporte.filter(item => idsServiciosConStatusUno.some(id => id === Number(item.productoId))));

        // const FilterProducto = georeporte.filter(item => idsServiciosConStatusUno.some(id => id === Number(item.productoId)));
        // FilterProducto ? (setLocacion(FilterProducto), showNotification('Filtrado Exitoso', 'success', 'metroui', 'bottomRight', 2000)) : showNotification('No se pudo filtrar por producto', 'error', 'metroui', 'bottomRight', 2000);
    };

    function handleClickReturn() {
        changeType(0); // Cambia el estado type a 1
    }


    const Georeporte = async () => {
        markers.forEach(marker => { marker.setMap(null); });

        setMarkers([]); // Limpia el array de marcadores
        const response = await request(route('Georeporte'), "POST",
            {
                turno: data.turno,
                vendedor: Number(data.vendedor),
                unidad: data.unidad,
                estatus: data.estatus,
                fechaInicio: data.fecha,
                fechaFin: data.fecha2
            },
            {
                enabled: true,
                error: { message: 'Ha ocurrido un error', type: 'error' },
                success: { message: 'Buscando pedidos', type: 'success' }
            }
        );
        setGeoreporte(response);

        const idsServiciosConStatusUno = servicios
            .filter(servicio => servicio.status === 1)
            .map(servicio => servicio.id);

        idsServiciosConStatusUno.length === 0
            ? setLocacion(response)
            : setLocacion(response.filter(item => idsServiciosConStatusUno.some(id => id === Number(item.productoId))));
    };

    useEffect(() => {
        function initMap() {
            if (window.google && typeof window.google.maps.Map === "function") {
                const newMap = new window.google.maps.Map(document.getElementById("map"), {
                    zoom: 10,
                    center: { lat: 25.50108477793966, lng: -103.3670574816098 },
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }], }],
                });

                const markers = locacion.map((item) => {
                    const latLng = new window.google.maps.LatLng(parseFloat(item.latitud), parseFloat(item.longitud));
                    let markerIconUrl = imgPortatil10;
                    switch (item.producto_nombre) {
                        case "Portatil 10KG":
                            markerIconUrl = imgPortatil10;
                            break;
                        case "Portatil 20KG":
                            markerIconUrl = imgPortatil20;
                            break;

                        case "Portatil 30KG":
                            markerIconUrl = imgPortatil30;
                            break;

                        case "Portatil 45KG":
                            markerIconUrl = imgPortatil45;
                            break;

                        case "Estacionario":
                            markerIconUrl = imgEstacionario;
                            break;

                        case "Servicio tecnico":
                            markerIconUrl = imgServicio;
                            break;

                        case "Montacargas":
                            markerIconUrl = imgMontacargas;
                            break;

                        case "Recarga":
                            markerIconUrl = imgRecarga;
                            break;

                        case "Carburacion":
                            markerIconUrl = imgCarburacion;
                            break;

                        case "Cilindro de montarcargas":
                            markerIconUrl = imgCilindro;
                            break;

                        default:
                            markerIconUrl = imgPortatil10;
                            break;
                    }




                    const marker = new window.google.maps.Marker({
                        position: latLng,
                        map: newMap,
                        icon: {
                            url: markerIconUrl,
                        },
                    });

                    // Agregar infoWindow a cada marcador
                    const contentString = `
                      <div>
                        <h3>Folio: ${item.pedidoId} </h3>
                        <p>Cliente:${item.Nombre}  ${item.Apellido1}  ${item.Apellido2}</p>
                        <p>Numero telefonico: ${item.telefono}</p>
                        <p>Fecha pedido: ${item.fechaPedido}</p>
                        <p>Fecha Surtido: ${item.fechaSurtido}</p>
                        <p>Vendedor:${item.Nombres}  ${item.ApePat}  ${item.ApeMat}</p>
                      </div>
                    `;

                    const infowindow = new window.google.maps.InfoWindow({
                        content: contentString,
                    });

                    marker.addListener("click", () => {
                        infowindow.open(map, marker);
                    });

                    return marker;
                });

                // Actualizar el estado de los marcadores después de haberlos creado todos
                setMarker(markers);

                // Actualizar el estado del mapa una vez que se haya inicializado
                setMap(newMap);
                
            } else {
                showNotification('Google Maps API not loaded or Map constructor is not available.', 'error', 'metroui', 'bottomRight', 2000)
            }
        }

        initMap();
    }, [locacion]);



    useEffect(() => {
        GetTurnos();
        GetVendedores();
        GetEstatus();
        GetServicios();
    }, []);


    useEffect(() => {
        if (turnos && vendedores && estatus) setLoading(false)
    }, [turnos, vendedores, estatus])

    return (
        <>
            <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
                <div className="flex flex-col h-[90vh] overflow-y-auto sm:max-w-[100%] md:max-w-[28%] w-full blue-scroll gap-3 px-1 pb-2">

                    <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                        <div className='mt-4 gap-4' onClick={handleClickReturn}>
                            <Tooltip title="Regresar a GeoMapa">
                                <div>
                                    <KeyboardReturnIcon />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-2 ">
                            <TextInput
                                label="Fecha de inicio"
                                type="date"
                                className="block w-full"
                                style={{ padding: '15px', borderRadius: '10px' }}
                                value={data.fecha || ''}
                                min={minDate} // Establecer un mes antes de la fecha actual como la fecha mínima
                                max={today} // Establecer la fecha actual como la fecha máxima
                                onChange={(e) => { setData({ ...data, fecha: e.target.value }) }}
                            />

                            <TextInput
                                label="Fecha de fin"
                                type="date"
                                className="block w-full"
                                style={{ padding: '15px', borderRadius: '10px' }}
                                value={data.fecha2 || ''}
                                min={minDate} // Establecer un mes antes de la fecha actual como la fecha mínima
                                max={today} // Establecer la fecha actual como la fecha máxima
                                onChange={(e) => { setData({ ...data, fecha2: e.target.value, }); }}
                            />
                        </div>

                        <SelectComp
                            label="Turno"
                            options={turnos}
                            value={data.turno || 0}
                            firstOption={true}
                            firstLabel="Todas"
                            onChangeFunc={(e) => { setData({ ...data, turno: e }); }}
                            data="turno_nombreTurno"
                            valueKey="turno_idTurno"
                        />
                        <SelectComp
                            label="Activo"
                            firstOption={true}
                            firstLabel="Todas"
                            options={estatus}
                            value={data.estatus || 0}
                            onChangeFunc={(newValue) => setData({ ...data, estatus: newValue })}
                            data="descripcionestatus"
                            valueKey="estatusid"
                        />

                        <SelectComp
                            label="Vendedor"
                            options={vendedores}
                            firstOption={true}
                            firstLabel="Todas"
                            value={data.vendedor || 0}
                            onChangeFunc={(e) => { setData({ ...data, vendedor: e }); }}
                            data="nombre_completo"
                            valueKey="IdPersona"
                        />

                        <div className="flex flex-col bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', transition: 'box-shadow 0.3s ease, background-color 0.3s ease', backgroundColor: '#1B2654' }}
                            onClick={(e) => { Georeporte() }}
                            onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                            onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }} // Restaura el color de fondo al salir del hover
                        >
                            <span className="flex justify-between items-center">
                                <span>Buscar </span>
                                <SearchIcon />
                            </span>
                        </div>

                        <div class="p-2 w-100 divide-y divide-gray-100 rounded-md " >
                            <div class="p-1">
                                <strong class="block p-2 text-xs font-medium uppercase text-black-400">Tipos de productos: </strong>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                {servicios.map((servicio) => (
                                    <div key={servicio.id} class="p-1">
                                        <div className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm" style={{ backgroundColor: servicio.status === 1 ? '#1B2654' : 'initial', color: servicio.status === 1 ? 'white' : 'initial', }} onClick={() => { FiltroMarcador(servicio.id); }}  >
                                            <img className='scale-24' src={servicio.imagen} alt="" />
                                            <div style={{ textAlign: 'right' }}>{servicio.nombre}</div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                        <button onClick={() => setClusterActive(!clusterActive)}>
                            {clusterActive ? 'Desactivar Clustering' : 'Activar Clustering'}
                        </button>
                    </div>
                </div>

                <div className='flex flex-col w-full gap-2 items-stretch' >
                    <div className="w-full monitor-table" >
                        <div className=" w-full sm:h-[70vh] md:h-[90vh] shadow-sm rounded-xl">
                            <div id="map" style={{ height: "800px", width: "100%" }}></div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); }


