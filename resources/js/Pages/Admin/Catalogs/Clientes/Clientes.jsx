import clienteData, { IntClientDialogs, IntDataSelects, clienteValidation } from "./IntCliente";
import request, { validateInputs, dataCodigoPostal, locationBody } from "@/utils";
import ClientActionsDialog from "./Modal/ClientActionsDialog";
import InformacionGeneral from "./Modal/InformacionGeneral";
import InformacionFiscal from "./Modal/InformacionFiscal";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Chip from "@mui/material/Chip";
import SelectComp from '@/components/SelectComp';
import { ButtonComp } from "@/components/ButtonComp";

export default function Clientes() {
    const [infoByPostalCode, setInfoByPostalCode] = useState(locationBody)
    const [dataSelects, setDataSelects] = useState(IntDataSelects)
    const [states, setStates] = useState(IntClientDialogs)
    const [activeStep, setActiveStep] = useState(0);
    const { data, setData } = useForm(clienteData);
    const [action, setAction] = useState("create");
    const [clientes, setClientes] = useState();
    const [errors, setErrors] = useState({});
    const [filtro, setFiltro] = useState({ estatus: '', credito: '', cobrador: '', cliente: '', captacion: '' });
    const [clientesfiltradas, setClientesfiltradas] = useState();
    const estatus = [{ label: 'Activo', value: "1" }, { label: 'Inactivo', value: "0" }];

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getAllData = async () => {
        const [
            tipoClientes,
            tipoCaptaciones,
            tipoCarteras,
            formaPagos,
            vendedores,
            cfdis,
            regimenes,
        ] = await Promise.all([
            fetch(route("tipo-clientes.index")).then(res => res.json()),
            fetch(route("captacion.index")).then(res => res.json()),
            fetch(route("tipo-cartera.index")).then(res => res.json()),
            fetch(route("formas-pago.index")).then(res => res.json()),
            fetch(route("persona.vendedores")).then(res => res.json()),
            fetch(route("uso-cfdi.index")).then(res => res.json()),
            fetch(route("sat/regimen-fiscal.index")).then(res => res.json()),
        ])

        setDataSelects({
            tipoClientes: tipoClientes,
            tipoCaptaciones: tipoCaptaciones,
            tipoCarteras: tipoCarteras,
            formaPagos: formaPagos,
            vendedores: vendedores,
            cfdis: cfdis,
            regimenes: regimenes,
        })
    }

    const coloniasPorCodigoPostal = async (cp = data.cliente_codigoPostal) => {
        const finalResponse = await dataCodigoPostal(cp).finally(() => {
            if (states.loadingModal)
                setStates({ ...states, crudDialog: true, loadingModal: true })
        });
        setInfoByPostalCode(finalResponse);
        return {
            cliente_idPais: finalResponse.pais?.idPais,
            cliente_ciudad: finalResponse.municipio?.descripcionMunicipio,
            cliente_idEstado: finalResponse.estado?.idEstado,
            descripcionMunicipio: finalResponse.municipio?.idMunicipio,
            cliente_localidad: finalResponse.municipio?.descripcionMunicipio,
        };
    };

    const GetClientes = async () => {
        const responseR = await fetch(route("clientes.index"));
        const dataR = await responseR.json();
        setClientes(dataR);
        setClientesfiltradas(dataR);
    };

    const submitClient = async (e) => {

        e.preventDefault();

        setErrors({})
        const result = validateInputs(clienteValidation, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === 'create' ? route("clientes.store") : route("clientes.update", data.cliente_idCliente);
        const metodo = action === 'create' ? 'POST' : 'PUT'
        await request(ruta, metodo, data).then(() => {
            GetClientes();
            setStates({ ...states, crudDialog: false });
        })
    };

    const handleActionsDialog = (state = false, item = clienteData) => {
        if (state) setData(item)
        else setData(clienteData)
        setStates({ ...states, actionsDialog: !states.actionsDialog })
    }

    const handleCrudDialog = (state = false, item = clienteData) => {
        if (!state) setData(clienteData)
        if (!states.crudDialog) {
            setStates({ ...states, loadingModal: false })
            const newColoniaData = coloniasPorCodigoPostal(item.cliente_codigoPostal)
            if (state) setData({ ...item, ...newColoniaData })
        }
        else
            setStates({ ...states, crudDialog: false })
        setErrors({});
    }

    useEffect(() => {
        getAllData()
        getMenuName()
    }, [])

    useEffect(() => {
        if (!clientes) GetClientes()
        else setStates({ ...states, loading: false });
    }, [clientes]);


    const filteredData = () => {
        const filtered = clientes.filter(client => {
            const { estatus, credito, cliente, captacion, cobrador } = filtro;
            const Estatus = String(client.cliente_estatus);
            const Credito = String(client.cliente_tieneCredito);

            return (!estatus || estatus === "3" || Estatus === estatus) &&
                (!credito || credito === "3" || Credito === credito) &&
                (!cliente || cliente === 0 || Number(client.cliente_idTipoCliente) === cliente) &&
                (!captacion || captacion === 0 || Number(client.cliente_idTipoCaptacion) === captacion) &&
                (!cobrador || cobrador === 0 || Number(client.cliente_idVendedor) === cobrador);
        });

        setClientesfiltradas(filtered);
    };

    return (
        <div className="relative h-[100%] pb-12 px-3 overflow-auto blue-scroll">
            {states.loading && <LoadingDiv />}
            {clientes && !states.loading && (
                <>

                    <section className='gap-6 flex-col sm:w-full md:w-[275px] sm:float-none md:float-left border-2 rounded-xl relative px-4 pb-4'>

                        <SelectComp
                            label="Activo"
                            options={estatus}
                            value={filtro.estatus}
                            data="label"
                            valueKey="value"
                            onChangeFunc={(e) => setFiltro({ ...filtro, estatus: e })}
                        />

                        <SelectComp
                            label="Credito"
                            options={estatus}
                            value={filtro.credito}
                            data="label"
                            valueKey="value"
                            onChangeFunc={(e) => setFiltro({ ...filtro, credito: e })}
                        />

                        <SelectComp
                            label="Tipo cliente"
                            options={dataSelects.tipoClientes}
                            value={filtro.cliente}
                            data="tipoCliente_tipo"
                            valueKey="tipoCliente_idTipoCliente"
                            onChangeFunc={(e) => setFiltro({ ...filtro, cliente: e })}
                        />

                        <SelectComp
                            label="Tipo captacion"
                            options={dataSelects.tipoCaptaciones}
                            value={filtro.captacion}
                            data="tipoCaptacion_tipo"
                            valueKey="tipoCaptacion_idTipoCaptacion"
                            onChangeFunc={(e) => setFiltro({ ...filtro, captacion: e })}

                        />
                        <SelectComp
                            label="Cobrador"
                            options={dataSelects.vendedores}
                            value={filtro.cobrador}
                            data="nombre_completo"
                            valueKey="IdPersona"
                            onChangeFunc={(e) => setFiltro({ ...filtro, cobrador: e })}
                        />

                        <ButtonComp
                            onClick={filteredData}
                            label="Buscar"
                        />
                    </section>


                    <section className='relative flex flex-col h-full items-stretch sm:pl-0 md:pl-4'>
                        <Datatable
                            data={clientesfiltradas}
                            virtual={true}
                            add={() => {
                                setAction("create");
                                setData(clienteData);
                                // handleModal('cliente'); 
                                handleCrudDialog(true)
                            }}
                            columns={[
                                { header: "No. Cliente", accessor: "cliente_idCliente", width: '40%' },
                                { header: "Razón social", accessor: 'cliente_razonsocial', width: '40%' },
                                { header: "RFC", accessor: 'cliente_rfc', width: '40%' },
                                {
                                    header: "Credito",
                                    cell: (eprops) => <>{eprops.item.cliente_tieneCredito == "1" ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>,
                                    width: '40%'
                                }, {
                                    header: "Activo",
                                    cell: (eprops) => <>{eprops.item.cliente_estatus == "1" ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>,
                                    width: '40%'
                                },
                                {
                                    header: "Acciones",
                                    width: '20%',
                                    edit: (eprops) => {
                                        setAction("edit");
                                        handleCrudDialog(true, eprops.item)
                                    },
                                    cell: (eprops) => (

                                        <Tooltip title="Mas acciones">
                                            <button className="material-icons" onClick={() => handleActionsDialog(true, eprops.item)}>manage_accounts</button>
                                        </Tooltip>
                                    )
                                },
                            ]}
                        />
                    </section>
                </>
            )}

            <DialogComp
                dialogProps={{
                    model: 'cliente',
                    width: 'md',
                    openState: states.crudDialog,
                    style: 'grid grid-cols-4 gap-x-4',
                    actionState: action,
                    openStateHandler: () => handleCrudDialog(),
                    onSubmitState: () => submitClient
                }}
                activeStep={activeStep}
                stepperHandler={setActiveStep}
                steps={[
                    { label: 'Información general', style: 'grid grid-cols-4 gap-x-4', fields: InformacionGeneral(data, setData, action, infoByPostalCode, setInfoByPostalCode, coloniasPorCodigoPostal) },
                    { label: 'Información físcal', style: 'grid grid-cols-4 gap-x-4', fields: InformacionFiscal(data, setData, dataSelects) }
                ]}
                errors={errors}
            />

            {states.actionsDialog && <ClientActionsDialog
                open={states.actionsDialog}
                dialogHandler={handleActionsDialog}
                data={data}
                setData={setData}
                getClientes={GetClientes}
            />}
        </div >
    );
}