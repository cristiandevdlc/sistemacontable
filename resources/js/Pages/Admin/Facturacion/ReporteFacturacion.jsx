import LoadingDiv from '@/components/LoadingDiv';
import { useState, useEffect } from 'react';
import TextInput from "@/components/TextInput";
import SelectComp from '@/components/SelectComp';
import Datatable from "@/components/Datatable";
import { Chip } from '@mui/material'
import { ButtonComp } from '@/components/ButtonComp';
import { FieldDrawer } from '@/components/DialogComp';
import { Calculate } from '@mui/icons-material'
import { ExcelFacturacionTemplate } from './ExcelFacturacionTemplate'
import { Divider } from 'rsuite';
import moment from 'moment';



export default function ReporteFacturacion() {
    const [checkboxMarcadoCliente, setCheckboxMarcadoCliente] = useState(false);
    const [checkboxMarcadoFecha, setCheckboxMarcadoFecha] = useState(false);
    const [data, setData] = useState({ FechaInicio: moment().format("YYYY-MM-DD"), FechaFinal: moment().format("YYYY-MM-DD"), clienteSelect: 0, factura: 0, remision: 0 })
    const [cliente, setCliente] = useState([])
    const [informacionData, setinformacionData] = useState([]);


    const importe = informacionData.reduce((acc, curr) => acc + parseFloat(curr.Importe), 0);
    const descuento = informacionData.reduce((acc, curr) => acc + parseFloat(curr.Descuento), 0);
    const ivaTotal = informacionData.reduce((acc, curr) => acc + parseFloat(curr.IVA), 0);
    const Total = informacionData.reduce((acc, curr) => acc + parseFloat(curr.Total), 0);


    const tableColumns = [
        { header: "Fecha ", accessor: "FechaFactura", type: "date" },
        { header: "Cliente", accessor: "Cliente", type: "text" },
        { header: "Tipo", accessor: "Tipo" },
        { header: "Serie", accessor: "Serie", type: "text" },
        { header: "Folio", accessor: "Folio", type: "number" },
        { header: "Estatus", accessor: "Estatus" },
        { header: "Tipo", accessor: "Tipo_venta", type: "text" },
        { header: "Producto", accessor: "Producto", type: "text" },
        { header: "Precio", accessor: "Precio", type: "number" },
        { header: "Cantidad", accessor: "Cantidad", type: "number" },
        { header: "Importe", accessor: "Importe", type: "number" },
        { header: "Descuento", accessor: "Descuento", type: "number" },
        { header: "IVA", accessor: "IVA", type: "number" },
        { header: "Total", accessor: "Total", type: "number" },

    ]


    const handleCheckboxChange = (event) => {
        setCheckboxMarcadoCliente(event.target.checked);
    };
    const handleCheckboxChangeFecha = (event) => {
        setCheckboxMarcadoFecha(event.target.checked);
    };

    const GetClientes = async () => {
        const response = await fetch(route("clientes.index"));
        const data = await response.json();
        setCliente(data);
    };

    const GuardarDatos = async (datos) => {

        if (!datos.FechaInicio || !datos.FechaFinal || !datos.clienteSelect || !datos.factura || !datos.remision) {
            showNotification("Verifica que los campos este completos", "error", "metroui", "bottomRight", 2000);
            return;
        }


        const dataApi = {
            FechaInicio: datos.FechaInicio,
            FechaFinal: datos.FechaFinal,
            idCliente: datos.clienteSelect,
            factura: datos.factura,
            remision: datos.remision
        };

        const response = await fetch(route('Reporte-Factura'), {
            method: "POST",
            body: JSON.stringify({ Datos: dataApi }),
            headers: { "Content-Type": "application/json" }
        });

        const responseData = await response.json();
        if (responseData != 0) {

            setinformacionData(responseData);
            console.log("soy response", responseData);
            return response;

        } else {
            showNotification("No se encontraron datos.", 'error', 'metroui', 'bottomRight', 2000);
            setinformacionData([])
        }

    }

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat('es-mx').format(new Date).replaceAll('/', '_')
        return `Reporte Facturacion ${fechaActual}`
    }

    useEffect(() => {
        GetClientes();
    }, []);

    return (
        <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
            <div className="flex flex-col h-[100vh]  sm:max-w-[100%] md:max-w-[18%] w-full blue-scroll gap-1 ">
                <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                    <TextInput
                        label="Remision"
                        type="text"
                        className="block w-full"
                        style={{ borderRadius: '10px' }}
                        value={data.remision}
                        onChange={(e) => { setData({ ...data, remision: e.target.value }) }}
                    />
                    <TextInput
                        label="Factura"
                        type="text"
                        className="block w-full"
                        style={{ borderRadius: '10px' }}
                        value={data.factura}
                        onChange={(e) => { setData({ ...data, factura: e.target.value }) }}
                    />
                    <TextInput
                        label="Id. Cliente"
                        type="text"
                        className="block w-full"
                        style={{ borderRadius: '10px' }}
                        value={data.clienteSelect || ''}
                        disabled={!checkboxMarcadoCliente} // Deshabilitar si el checkbox está marcado

                    />

                    <SelectComp
                        label="Cliente"
                        disabled={!checkboxMarcadoCliente} // Deshabilitar si el checkbox está marcado
                        options={cliente}
                        value={data.clienteSelect}
                        onChangeFunc={(newValue) => setData({ ...data, clienteSelect: newValue, })}
                        data="cliente_nombrecomercial"
                        valueKey="cliente_idCliente"

                    />
                    <div className='mt-4'>

                        <input
                            type="checkbox"
                            checked={checkboxMarcadoCliente}
                            onChange={handleCheckboxChange}
                            style={{ borderRadius: '50%' }}
                        />
                        <span style={{ marginLeft: "10px" }}>Buscar por cliente</span>
                    </div>
                    <ButtonComp label='Refrescar' onClick={() => GuardarDatos(data)} />
                    <div className='mt-4'>

                        <ButtonComp
                            icon={<Calculate />}

                            label='Exportar a excel'
                            color='#2e7d32'
                            onClick={() => ExcelFacturacionTemplate(informacionData, tableColumns, data.FechaInicio, data.FechaFinal, '', excelName())}

                        />
                    </div>

                </div>
                <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                    <TextInput
                        label="Fecha Inicio"
                        type="date"
                        className="block w-full"
                        style={{ borderRadius: '10px' }}
                        value={data.FechaInicio || new Date().toISOString().split('T')[0]}
                        onChange={(e) => { setData({ ...data, FechaInicio: e.target.value }) }}
                        min="2012-01-01T00:00"
                        disabled={!checkboxMarcadoFecha}
                    />
                    <TextInput
                        label="Fecha Final"
                        type="date"
                        className="block w-full"
                        style={{ borderRadius: '10px' }}
                        value={data.FechaFinal || new Date().toISOString().split('T')[0]}
                        onChange={(e) => { setData({ ...data, FechaFinal: e.target.value }) }}
                        min="2012-01-01T00:00"
                        disabled={!checkboxMarcadoFecha}

                    />

                    <div className="mt-4">
                        <input
                            type="checkbox"
                            onChange={handleCheckboxChangeFecha}
                            style={{ borderRadius: '50%' }} // Estilos para hacerlo más redondo y abajo
                        />
                        <span style={{ marginLeft: "15px", marginTop: "15px" }}>Filtrar por fecha</span>
                    </div>
                </div>

                <div className='flex flex-col shadow-md /* bg-[#1B2654] */ border-2 p-4 rounded-xl text-white gap-2'>
                    <div className='flex justify-between'>
                        <span>Total importe</span>
                        <span>{importe}</span>

                    </div>
                    <Divider color='#5F6C91' />
                    <div className='flex justify-between'>
                        <span>Total descuento</span>
                        <span>{descuento.toFixed(2)}</span>

                    </div>
                    <Divider color='#5F6C91' />
                    <div className='flex justify-between'>
                        <span>Total Iva</span>
                        <span>{ivaTotal.toFixed(2)}</span>

                    </div>
                    <Divider color='#5F6C91' />
                    <div className='flex justify-between'>
                        <span>Total</span>
                        <span>{Total}</span>
                    </div>
                    <Divider color='#5F6C91' />

                </div>
            </div>
            <div className='md:max-w-[100%] overflow-auto flex blue-scroll' style={{ flex: 1 }}>
                <div style={{ width: 'fit-content' }}>
                    <Datatable
                        data={informacionData}
                        virtual={true}
                        width={'115%'}
                        searcher={false}
                        columns={[
                            { header: "Fecha ", accessor: "FechaFactura" },
                            { header: "Cliente", accessor: "Cliente" },
                            { header: "Tipo", accessor: "Tipo" },
                            { header: "Serie", accessor: "Serie" },
                            { header: "Folio", accessor: "Folio" },
                            { header: "Estatus", accessor: "Estatus", cell: eprops => eprops.item.Estatus === "1" ? (<Chip label='F' size='small' />) : (<Chip label='C' size='small' />) },
                            { header: "Tipo", accessor: "Tipo_venta" },
                            { header: "Producto", accessor: "Producto" },
                            { header: "UMedida", accessor: "Unidad_medida" },
                            { header: "Precio", cell: (row) => parseFloat(row.item.Precio).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                            { header: "Cantidad", cell: (row) => parseFloat(row.item.Cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
                            { header: "Importe", accessor: "Importe" },
                            { header: "Descuento", accessor: "Descuento" },
                            { header: "IVA", accessor: "IVA" },
                            { header: "Total", accessor: "Total" },

                        ]}
                    />
                </div>
            </div>
        </div>
    );

    function showNotification(text, type, theme, layout, timeout) { new Noty({ text: text, type: type, theme: theme, layout: layout, timeout: timeout }).show(); };
}

const InfoItem = ({ label, value }) => { return (<div> {label}: {value} </div>); };
