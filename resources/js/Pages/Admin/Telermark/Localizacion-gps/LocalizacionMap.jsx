import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import ImagenCamion from './img/camion-de-aceite.png'
import DialogComp from "@/components/DialogComp";
import { Assignment } from '@mui/icons-material';
import { Button, Badge } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const center = {
    lat: 25.50108477793966,
    lng: -103.3670574816098,
};

export default function LocalizacionMap({ state, setData = () => { } }) {
    const [mapCenter, setMapCenter] = useState(center);
    const [open, setOpen] = useState(false)
    const [infoTooltip, setInfoTooltip] = useState(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDiRJzPGa1pnDYNn7fLzoVKI6xhZDP5bm4"
    })
    const mapRef = useRef(null);

    const handleMarkerClick = (clickedLocation = null) => setInfoTooltip(clickedLocation);

    const getPendient = async (newData) => {
        setData(prev => ({ ...prev, ...newData, refresh: true }))
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
        console.log("state",state)
        if (mapRef.current) {
            setTimeout(() => {
                initializeMap()
            }, 2000)
        }
    }, [mapRef]);

    return (
        <>
            <div className="border-2 w-full sm:h-[70vh] md:h-[90vh] shadow-sm rounded-xl">
                <div className='relative h-[100%] w-full p-2'>
                    {state?.withoutGps?.length > 0 && (
                        <div style={{ position: 'absolute', top: '10%', right: '2%', zIndex: '1000' }}>
                            <Button type='button' variant="contained" color="error" onClick={() => setOpen(true)}>
                                UNIDADES SIN GPS
                            </Button>
                        </div>
                    )}
                    
                    {isLoaded && <GoogleMap
                        center={mapCenter} // Punto de inicio del mapa
                        zoom={13}
                        ref={mapRef}
                        mapContainerStyle={{ width: "100%", height: "100%", borderRadius: '10px' }}
                        options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            styles: [{
                                featureType: 'poi',
                                stylers: [{ visibility: 'off' }], // Desactivar puntos de interés (POI)
                            }],
                        }}
                    >
                        {state.withGps?.map((location, index) => (
                            <div key={index}>
                                <Marker
                                    key={Number(location.unidad)}
                                    position={{ lat: Number(location.latitud), lng: Number(location.longitud) }}
                                    title={location.Unidad}
                                    onClick={() => handleMarkerClick(location)}
                                    icon={{
                                        url: ImagenCamion,
                                        scaledSize: new window.google.maps.Size(40, 40),
                                    }}
                                />
                            </div>
                        ))}
                        {infoTooltip && (
                            <InfoWindow position={{ lat: Number(infoTooltip.latitud), lng: Number(infoTooltip.longitud) }} onCloseClick={() => handleMarkerClick()}>
                                <div className=" rounded-lg border border-gray-100 shadow-sm">
                                    <dl className="divide-y divide-gray-100 text-sm">
                                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 ">
                                            <dt className="font-medium text-gray-900">Operador:</dt>
                                            <dd className="text-gray-700 sm:col-span-2">{infoTooltip.Operador}</dd>
                                        </div>

                                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">Unidad:</dt>
                                            <dd className="text-gray-700 sm:col-span-2">{infoTooltip.Unidad}</dd>
                                        </div>

                                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">Ruta</dt>
                                            <dd className="text-gray-700 sm:col-span-2">{infoTooltip.Ruta}</dd>
                                        </div>

                                        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                                            <dt className="font-medium text-gray-900">Servicios pendientes:</dt>
                                            <dd className="text-gray-700 sm:col-span-2">
                                                <Badge badgeContent={infoTooltip.PedidosPendientes} color="primary">
                                                    <Assignment color="action" />
                                                </Badge></dd>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            <Button type='button' variant="contained" className="!bg-primary-color" onClick={() => getPendient({
                                                unidad: infoTooltip.idunidad,
                                                ruta: infoTooltip.idRuta
                                            })}>
                                                Buscar
                                            </Button>
                                        </div>
                                    </dl>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>}
                </div>
            </div>

            <DialogComp
                dialogProps={{
                    model: 'Unidades sin GPS',
                    width: 'sm',
                    customTitle: true,
                    openState: open,
                    openStateHandler: () => setOpen(false),
                    customAction: () => <>
                        <Button type='button' color="error" onClick={() => setOpen(false)}>
                            Cerrar
                        </Button> </>
                }}
                fields={[
                    {
                        custom: true,
                        customItem: () => (
                            <>
                                <ul className="grid grid-cols-2 gap-3">
                                    {state.withoutGps?.map((unidad, index) => (
                                        <li key={index}>
                                            <a className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                                                Unidad: {unidad.unidad}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )
                    }
                ]}
            />
        </>
    )
}