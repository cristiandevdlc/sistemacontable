import Datatable from '@/components/Datatable'
import { FieldDrawer } from '@/components/DialogComp'
import LoadingDiv from '@/components/LoadingDiv'
import { usePDF } from '@react-pdf/renderer'
import React from 'react'
import { useState } from 'react'
import ReportePDF from './ReportePDF'
import request, { camionLogo, moneyFormat, noty } from '@/utils'
import { useEffect } from 'react'
import { excelTemplate } from './ExcelTemplate'

const CargosClientes = () => {
    const [loadingState, setLoadingState] = useState({ comp: true, info: false, pdf: false })
    const [state, setState] = useState({
        fechaSelected: new Date().toISOString().split("T")[0],
        tipoCarteraSelected: '',
        vendedorSelected: '',
        clienteSelected: '',
        checkVendedor: "1",
        checkCliente: "0"
    })
    const [dataSelect, setDataSelect] = useState({
        tipoCartera: null,
        vendedor: null,
        clientes: null
    })
    const [data, setData] = useState()
    // const [tableColumns, setTableColumns] = useState()
    const [pdfName, setPDFName] = useState('')
    const [newPdf, setNewPdf] = useState(true)
    const [totales, setTotales] = useState()
    const [pdfState, setPDFState] = usePDF()
    let totalesGlobales = {}

    const clienteColumns = [
        { width: '9%', header: "Cobrador", accessor: "Cobrador", type: "text", visible: true },
        { width: '9%', header: "No. Cliente", accessor: "cliente_idCliente", type: "text", visible: true },
        { width: '9%', header: "Días", accessor: "diasCredito", type: "number", visible: true },
        { width: '9%', header: "Cliente", accessor: "cliente_razonsocial", type: "text", visible: true },
        { width: '9%', header: "Factura", accessor: "folio", type: "text", visible: true },
        { width: '9%', header: "Fecha Fact.", accessor: "FechaHora", type: "date", visible: true },
        // { width: '9%', header: "Observaciones", accessor: "obs", type: "text", visible: true },
        { width: '9%', header: "Fecha Venc.", accessor: "fecha_vencimiento", type: "date", visible: true },
        { width: '9%', header: "Días vencidos", accessor: "dias_vencidos", type: "number", visible: true },
        { width: '9%', header: "Importe", accessor: "importe", type: "number", visible: true, cell: ({ item }) => <span>{moneyFormat(item.importe)}</span> },
        { width: '9%', header: "Saldo", accessor: "saldo", type: "number", visible: true, cell: ({ item }) => <span>{moneyFormat(item.saldo)}</span> }
    ]

    const getSelects = async () => {
        const [tipoCartera, vendedores, clientes] = await Promise.all([
            request(route('tipo-cartera.index'), "GET", { enabled: true }),
            // request(route('tipo-clientes.index'), "GET", { enabled: true }),
            request(route('persona.vendedores'), "GET", { enabled: true }),
            request(route('select-clientes'), "GET", { enabled: true })
        ])
        setDataSelect({
            tipoCartera: tipoCartera,
            vendedor: vendedores,
            clientes: clientes
        })
        setLoadingState({ ...loadingState, comp: false })
    }

    const getData = async () => {
        setLoadingState({ ...loadingState, info: true })
        try {
            const response = await request(
                route('reporte-cargos-clientes'),
                "POST",
                { ...state },
                { enabled: true, success: { message: "Registros obtenidos." } }
            )
            setData(response)
            setNewPdf(true)
        } catch {
            noty('Ocurrió un error al obtener los datos.', 'error')
        }
        // setLoadingState({ ...loadingState, info: false })
        // setIntHeaders({ ...intHeaders, saved: false })
    }

    const generatePDF = () => {
        const pdf = (
            <ReportePDF data={data} estado={state} columns={clienteColumns} />
        )
        setPDFState(pdf)
        setNewPdf(false)
        getPDFName()
        setLoadingState(prev => ({ ...prev, pdf: false }))
    }

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat('es-mx').format(new Date).replaceAll('/', '_')
        return `Reporte cobranza${state.checkResumido == '1' ? ' resumido' : ''} ${fechaActual}`
    }

    const getPDFName = () => {
        const fechaActual = new Intl.DateTimeFormat('es-mx').format(new Date).replaceAll('/', '_')
        let nombre = `Reporte cobranza${state.checkResumido == '1' ? ' resumido' : ''} ${fechaActual}.pdf`

        setPDFName(nombre)
    }

    const getTotales = () => {
        totalesGlobales = clienteColumns.reduce((acc, columnHeader) => {
            if (columnHeader.type === "number") {
                acc[columnHeader.accessor] = 0;
            }
            return acc;
        }, {});

        data.forEach((item) => {
            clienteColumns.forEach((col) => {
                if (col.type === "number" && col.header !== "Días vencidos") {
                    const cantidad = parseFloat(item[col.accessor]) || 0;
                    totalesGlobales[col.accessor] += cantidad;
                }
            })
        })
        setTotales(totalesGlobales)
    }

    useEffect(() => {
        getSelects()
    }, [])

    useEffect(() => {
        loadingState.pdf && generatePDF()
    }, [loadingState.pdf])

    useEffect(() => {
        if (data) {
            // generatePDF()
            getTotales()
            setLoadingState({ ...loadingState, info: false })
        }
    }, [data])

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
                                    label: 'Vendedor',
                                    select: true,
                                    disabled: state.checkVendedor === '0',
                                    value: state.vendedorSelected,
                                    options: dataSelect.vendedor,
                                    data: 'nombre_completo',
                                    valueKey: 'IdPersona',
                                    // data: 'tipoCliente_tipo',
                                    // valueKey: 'tipoCliente_idTipoCliente',
                                    onChangeFunc: (e) => { setState({ ...state, vendedorSelected: e }) }
                                },
                                {
                                    label: 'Cliente',
                                    select: true,
                                    value: state.clienteSelected,
                                    options: dataSelect.clientes,
                                    disabled: state.checkCliente === '0',
                                    data: 'numeroYnombre',
                                    valueKey: 'idCliente',
                                    onChangeFunc: (e) => { setState({ ...state, clienteSelected: e }) }
                                },
                                {
                                    label: "Vendedor",
                                    check: true,
                                    checked: state.checkVendedor,
                                    onChangeFunc: (e) => setState({ ...state, checkVendedor: "1", checkCliente: "0" })
                                },
                                {
                                    label: "Cliente",
                                    check: true,
                                    checked: state.checkCliente,
                                    onChangeFunc: (e) => setState({ ...state, checkVendedor: "0", checkCliente: "1" })
                                },
                                {
                                    custom: true,
                                    customItem: () => {
                                        return (
                                            <div className='flex flex-col gap-4 pt-3'>
                                                <button className='h-[48px] w-full bg-primary-color text-white rounded-lg' onClick={() => getData()}>
                                                    Buscar
                                                </button>
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
                                                    onClick={() => excelTemplate(data, clienteColumns, state, excelName())}
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
                        ) : (data ? (
                            <>
                                <Datatable
                                    data={data}
                                    virtual={true}
                                    columns={clienteColumns}
                                />
                                <div className='flex text-center w-full mt-7 bg-[#1B2654] text-white text-[12px] p-2 rounded-md'>
                                    {
                                        clienteColumns.map((columnHeader, colIndex) => {
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

export default CargosClientes