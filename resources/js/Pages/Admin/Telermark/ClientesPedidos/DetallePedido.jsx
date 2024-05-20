import moment from 'moment';
import React from 'react'
import Imagen from './img/Rectangle 354.png'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@mui/material";
import { useState } from 'react'
import request from '@/utils';
import ClearIcon from '@mui/icons-material/Clear';

export default function DetallePedido({ detalles, handleCloseDialog }) {
    const [data, setData] = useState({ fecha: "" });
    const [detalle, setDetalle] = useState(false);
    const [menuPermissionData, setMenuPermissionData] = useState([]); // Store menu permission data
    useEffect(() => {
        Showmenupermission();
        setData({ fecha: detalles.fregistro })
    }, []);

    const changedate = async (inputValue) => {
        const fechaFormateada = new Date(data.fecha).toISOString().slice(0, 19).replace("T", " ");
        const requestBody = { id: detalles.folio, fecha: fechaFormateada };

        const requestData = await request(route("actualizarFechaPedido"), 'POST', requestBody, { enabled: true, success: { type: 'success', message: "Se actualizó la fecha de pedido" } });
        handleCloseDialog("", "");
    }


    const Showmenupermission = async () => {
        try {
            const requestData = await request(route("userMenuPermission"), 'GET');
            setMenuPermissionData(requestData); // Store the menu permission data
            const menuObject = requestData.find(item => item.menu_url === "clientes-pedidos");

            if (menuObject) {
                if (menuObject.pivot.usuarioxmenu_especial === "1") {
                    // console.log("Hola microbio");
                } else {
                    // console.log("No eres un microbio especial.");
                }
            } else {
                console.log("No se encontró ningún objeto con menu_url igual a 'clientes-pedidos'.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const isMicrobioEspecial = () => {
        const menuObject = menuPermissionData.find(item => item.menu_url === "clientes-pedidos");
        return menuObject && menuObject.pivot.usuarioxmenu_especial === "1";
    };

    const renderFechaRegistro = () => {
        if (isMicrobioEspecial()) {
            return (
                <div className='grid grid-cols-2 gap-2 mt-2' style={{ textAlign: 'left', padding: '20px', backgroundColor: '#1B2654', borderRadius: '25px', height: '80%' }}>
                    <div style={{ color: 'white' }}>
                        Reprogramacion del pedido
                        <div style={{ fontFamily: 'monserrat', color: 'white', paddingTop: '10px', fontSize: '10px' }}>
                            <input
                                type="datetime-local"
                                className="block w-full"
                                style={{ border: 'none', height: '50px', width: '100%', color: 'white', backgroundColor: 'transparent', fontSize: '12px' }}
                                value={data.fecha || ''}
                                min="1800-01-01T00:00"
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        fecha: e.target.value,
                                    });
                                }}
                            />
                            <style>{`input[type="datetime-local"]::-webkit-calendar-picker-indicator {filter: invert(1);}`} </style>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', paddingTop: '15px' }}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: 'red', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '90%' }}
                            onClick={changedate}
                        >
                            Cambiar fecha
                        </Button>
                    </div>
                </div>
            );
        }
        return null;
    };


    return (
        <div style={{ borderRadius: '50px', width: '100%', padding: '20px' }}>
            <div style={{ color: "black", fontWeight: "bold", fontSize: "20px", width: "100%" }}>
                Detalle del pedido
            </div>
            <hr />
            <div className='grid grid-cols-2 gap-2 mt-2' style={{ textAlign: 'left', padding: '20px', backgroundColor: '#1B2654', borderRadius: '25px', height: '80%' }}>
                <DetailItem label="Folio" value={detalles.folio} />
                <DetailItem label="Precio" value={`$ ${detalles.precio ? detalles.precio.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null}`} />
                {/* <DetailItem label="Precio de litro" value="Precio no hay" /> */}
               
                <DetailItem label="Fecha de surtido" value={detalles.fsurtido ? moment(detalles.fsurtido).format('DD/MM/YYYY hh:mm:ss A') : "Todavía no se surte"} />
                <DetailItem label="Servicio" value={detalles.servicio == "" ? detalles.servicio : "No hay servicio"} />
                <DetailItem label="Metodo de pago" value={detalles.metodo} />
                <DetailItem label="Cantidad" value={parseFloat(detalles.Cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                <DetailItem label="Total" value={parseFloat(detalles.total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                <DetailItem label="Origen" value={detalles.origen} />
                <DetailItem label="Tipo de pedido (Producto)" value={detalles.producto} />

                <div style={{ color: 'white' }}>
                    Estatus
                    <div
                        style={{
                            width: '100px',
                            height: '2px',
                            backgroundColor: (
                                detalles.estatus === "1"
                                    ? "#46DC00" // Verde
                                    : detalles.estatus === "2"
                                        ? "#FFE601" // Amarillo
                                        : "#FF0000" // Rojo
                            ),

                        }}
                    >{
                            detalles.estatus === "1"
                                ? "CONFIRMADO" // Verde
                                : detalles.estatus === "2"
                                    ? "PENDIENTE" // Amarillo
                                    : "CANCELADO" // Rojo
                        }
                    </div>

                </div>
                <br />
            </div>
            {renderFechaRegistro()}

            {/* <div className='grid grid-cols-2 gap-2 mt-2'>
                <Link to="/localizacion_gps" state={detalles} >
                    <DetailBlock title="Servicios pendientes" image={Imagen} />
                </Link>

                <Link to="/correcion_pedidos" state={detalles} >
                    <DetailBlock title="Correcion de pedidos" image={Imagen} />
                </Link>
            </div> */}
            <button
                type="button"
                class="absolute top-0 right-0 mt-2 mr-2 bg-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => { handleCloseDialog("", ""); }}>
                <ClearIcon />
            </button>
            {/* handleCloseDialog(direccion,data); */}
        </div >
    );
};

const DetailItem = ({ label, value }) => (
    <div style={{ color: 'white', padding: '5px' }}>
        {label}
        <div style={{ fontFamily: 'monserrat', color: '#D1D1D1', paddingTop: '10px', fontSize: '12px' }}>{value}</div>
    </div>
);

const DetailBlock = ({ title, image }) => (
    <div style={{ backgroundColor: '#1B2654', color: 'white', borderRadius: '25px', textAlign: 'center', height: '100%', opacity: '85%' }}>
        <img src={image} alt="" style={{ display: 'block', margin: '0 auto', width: '80%', height: 'auto' }} />
        {title}
    </div>
);
