import LoadingDiv from '@/components/LoadingDiv'
import selectOptImg from '../../../../../../png/camion.png'
import { Chart } from 'primereact/chart'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Datatable from '@/components/Datatable'
import TextInput from '@/components/TextInput'
import { Checkbox, FormControlLabel } from '@mui/material'
import request, { noty } from '@/utils'
import { exportExcel } from '@/core/CreateExcel'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { colores, options } from './OpcionesReporte'
import { useRef } from 'react'

const ReporteConfClientes = () => {
    const [state, setState] = useState({
        loading: true,
        loadingInfo: false,
        loadingExcel: false,
        fchInicio: '',
        fchFin: new Date().toISOString().split("T")[0],
        checkResultados: false,
        fileName: ''
    })
    const [excelData, setExcelData] = useState()
    const [promedios, setPromedios] = useState()
    const [chartData, setChartData] = useState()
    const chart = useRef()

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
        { header: "Operadora", accessor: "usuario_nombre", type: "text" },
        { header: "Llamadas Que Debió Hacer", accessor: "total", type: "number" },
        { header: "Llamadas Hechas", accessor: "contactados", type: "number" },
        { header: "Sin Respuesta", accessor: "sinRespuesta", type: "number" },
    ]

    const promediosColumns = [
        { header: "Pregunta", accessor: "pregunta", type: "text" },
        { header: "Promedio", accessor: "promedio", type: "number" },
    ]

    const onChangeCheckResultados = (e) => {
        setState({ ...state, checkResultados: e.target.checked })
    }

    const getData = async () => {
        setState({ ...state, loadingInfo: true })
        if (state.checkResultados) {
            try {
                const response = await request(route('promedios-encuesta'),
                    "POST",
                    { fchInicio: state.fchInicio, fchFin: state.fchFin },
                    { enabled: true, error: { message: "Ocurrió un error al obtener los registros." }, success: { message: "Registros obtenidos." } }
                )
                setPromedios(response)
            } catch {
                noty("Ocurrió un error al obtener los datos.", 'error')
                setState({ ...state, loadingInfo: false })
            }
        } else {
            try {
                const response = await request(route('confCliente-operadora'),
                    "POST",
                    { fchInicio: state.fchInicio, fchFin: state.fchFin },
                    { enabled: true, error: { message: "Ocurrió un error al obtener los registros." }, success: { message: "Registros obtenidos." } }
                )
                setExcelData(response)
            } catch {
                noty("Ocurrió un error al obtener los datos.", 'error')
                setState({ ...state, loadingInfo: false })
            }
        }
    }

    useEffect(() => {
        if (promedios) {
            const set = promedios.map((item, index) => {
                return {
                    label: item.pregunta,
                    backgroundColor: colores[index % colores.length],
                    borderColor: 'none',
                    data: [item.promedio]
                }
            })
            const data = {
                labels: [''],
                datasets: set.map((item) => { return item })
            };
            setChartData(data);
        }
    }, [promedios]);

    useEffect(() => {
        if (excelData || promedios) {
            // getExcel().then(() => {
            setState({ ...state, loadingInfo: false, loadingExcel: false })
            // setExcelData(null)
            // })
        }
    }, [excelData, promedios])

    useEffect(() => {
        setState({ ...state, loading: false })
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
                <div className='flex gap-6 sm:flex-col md:flex-row'>
                    <div className='flex flex-col col-span-2 gap-5 min-w-[30vh]'>
                        <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-5 pb-8'>
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
                                        checked={state.checkResultados || false}
                                        onChange={onChangeCheckResultados}
                                    />
                                }
                                label="Resultados" />
                            <button className='bg-[#1B2654] text-white w-full rounded-lg p-3' onClick={getData}>Generar</button>
                        </div>
                    </div>
                    {!state.loadingInfo && ((excelData && !state.checkResultados) ? (
                        <div className='relative col-span-10 w-full mt-2'>
                            <div className='grid justify-items-end'>
                                <button
                                    className='bg-[#2e7d32] opacity-[85%] p-2 text-white px-4 rounded-md mb-3'
                                    onClick={() => exportExcel(excelData, excelColumns, "Reporte confirmación cliente")}
                                >
                                    Exportar
                                </button>
                            </div>
                            <Datatable
                                data={excelData}
                                virtual={true}
                                searcher={false}
                                columns={excelColumns}
                            />
                        </div>
                    ) : ((promedios && state.checkResultados && chartData) ? (
                        <div className='relative col-span-10 w-full mt-2'>
                            <div className='grid justify-items-end'>
                                <button
                                    className='bg-[#2e7d32] opacity-[85%] p-2 text-white px-4 rounded-md mb-3'
                                    onClick={() => exportExcel(promedios, promediosColumns, "Reporte promedios encuestas", chart.current.getBase64Image())}
                                    // onClick={() => {
                                    //     exportExcel({ compList, data, origenes }, chart.current.getBase64Image())
                                    // }}
                                >
                                    Exportar
                                </button>
                            </div>
                            <Datatable
                                data={promedios}
                                virtual={true}
                                searcher={false}
                                columns={promediosColumns}
                            />
                            <div className='w-full col-span-10 mt-4 border-2 shadow-md px-4 pb-3 rounded-xl'>
                                <Chart className="h-[75%] w-[99%] min-[1080px]:h-[100%]" type="bar" ref={chart} data={chartData} options={options} plugins={[ChartDataLabels]} />
                            </div>
                        </div>
                    ) : (
                        <div className='flex col-span-10 place-content-center w-full'>
                            <img className='scale-50 non-selectable' src={selectOptImg} alt="" />
                        </div>
                    )
                    ))
                    }
                    {state.loadingInfo && (
                        <div className='w-full col-span-10'>
                            <LoadingDiv />
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default ReporteConfClientes