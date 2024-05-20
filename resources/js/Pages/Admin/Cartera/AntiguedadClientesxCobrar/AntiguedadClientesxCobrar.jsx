import Datatable from '@/components/Datatable'
import { FieldDrawer } from '@/components/DialogComp'
import LoadingDiv from '@/components/LoadingDiv'
import request, { camionLogo, moneyFormat, noty } from '@/utils'
import { usePDF } from '@react-pdf/renderer'
import React from 'react'
import { useState, useEffect } from 'react'
import ReportePDF from './ReportePDF'
import { excelTemplate } from './ExcelTemplate'

const AntiguedadClientesxCobrar = () => {
    const [loadingState, setLoadingState] = useState({ comp: true, info: false, pdf: false })
    const [state, setState] = useState({
        fechaSelected: new Date().toISOString().split("T")[0],
        tipoCarteraSelected: '',
        canalSelected: '',
        segmentoSelected: '',
        // noCliente: '',
        clienteSelected: '',
        intervalo: 15,
        checkResumido: "1",
        checkImporteOriginal: "0"
    })
    const [dataSelect, setDataSelect] = useState({
        tipoCartera: null,
        canal: null,
        segmento: null,
        clientes: null
    })
    const [data, setData] = useState()
    const [tableColumns, setTableColumns] = useState()
    const [intHeaders, setIntHeaders] = useState({ saved: false, int1: "", int2: "", int3: "", int4: "" })
    const [pdfState, setPDFState] = usePDF()
    const [pdfName, setPDFName] = useState('')
    const [newPdf, setNewPdf] = useState(true)
    const [totales, setTotales] = useState()
    let totalesGlobales = {}

    const facturasColumns = [
        { width: '7.14%', header: "No. Cliente", accessor: "cliente_idCliente", type: "text", visible: true },
        { width: '7.14%', header: "Días", accessor: "diasCredito", type: "number", visible: true },
        { width: '7.14%', header: "Cliente", accessor: "cliente_razonsocial", type: "text", visible: true },
        { width: '7.14%', header: "Factura", accessor: "folio", type: "text", visible: true },
        //width: '7.14%',  { header: "Observaciones", accessor: "obs", type: "text", visible: true },
        { width: '7.14%', header: "Fecha Fact.", accessor: "FechaHora", type: "date", visible: true },
        { width: '7.14%', header: "Fecha Venc.", accessor: "fecha_vencimiento", type: "date", visible: true },
        { width: '7.14%', header: "Días vencidos", accessor: "dias_vencidos", type: "number", visible: true },
        { width: '7.14%', header: "Importe", accessor: "importe", type: "number", visible: state.checkImporteOriginal === '1' ? true : false, cell: ({ item }) => <span className='w-full'>{moneyFormat(item.importe)}</span> },
        { width: '7.14%', header: "Saldo", accessor: "saldo", type: "number", visible: true, cell: ({ item }) => <span className='w-full'>{moneyFormat(item.saldo)}</span> },
        { width: '7.14%', header: "Por Vencer", accessor: "porvencer", type: "number", visible: true, cell: ({ item }) => <span className='w-full'>{moneyFormat(item.porvencer)}</span> },
        { width: '7.14%', header: intHeaders.int1, accessor: "intervalo1", type: "number", visible: true, cell: ({ item }) => <span className='w-full'>{moneyFormat(item.intervalo1)}</span> },
        { width: '7.14%', header: intHeaders.int2, accessor: "intervalo2", type: "number", visible: true, cell: ({ item }) => <span className='w-full'>{moneyFormat(item.intervalo2)}</span> },
        { width: '7.14%', header: intHeaders.int3, accessor: "intervalo3", type: "number", visible: true, cell: ({ item }) => <span className='w-full'>{moneyFormat(item.intervalo3)}</span> },
        { width: '7.14%', header: intHeaders.int4, accessor: "intervalo4", type: "number", visible: true, cell: ({ item }) => <span className='w-full'>{moneyFormat(item.intervalo4)}</span> }
    ]

    const resumenColumns = [
        { width: '12.5%', header: "No. Cliente", accessor: "cliente_idCliente", type: "text" },
        { width: '12.5%', header: "Cliente", accessor: "cliente_razonsocial", type: "text" },
        // { width: '12%', header: "Días", accessor: "diasCredito", type: "number" },
        { width: '12.5%', header: "Saldo", accessor: "saldo", type: "number", cell: ({ item }) => <span>{moneyFormat(item.saldo)}</span> },
        { width: '12.5%', header: "Por Vencer", accessor: "porvencer", type: "number", cell: ({ item }) => <span>{moneyFormat(item.porvencer)}</span> },
        { width: '12.5%', header: intHeaders.int1, accessor: "intervalo1", type: "number", cell: ({ item }) => <span>{moneyFormat(item.intervalo1)}</span> },
        { width: '12.5%', header: intHeaders.int2, accessor: "intervalo2", type: "number", cell: ({ item }) => <span>{moneyFormat(item.intervalo2)}</span> },
        { width: '12.5%', header: intHeaders.int3, accessor: "intervalo3", type: "number", cell: ({ item }) => <span>{moneyFormat(item.intervalo3)}</span> },
        { width: '12.5%', header: intHeaders.int4, accessor: "intervalo4", type: "number", cell: ({ item }) => <span>{moneyFormat(item.intervalo4)}</span> }
    ]

    const getSelects = async () => {
        const [tipoCartera, canal, segmento, clientes] = await Promise.all([
            request(route('tipo-cartera.index'), "GET", { enabled: true }),
            request(route('captacion.index'), "GET", { enabled: true }),
            request(route('tipo-clientes.index'), "GET", { enabled: true }),
            request(route('select-clientes'), "GET", { enabled: true })
        ])
        setDataSelect({
            tipoCartera: tipoCartera,
            canal: canal,
            segmento: segmento,
            clientes: clientes
        })
        setLoadingState({ ...loadingState, comp: false })
    }

    const intervalHeaders = () => {
        setLoadingState({ ...loadingState, info: true })
        setIntHeaders({
            int1: `1 - ${state.intervalo}`,
            int2: `${state.intervalo + 1} - ${state.intervalo * 2}`,
            int3: `${(state.intervalo * 2) + 1} - ${state.intervalo * 3}`,
            int4: `Más de ${state.intervalo * 3}`,
            saved: true
        })
    }

    const getTableColumns = () => {
        if (state.checkResumido === "1") {
            setTableColumns(resumenColumns)
        } else {
            const columns = facturasColumns.filter((column) => {
                return column.visible
            })
            setTableColumns(columns)
        }
    }

    const getData = async () => {
        try {
            const response = await request(
                route('reporte-antiguedad-clientesXcobrar'),
                "POST",
                { ...state },
                { enabled: true, success: { message: "Registros obtenidos." } }
            )
            getTableColumns()
            setData(response)
            setNewPdf(true)
        } catch {
            noty('Ocurrió un error al obtener los datos.', 'error')
        }
        // setLoadingState({ ...loadingState, info: false })
        setIntHeaders({ ...intHeaders, saved: false })
    }

    const generatePDF = () => {
        const pdf = (
            <ReportePDF data={data} estado={state} columns={tableColumns} />
        )
        setPDFState(pdf)
        getPDFName()
        setNewPdf(false)
        setLoadingState(prev => ({ ...prev, pdf: false }))
    }

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat('es-mx').format(new Date).replaceAll('/', '_')
        return `Reporte clientes por cobrar${state.checkResumido == '1' ? ' resumido' : ''} ${fechaActual}`
    }

    const getPDFName = () => {
        const fechaActual = new Intl.DateTimeFormat('es-mx').format(new Date).replaceAll('/', '_')
        let nombre = `Reporte clientes por cobrar${state.checkResumido == '1' ? ' resumido' : ''} ${fechaActual}.pdf`

        setPDFName(nombre)
    }

    useEffect(() => {
        getSelects()
    }, [])

    useEffect(() => {
        if (intHeaders.saved && loadingState.info) {
            getData()
        }
        // if (data) {
        //     generatePDF()
        // }
    }, [intHeaders, data]);

    useEffect(() => {
        loadingState.pdf && generatePDF()
    }, [loadingState.pdf])

    useEffect(() => {
        if (tableColumns && data) {
            totalesGlobales = tableColumns.reduce((acc, columnHeader) => {
                if (columnHeader.type === "number") {
                    acc[columnHeader.accessor] = 0;
                }
                return acc;
            }, {});

            data.forEach((item) => {
                tableColumns.forEach((col) => {
                    if (col.type === "number" && col.header !== "Días vencidos") {
                        const cantidad = parseFloat(item[col.accessor]) || 0;
                        totalesGlobales[col.accessor] += cantidad;
                    }
                })
            })
            setTotales(totalesGlobales)
        }
    }, [tableColumns])

    useEffect(() => {
        if (data && tableColumns) getTableColumns()
    }, [state.checkImporteOriginal])

    useEffect(() => {
        if (totales) {
            setLoadingState({ ...loadingState, info: false })
        }
    }, [totales])

    return (
        <div className='relative h-[100%] pb-4 px-3 overflow-auto blue-scroll'>
            {loadingState.comp && <LoadingDiv />}
            {!loadingState.comp &&
                <>
                    <section className='gap-6 flex-col sm:w-full md:w-[275px] sm:float-none md:float-left border-2 rounded-xl relative px-4 pb-4'>
                        <FieldDrawer
                            fields={[
                                {
                                    label: 'Fecha',
                                    input: true,
                                    type: 'date',
                                    max: new Date().toISOString().split("T")[0],
                                    min: '1800-01-01',
                                    // fieldKey: '',
                                    value: state.fechaSelected || new Date().toISOString().split("T")[0],
                                    onChangeFunc: (e) => { setState({ ...state, fechaSelected: e.target.value }) }
                                },
                                {
                                    label: 'Tipo de cartera',
                                    select: true,
                                    value: state.tipoCarteraSelected,
                                    options: dataSelect.tipoCartera,
                                    data: 'tipoCartera_nombre',
                                    valueKey: 'tipoCartera_idTipoCartera',
                                    onChangeFunc: (e) => { setState({ ...state, tipoCarteraSelected: e }) }
                                },
                                {
                                    label: 'Canal',
                                    select: true,
                                    value: state.canalSelected,
                                    options: dataSelect.canal,
                                    data: 'tipoCaptacion_tipo',
                                    valueKey: 'tipoCaptacion_idTipoCaptacion',
                                    onChangeFunc: (e) => { setState({ ...state, canalSelected: e }) }
                                },
                                {
                                    label: 'Segmento',
                                    select: true,
                                    value: state.segmentoSelected,
                                    options: dataSelect.segmento,
                                    data: 'tipoCliente_tipo',
                                    valueKey: 'tipoCliente_idTipoCliente',
                                    onChangeFunc: (e) => { setState({ ...state, segmentoSelected: e }) }
                                },
                                {
                                    label: 'Cliente',
                                    select: true,
                                    value: state.clienteSelected,
                                    options: dataSelect.clientes,
                                    data: 'numeroYnombre',
                                    valueKey: 'idCliente',
                                    onChangeFunc: (e) => { setState({ ...state, clienteSelected: e }) }
                                },
                                {
                                    label: 'Intervalo',
                                    input: true,
                                    type: 'number',
                                    // fieldKey: '',
                                    value: state.intervalo,
                                    onChangeFunc: (e) => {
                                        setState({ ...state, intervalo: e.target.value })
                                    }
                                },
                                {
                                    label: "Resumido",
                                    check: true,
                                    fieldKey: '',
                                    checked: state.checkResumido,
                                    onChangeFunc: (e) => {
                                        e.target.checked ?
                                            setState({
                                                ...state,
                                                checkResumido: "1",
                                                checkImporteOriginal: "0"
                                            }) :
                                            setState({
                                                ...state,
                                                checkResumido: "0"
                                            })
                                    }
                                },
                                {
                                    label: "Mostrar importe original de facturas",
                                    check: true,
                                    fieldKey: '',
                                    disabled: state.checkResumido == "1" ? true : false,
                                    checked: state.checkImporteOriginal,
                                    onChangeFunc: (e) => setState({
                                        ...state,
                                        checkImporteOriginal: e.target.checked ? "1" : "0",
                                    })
                                },
                                {
                                    custom: true,
                                    customItem: () => {
                                        return (
                                            <div className='flex flex-col gap-4 pt-3'>
                                                <button className='h-[48px] w-full bg-primary-color text-white rounded-lg' onClick={intervalHeaders}>
                                                    Buscar
                                                </button>
                                                {/* <button
                                                    className={`h-[48px] w-full ${((data && pdfState) || pdfState?.loading) ? `bg-pdf-color` : `bg-disabled-color`} text-white rounded-lg`}
                                                    disabled={data && pdfState ? false : true}
                                                >
                                                    {data && pdfState ? (
                                                        <a href={pdfState.url} download={pdfName}>Descargar PDF</a>
                                                    ) : "Generar PDF"}
                                                </button> */}
                                                {data && !newPdf ? (
                                                    <a
                                                        href={pdfState.url}
                                                        download={pdfName}
                                                        className={`grid h-[48px] w-full bg-pdf-color text-white rounded-lg text-center content-center cursor-pointer non-selectable`}
                                                    >Descargar PDF</a>
                                                ) : (
                                                    <button
                                                        className={`h-[48px] w-full ${((data && pdfState) || pdfState?.loading) ? `bg-pdf-color` : `bg-disabled-color`} text-white rounded-lg`}
                                                        disabled={data && pdfState ? false : true}
                                                        onClick={() => setLoadingState(prev => ({ ...prev, pdf: true }))}
                                                    >
                                                        {loadingState.pdf ? (
                                                            <div className='h-full rounded-lg bg-[#c0c0c03a]'>
                                                                <LoadingDiv size={25} color='inherit' />
                                                            </div>
                                                        ) : "Generar PDF"
                                                        }
                                                    </button>
                                                )}
                                                <button
                                                    className={`h-[48px] w-full ${data ? `bg-excel-color` : "bg-disabled-color"} text-white rounded-lg`}
                                                    disabled={data ? false : true}
                                                    onClick={() => excelTemplate(data, tableColumns, state, excelName())}
                                                >
                                                    Exportar excel
                                                </button>
                                            </div>
                                        )
                                    }
                                }
                            ]}
                        />
                    </section>
                    <section className='relative flex flex-col h-full items-stretch sm:pl-0 md:pl-4'>
                        {loadingState.info ? (
                            <LoadingDiv />
                        ) : (data && tableColumns ? (
                            <>
                                <Datatable
                                    data={data}
                                    virtual={true}
                                    columns={tableColumns}
                                />
                                <div className='flex text-center w-full mt-7 bg-[#1B2654] text-white text-[12px] p-2 rounded-md'>
                                    {
                                        tableColumns.map((columnHeader, colIndex) => {
                                            if (columnHeader.header !== 'No. Cliente' && columnHeader.header !== 'Días' && columnHeader.header !== 'Cliente') {
                                                if (columnHeader.type === "number" && columnHeader.header !== "Días vencidos") {
                                                    return (
                                                        <div key={colIndex} className='w-full'>
                                                            <span>$ {moneyFormat(totales[columnHeader.accessor])}</span>
                                                        </div>
                                                    );
                                                }
                                            }
                                            return (
                                                <div key={colIndex} className='w-full'>
                                                    <span></span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </>
                        ) : (
                            <div className='flex flex-col relative h-full items-center overflow-hidden self-center justify-center'>
                                <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                                <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                            </div>
                        ))
                        }
                    </section>
                </>
            }
        </div>
    )
}

export default AntiguedadClientesxCobrar