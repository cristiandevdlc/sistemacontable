import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';
import DataGrid, { Column, Editing, FilterRow, Selection } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import React, { useEffect, useState } from 'react'
import request, { firstObj, moneyFormat, noty } from "@/utils";
import TextInput from '@/components/TextInput';
import DialogComp, { FieldDrawer } from '@/components/DialogComp';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { useForm } from '@inertiajs/react';
import { data } from 'autoprefixer';
import { set } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom'
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import { Request } from '@/core/Request';
import { ButtonComp } from '@/components/ButtonComp';
import Datatable from '@/components/Datatable';
import moment from 'moment';
import { useCallback } from 'react';

const taxesTypes = {
    OneToOne: 1,
    ManyToOne: 2,
    OneToMany: 3,
    GlobalTax: 4,
}

const divType = {
    kilo: 1,
    importe: 4,
}

const resetQuantity = {
    cantidad: 0,
    total: 0,
    diferencia: 0
}

export default function FacturacionRemisiones() {
    const navigate = useNavigate()
    const [state, setState] = useState({
        facturaciones: [],
        loading: false,
        selected: [],
        blockSelection: false,
        remisionDividida: []
    })
    const [filtro, setFiltro] = useState('');

    const [filtroTipoVenta, setFiltroTipoVenta] = useState('');
    const [filtroNombreCliente, setfiltroNombreCliente] = useState('');


    const [data, setData] = useState({
        fechaInicio: moment().subtract(10, 'days').format('YYYY-MM-DD'),
        fechaFinal: moment().format('YYYY-MM-DD'),
        ...resetQuantity,
        cantidad: 0,
        total: 0,
        diferencia: 0,
        division: divType.kilo,
        forma: taxesTypes.OneToOne,
        TipoVenta: ''
    });

    const [informacionMandada, setInformacionMandada] = useState({
        index: [],
        forma: data.forma,
        informacion: []
    });

    const handleDivision = () => {
        setState({ ...state, blockSelection: true })

        setData({ ...data, diferencia: data.diferencia - data.cantidad })

        const mainObj = firstObj(state.selected)
        let newTableReg = { ...mainObj }

        let percent = 0

        if (data.division == divType.importe) percent = data.cantidad / mainObj.total
        else percent = data.cantidad / mainObj.Cantidad

        newTableReg['total'] = mainObj.total * percent
        newTableReg['Cantidad'] = mainObj.Cantidad * percent
        newTableReg['Bonificacion'] = mainObj.Bonificacion * percent
        newTableReg['importe'] = mainObj.importe * percent
        newTableReg['IVACalculada'] = mainObj.IVACalculada * percent

        setState((prev) => ({
            ...prev,
            remisionDividida: [
                ...prev.remisionDividida,
                newTableReg
            ]
        }))

        setData(prev => ({ ...prev, cantidad: prev.diferencia }))
    }



    // Función para manejar cambios en el campo de entrada de folio
    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    const handleFiltroChangeVenta = (event) => {
        setFiltroTipoVenta(event.target.value);
    };


    const handleFiltroChangeCliente = (event) => {
        setfiltroNombreCliente(event.target.value);
    };




    const filtrarDatos = (item) => {
        console.log("item",item);
        const folioMatch = item.Folio.toLowerCase().includes(filtro.toLowerCase());
        const remisionMatch = item.remision.toLowerCase().includes(filtro.toLowerCase());

        
        return folioMatch || remisionMatch ; 
    };
    const filtrarDatosCliente = (item) => {
        const tipoClienteInput = filtroNombreCliente.toLowerCase(); // Convertir el texto de búsqueda a minúsculas
        console.log("tipocliente",item)
        const tipoClienteItem = item.Cliente.toLowerCase(); // Convertir el valor de TipoVenta a minúsculas

        // Verificar si el TipoVentaItem contiene el texto de búsqueda ingresado
        if (tipoClienteItem.includes(tipoClienteInput)) {
            return true; // Si lo contiene, devolver true para incluir este elemento en los datos filtrados
        } else {
            return false; // Si no lo contiene, devolver false para excluir este elemento de los datos filtrados
        }
    };

    const filtrarDatosTipoVenta = (item) => {
        const tipoVentaInput = filtroTipoVenta.toLowerCase(); // Convertir el texto de búsqueda a minúsculas
        const tipoVentaItem = item.TipoVenta.toLowerCase(); // Convertir el valor de TipoVenta a minúsculas

        // Verificar si el TipoVentaItem contiene el texto de búsqueda ingresado
        if (tipoVentaItem.includes(tipoVentaInput)) {
            return true; // Si lo contiene, devolver true para incluir este elemento en los datos filtrados
        } else {
            return false; // Si no lo contiene, devolver false para excluir este elemento de los datos filtrados
        }
    };

    //const datosFiltradosVenta = (filtro && filtroTipoVenta && filtroNombreCliente) ? state.facturaciones.filter(filtrarDatos).filter(filtrarDatosTipoVenta) : (filtro ? state.facturaciones.filter(filtrarDatos) : (filtroTipoVenta ? state.facturaciones.filter(filtrarDatosTipoVenta) : state.facturaciones));
    const datosFiltradosVenta = (filtro && filtroTipoVenta && filtrarDatosCliente) ? state.facturaciones.filter(filtrarDatos).filter(filtrarDatosTipoVenta).filter(filtrarDatosCliente) :(filtro ? state.facturaciones.filter(filtrarDatos) :(filtroTipoVenta ? state.facturaciones.filter(filtrarDatosTipoVenta) :  (filtroNombreCliente ? state.facturaciones.filter(filtrarDatosCliente) : state.facturaciones)));


    const getFacturaciones = async () => {
        setState({ ...state, selected: [], loading: true })
        const requestDataInfo = await Request._post(route("getFacturacionesRemisiones"), {
            idForma: data.forma,
            FechaInicio: data.fechaInicio,
            FechaFinal: data.fechaFinal
        });

        // setState((prev) => ({
        //     ...prev, facturaciones: [{ "conceptosProductosSAT_clave": "15111510", "cdfi": "G03", "factura_idUsocfdi": "2017", "Folio": "487", "ventadetalle": "773", "remision": "7410", "Cliente": "INTERGAS DEL NORTE", "RFC": "INO960919PK9", "RFCEmpresa": "INO960919PK9", "TipoVenta": "CREDITO", "factura_idMetodoPago": "1", "ClaveMetodoPago": "PPD", "FormaPago": "TRANSFERENCIA", "ClaveFormaPago": "03", "formasPago_idFormasPago": "2003", "Cantidad": "100000.0000", "Bonificacion": "1000000.0000", "precioUnitario": "10.7000", "total": "70000.0000", "ventaDetalle_IVA": "367500.0000", "idCliente": "3031", "codigoPostal": "27000", "Estado": "Coahuila de Zaragoza", "pais": "MÉXICO", "Estacion_PCRE": "wBLVD. REVOLUCION CALLE 548", "ClaveUnidad": "LTR", "Unidad": "LTS", "facturaDetalle_idUnidadMedida": "7", "claveImpuesto": "002", "TasaOCuota": ".1600", "factura_idRegimenfiscal": "3", "Regimenfiscal": "General Ley Personas", "RegimenFiscalClave": "601", "producto_nombre": "Estacionario", "importe": "1070000.00000000", "IVACalculada": "171200.00000000", "vendedor": "5355", "idProducto": "1029" }, { "conceptosProductosSAT_clave": "15111510", "cdfi": "G03", "factura_idUsocfdi": "2017", "Folio": "488", "ventadetalle": "774", "remision": "8520", "Cliente": "INTERGAS DEL NORTE", "RFC": "INO960919PK9", "RFCEmpresa": "INO960919PK9", "TipoVenta": "CREDITO", "factura_idMetodoPago": "1", "ClaveMetodoPago": "PPD", "FormaPago": "TRANSFERENCIA", "ClaveFormaPago": "03", "formasPago_idFormasPago": "2003", "Cantidad": "100000.0000", "Bonificacion": "1000000.0000", "precioUnitario": "10.7000", "total": "70000.0000", "ventaDetalle_IVA": "367500.0000", "idCliente": "3031", "codigoPostal": "27000", "Estado": "Coahuila de Zaragoza", "pais": "MÉXICO", "Estacion_PCRE": "wBLVD. REVOLUCION CALLE 548", "ClaveUnidad": "LTR", "Unidad": "LTS", "facturaDetalle_idUnidadMedida": "7", "claveImpuesto": "002", "TasaOCuota": ".1600", "factura_idRegimenfiscal": "3", "Regimenfiscal": "General Ley Personas", "RegimenFiscalClave": "601", "producto_nombre": "Estacionario", "importe": "1070000.00000000", "IVACalculada": "171200.00000000", "vendedor": "5355", "idProducto": "1029" }], loading: false
        // }))
        setState((prev) => ({
            ...prev,
            facturaciones: requestDataInfo,
            selected: [], remisionDividida: [],
            loading: false, blockSelection: false
        }))
        setData({ ...data, ...resetQuantity })
        if (requestDataInfo.length == 0) noty('Sin datos', 'error')
    };


    const calculateTotal = (selectedData = state.selected) => setData((prev) => {
        const objSel = firstObj(selectedData) ?? {}
        return {
            ...prev,
            total: parseFloat(prev.division == divType.importe ? objSel.total : objSel.Cantidad),
            diferencia: parseFloat(prev.division == divType.importe ? objSel.total : objSel.Cantidad)
        }
    })

    const handleSelection = ({ selectedRowKeys }) => {
        if (data.forma == taxesTypes.OneToMany) {
            calculateTotal(selectedRowKeys)
        }
        setState({
            ...state,
            selected: selectedRowKeys
        })
    }

    const redirectToGenerator = () => {
        // Mapea cada remisión y agrega el IVA calculado a cada una
        const remisionesConIVA = state.remisionDividida.map(remision => {
            const ivaRemisionDividida = parseFloat(remision.importe) * parseFloat(0.160000);
            const ivaRemisionDivididaFormatted = ivaRemisionDividida.toFixed(2);
            console.log("cualquier mamada", remision.importe);

            // Retorna un nuevo objeto remisión con el IVA calculado
            return {
                ...remision,
                ivaRemisionDividida: ivaRemisionDivididaFormatted
            };
        });

        // Construye el objeto item con la forma deseada
        const item = {
            forma: data.forma,
            index: state.selected,
            informacion: data.forma === taxesTypes.OneToMany ? remisionesConIVA : state.selected
        };

        // Navega a la página de Generador de Factura Cliente con el objeto item en el estado
        navigate('/Generador-Factura-Cliente', { state: { item } });
    };



    useEffect(() => {
        getFacturaciones()
    }, []);


    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
                <div className="flex flex-col overflow-y-auto sm:max-w-[100%] md:max-w-[18%] w-full blue-scroll gap-3 px-1 pb-2 min-w-[300px]">


                    <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>


                        <FieldDrawer
                            fields={[
                                {
                                    label: 'Filtro',
                                    input: true,
                                    type: 'text',
                                    fieldKey: '',
                                    value: filtro,
                                    onChangeFunc: handleFiltroChange
                                },
                                {
                                    input: true,
                                    label: "Fecha inicio",
                                    type: "date",
                                    value: data.fechaInicio,
                                    onChangeFunc: (e) => setData({ ...data, fechaInicio: e.target.value, })
                                },
                                {
                                    input: true,
                                    label: "Fecha final",
                                    type: "date",
                                    value: data.fechaFinal,
                                    onChangeFunc: (e) => setData({ ...data, fechaFinal: e.target.value, })
                                },
                                {
                                    custom: true,
                                    customItem: () => (<>
                                        <ButtonComp label='Refrescar' onClick={getFacturaciones} />
                                    </>)
                                },
                                {
                                    label: 'Tipo',
                                    input: true,
                                    type: 'text',
                                    fieldKey: '',
                                    value: filtroTipoVenta,
                                    onChangeFunc: handleFiltroChangeVenta

                                    // onChangeFunc: (e) => setData({
                                    //     ...data,
                                    //     folioPago: e.target.value.replace(/\D/g, ""),
                                    // })
                                },
                                {
                                    label: 'Cliente',
                                    input: true,
                                    type: 'text',
                                    fieldKey: '',
                                    value: filtroNombreCliente,
                                    onChangeFunc: handleFiltroChangeCliente

                                    // onChangeFunc: (e) => setData({
                                    //     ...data,
                                    //     folioPago: e.target.value.replace(/\D/g, ""),
                                    // })
                                },
                                {
                                    select: true,
                                    label: "Forma",
                                    options: [
                                        { id: 1, typeName: '1 Factura Por 1 Remision' },
                                        { id: 2, typeName: 'N Remisiones en 1 Factura' },
                                        { id: 3, typeName: '1 Remision en N Facturas' },
                                        // { id: 4, typeName: 'Factura Global' }
                                    ],
                                    value: data.forma,
                                    valueKey: "id",
                                    data: 'typeName',
                                    onChangeFunc: (e) => {
                                        setData({
                                            ...data,
                                            forma: e ?? taxesTypes.OneToOne,
                                            division: divType.kilo,
                                            ...resetQuantity,
                                        })
                                        const firstSel = firstObj(state.selected)
                                        if (firstSel && e != taxesTypes.OneToMany) setState({
                                            ...state,
                                            selected: [firstSel],
                                            blockSelection: false
                                        })
                                    }
                                },
                                {
                                    _conditional: () => (data.forma == taxesTypes.OneToMany),
                                    select: true,
                                    label: "Dividir por",
                                    options: [{ id: 1, typeName: 'Kilo / Litro' }, { id: 4, typeName: 'Importe' }],
                                    value: data.division || '',
                                    data: "typeName",
                                    valueKey: "id",
                                    disabled: state.blockSelection,
                                    onChangeFunc: (newValue) => {
                                        setData({
                                            ...data,
                                            division: newValue ?? divType.kilo,
                                            ...resetQuantity,
                                        })
                                        calculateTotal()
                                    }
                                },
                                {
                                    _conditional: () => (data.forma == taxesTypes.OneToMany),
                                    input: true,
                                    label: data.division == divType.kilo ? "Cantidad" : 'Importe',
                                    type: "decimal",
                                    customIcon: data.division == divType.importe ? 'attach_money' : '',
                                    value: data.cantidad,
                                    onChangeFunc: (e) => setData({
                                        ...data,
                                        cantidad: e.target.value,
                                    })
                                },
                                {
                                    _conditional: () => (data.forma == taxesTypes.OneToMany),
                                    input: true,
                                    label: "Total",
                                    value: data.total,
                                    disabled: true,
                                    type: 'decimal',
                                    customIcon: data.division == divType.importe ? 'attach_money' : '',
                                },
                                {
                                    _conditional: () => (data.forma == taxesTypes.OneToMany),
                                    input: true,
                                    label: "Diferencia",
                                    type: 'decimal',
                                    value: data.diferencia,
                                    disabled: true,
                                    customIcon: data.division == divType.importe ? 'attach_money' : '',
                                },
                                {
                                    _conditional: () => (data.forma == taxesTypes.OneToMany),
                                    custom: true,
                                    customItem: () => <ButtonComp
                                        onClick={handleDivision}
                                        className='!text-[10px]'
                                        disabled={state.selected.length == 0 || data.cantidad == 0 || data.cantidad > data.diferencia}
                                        label={<div>Dividir remision <HorizontalSplitIcon className='me-2' /></div>}
                                    />

                                }
                            ]}
                        />

                        <hr className='mt-4' />

                        <ButtonComp
                            disabled={(data.forma == '') || (data.forma == taxesTypes.OneToMany && (data.diferencia != 0)) || (state.selected.length == 0)}
                            label={<>Facturar <FactCheckIcon className='ms-2' /></>}
                            onClick={redirectToGenerator}
                        />
                    </div>

                </div>


                {state.loading && <div className='sm:!h-[50vh] md:!h-[85vh] w-full flex-col items-center justify-center'><LoadingDiv /></div>}
                {!state.loading &&
                    <>
                        <div className='flex-col overflow-hidden'>
                            <div className='!md:max-w-[80%] overflow-auto flex blue-scroll' >
                                <div>
                                    <Datatable
                                        searcher={false}
                                        height={(data.forma == taxesTypes.OneToMany) ? '40vh' : ''}
                                        data={datosFiltradosVenta}
                                        virtual={true}
                                        tableClassName={'!text-[10px]'}
                                        selectedData={state.selected}
                                        selection={(data.forma == taxesTypes.ManyToOne) ? 'multiple' : 'single'}
                                        selectionFunc={state.blockSelection ? () => { } : handleSelection}
                                        columns={[
                                            { width: '80px', header: 'Folio', accessor: 'Folio' },
                                            { width: '70px', header: 'Remision', accessor: 'remision' },
                                            { width: '180px', header: 'Cliente', accessor: 'Cliente' },
                                            { width: '100px', header: 'Producto', accessor: 'producto_nombre' },
                                            { width: '90px', header: 'RFC', accessor: 'RFC' },
                                            { width: '90px', header: 'Tipo', accessor: 'TipoVenta' },
                                            { width: '100px', header: 'Forma', accessor: 'FormaPago' },
                                            { width: '200px', header: 'Estacion_PCRE', accessor: 'Estacion_PCRE' },
                                            { width: '130px', header: 'Cantidad', cell: ({ item }) => `${moneyFormat(item.Cantidad)}` },
                                            { width: '130px', header: 'Precio', cell: ({ item }) => `$ ${moneyFormat(item.Precio)}` },
                                            { width: '130px', header: 'Bonificacion', cell: ({ item }) => `$ ${moneyFormat(item.Bonificacion)}` },
                                            { width: '130px', header: 'Importe', cell: ({ item }) => `$ ${moneyFormat(item.importelts)}` },
                                            { width: '130px', header: 'IVA', cell: ({ item }) => `$ ${moneyFormat(item.iva)}` },
                                            { width: '130px', header: 'Total', cell: ({ item }) => `$ ${moneyFormat(item.total)}` },
                                        ]}
                                    />
                                </div>
                            </div>
                            {
                                (data.forma == taxesTypes.OneToMany) && (<>
                                    <div className='my-5'>Divisiones de remision</div>
                                    <div className='!md:max-w-[80%] overflow-auto flex blue-scroll' >
                                        <div>
                                            <Datatable
                                                searcher={false}
                                                height={(data.forma == taxesTypes.OneToMany) ? '40vh' : ''}
                                                data={[
                                                    ...state.remisionDividida,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                    // ...state.facturaciones, ...state.facturaciones, ...state.facturaciones,
                                                ]}
                                                virtual={true}
                                                width={'59vw'}
                                                tableClassName={'!text-[10px]'}
                                                columns={[
                                                    { width: '17%', header: 'Folio', accessor: 'Folio' },
                                                    { width: '17%', header: 'Cantidad', cell: ({ item }) => `${moneyFormat(item.Cantidad)}` },
                                                    { width: '17%', header: 'Precio', cell: ({ item }) => `$ ${moneyFormat(item.Precio)}` },
                                                    { width: '17%', header: 'Bonificacion', cell: ({ item }) => `$ ${moneyFormat(item.Bonificacion)}` },
                                                    { width: '17%', header: 'Importe', cell: ({ item }) => `$ ${moneyFormat(item.importe)}` },
                                                    {
                                                        width: '17%',
                                                        header: 'IVA',
                                                        cell: ({ item }) => {
                                                            // Calcula el IVA basado en el importe y la tasa de IVA
                                                            const IvaRemisionDividida = (parseFloat(item.importe) * parseFloat(0.160000)).toFixed(2);

                                                            // Agrega el valor del IVA calculado al objeto item
                                                            const newItem = { ...item, remisionDividida: IvaRemisionDividida };

                                                            // Devuelve el componente con el formato de dinero
                                                            return `$ ${moneyFormat(IvaRemisionDividida)}`;
                                                        }
                                                    },

                                                    { width: '17%', header: 'Total', cell: ({ item }) => `$ ${moneyFormat(item.total)}` },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </>)
                            }
                        </div>
                    </>
                }
            </div>
        </div >
    )
}
