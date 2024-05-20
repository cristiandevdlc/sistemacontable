import Tooltip from "@mui/material/Tooltip";
import Datatable from "@/components/Datatable";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp, { FieldDrawer } from "@/components/DialogComp";
import { useState, useEffect } from "react";
import InformacionGeneral from "./Modal/InformacionGeneral";
import InformacionFiscal from "./Modal/InformacionFiscal";
import proveedorData, { intProvSelects, intProvState, proveedorFields, proveedorValidations } from "./IntProveedor";
import request, { dataCodigoPostal, locationBody, validateInputs, } from "@/utils";
import { Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Proveedor = () => {
    const [infoByPostalCode, setInfoByPostalCode] = useState(locationBody)
    const [dataSelects, setDataSelects] = useState(intProvSelects);
    const [state, setState] = useState(intProvState)
    const [proveedorResponse, setProveedorResponse] = useState()
    const [data, setData] = useState(proveedorData);
    const [activeStep, setActiveStep] = useState(0);
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [filtro, setFiltro] = useState({ giroComercial: "", nombreProveedor: "", estatus: "3" });
    const [proveedorFiltrado, setProveedorFiltrado] = useState();
    const [fs, setFs] = useState(true);

    const getMenuName = async () => {
        try {
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getFetchData = async () => {
        const [
            proveedorResponse,
            empresas,
            bancos,
            captacion,
        ] = await Promise.all([
            fetch(route("proveedor.index")).then(res => res.json()),
            request(route("empresas.index")),
            request(route("bancos.index")),
            request(route("captacion.index")),
        ]);
        setProveedorResponse(proveedorResponse)
        setProveedorFiltrado(proveedorResponse)
        setDataSelects({
            ...dataSelects,
            empresas: empresas,
            bancos: bancos,
            captacion: captacion,
        })
    }

    const submit = async (e) => {
        e.preventDefault()
        setErrors({})
        const result = validateInputs(proveedorValidations, data, proveedorFields)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("proveedor.store") : route("proveedor.update", data.proveedor_id);
        const method = action === "create" ? "POST" : 'PUT';
        await request(ruta, method, data).then(() => {
            getFetchData();
            setFs(true)
            handleCrudDialog()
            setErrors({})
            setState({ ...state, open: !open });
        })
    };


    const handleCrudDialog = (states = false, item = proveedorData) => {
        if (!states) setData(proveedorData)
        if (!state.open) {
            setState({ ...state, loadingModal: false })
            const newColoniaData = coloniasPorCodigoPostal(item.proveedor_cp)
            if (states) setData({ ...item, ...newColoniaData })
        }
        else {
            setState({ ...state, open: false })
        }
        setErrors({});
    }

    const coloniasPorCodigoPostal = async (cp = data.proveedor_cp) => {
        const finalResponse = await dataCodigoPostal(cp).finally(() => {
            if (state.loadingModal)
                setState({ ...state, open: true, loadingModal: true })
        });
        setInfoByPostalCode(finalResponse);
        return {
            proveedor_idPais: finalResponse.pais?.idPais,
            proveedor_idEstado: finalResponse.estado?.idEstado,
        };
    };

    useEffect(() => {
        getFetchData()
    }, []);

    useEffect(() => {
        if (proveedorResponse) setState({ ...state, loading: false })
    }, [proveedorResponse])

    useEffect(() => {
        getMenuName();
    }, []);

    const filteredData = () => {
        const filtered = proveedorResponse.filter(proveedor => {
            let match = true;
            const nombre = proveedor.proveedor_id;
            const captacionn = proveedor.captacion[0].tipoCaptacion_idTipoCaptacion;
            const EstatusProveedor = proveedor.proveedor_estatus;

            if (filtro.nombreProveedor && nombre !== filtro.nombreProveedor) {
                match = false;
            }
            if (filtro.estatus != null && filtro.estatus !== "3" && EstatusProveedor !== filtro.estatus) {
                match = false;
            }
            if (filtro.giroComercial && captacionn !== filtro.giroComercial) {
                match = false;
            }

            return match;
        });
        setProveedorFiltrado(filtered);
    };

    return (

        <div className="relative h-[100%] pb-4 px-3 -mt-4">
            {state.loading && <LoadingDiv />}
            <div className="flex relative gap-3 sm:flex-col md:flex-row h-[90%]">
                <div className="flex flex-col gap-2 pt-4 min-w-[300px]">

                    <div className="flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 ">
                        <h1>Buscar por:</h1>
                        <FieldDrawer
                            fields={[
                                {
                                    label: "Nombre Proveedor",
                                    select: true,
                                    options: proveedorResponse,
                                    fieldKey: "NombreComercial",
                                    value: filtro.nombreProveedor,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            nombreProveedor: e,
                                        }),
                                    data: 'proveedor_nombrecomercial',
                                    valueKey: 'proveedor_id',
                                },
                                {
                                    label: "Giro Comercial",
                                    select: true,
                                    options: dataSelects.captacion,
                                    fieldKey: "GiroComercial",
                                    value: filtro.giroComercial,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            giroComercial: e
                                        }),
                                    data: 'tipoCaptacion_tipo',
                                    valueKey: 'tipoCaptacion_idTipoCaptacion',
                                },

                                {
                                    label: "Estatus",
                                    select: true,
                                    options: [
                                        {
                                            label: "Activo",
                                            value: "1",
                                        },
                                        {
                                            label: "Inactivo",
                                            value: "0",
                                        },
                                    ],
                                    fieldKey: "estatus",
                                    value: filtro.estatus,
                                    onChangeFunc: (e) =>
                                        setFiltro({
                                            ...filtro,
                                            estatus: e,
                                        }),
                                    data: 'label',
                                    valueKey: 'value',
                                },
                            ]}
                        />
                        <button className="flex items-center justify-between shadow-md mt-4 bg-[#1B2654] border-2 p-4 rounded-xl text-white text-[12px] gap-3 transition duration-300 hover:bg-[#2c3a78] active:bg-[#344c82]"
                            onClick={(e) => { filteredData(filtro) }}
                        >
                            <span>Buscar</span>
                            <SearchIcon />
                        </button>
                    </div>
                </div>
                <div className="relative col-span-10 mx-5 w-full mt-4">
                    {!state.loading && (
                        <Datatable
                            add={() => {
                                setAction('create')
                                setData(proveedorData)
                                handleCrudDialog(true)
                            }}
                            searcher={false}
                            data={proveedorFiltrado}
                            columns={[
                                { header: 'RFC', accessor: 'proveedor_rfc' },
                                { header: 'Razón Social', accessor: 'proveedor_razonsocial' },
                                { header: 'Teléfono', accessor: 'proveedor_telefono' },
                                { header: 'Correo', accessor: 'proveedor_correo' },
                                { header: 'Activo', accessor: 'proveedor_estatus', cell: eprops => eprops.item.proveedor_estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />) },
                                {
                                    header: "Acciones", edit: (eprops) => {
                                        setActiveStep(0);
                                        setAction('edit')
                                        handleCrudDialog(true, eprops.item)
                                    },
                                }
                            ]}
                        />
                    )}
                </div>
                <DialogComp
                    dialogProps={{
                        model: 'proveedor',
                        width: 'md',
                        openState: state.open,
                        actionState: action,
                        openStateHandler: () => handleCrudDialog(),
                        onSubmitState: () => submit
                    }}
                    activeStep={activeStep}
                    stepperHandler={setActiveStep}
                    steps={[
                        {
                            label: 'Información General',
                            style: 'grid grid-cols-4 gap-x-4',
                            fields: InformacionGeneral(data, setData, dataSelects, infoByPostalCode, setInfoByPostalCode, coloniasPorCodigoPostal)
                        },
                        {
                            label: 'Información Fiscal',
                            style: 'grid grid-cols-2 gap-x-4',
                            fields: InformacionFiscal(data, setData, dataSelects, setDataSelects)
                        },
                    ]}
                    errors={errors}
                />
            </div>
        </div>
    );
}

export default Proveedor