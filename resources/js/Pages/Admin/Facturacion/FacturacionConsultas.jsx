import LoadingDiv from '@/components/LoadingDiv';
import { useState, useEffect } from 'react';
import TextInput from "@/components/TextInput";
import SearchIcon from '@mui/icons-material/Search';
import Datatable from "@/components/Datatable";
import { Button, Checkbox, Tooltip, Dialog } from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import Imagen from './Factura.gif'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import PrintIcon from '@mui/icons-material/Print';
import ListIcon from '@mui/icons-material/List';
import DoorbellIcon from '@mui/icons-material/Doorbell';
export default function FacturacionConsultas() {
    const [state, setState] = useState({ loading: true })
    const [facturacion, setfacturacion] = useState([]);
    const fechaHoy = new Date();
    const fechaFormateada = `${fechaHoy.getFullYear()}-${(fechaHoy.getMonth() + 1).toString().padStart(2, '0')}-${fechaHoy.getDate().toString().padStart(2, '0')}`;
    const [data, setdata] = useState({ fechainicio: fechaFormateada, fechafin: fechaFormateada });
    const [exito, setexito] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [detalle, setDetalle] = useState(false)
    const [informacion, setInformacion] = useState({});
    const [filtro, setFiltro] = useState('');

    const getFacturas = async () => {
        const response = await fetch(route('FacturacionConsultas'), { method: "POST", body: JSON.stringify({ fechaInicio: new Date(data.fechainicio).toISOString().split('T')[0], fechaFin: new Date(data.fechafin).toISOString().split('T')[0] }), headers: { "Content-Type": "application/json" } });
        const facturas = response.ok ? await response.json() : null;
        const message = response.ok ? facturas.length > 0 ? 'Se encontraron facturas' : 'No hay facturas por el momento' : 'Hubo un problema al obtener las facturas';
        const notificationType = response.ok ? facturas.length > 0 ? 'success' : 'error' : 'error';
        setfacturacion(facturas);
        showNotification(message, notificationType, 'metroui', 'bottomRight', 2000);
    };

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    // Función para filtrar los datos por folio
    const filtrarDatos = (item) => {
        const folioMatch = item.Folio.toLowerCase().includes(filtro.toLowerCase());
        // const remisionMatch = item.Remisiones.toLowerCase().includes(filtro.toLowerCase());
        return folioMatch;
    };

    const datosFiltrados = filtro ? facturacion.filter(filtrarDatos) : facturacion;

    const EnvioCorreoUno = async () => {
        setState({ ...state, loading: true });

        const response = await fetch(route('EnvioCorreoUno'), { method: "POST", body: JSON.stringify({ Lista: selectedItems, }), headers: { "Content-Type": "application/json" } });
        if (response.ok) {
            const responseData = await response.json();
            const resultados = responseData.resultados;
            const message = responseData.message;
            const notificationType = resultados.some(result => result.status === 'error') ? 'error' : 'success';
            showNotification(message, notificationType, 'metroui', 'bottomRight', 2000);
            setState({ ...state, loading: false });

        } else {
            setState({ ...state, loading: false });
            const message = 'Hubo un problema al obtener las facturas';
            showNotification(message, 'error', 'metroui', 'bottomRight', 2000);
        }
    };






    const DiarioVentas = async () => {
        const response = await fetch(route('DiarioVentas'), { method: "POST", body: JSON.stringify({ Factura: selectedItems, fechaInicio: new Date(data.fechainicio).toISOString().split('T')[0], fechaFin: new Date(data.fechafin).toISOString().split('T')[0], }), headers: { "Content-Type": "application/json" } });
        if (!response.ok) { throw new Error(`Error: ${response.statusText}`); }
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        const isPDF = contentDispositionHeader && contentDispositionHeader.includes('pdf');
        if (isPDF) {
            const blob = await response.blob(), url = window.URL.createObjectURL(blob), a = Object.assign(document.createElement('a'), { href: url, download: `DiarioVentas_${Date.now()}.pdf` }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
            new Noty({ text: "Descargando diario de ventas", type: "success", theme: "metroui", layout: "bottomRight", timeout: 2000 }).show();
        } else {
            const dataMun = await response.json(); new Noty({ text: dataMun.error, type: "error", theme: "metroui", layout: "bottomRight", timeout: 2000 }).show();
        }
    };

    const ImprimirFacturas = async () => {

        let errores = 0;
        let exitos = 0;
        for (const item of selectedItems) {
            try {
                await VisualizarFactura(item.idFactura, item.tipoFactura, 1);
                exitos++;
            } catch (error) {
                errores++;
            }
        }
        showNotification(`Total de archivos descargados son: ${exitos}`, 'success', 'metroui', 'bottomRight', 2000);
        getFacturas();
    };





    const VisualizarFactura = async (Folio, Tipo, Forma) => {
        try {
            const response = await fetch(route('BuscarDocumento'), { method: "POST", body: JSON.stringify({ Folio, Tipo }), headers: { "Content-Type": "application/json" } });
            if (!response.ok) { throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`); }
            const blob = await response.blob(), url = window.URL.createObjectURL(blob), a = Object.assign(document.createElement('a'), { href: url, download: `Facturacion${Date.now()}.pdf` }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
            if (Forma !== 1) {
                showNotification('El archivo se ha descargado con éxito', 'success', 'metroui', 'bottomRight', 2000);
                getFacturas();
            }
        } catch (error) {
            if (Forma !== 1) {
                showNotification('No se encontró la factura seleccionada', 'error', 'metroui', 'bottomRight', 2000);
            }
        }
    };



    const CancelarFactura = async (Folio, Tipo) => {
        try {
            const response = await fetch(route('CancelarFactura'), { method: "POST", body: JSON.stringify({ Folio, Tipo }), headers: { "Content-Type": "application/json" } });
            if (!response.ok) { throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`); }
            const blob = await response.blob(), url = window.URL.createObjectURL(blob), a = Object.assign(document.createElement('a'), { href: url, download: `Facturacion_Cancelada${Date.now()}.pdf` }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
            getFacturas();
            showNotification('El archivo se ha descargado con exito', 'success', 'metroui', 'bottomRight', 2000);
        } catch (error) {
            console.error(error.message);
        }
    };

    const TimbrarFactura = async (Informacion) => {
        console.log("INFORMACION", Informacion);
        try {
            const response = await fetch(route('TimbrarFactura'), {
                method: "POST",
                body: JSON.stringify({ Informacion }),
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Facturacion${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
    
            showNotification('Se ha timbrado con éxito la factura', 'success', 'metroui', 'bottomRight', 2000);
        } catch (error) {
            console.error(error.message);
        }
    };
    


    const getAll = async () => { getFacturas(); }

    const handleCheckboxChange = (idFactura) => {
        const isSelected = selectedItems.some((selectedItem) => selectedItem.idFactura === idFactura);

        if (!isSelected) {
            // Agregar el item seleccionado al estado
            const selectedItem = facturacion.find((item) => item.idFactura === idFactura);
            setSelectedItems([...selectedItems, selectedItem]);
        } else {
            // Remover el item seleccionado del estado
            const updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem.idFactura !== idFactura);
            setSelectedItems(updatedSelectedItems);
        }
    };

    // Función para seleccionar todos los elementos
    const handleSelectAll = () => {
        setSelectedItems([...facturacion]);
    };

    // Función para deseleccionar todos los elementos
    const handleDeselectAll = () => {
        setSelectedItems([]);
    }


    useEffect(() => { document.title = 'Intergas | Facturacion Consultas'; getAll().then(() => setState({ loading: false })) }, [])


    return (
        <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
            {state.loading && <div className='flex items-center justify-center h-screen w-screen'><LoadingDiv /></div>}
            {!state.loading &&
                <>
                    {exito ? (<><img src={Imagen} alt="" style={{ width: '70%', height: 'auto', display: 'block', margin: 'auto', loop: false, autoPlay: true }} /> </>
                    ) : (
                        <>
                            <div className="flex flex-col h-[92vh] overflow-y-auto sm:max-w-[100%] md:max-w-[18%] w-full blue-scroll gap-3 px-1 pb-2">
                                <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                                    <TextInput
                                        label="N* Folio"
                                        type="text"
                                        value={filtro}
                                        onChange={(e) => setFiltro(e.target.value)} // Añadir (e.target.value) como argumento
                                    />

                                    <TextInput
                                        label="Fecha de inicio"
                                        type="date"
                                        className="block w-full texts"
                                        value={data.fechainicio || new Date.toISOString().split('T')[0]}
                                        min="1800-01-01"
                                        onChange={(e) => { setdata({ ...data, fechainicio: e.target.value }); }}
                                    />

                                    <TextInput
                                        label="Fecha de fin"
                                        type="date"
                                        className="block w-full texts"
                                        value={data.fechafin || new Date().toISOString().split('T')[0]}
                                        min="1800-01-01"
                                        onChange={(e) => { setdata({ ...data, fechafin: e.target.value }); }}
                                    />



                                    {/* <Button variant="contained" style={{ background: '#1B2654', marginTop: '10px', textAlign: 'center', height: '40px', borderRadius: '10px', width: '100%', fontWeight: 'bold', }} onClick={(e) => { getFacturas() }}>Buscar <SearchIcon /></Button> */}
                                    <div className="flex flex-col bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', transition: 'box-shadow 0.3s ease, background-color 0.3s ease', backgroundColor: '#1B2654' }}
                                        onClick={(e) => { getFacturas() }}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }} // Restaura el color de fondo al salir del hover
                                    >
                                        <span className="flex justify-between items-center">
                                            <span>Buscar </span>
                                            <SearchIcon />
                                        </span>
                                    </div>


                                </div>

                                <div className='flex flex-col shadow-md px-3 pt-3 pb-4 border-2  rounded-xl'>
                                    <span>Acciones</span>

                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }} onClick={() => { EnvioCorreoUno(); }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }} >
                                        <span className="flex justify-between items-center"> <span>Enviar correo  </span><EmailIcon /></span>
                                    </div>
                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }} onClick={() => { DiarioVentas(); }}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }} // Restaura el color de fondo al salir del hover
                                    >
                                        <span className="flex justify-between items-center"> <span>Diario de ventas  </span><SignalCellularAltIcon /></span>
                                    </div>
                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }} onClick={() => { ImprimirFacturas(); }}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }} // Restaura el color de fondo al salir del hover
                                    >
                                        <span className="flex justify-between items-center"> <span>Imprimir facturas </span><PrintIcon /></span>
                                    </div>

                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }}
                                        onClick={handleSelectAll}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }} // Restaura el color de fondo al salir del hover
                                    >
                                        <span className="flex justify-between items-center"> <span>Seleccionar todas las facturas </span><FormatListBulletedIcon /></span>
                                    </div>
                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }}
                                        onClick={handleDeselectAll}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }} // Restaura el color de fondo al salir del hover
                                    >
                                        <span className="flex justify-between items-center"> <span>Quitar todas las selecciones </span><FormatLineSpacingIcon /></span>
                                    </div>

                                </div>
                            </div>

                            <div className='flex flex-col w-full gap-4 items-stretch' >
                                <div className="w-full monitor-table" >

                                    <Datatable
                                        data={datosFiltrados}
                                        searcher={false}
                                        columns={[
                                            {
                                                header: "Facturas",
                                                accessor: "Estatus",
                                                width: '50%',
                                                cell: (eprops) => (
                                                    <>
                                                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                                                            <div class="h-22 rounded-lg bg-white-200 lg:col-span-2" style={{ background: '#1B2654', color: 'white' }}>
                                                                <div className="grid grid-cols-1 gap-1 lg:grid-cols-6" style={{ padding: '2%', textAlign: 'left', position: 'relative' }}>
                                                                    <div style={{ position: 'absolute', top: 0, right: 0 }}>

                                                                        <input
                                                                            type="checkbox"
                                                                            color="success"
                                                                            className="ml-[10px] w-[30px] h-[30px]"
                                                                            style={{ color: "green", borderRadius: "10px" }}
                                                                            checked={selectedItems.some((item) => item.idFactura === eprops.item.idFactura)}
                                                                            onChange={() => handleCheckboxChange(eprops.item.idFactura)}
                                                                        />
                                                                        {/* <input type="checkbox" color="success" className="ml-[10px] w-[30px] h-[30px]" style={{ color: "green", borderRadius: "10px" }} onChange={() => handleCheckboxChange(eprops.item.idFactura)} /> */}
                                                                    </div>
                                                                    <InfoItem label="Cliente" value={eprops.item.Cliente ? eprops.item.Cliente : "S/N Nombre del cliente"} />
                                                                    <InfoItem label="Folio" value={eprops.item.Folio ? eprops.item.Folio : "S/N Numero de folio"} />
                                                                    <InfoItem label="Usuario" value={eprops.item.Usuario ? eprops.item.Usuario : "S/N Usuario"} />
                                                                    <InfoItem label="Remisiones" value={eprops.item.Remisiones} />
                                                                    <InfoItem label="Importe" value={eprops.item.Importe ? `$ ${parseFloat(eprops.item.Importe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N IMPORTE"} />
                                                                    <InfoItem label="Descuento" value={eprops.item.Descuento ? eprops.item.Descuento : "S/N Numero de Descuento"} />
                                                                    <InfoItem label="Fecha" value={eprops.item.Fecha ? eprops.item.Fecha : "S/N Fecha de factura"} />
                                                                    <InfoItem label="Tipo" value={eprops.item.Tipo ? eprops.item.Tipo : "S/N METODO DE PAGO"} />
                                                                    <InfoItem label="Vendedor" value={eprops.item.Vendedor ? eprops.item.Vendedor : "S/N Vendedor"} />
                                                                    <InfoItem label="Observaciones" value={eprops.item.Observaciones ? eprops.item.Observaciones : "S/N Observaciones"} />
                                                                    <InfoItem label="IVA" value={eprops.item.Iva ? `$ ${parseFloat(eprops.item.Iva).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N IVA"} />
                                                                    <InfoItem label="Total" value={eprops.item.Total ? `$ ${parseFloat(eprops.item.Total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N TOTAL"} />
                                                                </div>

                                                            </div>

                                                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_120px] lg:gap-8">
                                                                <div class="h-22 rounded-lg bg-white-200">
                                                                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2" style={{ padding: '2%', textAlign: 'left' }}>
                                                                        {[
                                                                            {
                                                                                key: 'Estatus',
                                                                                label: 'Estatus',
                                                                                prop: 'Estatus', // Utiliza la clave directamente
                                                                                activeText: 'ACTIVO',
                                                                                inactiveText: 'CANCELADA'
                                                                            },
                                                                            {
                                                                                key: 'Timbrada',
                                                                                label: 'Timbrado',
                                                                                prop: 'Timbrada', // Utiliza la clave directamente
                                                                                activeText: 'ACTIVO',
                                                                                inactiveText: 'INACTIVO'
                                                                            },
                                                                            {
                                                                                key: 'Impresa',
                                                                                label: 'Impreso',
                                                                                prop: 'Impresa', // Utiliza la clave directamente
                                                                                activeText: 'ACTIVO',
                                                                                inactiveText: 'INACTIVO'
                                                                            },
                                                                            {
                                                                                key: 'Enviada',
                                                                                label: 'Enviado',
                                                                                prop: 'Enviada', // Utiliza la clave directamente
                                                                                activeText: 'ACTIVO',
                                                                                inactiveText: 'INACTIVO'
                                                                            }
                                                                        ].map(item => (
                                                                            <div key={item.key}>
                                                                                <div>{item.label}:</div>
                                                                                <div>
                                                                                    {eprops.item[item.prop] === "1" ? (
                                                                                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                                                                                            <p className="whitespace-nowrap text-sm" style={{ fontSize: '10px' }}>{item.activeText}</p>
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-red-700">
                                                                                            <p className="whitespace-nowrap text-sm" style={{ fontSize: '10px' }}>{item.inactiveText}</p>
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="h-32 rounded-lg bg-white-200 flex justify-center items-center" onClick={() => { setInformacion(eprops.item); setDetalle(true); }}>
                                                                    <ListIcon />
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </>
                                                ),
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <Dialog open={detalle} style={{ height: '100%' }} onClose={() => { setDetalle(false); }} maxWidth="xl" state={informacion}>
                        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8" style={{ padding: '2%' }}>

                            <div class="h-30 rounded-lg bg-gray-200" style={{ background: '#1B2654', color: 'white', width: '350px' }}>
                                <div className='flex flex-col  bg-[#1B2654]  p-4 rounded-xl text-white text-[12px] gap-2'>
                                    {informacion.Folio !== 0 && (<div className='flex justify-between'> <span>Factura id: </span>{informacion.Folio ? informacion.Folio : ""}</div>)}
                                    <div className='flex justify-between'> <span>Cliente: </span>{informacion.Cliente ? informacion.Cliente : "S/N CLIENTE"}</div>
                                    <div className='flex justify-between'> <span>Vendedor: </span>{informacion.Vendedor ? informacion.Vendedor : "S/N VENDEDOR"} </div>
                                    <div className='flex justify-between'> <span>Metodo de pago: </span>{informacion.Tipo ? informacion.Tipo : "NO TIENE CALLE"}</div>
                                    <div className='flex justify-between'> <span>Observaciones: </span>{informacion.Observaciones ? informacion.Observaciones : "S/N OBSERVACIONES"} </div>
                                    <div className='flex justify-between'> <span>Usuario: </span>{informacion.Usuario ? informacion.Usuario : "S/N USUARIO"} </div>
                                    <div className='flex justify-between'> <span>Remisiones: </span>{informacion.Remisiones ? informacion.Remisiones : "S/N Remisiones"} </div>
                                    <hr />
                                    <div className='flex justify-between'> <span>Iva: </span>{informacion.Iva ? `$ ${parseFloat(informacion.Iva).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N Iva"} </div>
                                    <div className='flex justify-between'> <span>Descuento: </span>{informacion.Descuento ? `$ ${parseFloat(informacion.Descuento).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N Descuento"} </div>
                                    <div className='flex justify-between'> <span>Importe: </span>{informacion.Importe ? `$ ${parseFloat(informacion.Importe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N Importe"} </div>
                                    <div className='flex justify-between'> <span>Total: </span>{informacion.Total ? `$ ${parseFloat(informacion.Total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N Total"} </div>

                                </div>
                            </div>


                            <div class="h-30 rounded-lg bg-white-200">
                                <Link to="/Visualizar-Factura" state={{ item: informacion }}>
                                    <div className="flex flex-col shadow-md bg-[#1B2654] border-2 p-8 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }}

                                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }}>
                                        <span className="flex justify-between items-center"> <span>Visualizar Factura </span><DescriptionIcon /></span>
                                    </div>
                                </Link>

                                {informacion.Timbrada == 0 && (
                                    <div className="flex flex-col shadow-md bg-[#FC4C02] border-2 p-8 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }}
                                    onClick={(e) => {  TimbrarFactura(informacion); }}

                                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#FC4C02' }}>
                                        <span className="flex justify-between items-center">
                                            <span>Timbrar factura </span>
                                            <DoorbellIcon />
                                        </span>
                                    </div>

                                )}


                                <div
                                    className="flex flex-col shadow-md bg-[#1B2654] border-2 p-8 rounded-xl text-white text-[12px] gap-2"
                                    style={{ marginTop: '10px' }}
                                    onClick={(e) => { informacion.Estatus == "1" ? VisualizarFactura(informacion.idFactura, informacion.tipoFactura, 2) : CancelarFactura(informacion.idFactura, informacion.tipoFactura); }}
                                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#293a7a' }} // Cambia el color de fondo al hacer hover
                                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#1B2654' }}>
                                    <span className="flex justify-between items-center">
                                        <span>Imprimir Factura </span>
                                        <PrintIcon />
                                    </span>
                                </div>

                                {(informacion.Estatus === "1" || informacion.Estatus === "1") && ( // Añade paréntesis aquí
                                    <Link to="/facturas-cancelacion" state={{ item: informacion }}>
                                        <div className="flex flex-col shadow-md bg-[#da1a29] border-2 p-8 rounded-xl text-white text-[12px] gap-2" style={{ marginTop: '10px' }} >
                                            <span className="flex justify-between items-center"> <span>Cancelar factura </span><DoNotDisturbAltIcon /></span>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Dialog >
                </>
            }
        </div >
    )
}

function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };

const InfoItem = ({ label, value }) => { return (<div> {label}: {value} </div>); };

