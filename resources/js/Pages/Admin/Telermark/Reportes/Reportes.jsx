import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Datatable from "@/components/Datatable";
import TextInput from "@/components/TextInput";
import React from "react";
import SelectComp from "@/components/SelectComp";
import request from '@/utils';
import { handleExportToExcel } from './ExcelReportes'
import Imagen from './img/camion.png'
import LoadingDiv from "@/components/LoadingDiv";
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

export default function Reportes() {
    const { data, setData } = useForm({
        zona: "",
        fechai: new Date().toISOString().split("T")[0],
        fechaf: new Date().toISOString().split("T")[0],
        operadora: "",
        vendedor: "",
        ciudad: "",
        colonia: "",
        origen: "",
        unidad: "",
        ruta: "",
        estatus: "",
        servicio: ""
    });
    const [loading, setLoading] = useState(true)
    const [mostrar, setMostrar] = useState(false)
    const [estatus, setEstatus] = useState();
    const [unidades, setUnidades] = useState();
    const [rutas, setRutas] = useState();
    const [reportes, setReportes] = useState();
    const [municipios, setMunicipios] = useState();
    const [servicios, setServicios] = useState();
    const [zonas, setZonas] = useState([]);
    const [estados, setEstados] = useState([]);
    const [esta, setEsta] = useState({});
    const [mun, setMun] = useState({ idMunicipio: "", descripcionMunicipio: "" });
    const [col, setCol] = useState({ Colonia_Id: "", Colonia_Nombre: "" });
    const [colonias, setColonias] = useState();
    const [origenes, setOrigen] = useState([]);
    const [operadora, setOperadora] = useState();

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const fetchdata = async () => {
        try {
            await Promise.all([
                getOperadorr(),
                getOrigen(),
                getZonas(),
                getEstados(),
                getUnidades(),
                getEstatus(),
                getServicios(),
                getRutas(),
                getTurno(),
                getUnidades(),
                getZonas(),

            ]);
            // Todas las llamadas asincrónicas se han completado aquí
        } catch (error) {
            //   console.error("Error al cargar los datos:", error);
            // Manejar el error de alguna manera, como mostrar un mensaje de error al usuario
        }
    };

    const getReportes = async () => {
        setMostrar(true)
        const requestBody = {
            estatus: data.estatus,
            ruta: data.ruta,
            unidad: data.unidad,
            colonias: col.Colonia_Id,
            zona: data.zona,
            servicio: data.servicio,
            fechai: data.fechai,
            fechaf: data.fechaf,
            ciudad: mun.idMunicipio,
            origen: data.origen,
            operadora: data.operadora
        }
        const requestData = await request(route("reportes"), 'POST', requestBody)
        setReportes(requestData.Reportes)
        setMostrar(false)
    };

    useEffect(() => {
        console.log('data', data)
    }, [data])

    function calculateMinDate() {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);  // Resta un mes
        // Formatea la fecha en el formato necesario para datetime-local
        const formattedOneMonthAgo = oneMonthAgo.toISOString().substring(0, 16);
        return formattedOneMonthAgo;  // Devuelve la fecha mínima
    }

    function calculateMaxDate() {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);  // Resta un mes
        // Formatea las fechas en el formato necesario para datetime-local
        const formattedToday = today.toISOString().substring(0, 16);
        const formattedLastMonth = lastMonth.toISOString().substring(0, 16);
        return formattedToday;  // Devuelve la fecha máxima
    }

    const MunicipioEstados = async (e) => {
        const requestBody = { id: e };
        const requestData = await request(route("buscarPorEstadoTelemark"), 'POST', requestBody)
        setMunicipios(requestData);
    };

    const getEstados = async () => {
        const response = await fetch(route("estados-filtrados"));
        const data = await response.json();
        setEstados(data);
    };

    const MunicipioColonias = async (e) => {
        const requestBody = { id: e };
        const requestData = await request(route("buscarPorMunicipio"), 'POST', requestBody)
        setColonias(requestData);
    };

    const getEstatus = async () => {
        const responseR = await fetch(route("estatus.index"));
        const dataR = await responseR.json();
        setEstatus(dataR);
    };

    const getOrigen = async () => {
        const response = await fetch(route("origen-pedidos.index"));
        const data = await response.json();
        setOrigen(data);
    };

    const getServicios = async () => {
        const responseTs = await fetch(route("tipos-servicios.index"));
        const dataTs = await responseTs.json();
        setServicios(dataTs);
    };
    const getZonas = async () => {
        const responseTs = await fetch(route("zonas.index"));
        const dataTs = await responseTs.json();
        setZonas(dataTs);
    };

    const getRutas = async () => {
        const responseR = await fetch(route("rutas.index"));
        const dataR = await responseR.json();
        setRutas(dataR);
    };

    const getUnidades = async () => {
        const responseT = await fetch(route("unidades.index"));
        const dataT = await responseT.json();
        setUnidades(dataT);
    };
    const getOperadorr = async () => {
        const responseR = await fetch(route("operadora"));
        const dataR = await responseR.json();
        setOperadora(dataR);
    };

    const handleDescargarClick = async () => {
        if (reportes && reportes.length > 0) {
            new Noty({
                text: "Descargando...",
                type: "success",
                theme: "metroui",
                layout: "bottomRight",
                timeout: 2000,
            }).show();
            // Exportar los datos a Excel utilizando el componente DataTableExcel
            const dataToExport = reportes.map((item) => ({
                fechaPedido: item.fechaPedido,
                pedidoId: item.pedidoId,
                telefono: item.telefono,
                nombre: item.Nombre + ' ' + item.Apellido1 + ' ' + item.Apellido2,
                domicilio: item.calle + ' ' + item.numeroExterior,
                entrecalles: item.entrecalle1 + '-' + item.entrecalle2,
                colonia: item.Colonia_Nombre,
                ciudad: item.descripcionMunicipio,
                cantidad: item.Cantidad,
                ruta: item.ruta_nombre,
                vendedor: item.Nombres + ' ' + item.ApePat + ' ' + item.ApeMat,
                estatus: item.descripcionestatus,
                motivo: item.motivocancelacionid,
                fechaconfirmacion: item.fechaConfirmacion,
                remision: item.remision,
                origen: item.descripcion,
                unidadMedida_nombre: item.unidadMedida_nombre,
                operadora: item.usuario_nombre,
                tipoServicio_descripcion: item.tipoServicio_descripcion,
                informacion: item.servicio,
                fechacreacion: item.FechaCreacion
            }));
            handleExportToExcel(dataToExport);
        } else {
            new Noty({
                text: "No hay datos para descargar",
                type: "error",
                theme: "metroui",
                layout: "bottomRight",
                timeout: 2000,
            }).show();
        }
    };

    const limpiarReportes = () => {
        setReportes([]);
        new Noty({ text: "Se han limpiado los reportes con exito", type: "success", theme: "metroui", layout: "bottomRight", timeout: 2000, }).show();
    };

    useEffect(() => {
        fetchdata().then(() => setLoading(false));
        getMenuName();
    }, []);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading &&
                <div className="flex gap-6 sm:flex-col md:flex-row">
                    <div className="flex flex-col min-w-[40vh] gap-4">
                        <div className='grid grid-cols-2 gap-2 border-2 w-full shadow-md px-4 pb-3 rounded-xl'>
                            <TextInput
                                label="Fecha de inicio"
                                type="date"
                                className="block w-full texts"
                                value={data.fechai || new Date().toISOString().split('T')[0]}
                                max={calculateMaxDate()}
                                min={calculateMinDate()}
                                onChange={(newDate) => {
                                    setData({
                                        ...data,
                                        fechai: newDate.target.value,
                                    })
                                }}
                            />
                            <TextInput
                                type="date"
                                label="Fecha de fin"
                                className="block w-full"
                                style={{ borderRadius: '10px' }}
                                value={data.fechaf || new Date().toISOString().split('T')[0]}
                                max={calculateMaxDate()}
                                min={calculateMinDate()}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        fechaf: e.target.value,
                                    });
                                }}
                            />
                            <SelectComp
                                label="Zonas"
                                value={data.zona}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(newValue) =>
                                    setData({
                                        ...data,
                                        zona: newValue,
                                    })
                                }
                                options={zonas}
                                data={'zona_descripcion'}
                                valueKey="zona_idZona"
                            />
                            <SelectComp
                                label="Estado"
                                options={estados}
                                value={esta.idEstado || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(e) => {
                                    setEsta({
                                        ...esta,
                                        idEstado: e,
                                    });
                                    MunicipioEstados(e)
                                }}
                                data="descripcionEstado"
                                valueKey="idEstado"
                            />
                            <SelectComp
                                label="Ciudad"
                                options={municipios}
                                value={mun.idMunicipio || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(e) => {
                                    setMun({
                                        ...mun,
                                        idMunicipio: e,
                                    });
                                    MunicipioColonias(e)
                                }}
                                data="descripcionMunicipio"
                                valueKey="idMunicipio"
                            />
                            <SelectComp
                                label="Colonia"
                                options={colonias}
                                value={col.Colonia_Id || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(e) =>
                                    setCol({
                                        ...col,
                                        Colonia_Id: e,
                                    })
                                }
                                data="Colonia_Nombre"
                                valueKey="Colonia_Id"
                            />
                            <SelectComp
                                label="Unidad"
                                value={data.unidad || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(newValue) =>
                                    setData({
                                        ...data,
                                        unidad: newValue,
                                    })
                                }
                                options={unidades}
                                data="unidad_numeroComercial"
                                valueKey="unidad_idUnidad"
                            />
                            <SelectComp
                                label="Operadora"
                                options={operadora}
                                value={data.operadora || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(newValue) =>
                                    setData({
                                        ...data,
                                        operadora: newValue,
                                    })
                                }
                                data="usuario_nombre"
                                valueKey="usuario_idUsuario"
                            />
                            <SelectComp
                                label="Origen"
                                value={data.origen || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(newValue) =>
                                    setData({
                                        ...data,
                                        origen: newValue,
                                    })
                                }
                                options={origenes}
                                data="descripcion"
                                valueKey="idorigen"
                            />
                            <SelectComp
                                label="Ruta"
                                value={data.ruta || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(newValue) =>
                                    setData({
                                        ...data,
                                        ruta: newValue,
                                    })
                                }
                                options={rutas}
                                data="ruta_nombre"
                                valueKey="ruta_idruta"
                            />
                            <SelectComp
                                label="Activo"
                                value={data.estatus || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(newValue) =>
                                    setData({
                                        ...data,
                                        estatus: newValue,
                                    })
                                }
                                options={estatus}
                                data="descripcionestatus"
                                valueKey="estatusid"
                            />
                            <SelectComp
                                label="Tipo de servicio"
                                value={data.servicio || ""}
                                fistrOption={true}
                                firstLabel="Todas"
                                onChangeFunc={(newValue) =>
                                    setData({
                                        ...data,
                                        servicio: newValue,
                                    })
                                }
                                options={servicios}
                                data="tipoServicio_descripcion"
                                valueKey="tipoServicio_idTipoServicio"
                            />
                            <div className='grid grid-cols-1 gap-1 col-span-2'>
                                <Button variant="contained" endIcon={<SearchIcon />} style={{ fontWeight: 'bold', backgroundColor: '#041768', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }}
                                    onClick={getReportes}>Buscar</Button>
                                <Button
                                    variant="contained"
                                    className="!bg-excel-color"
                                    endIcon={<span className="material-icons">calculate</span>}
                                    onClick={handleDescargarClick} style={{ fontWeight: 'bold', height: '50px', color: 'white', borderRadius: '10px', opacity: '85%', width: '100%', marginTop: '20px', }}
                                >
                                    Exportar a excel
                                </Button>
                                <Button variant="contained" endIcon={<DeleteSweepIcon />} style={{ fontWeight: 'bold', backgroundColor: '#036cf5', color: 'white', marginTop: '20px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%' }}
                                    onClick={limpiarReportes}>Limpiar</Button>
                            </div>
                        </div>
                    </div>
                    {
                        (reportes && reportes.length > 0) ? (
                            <div className="col-span-1 lg:col-span-2 w-full pt-3 monitor-table" >
                                <Datatable
                                    virtual={true}
                                    searcher={false}
                                    data={reportes}
                                    columns={[
                                        { header: "Fecha", accessor: "fechaPedido", cell: ({ item }) => item.fechaPedido ? (new Date(item.fechaPedido)).formatMX() : '' },
                                        { header: 'Folio', accessor: 'turno_nombreTurno', cell: ({ item }) => item.pedidoId },
                                        { header: 'Telefono', accessor: 'turno_nombreTurno', cell: ({ item }) => item.telefono },
                                        { header: 'Nombre del cliente', accessor: 'turno_nombreTurno', cell: ({ item }) => item.Nombre + " " + item.Apellido1 + " " + item.Apellido2 },
                                        { header: 'Colonia', accessor: 'turno_nombreTurno', cell: ({ item }) => item.Colonia_Nombre },
                                        { header: 'Cantidad', accessor: 'turno_nombreTurno', cell: ({ item }) => item.Cantidad },
                                        { header: 'Unidades', accessor: 'turno_nombreTurno', cell: ({ item }) => item.unidadMedida_nombre },
                                        { header: 'Servicio', accessor: 'turno_nombreTurno', cell: ({ item }) => item.tipoServicio_descripcion },
                                    ]}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center place-content-center w-full h-[80vh]">
                                <img className='scale-75' src={Imagen} alt="" />
                                <h2 style={{ fontSize: '18px', color: 'gray' }}>
                                    No se ha encontrado información.
                                </h2>
                            </div>
                        )
                    }
                </div>
            }
        </div>
    );
}

