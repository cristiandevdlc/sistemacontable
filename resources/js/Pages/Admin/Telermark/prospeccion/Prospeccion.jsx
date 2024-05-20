import { Button, DialogActions, Tooltip, Checkbox, FormControlLabel } from "@mui/material";
import request, { getCurrDateInput, validateInputs } from '@/utils';
import SelectComp from "@/components/SelectComp";
import DialogComp from "@/components/DialogComp";
import TextInput from "@/components/TextInput";
import Datatable from '@/components/Datatable';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import LoadingDiv from "@/components/LoadingDiv";

const prospeccionValidations = {
    fechasugerida1: 'required',
    idMotivoReprospeccion: 'required'
}

export default function Prospeccion() {
    const [state, setState] = useState({ loading: true })
    const [openReprogramacion, setOpenReprogramacion] = useState(false);
    const [prospeccionProducto, setpProspeccioProducto] = useState([]);
    const [openCancelacion, setOpenCancelacion] = useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const [action, setAction] = useState("create");
    const [operadora, setOperadora] = useState();
    const [errors, setErrors] = useState({});
    const [filters, setFilters] = useState({
        fecha: getCurrDateInput().split('T')[0],
        filtrarPorFecha: false,
        operadora: '',
        estatus: 2,
    })
    const [data, setData] = useState({
        prospeccionid: "",
        fechasugerida1: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        idMotivoReprospeccion: "",
        usuarioid: "",
    });

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };




    useEffect(() => {
        filterProspects();
        getMenuName();
    }, [filters]);

    const filterProspects = async () => {
        const response = await request(route("prospecciones-filtradas"), 'POST', filters, { enabled: true });
        if (response && response.length > 0) {
            setpProspeccioProducto(response);
            new Noty({
                text: "Registo obtenido",
                type: "suceess",
                theme: "metroui",
                layout: "bottomRight",
                timeout: 3000,
            }).show();
        } else {
            new Noty({
                text: "No hay datos para mostrar",
                type: "error",
                theme: "metroui",
                layout: "bottomRight",
                timeout: 3000,
            }).show();
        }
    }

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        if (data.fechasugerida1.trim() === "") {
            newErrors.fechasugerida1 = "La fecha es requerida ";
            isValid = false;
        }
        if (data.idMotivoReprospeccion.trim() === null) {
            newErrors.idMotivoReprospeccion = "El motivo es requerido";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const operadoras = async () => {
        const response = await fetch(route("operadora"));
        const data = await response.json();
        setOperadora(data);
    };

    const reprogramarProspeccion = async (e) => {
        setErrors({})
        const result = validateInputs(prospeccionValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        await request(route("prospeccion.update", data.prospeccionid), 'PUT', data).then(() => {
            filterProspects()
            handleReprogramacionModal()
        });
    };

    const submitCancelar = async (e) => {
        e.preventDefault();
        await request(route("prospeccion.destroy", data.prospeccionid), 'DELETE', {}, {
            enabled: true,
            success: {
                message: 'Prospección cancelada',
                type: 'error'
            }
        }).then(() => {
            filterProspects()
            handleCancelacionModal()
        });
    };

    const handleCancelacionModal = () => {
        setOpenCancelacion(!openCancelacion);
        setErrors({});
    };

    const handleReprogramacionModal = () => {
        setOpenReprogramacion(!openReprogramacion);
        setErrors({});
    };

    useEffect(() => {
        operadoras();
    }, [])

    useEffect(() => {
        if (operadora) setState({ ...state, loading: false })
    }, [operadora])

    useEffect(() => {
        filterProspects()
    }, [filters]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <div className='flex items-center justify-center h-screen'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className='flex gap-6 sm:flex-col md:flex-row'>
                    <div className='flex flex-col min-w-[30vh] gap-4'>
                        <div className="border-2 w-full shadow-md px-4 pb-3 rounded-xl">
                            <SelectComp
                                label="Activo"
                                options={[
                                    { id: "2", value: "Todos" },
                                    { id: "1", value: "Activos" },
                                    { id: "0", value: "Cancelados" },
                                ]}
                                value={filters.estatus}
                                onChangeFunc={(newValue) => { setFilters({ ...filters, estatus: newValue }) }}
                                data="value"
                                valueKey="id"
                            />
                            <SelectComp
                                label="Operadora"
                                options={operadora}
                                value={filters.operadora || ""}
                                onChangeFunc={(newValue) => { setFilters({ ...filters, operadora: newValue }) }}
                                // onChangeFunc={submitFilterOperadora}
                                data="usuario_nombre"
                                valueKey="usuarioid"
                                fistrOption={true}
                                firstLabel='Ninguno'
                            />
                            <TextInput
                                label='Fecha'
                                className="block w-full mt-1 texts"
                                onChange={(e) => { setFilters({ ...filters, fecha: e.target.value }) }}
                                type="date"
                                value={filters.fecha}
                                max={(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                                defaultValue={currentDate}
                            />
                            <FormControlLabel
                                label="Filtrar por fecha"
                                className="mt-4 ms-5"
                                control={
                                    <Checkbox
                                        sx={{
                                            "& .MuiSvgIcon-root": {
                                                fontSize: 30,
                                            },
                                        }}
                                        checked={filters.filtrarPorFecha} onChange={(e) => {
                                            setFilters({ ...filters, filtrarPorFecha: filters.filtrarPorFecha ? false : true })
                                        }}
                                    />
                                }
                            />
                        </div>
                    </div>
                    {(prospeccionProducto) &&
                        <div className="w-full monitor-table">
                            <Datatable
                                data={prospeccionProducto}
                                searcher={false}
                                virtual={true}
                                columns={[
                                    {
                                        header: " ", width: '12.5%', cell: eprops => (
                                            <div className='relative w-[25px] h-[40px]'>
                                                <div className={(eprops.item.estatus == 1
                                                    ? "bg-[#46DC00]" // Verde
                                                    : eprops.item.estatus == 2
                                                        ? "bg-[#FFE601]" // Amarillo
                                                        : "bg-[#FF0000]") // Rojo
                                                    + ' absolute rounded-full h-[100%] w-[9px] top-0 left-2'}></div>
                                            </div>
                                        )
                                    },
                                    { width: '12.5%', header: 'Nombre', accessor: 'Nombre', width: '10%' },
                                    { width: '12.5%', header: 'Telefono', accessor: 'telefono', width: '10%' },
                                    { width: '12.5%', header: 'Producto', accessor: 'producto_nombre', width: '10%' },
                                    { width: '12.5%', header: 'Razon', accessor: 'RazonProspeccion', alignment: 'start' },
                                    {
                                        width: '12.5%', header: 'Fecha Programada', accessor: 'fechasugerida1', cell: eprops => {
                                            const fechaCompleta = eprops.item.fechasugerida1;
                                            const fechaSinCeros = fechaCompleta.slice(0, -12);
                                            const fechaFormateada = fechaSinCeros.substring(0, 10);
                                            return <span>{fechaFormateada}</span>;
                                        }
                                    },
                                    {
                                        width: '12.5%', header: 'Actualizacion',
                                        accessor: 'fechaactualizacion',
                                        cell: eprops => {
                                            const fechaactualizacion = eprops.item.fechaactualizacion;
                                            const fechaSinCeros = fechaactualizacion ? fechaactualizacion.slice(0, -12) : '';
                                            const fechaFormateada = fechaSinCeros.substring(0, 10);
                                            return <span>{fechaFormateada}</span>;
                                        }
                                    },
                                    {
                                        width: '12.5%', header: 'Acciones',
                                        custom: eprops =>
                                            <>
                                                <Tooltip title="Ver cliente">
                                                    <Link to="/clientes-pedidos" state={{ item: eprops.item }}>
                                                        <button className="material-icons">person</button>
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip title="Reprogramar">
                                                    <button className="material-icons"
                                                        onClick={() => {
                                                            setData({
                                                                ...eprops.item,
                                                                fechasugerida1: new Date().toISOString().split('T')[0]
                                                            })
                                                            handleReprogramacionModal(!openReprogramacion)
                                                        }}
                                                    > today </button>
                                                </Tooltip>
                                                <Tooltip title="Cancelar">
                                                    <button className="material-icons"
                                                        onClick={() => {
                                                            setData({ ...eprops.item })
                                                            handleCancelacionModal()
                                                        }}
                                                    > close </button>
                                                </Tooltip>
                                            </>
                                    }
                                ]}

                            />
                        </div>
                    }
                    <DialogComp
                        dialogProps={{
                            model: `Reprogramar prospección a cliente: ${data.Nombre}`,
                            width: 'sm',
                            openState: openReprogramacion,
                            customTitle: true,
                            style: 'grid grid-cols-1 gap-4',
                            openStateHandler: () => handleReprogramacionModal(),
                            onSubmitState: () => reprogramarProspeccion,
                        }}
                        fields={[
                            {
                                label: "Fecha sugerida",
                                input: true,
                                type: 'date',
                                fieldKey: 'fechasugerida1',
                                value: data.fechasugerida1,
                                onChangeFunc: (e) => {
                                    setData({
                                        ...data,
                                        fechasugerida1: e.target.value
                                    })
                                }
                            },
                            {
                                label: "Motivo de preprogramación",
                                options: [
                                    { id: 1, value: 'No se encontro al cliente' },
                                    { id: 2, value: 'Cliente Solicito Se Le Hablara Despues' }
                                ],
                                value: data.idMotivoReprospeccion || '',
                                onChangeFunc: (newValue) => {
                                    setData({
                                        ...data,
                                        idMotivoReprospeccion: newValue
                                    })
                                },
                                data: "value",
                                valueKey: "id",
                                fieldKey: "idMotivoReprospeccion",
                                select: true,
                                fistrOption: true,
                                firstLabel: 'Ninguno'
                            },
                        ]}
                        errors={errors}
                    />
                    <DialogComp
                        dialogProps={{
                            model: `Cancelar prospección a cliente: ${data.Nombre}`,
                            width: 'xs',
                            openState: openCancelacion,
                            customTitle: true,
                            style: 'grid grid-cols-1 gap-4',
                            actionState: action,
                            openStateHandler: () => handleCancelacionModal(),
                            onSubmitState: () => cancelarProspeccion,
                            customAction: () => {
                                return (
                                    <>
                                        <DialogActions>
                                            <Button color="error" onClick={submitCancelar}>
                                                Confirmar cancelación
                                            </Button>
                                            <Button color='info' onClick={() => { handleCancelacionModal(); }}>
                                                Cerrar
                                            </Button>
                                        </DialogActions>
                                    </>
                                )
                            }
                        }}
                        errors={errors}
                    />
                </div>
            }
        </div>
    );
}