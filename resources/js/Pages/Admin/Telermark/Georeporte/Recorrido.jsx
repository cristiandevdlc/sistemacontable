import '../../../../../sass/FormsComponent/_checkbox.scss'
import SelectComp from '@/components/SelectComp';
import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import request from '@/utils';
import GeoMapaImg from './img/Camiongif.gif';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Button, Dialog, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Recorrido({ changeType }) {
    const { isLoaded } = useJsApiLoader({ id: "google-map-script", googleMapsApiKey: "AIzaSyDiRJzPGa1pnDYNn7fLzoVKI6xhZDP5bm4" });
    const [data, setData] = useState({ unidad: 0 });
    const [unidad, setUnidad] = useState([]);
    const [unidades, setUnidades] = useState();
    const [locacion, setLocacion] = useState([]);
    const [map, setMap] = useState(null);
    const [flightPath, setFlightPath] = useState(null);

    const fields = [
        { label: 'N° SERIE', value: unidad.unidad_NumSerie || 'S/N SERIE' },
        { label: 'PERMISO CRE', value: unidad.unidad_permisoCRE || 'S/N PERMISO CRE' },
        { label: 'TIPO DE SERVICIO', value: unidad.tipo_servicio?.tipoServicio_descripcion || 'S/N TIPO DE SERVICIO' },
        { label: 'PLACA', value: unidad.unidad_placa || 'S/N PLACA' },
        { label: 'AREAS', value: unidad.areas?.AF_Nombre || 'S/N AREA' },
        { label: 'CILINDROS', value: unidad.unidad_Cilindros || 'S/N CILINDROS' },
        { label: 'FECHA DE ALTA', value: unidad.unidad_fechaAlta || 'S/N FECHA DE ALTA' },
        { label: 'AÑO', value: unidad.unidad_año || 'S/N AÑO' },
    ];

    const Recorrido = async (e) => {
        const response = await fetch(route('Recorrido'), { method: "POST", body: JSON.stringify({ unidad: data.unidad }), headers: { "Content-Type": "application/json" } });
        if (response.ok) {
            const data = await response.json();
            data && Object.keys(data).length > 0 ? (setLocacion(data), showNotification('Se encontro recorrido', 'success', 'metroui', 'bottomRight', 2000)) : (showNotification('No se encontraron Unidades', 'error', 'metroui', 'bottomRight', 2000), setLocacion([]));

        } else {
            console.error("Error en la solicitud:", response.status, response.statusText);
        }
    };


    const GetUnidades = async () => {
        const requestData = await request(route("unidades.index"), 'GET')
        setUnidades(requestData);
    };
    useEffect(() => {
        GetUnidades();
    }, []);


    useEffect(() => {
        if (unidades) {
            const unidadEncontrada = unidades.find(item => item.unidad_idUnidad === data.unidad);
            unidadEncontrada && setUnidad(unidadEncontrada);
            Recorrido();
        }
    }, [data.unidad, unidades]);



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

                const newFlightPath = new window.google.maps.Polyline({
                    path: locacion,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });
                newFlightPath.setMap(newMap);

                setMap(newMap);
                setFlightPath(newFlightPath);
            } else {
                showNotification('Google Maps API not loaded or Map constructor is not available.', 'error', 'metroui', 'bottomRight', 2000)
            }
        }

        initMap();
    }, [locacion]);


    function handleClickReturn() {
        changeType(0); // Cambia el estado type a 1
    }

    return (
        <>
            <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
                <div className="flex flex-col h-[90vh] overflow-y-auto sm:max-w-[100%] md:max-w-[18%] w-full blue-scroll gap-3 px-1 pb-2">
                    <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                        <div className='mt-4 gap-4' onClick={handleClickReturn}>
                            <Tooltip title="Regresar a GeoMapa">
                                <div>
                                    <KeyboardReturnIcon />
                                </div>
                            </Tooltip>
                        </div>

                        <SelectComp
                            label="UNIDAD"
                            options={unidades}
                            value={data.unidad}
                            onChangeFunc={(newValue) => {
                                setData({ ...data, unidad: newValue });
                            }}
                            data="unidad_numeroComercial"
                            valueKey="unidad_idUnidad"
                        />
                        <br />

                        <div className='flex flex-col  bg-[#1B2654]  p-4 rounded-xl text-white text-[12px] gap-2'>
                            <div>
                                {fields.map((field, index) => (
                                    <div key={index} className='flex justify-between pt-4'>
                                        <span>{field.label}: </span>
                                        {field.value}
                                    </div>
                                ))}

                                <div className='flex justify-between pt-4'>
                                    <span>ESTATUS </span>
                                    <div className='relative w-[90px] h-[20px]'>
                                        <div className="absolute rounded-full h-[50%] w-[100%] top-0 left-0"  style={{ background: fields.Estatus === '0' ? '#FF0000' : 'green' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col w-full gap-2 items-stretch' >
                    <div className="w-full monitor-table" >
                        <div className=" w-full sm:h-[70vh] md:h-[90vh] shadow-sm rounded-xl">
                            <div className='relative h-[100%] w-full p-2'>
                                <div id="map" style={{ height: "800px", width: "100%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); }
