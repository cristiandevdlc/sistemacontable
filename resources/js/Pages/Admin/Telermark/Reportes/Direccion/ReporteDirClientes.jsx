import LoadingDiv from '@/components/LoadingDiv'
import TextInput from '@/components/TextInput'
import selectOptImg from '../../../../../../png/camion.png'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Checkbox, Divider, FormControlLabel } from '@mui/material'
import request, { noty } from '@/utils'
import Datatable from '@/components/Datatable'
import SelectComp from '@/components/SelectComp'
import { exportExcel } from '@/core/CreateExcel'
import PreviewRepDirClientes from './PreviewRepDirClientes'

const ReporteDirClientes = () => {
    const [state, setState] = useState({
        loading: true,
        loadingInfo: false,
        loadingExcel: false,
        openPreview: false,
        type: '',
        fchInicio: null,
        fchFin: new Date().toISOString().split("T")[0],
        ruta: false,
        idRuta: null,
        idColonia: null,
        colonia: false,
        selectedMunicipio: null,
        fileName: ''
    })
    const [totales, setTotales] = useState()
    const [municipios, setMunicipios] = useState()
    const [excelData, setExcelData] = useState()
    const [tableData, setTableData] = useState({
        rutas: {},
        colonias: {},
        tabla: ''
    })

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const excelColumns = [
        { header: "Teléfono", accessor: "telefono", type: "number" },
        { header: "Nombre", accessor: "nombreCliente", type: "text" },
        { header: "Dirección", accessor: "direccionCliente", type: "text" },
        { header: "Empresa", accessor: "nombreNegocio", type: "text" },
        { header: "Colonia", accessor: "colonia", type: "text" },
        { header: "Ciudad", accessor: "ciudad", type: "text" },
        { header: "Fecha último pedido", cell: ({ item }) => item.fchUltimoPedido ? (new Date(item.fchUltimoPedido)).formatMX() : '', type: "date" },
        { header: "Llenos", accessor: "llenos", type: "text" },
        { header: "Recargas", accessor: "recargas", type: "text" },
        { header: "Estacionario", accessor: "estacionario", type: "text" }
    ]

    const getTotales = async (idRuta = null, colonia = null) => {
        const response = await request(
            route("totales-dir-clientes"), "POST",
            {
                fchInicio: state.fchInicio,
                fchFin: state.fchFin,
                ruta: idRuta,
                colonia: colonia,
                municipio: state.selectedMunicipio
            }, { enabled: true }
        )
        setTotales({ ...response })
    }

    const getMunicipios = async () => {
        const response = await fetch(route("muns-for-telemark")).then((res) => res.json())
        return response
    }

    const goToColonias = async (idRuta) => {
        setState({ ...state, loadingInfo: true })
        try {
            const response = await request(route("buscar-dir-clientes"),
                "POST",
                { idRuta: idRuta, fchInicio: state.fchInicio, fchFin: state.fchFin },
                { enabled: true, error: { message: "Hubo un error al obtener registros." }, success: { message: "Registros obtenidos." } }
            )
            getTotales(idRuta)
            setTableData(response)
            setState({ ...state, loadingInfo: false })
        } catch {
            noty("Ocurrió un error al generar el reporte.", 'error')
        }
        setState({ ...state, loadingInfo: false, loadingExcel: false })
    }

    const getClientesInRuta = async (ruta) => {
        setState({ ...state, loadingExcel: true, type: ruta.idRuta, fileName: (`CLIENTES RUTA ${ruta.nombreRuta}`) })
        try {
            const response = await request(route('clientes-by-ruta'),
                "POST",
                { idRuta: ruta.idRuta, fchInicio: state.fchInicio, fchFin: state.fchFin },
                { enabled: true, error: { message: "Hubo un error al obtener registros." }, success: { message: "Registros obtenidos." } }
            )
            setExcelData(response)
        } catch {
            noty("Ocurrió un error al generar el reporte.", 'error')
            setState({ ...state, loadingInfo: false, loadingExcel: false })
        }
    }

    const getAllClientesInRuta = async (ruta) => {
        setState({ ...state, loadingExcel: true, type: ruta.idRuta, fileName: (`CLIENTES TOTALES RUTA ${ruta.nombreRuta}`) })
        try {
            const response = await request(route('all-clientes-by-ruta'),
                "POST",
                { idRuta: ruta.idRuta },
                { enabled: true, error: { message: "Hubo un error al obtener registros." }, success: { message: "Registros obtenidos." } }
            )
            setExcelData(response)
        } catch {
            noty("Ocurrió un error al generar el reporte.", 'error')
            setState({ ...state, loadingInfo: false, loadingExcel: false })
        }
    }

    const getByProducto = async (idColonia, producto) => {
        setState({ ...state, loadingExcel: true, type: idColonia, fileName: (`CLIENTES COLONIA ${idColonia} ${producto.toUpperCase()}`) })
        try {
            const response = await request(route('clientes-by-producto'),
                "POST",
                { idColonia: idColonia, producto: producto, fchInicio: state.fchInicio, fchFin: state.fchFin, idRuta: state.idRuta },
                { enabled: true, error: { message: "Hubo un error al obtener registros." }, success: { message: "Registros obtenidos." } }
            )
            setExcelData(response)
            getTotales(null, idColonia)
        } catch {
            noty("Ocurrió un error al generar el reporte.", 'error')
            setState({ ...state, loadingInfo: false, loadingExcel: false })
        }
    }

    const getAllPerColonia = async (colonia) => {
        setState({ ...state, loadingExcel: true, type: colonia.idColonia, fileName: (`CLIENTES COLONIA ${colonia.idColonia}`) })
        try {
            const response = await request(route('clientes-by-colonia'),
                "POST",
                { idColonia: colonia.idColonia/* , idRuta: state.idRuta, fchInicio: state.fchInicio, fchFin: state.fchFin, */ },
                { enabled: true, error: { message: "Hubo un error al obtener registros." }, success: { message: "Registros obtenidos." } }
            )
            setExcelData(response)
            getTotales(null, colonia.idColonia)
        } catch {
            noty("Ocurrió un error al generar el reporte.", 'error')
            setState({ ...state, loadingInfo: false, loadingExcel: false })
        }
    }

    const getFromTotales = async (type) => {
        setState({ ...state, loadingExcel: true, type: type })
        try {
            const response = await request(route('clientes-by-totales'),
                "POST",
                { type: type },
                { enabled: true, error: { message: "Hubo un error al obtener registros." }, success: { message: "Registros obtenidos." } }
            )
            if (type === '') setState({ ...state, fileName: 'Clientes totales' })
            if (type === 'conServicio') setState({ ...state, fileName: 'Clientes con pedidos' })
            if (type === 'sinServicio') setState({ ...state, fileName: 'Clientes sin pedidos' })
            if (type === 'estacionario') setState({ ...state, fileName: 'Clientes con estacionario' })
            if (type === 'portatil') setState({ ...state, fileName: 'Clientes con portátil' })
            setExcelData(response)
        } catch {
            noty("Ocurrió un error al generar el reporte.", 'error')
            setState({ ...state, loadingInfo: false, loadingExcel: false })
        }
    }

    const getClientes = async () => {
        if (state.selectedMunicipio) {
            if (!state.colonia && !state.ruta) {
                noty("Selecciona busqueda por ruta o colonia.", 'error')
            } else {
                setState({ ...state, loadingInfo: true })
                try {
                    const response = await request(route("buscar-dir-clientes"),
                        "POST",
                        { fchInicio: state.fchInicio, fchFin: state.fchFin, municipio: state.selectedMunicipio, ruta: state.ruta, colonia: state.colonia },
                        { enabled: true, error: { message: "Hubo un error al obtener registros." }, success: { message: "Registros obtenidos." } }
                    )
                    setTableData(response)
                    getTotales()
                    setState({ ...state, loadingInfo: false, idRuta: null })
                } catch {
                    noty("Ocurrió un error al generar el reporte.", 'error')
                    setState({ ...state, loadingInfo: false })
                }
            }
        } else {
            noty("Selecciona un municipio.", 'error')
        }
    }

    const onChangeCheckColonia = () => {
        if (state.ruta) {
            setState({ ...state, ruta: false, colonia: !state.colonia })
        } else {
            setState({ ...state, colonia: !state.colonia })
        }
    }

    const onChangeCheckRuta = () => {
        if (state.colonia) {
            setState({ ...state, ruta: !state.ruta, colonia: false })
        } else {
            setState({ ...state, ruta: !state.ruta })
        }
    }

    const excelName = () => {
        return state.fileName
    }

    const getExcel = () => {
        return new Promise((resolve, reject) => {
            exportExcel(excelData, excelColumns, excelName())
            const checkInterval = setInterval(() => {
                const a = document.querySelector('a[download]');
                if (a === null) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        })
    }

    const closePreview = () => {
        setState({ ...state, openPreview: false })
        setExcelData(null)
    }

    useEffect(() => {
        if (excelData) {
            setState({ ...state, openPreview: true, loadingExcel: false })
            // getExcel().then(() => {
            //     setState({ ...state, loadingExcel: false })
            //     setExcelData(null)
            // })
        }
    }, [excelData])

    useEffect(() => {
        getMunicipios()
            .then((res) => {
                setMunicipios(res)
            })
    }, [])

    useEffect(() => {
        if (!totales) {
            getTotales()
        } else if (totales && municipios) {
            setState({ ...state, loading: false })
        }
    }, [totales, municipios])

    useEffect(() => {
        getMenuName();
    }, [])

    return (
        <div className='relative h-[100%] pb-4 px-3 overflow-auto blue-scroll'>
            {state.loading &&
                <div className='flex place-content-center h-[90vh] w-full'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className='flex gap-4 sm:flex-col md:flex-row'>
                    <div className='flex flex-col min-w-[30vh] gap-4'>
                        <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-5 pb-8'>
                            <SelectComp
                                label={'Municipios'}
                                virtual={true}
                                options={municipios}
                                value={state.selectedMunicipio || ''}
                                data="descripcionMunicipio"
                                valueKey="idMunicipio"
                                secondKey={state.selectedMunicipio}
                                onChangeFunc={(e) => setState({ ...state, selectedMunicipio: e })}
                            />
                            <TextInput
                                type="date"
                                className="block w-full"
                                min="1900-01-01"
                                max={state.fchFin ?? new Date().toISOString().split("T")[0]}
                                value={state.fchInicio}
                                onChange={(event) => setState({ ...state, fchInicio: event.target.value })}
                                style={{
                                    borderRadius: "12px",
                                    padding: "15px",
                                }}
                            />
                            <TextInput
                                type="date"
                                className="block w-full"
                                min={state.fchInicio ?? "1900-01-01"}
                                max={new Date().toISOString().split("T")[0]}
                                value={state.fchFin}
                                onChange={(event) => setState({ ...state, fchFin: event.target.value })}
                                style={{
                                    borderRadius: "12px",
                                    padding: "15px",
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                        checked={state.ruta || false}
                                        onChange={onChangeCheckRuta}
                                    />
                                }
                                label="Ruta" />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                        checked={state.colonia || false}
                                        onChange={onChangeCheckColonia}
                                    />
                                }
                                label="Colonia" />
                            <button className='bg-[#1B2654] text-white w-full rounded-lg p-3' onClick={getClientes}>Generar</button>
                        </div>
                        <div className='flex flex-col shadow-md /* bg-[#1B2654] */ border-2 p-4 rounded-xl text-white gap-2'>
                            <div className='flex justify-between'>
                                <span>Total de clientes</span>
                                <a className={(state.loadingExcel && state.type === '') ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                    onClick={() => getFromTotales('')}>
                                    {totales.totalClientes}
                                </a>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Con servicio</span>
                                <a className={(state.loadingExcel && state.type === 'conServicio') ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                    onClick={() => getFromTotales('conServicio')}>
                                    {totales.conServicio}
                                </a>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Sin servicio</span>
                                <a className={(state.loadingExcel && state.type === 'sinServicio') ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                    onClick={() => getFromTotales('sinServicio')}>
                                    {totales.sinServicio}
                                </a>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Estacionario</span>
                                <a className={(state.loadingExcel && state.type === 'estacionario') ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                    onClick={() => getFromTotales('estacionario')}>
                                    {totales.estacionario}
                                </a>
                            </div>
                            <Divider color='#5F6C91' />
                            <div className='flex justify-between'>
                                <span>Portátil</span>
                                <a className={(state.loadingExcel && state.type === 'portatil') ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                    onClick={() => getFromTotales('portatil')}>
                                    {totales.portatil}
                                </a>
                            </div>
                        </div>
                    </div>
                    {!state.loadingInfo && ((tableData.tabla !== '') ? (
                        tableData.tabla === 'rutas' ? (
                            <div className='w-full'>
                                <Datatable
                                    data={tableData.rutas}
                                    virtual={true}
                                    searcher={false}
                                    columns={[
                                        {
                                            header: "Ruta", accessor: "nombreRuta", cell: eprops => <a className='underline underline-offset-4 text-[#0053E4] cursor-pointer'
                                                onClick={() => getAllClientesInRuta(eprops.item)}>{eprops.item.nombreRuta}</a>  /* todas */
                                        },
                                        {
                                            header: "Colonias", accessor: "Colonias", cell: eprops => <a className='underline underline-offset-4 text-[#0053E4] cursor-pointer'
                                                onClick={() => goToColonias(eprops.item.idRuta)}>{eprops.item.Colonias}</a>
                                        },
                                        {
                                            header: "Clientes", accessor: "Clientes", cell: eprops => <a className={(state.loadingExcel && state.type === eprops.item.idRuta) ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                                onClick={() => getClientesInRuta(eprops.item)}>{eprops.item.Clientes}</a>
                                        },
                                    ]}
                                />
                            </div>
                        ) : (
                            tableData.tabla === 'colonias' && (
                                <div className='w-full'>
                                    <Datatable
                                        data={tableData.colonias}
                                        virtual={true}
                                        searcher={false}
                                        columns={[
                                            {
                                                header: "Colonia", accessor: "nombreColonia", cell: eprops => <a className={(state.loadingExcel && state.type === eprops.item.idColonia) ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                                    onClick={() => getAllPerColonia(eprops.item)}>{eprops.item.nombreColonia}</a>
                                            },
                                            {
                                                header: "Estacionario", accessor: "estacionario", cell: eprops => <a className={(state.loadingExcel && state.type === eprops.item.idColonia) ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                                    onClick={() => getByProducto(eprops.item.idColonia, 'estacionario')}>{eprops.item.estacionario}</a>
                                            },
                                            {
                                                header: "Portátil", accessor: "portatil", cell: eprops => <a className={(state.loadingExcel && state.type === eprops.item.idColonia) ? 'cursor-progress' : 'cursor-pointer' + ' underline underline-offset-4 text-[#0053E4]'}
                                                    onClick={() => getByProducto(eprops.item.idColonia, 'portatil')}>{eprops.item.portatil}</a>
                                            },
                                        ]}
                                    />
                                </div>
                            )
                        )
                    ) : (
                        <div className='flex col-span-10 place-content-center w-full'>
                            <img className='scale-50 non-selectable' src={selectOptImg} alt="" />
                        </div>
                    ))
                    }
                    {state.loadingInfo && (
                        <div className='w-full col-span-10'>
                            <LoadingDiv />
                        </div>
                    )}
                </div>
            }
            <PreviewRepDirClientes
                open={state.openPreview}
                onClose={closePreview}
                data={excelData ?? []}
                columns={excelColumns}
                exportFunc={getExcel}
                title={state.fileName}
            />
        </div>
    )
}

export default ReporteDirClientes