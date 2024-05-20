import TextInput from '@/components/TextInput'
import request, { noty } from '@/utils'
import { Chart } from 'primereact/chart'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { colores, options } from './OpcionesReporte'
import SelectComp from '@/components/SelectComp'
import Datatable from '@/components/Datatable'
import selectOptImg from '../../../../../png/camion.png'
import LoadingDiv from '@/components/LoadingDiv'
import { exportExcel } from '@/core/CreateExcel'
// import { Workbook } from 'exceljs';
// new Intl.DateTimeFormat('es-MX').format(new Date)
import { Box, Button } from "@mui/material";

const ReporteServicioTecnico = () => {
    const [state, setState] = useState({
        loading: true,
        loadingInfo: false,
        reporte: 1,
        fchInicio: '',
        fchFin: '',
        origen: '',
        operadora: '',
        tecnico: '',
        estatus: '',
        ciudad: '',
        colonia: '',
        servicio: ''
    })
    const [selectOpt, setSelectOpt] = useState({
        reportes: [
            { id: 1, text: 'Excel' },
            { id: 2, text: 'Gráfica' }
        ],
        origenes: [],
        operadoras: [],
        tecnicos: [],
        estatus: [],
        ciudades: [],
        colonias: [],
        servicios: [],
        rdy: false
    })
    const [pedidos, setPedidos] = useState()
    const [excelData, setExcelData] = useState()
    const [chartData, setChartData] = useState();

    const excelName = () => {
        const fechaActual = new Intl.DateTimeFormat('es-mx').format(new Date).replaceAll('/', '_')
        return `Reporte_de_servicios_tecnicos_${fechaActual}`
    }

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getSelectOptions = async () => {
        const [origenResponse, operadoraResponse, tecnicoResponse, estatusResponse, ciudadResponse, coloniaResponse, tipoServicioTecnicoResponse] = await Promise.all([
            fetch(route("origen-pedidos.index")).then(response => response.json()), // Origen
            fetch(route("usuarios.index")).then(response => response.json()), // Operadora
            fetch(route("persona.tecnicos")).then(response => response.json()), // Técnico
            fetch(route("estatus-pedidos")).then(response => response.json()), // Estatus
            fetch(route("municipio.index")).then(response => response.json()), // Ciudad
            fetch(route("colonias.index")).then(response => response.json()), // Colonia
            fetch(route("stecnico.index")).then(response => response.json()), // Servicio
        ])
        return {
            origenResponse, operadoraResponse, tecnicoResponse, estatusResponse, ciudadResponse, coloniaResponse, tipoServicioTecnicoResponse
        }
    }

    const getGraph = async () => {
        if (state.fchFin !== '' && state.fchInicio !== '') {
            setState({ ...state, loadingInfo: true })
            try {
                const response = await fetch(route("graficaServTecnico", { fchInicio: state.fchInicio, fchFin: state.fchFin }))
                const data = await response.json()
                setPedidos(data)
            } catch {
                noty("Ocurrió un error al generar el reporte.", 'error')
            }
        } else {
            noty("Verifica que hayas ingresado fechas válidas.", 'error')
        }
    }

    const getExcel = async () => {
        if (state.fchFin !== '' && state.fchInicio !== '') {
            setState({ ...state, loadingInfo: true })
            try {
                const response = await request(route('reporteServTecnico'), 'POST', { ...state })
                setExcelData(response)
            } catch (error) {
                noty("Ocurrió un error al generar el reporte. " + error, 'error')
            }
        } else {
            noty("Verifica que hayas ingresado fechas válidas.", 'error')
        }
    }

    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const excelColumns = [
        { header: "Motivo Servicio", accessor: "motivoServ", type: "text" },
        { header: "Solucion", accessor: "solucion", type: "text" },
        { header: "Comentarios", accessor: "comentarios", type: "text" },
        { header: "Tec. Atendió", accessor: "tecnicoAtendio", type: "text" },
        { header: "Fecha Creación", accessor: "fchCreacion", type: "date" },
        { header: "Fecha Confirmacion", accessor: "fchConfirmacion", type: "date" },
        { header: "Cambio Tanque", accessor: "fchCambioTanque", type: "date" },
        { header: "RDG", accessor: "cantidadRDG", type: "number" },
        { header: "Se cobró a", accessor: "cobroA", type: "text" },
        { header: "Cliente", accessor: "nombreCliente", type: "text" },
        { header: "Dirección", accessor: "direccionCliente", type: "text" },
        { header: "Tel.", accessor: "telCliente", type: "number" },
        { header: "Tel. 2", accessor: "telCliente2", type: "number" },
        { header: "Operadora", accessor: "nombreOperadora", type: "text" },
        { header: "Origen", accessor: "origen", type: "text" }
    ]

    useEffect(() => {
        if (pedidos) {
            const set = pedidos.map((item, index) => {
                return {
                    label: item.descripcion,
                    backgroundColor: colores[index % colores.length],
                    borderColor: 'none',
                    data: [item.pedidos_detalle_count]
                }
            })
            const data = {
                labels: [''],
                datasets: set.map((item) => { return item })
            };
            setChartData(data);
        }
    }, [pedidos]);

    useEffect(() => {
        if (excelData || chartData) {
            setState({ ...state, loadingInfo: false })
        }
        // console.log(state)
    }, [excelData, chartData])

    useEffect(() => {
        getMenuName();
        getSelectOptions()
            .then((res) => {
                setSelectOpt({
                    ...selectOpt,
                    origenes: res.origenResponse,
                    operadoras: res.operadoraResponse,
                    tecnicos: res.tecnicoResponse,
                    estatus: res.estatusResponse.Estatus,
                    ciudades: res.ciudadResponse,
                    colonias: res.colonia,
                    servicios: res.tipoServicioTecnicoResponse,
                    rdy: true
                })
                setState({ ...state, loading: false })
            })
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {(state.loading && !selectOpt.rdy) &&
                <div className='flex place-content-center h-[90vh] w-full'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className='flex gap-6 sm:flex-col md:flex-row'>
                    {(!state.loading && selectOpt.rdy) &&
                        <div className='flex flex-col min-w-[30vh] max-w-[35vh]'>
                            <div className='border-2 rounded-xl shadow-sm px-3 gap-5 pb-6'>
                                <SelectComp
                                    label="Reporte"
                                    options={selectOpt.reportes}
                                    value={state.reporte || 1}
                                    // virtual={true}
                                    data="text"
                                    valueKey="id"
                                    secondKey={state.reporte}
                                    onChangeFunc={(e) => {
                                        setState({ ...state, reporte: e })
                                    }}
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
                                    }} // Añade el border-radius
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
                                    }} // Añade el border-radius
                                />
                                <SelectComp
                                    label="Origen"
                                    firstLabel="Todos"
                                    firstOption={true}
                                    options={selectOpt.origenes}
                                    virtual={true}
                                    value={state.origen}
                                    data="descripcion"
                                    valueKey="idorigen"
                                    onChangeFunc={(e) => {
                                        setState({ ...state, origen: e })
                                    }}
                                    disabled={state.reporte === 2 ? true : false}
                                />
                                <SelectComp
                                    label="Operadora"
                                    firstLabel="Todos"
                                    firstOption={true}
                                    options={selectOpt.operadoras}
                                    virtual={true}
                                    value={state.operadora || ''}
                                    data="usuario_nombre"
                                    valueKey="usuario_idUsuario"
                                    secondKey={state.operadora || ''}
                                    onChangeFunc={(e) => {
                                        setState({ ...state, operadora: e })
                                    }}
                                    disabled={state.reporte === 2 ? true : false}
                                />
                                <SelectComp
                                    label="Técnico"
                                    firstLabel="Todos"
                                    firstOption={true}
                                    options={selectOpt.tecnicos}
                                    virtual={true}
                                    value={state.tecnico || ''}
                                    data="nombre_completo"
                                    valueKey="IdPersona"
                                    secondKey={state.tecnico || ''}
                                    onChangeFunc={(e) => {
                                        setState({ ...state, tecnico: e })
                                    }}
                                    disabled={state.reporte === 2 ? true : false}
                                />
                                <SelectComp
                                    label="Activo"
                                    firstLabel="Todos"
                                    firstOption={true}
                                    options={selectOpt.estatus}
                                    virtual={true}
                                    value={state.estatus || ''}
                                    data="descripcionestatus"
                                    valueKey="estatusid"
                                    secondKey={state.estatus || ''}
                                    onChangeFunc={(e) => {
                                        setState({ ...state, estatus: e })
                                    }}
                                    disabled={state.reporte === 2 ? true : false}
                                />
                                <SelectComp
                                    label="Ciudad"
                                    firstLabel="Todos"
                                    firstOption={true}
                                    options={selectOpt.ciudades}
                                    virtual={true}
                                    value={state.ciudad || ''}
                                    data="descripcionMunicipio"
                                    valueKey="idMunicipio"
                                    secondKey={state.ciudad || ''}
                                    onChangeFunc={(e) => {
                                        setState({ ...state, ciudad: e })
                                    }}
                                    disabled={state.reporte === 2 ? true : false}
                                />
                                {/* <SelectComp
                            label="Colonia"
                            options={selectOpt.colonias}
                            virtual={true}
                            value={state.reporte || ''}
                            data="text"
                            valueKey="id"
                            secondKey={state.reporte || ''}
                            onChangeFunc={(e) => {
                                // setState({ ...state, colonia: e })
                            }}
                             />*/}
                                <SelectComp
                                    label="Servicio"
                                    firstLabel="Todos"
                                    firstOption={true}
                                    options={selectOpt.servicios}
                                    virtual={true}
                                    value={state.servicio || ''}
                                    data={"descripcion"}
                                    valueKey="idproblema"
                                    secondKey={state.servicio || ''}
                                    onChangeFunc={(e) => {
                                        setState({ ...state, servicio: e })
                                    }}
                                    disabled={state.reporte === 2 ? true : false}
                                />
                                <button className='bg-[#1B2654] mt-4 text-white w-full rounded-lg p-3' onClick={state.reporte === 2 ? getGraph : getExcel}>Generar</button>
                            </div>
                        </div>
                    }
                    {state.reporte === 1 && !state.loadingInfo && ((excelData) ? (
                        <div className='relative w-full'>
                            <div className='grid justify-items-end'>
                                {/* <button
                            // disabled={state != optTurnoData.acomulado}
                            
                                className="!bg-excel-color"

                                onClick={() => exportExcel(excelData, excelColumns, excelName())}
                            >
                                Exportar
                            </button> */}
                                <button
                                    variant="contained"
                                    className={`${excelData.length != 0 ? 'bg-[#2e7d32]' : 'bg-[#919191]'} opacity-[85%] p-2 text-white px-4 rounded-md mb-3`}
                                    disabled={excelData.length == 0}
                                    onClick={() => exportExcel(excelData, excelColumns, excelName())}
                                >
                                    Exportar
                                </button>
                            </div>
                            <div className='w-full monitor-table'>
                                <Datatable
                                    data={excelData}
                                    virtual={true}
                                    searcher={false}
                                    columns={[
                                        { header: "Motivo Servicio", accessor: "motivoServ" },
                                        // { header: "Solucion", accessor: "solucion" },
                                        // { header: "Comentarios", accessor: "comentarios" },
                                        { header: "Tec. Atendió", accessor: "tecnicoAtendio" },
                                        { header: "Fecha Creación", accessor: "fchCreacion" },
                                        { header: "Fecha Confirmacion", accessor: "fchConfirmacion" },
                                        { header: "Cambio Tanque", accessor: "fchCambioTanque" },
                                        { header: "RDG", accessor: "cantidadRDG" },
                                        { header: "Se cobró a", accessor: "cobroA" },
                                        { header: "Cliente", accessor: "nombreCliente" },
                                        { header: "Dirección", accessor: "direccionCliente" },
                                        { header: "Tel.", accessor: "telCliente" },
                                        // { header: "Tel. 2", accessor: "telCliente2" },
                                        { header: "Operadora", accessor: "nombreOperadora" },
                                        // { header: "Origen", accessor: "origen" }
                                    ]}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='flex col-span-10 place-content-center w-full'>
                            <img className='scale-50 non-selectable' src={selectOptImg} alt="" />
                        </div>
                    ))
                    }
                    {state.reporte === 2 && !state.loadingInfo && ((chartData) ? (
                        <div className='w-full col-span-10 mx-5 mt-2'>
                            <Chart type="bar" data={chartData} options={options} plugins={[ChartDataLabels]} />
                        </div>
                    ) : (
                        <div className='flex place-content-center w-full col-span-10'>
                            <img className='scale-50 non-selectable' src={selectOptImg} alt="" />
                        </div>
                    ))
                    }
                    {state.loadingInfo && (
                        <div className='w-full col-span-10'>
                            <LoadingDiv />
                        </div>
                    )
                    }
                </div>
            }
        </div>
    )
}

export default ReporteServicioTecnico