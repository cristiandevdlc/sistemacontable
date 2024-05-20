import Datatable from '@/components/Datatable'
import LoadingDiv from '@/components/LoadingDiv'
import SelectComp from '@/components/SelectComp'
import TextInput from '@/components/TextInput'
import selectOptImg from '../../../../../png/camion.png'
import { Divider } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import request, { noty } from '@/utils'
import SearchIcon from '@mui/icons-material/Search';
import { exportRemisiones } from './ExportRemisiones'
import { Button,Tooltip } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import { Link, useLocation } from 'react-router-dom'

const ReportesLiquidacion = () => {
    const [state, setState] = useState({
        loading: true,
        loadingInfo: false,
        selectedServicio: 2,
        selectedUnidad: '',
        searchTerm: '',
        fchInicio: new Date().toISOString().split("T")[0],
        fchFin: new Date().toISOString().split("T")[0],
        litros: 0,
        cantidad: 0,
        bonificacion: 0,
        importe: 0,
        total: 0
    })
    const [tiposServicio, setTiposServicio] = useState()
    const [unidades, setUnidades] = useState({ estacionario: null, portatil: null })
    const [filteredUnits, setFilteredUnits] = useState([])
    const [tableData, setTableData] = useState()
    const [filteredData, setFilteredData] = useState()
    const [copiaDataTable, setCopiaDataTable] = useState([])




  





    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            console.log(nombreModulo)
            const requestData = await request(route("NameMenu"), 'POST', { modulo: nombreModulo });
            new Noty({
                text: requestData[0].mensaje,
                type: "error",
                theme: "metroui",
                layout: "bottomRight",
                timeout: 3000,
            }).show();

        } catch (error) { }
    };


    function formatoNumero(numero) {
        // Convertir el número a formato de miles y redondear a 2 decimales
        let numeroFormateado = parseFloat(numero).toFixed(4);

        // Separar la parte entera de la parte decimal
        let partes = numeroFormateado.split(".");
        let parteEntera = partes[0];
        let parteDecimal = partes[1];

        // Agregar comas para separar los miles en la parte entera
        if (parteEntera.length > 3) {
            parteEntera = parteEntera.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // Devolver el número formateado
        if (parteDecimal && parteDecimal !== "00") {
            return parteEntera + "." + parteDecimal;
        } else {
            return parteEntera;
        }
    }

    // Ejemplo de uso con el número 44.1706



    const dataColumns = [
        { header: "Control", accessor: "ventaEncabezado_idVentaEncabezado", type: 'number' },
        // { header: "No. Remisión", accessor: "ventaDetalle_remision", type: 'number' },
        // { header: "Fecha", accessor: "ventaEncabezado_fechaVenta", type: 'date' },
        { header: "Unidad", accessor: "unidad_numeroComercial", type: 'text' },
        { header: "Turno", accessor: "turno_nombreTurno", type: 'text' },
        { header: "Vendedor", accessor: "vendedor", type: 'text' },
        { header: "Supervisor", accessor: "supervisor", type: 'text' },
        { header: "Cliente", accessor: "cliente_razonsocial", type: 'text' },
        { header: "Importe", accessor: "importe", type: 'number' },
        { header: "Total", accessor: "total", type: 'number' },

    ]

    const getSelectOptions = async () => {
        const [tiposServicioResponse, unidadesResponse] = await Promise.all([
            fetch(route("tipos-servicios.index")).then(response => response.json()),
            fetch(route("unidades.index")).then(response => response.json())
        ])
        console.log("tiposServicioResponse", tiposServicioResponse)
        return { tiposServicioResponse, unidadesResponse }
    }

    const getRemisiones = async () => {
        setState({ ...state, loadingInfo: true })
        if (state.selectedServicio) {
            if ((state.fchInicio && state.fchFin) && (state.fchInicio !== '' && state.fchFin !== '') && state.fchInicio <= state.fchFin) {
                try {
                    const response = await request(route('getReporteRemision'), "POST",
                        { fchInicio: state.fchInicio, fchFin: state.fchFin, servicio: state.selectedServicio, unidad: state.selectedUnidad },
                        { enabled: true, error: { message: "Ocurrió un error al obtener los registros." }, success: { message: "Registros obtenidos." } }
                    )
                    setTableData(response)
                } catch {
                    setState({ ...state, loadingInfo: false })
                    noty("Ocurrió un error al obtener los registros.", 'error')
                }
            } else {
                noty("Verifica que hayas ingresado fechas válidas.", 'error')
                setState({ ...state, loadingInfo: false })
            }
        } else {
            noty("Debes seleccionar un tipo de servicio.", 'error')
            setState({ ...state, loadingInfo: false })
        }
    }

    useEffect(() => {
        getMenuName();

        getSelectOptions().then((res) => {
            const portatil = res.unidadesResponse.filter(unidad => unidad.tipo_servicio.tipoServicio_idTipoServicio === 1016)
            const estacionario = res.unidadesResponse.filter(unidad => unidad.tipo_servicio.tipoServicio_idTipoServicio === 2)
            setTiposServicio(res.tiposServicioResponse.filter(ts => ts.tipoServicio_idTipoServicio === 2 || ts.tipoServicio_idTipoServicio === 1016))
            setUnidades({
                estacionario: estacionario,
                portatil: portatil
            })
        })
    }, [])

    useEffect(() => {
        if (unidades.estacionario && unidades.portatil) {
            if (state.selectedServicio === 2) {
                const estacionario = unidades.estacionario
                setFilteredUnits(estacionario)
                setState({ ...state, selectedUnidad: "" })
            }
            if (state.selectedServicio === 1016) {
                const portatil = unidades.portatil
                setFilteredUnits(portatil)
                setState({ ...state, selectedUnidad: "" })
            }
        }
    }, [state.selectedServicio, unidades])



    useEffect(() => {
        if (tiposServicio && unidades.estacionario && unidades.portatil) {
            setState({ ...state, loading: false })
        }
        if (filteredData) {
            setState({ ...state, loadingInfo: false })
        }
    }, [tiposServicio, unidades, filteredData])

    useEffect(() => {
        if (tableData) {
            const filteredResults = tableData.filter(reg => {
                const rowValues = Object.values(reg).some(value => {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(state.searchTerm.toLowerCase());
                    }
                    return false;
                });
                return rowValues;
            });
            setState({
                ...state,
                cantidad: new Intl.NumberFormat('es-ES', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(filteredResults.reduce((total, item) => total + (parseFloat(item.ventaDetalle_cantidad) || 0), 0)),
                bonificacion: filteredResults.reduce((total, item) => total + (parseFloat(item.ventaDetalle_bonificacion) || 0), 0).toLocaleString('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
                importe: filteredResults.reduce((total, item) => total + (parseFloat(item.importe) || 0), 0).toLocaleString('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),
                total: filteredResults.reduce((total, item) => total + (parseFloat(item.total) || 0), 0).toLocaleString('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 }),

            })
            setFilteredData(filteredResults)
            // Suponiendo que filteredResults es un array de objetos

            // Obtener solo los encabezados
            const encabezados = Object.keys(filteredResults[0]); // Tomando el primer objeto del array para obtener las propiedades
            setCopiaDataTable(encabezados)

            console.log(encabezados);
            // Debería imprimir ["Control", "Valor"]

        }
    }, [state.searchTerm, tableData])

    return (
        <div className='relative mt-4 w-full h-full'>
            {state.loading &&
                <div className='flex place-content-center h-[90vh] w-full'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className='grid grid-cols-12 h-[90vh] pr-6 pb-8'>
                    <div className='flex flex-col col-span-2 gap-5'>
                        <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-5 pb-8'>
                            <SelectComp
                                label={'Tipo de servicio'}
                                virtual={false}
                                options={tiposServicio}
                                value={state.selectedServicio || ''}
                                data="tipoServicio_descripcion"
                                valueKey="tipoServicio_idTipoServicio"
                                secondKey={state.selectedServicio}
                                onChangeFunc={(e) => setState({ ...state, selectedServicio: e })}
                            />
                            <SelectComp
                                label={'Unidades'}
                                virtual={false}
                                firstLabel="Todos"
                                firstOption={true}
                                options={filteredUnits}
                                value={state.selectedUnidad || ''}
                                data="unidad_numeroComercial"
                                valueKey="unidad_idUnidad"
                                secondKey={state.selectedUnidad || ''}
                                onChangeFunc={(e) => setState({ ...state, selectedUnidad: e })}
                            />
                            <TextInput
                                type="date"
                                label={'Fecha'}

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

                            <button className='bg-[#1B2654] text-white w-full rounded-lg p-3' onClick={getRemisiones}>Generar</button>
                        </div>

                    </div>
                    {!state.loadingInfo && (tableData ? (
                        <div className='relative col-span-10 mx-5 w-full'>
                            <div className='relative grid justify-between grid-cols-2 '>
                                <div className='flex items-center' >


                                </div>

                            </div>


                            <div className="flex-auto md:order-2">
                                <div className="flex flex-wrap">
                                    <div className="w-full flex-none text-sm font-medium text-slate-700">
                                        {filteredData && filteredData.length > 0 ? (
                                            <div className="w-full pt-3 h-[90vh] monitor-table" >
                                                <Datatable
                                                    virtual={true}
                                                    searcher={false}
                                                    data={filteredData}
                                                    editing={{
                                                        mode: "cell",
                                                        allowUpdating: true,
                                                        allowDeleting: false
                                                    }}
                                                    columns={[
                                                        { header: "Control", accessor: "ventaEncabezado_idVentaEncabezado", type: 'number' },
                                                        // { header: "No. Remisión", accessor: "ventaDetalle_remision", type: 'number' },
                                                        // { header: "Fecha", accessor: "ventaEncabezado_fechaVenta", type: 'date' },
                                                        { header: "Unidad", accessor: "unidad_numeroComercial", type: 'text' },
                                                        { header: "Turno", accessor: "turno_nombreTurno", type: 'text' },
                                                        { header: "Vendedor", accessor: "vendedor", type: 'text' },
                                                        { header: "Supervisor", accessor: "supervisor", type: 'text' },
                                                        { header: "Cliente", accessor: "cliente_razonsocial", type: 'text' },
                                                        { header: "Importe", accessor: "importe", type: 'number' },
                                                        { header: "Total", accessor: "total", type: 'number' },
                                                        {
                                                            header: "Acciones",
                                                            cell: (eprops) => (
                                                                <>
                                                                    <Tooltip title="Descargar venta" >

                                                                        <button
                                                                            className="material-icons"
                                                                            onClick={() => {
                                                                                // setAction('edit');
                                                                                // setDireccion({ ...eprops.item });
                                                                                // console.log("Direccion");
                                                                                // setEsta({ idEstado: eprops.item.idEstado, descripcionEstado: "Descripciopn" });
                                                                                // MunicipioEstados(eprops.item.idEstado, eprops.item.idMunicipio, "Descriopcion");
                                                                                // MunicipioColonias(eprops.item.idMunicipio, eprops.item.Colonia_Id, "Descripción");
                                                                                // HistorialPedidos(cliente.clientePedidosId, eprops.item.direccionPedidosId);
                                                                                // setState(0);
                                                                                // document.getElementById("radio-1").checked = true;
                                                                                // document.getElementById("radio-2").checked = false;
                                                                            }}>
                                                                            add
                                                                        </button>
                                                                    </Tooltip>



                                                                </>
                                                            ),
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-[90vh]">
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        {/* <img src={Imagen} alt="" style={{ textAlign: 'center', width: '400px', height: 'auto', marginTop: '2px' }} /> */}
                                                    </div>
                                                    <h2 style={{ textAlign: 'center', fontSize: '20px', color: 'gray' }}>
                                                        No se ha encontrado información.
                                                    </h2>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
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
        </div>
    )
}

export default ReportesLiquidacion