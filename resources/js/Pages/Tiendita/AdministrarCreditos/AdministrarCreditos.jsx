import Datatable from "@/components/Datatable";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import request, { validateInputs } from "@/utils";

const AdministrarCreditos = () => {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false)
    const [state, setState] = useState({ loading: true, clientesSelectList: null, creditosList: null });
    const [data, setData] = useState({
        idCreditoTiendita: null,
        idPersona: null,
        estatusCredito: false,
        limiteCredito: null,
        fechaEstatus: '',
        creditoUsado: 0,
        persona: {}
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

    const getFetchData = async () => {
        const [clientesResponse, creditosResponse] = await Promise.all([
            request(route('nombreClientes'), "GET"),
            request(route('creditStatusPerClient'), "GET")
        ]);
        setState({ ...state, creditosList: creditosResponse, clientesSelectList: clientesResponse })
    }

    const creditosValidations = {
        idPersona: "required",
        limiteCredito: "required",
        estatusCredito: "boolean",
    }

    const submit = async (e) => {
        const result = validateInputs(creditosValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        e.preventDefault();
        const ruta = action === "create" ? route("administrar-creditos.store", 'POST', { enabled: true, success: { type: 'success', message: "Registrado en Correctamente" } }) : route("administrar-creditos.update", data.idCreditoTiendita);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getFetchData()
            handleCloseModal()
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setData({
            idCreditoTiendita: null,
            idPersona: null,
            estatusCredito: false,
            limiteCredito: null,
            fechaEstatus: '',
            creditoUsado: 0,
            persona: {}
        });
    }

    useEffect(() => {
        getFetchData()
        getMenuName()
    }, []);
    1537.595

    useEffect(() => {
        if (state.creditosList) setState({ ...state, loading: false })
    }, [state.creditosList])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            {!state.loading &&
                <div className="w-full">
                    <Datatable
                        add={() => {
                            setAction('create');
                            setOpen(true)
                        }}
                        virtual={true}
                        data={state.creditosList}
                        columns={[
                            {
                                header: 'Clientes',
                                accessor: 'idPersona'
                            },
                            { header: 'Límite Crédito', accessor: 'limiteCredito' },
                            { header: 'Crédito Usado', accessor: 'creditoUsado' },
                            {
                                header: 'Estatus', accessor: 'estatusCredito', cell: (eprops) =>
                                    eprops.item.estatusCredito === "1" ? (
                                        <Chip label="Activo" color="success" />
                                    ) : (
                                        <Chip label="Inactivo" color="error" />
                                    )
                            },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit');
                                    setData(eprops.item)
                                    setOpen(true)
                                },
                            }
                        ]}
                    />
                    <DialogComp
                        dialogProps={{
                            model: 'Asignar Crédito',
                            width: 'sm',
                            openState: open,
                            style: 'grid grid-cols-1 gap-4',
                            actionState: action,
                            openStateHandler: () => handleCloseModal(),
                            onSubmitState: () => submit
                        }}
                        fields={[
                            {
                                label: "Clientes",
                                select: true,
                                style: 'col-span-2',
                                options: state.clientesSelectList,
                                value: data.idPersona,
                                disabled: action === 'edit',
                                fieldKey: 'idPersona',
                                onChangeFunc: (e) => setData({ ...data, idPersona: e }),
                                data: 'nombre_completo',
                                valueKey: 'IdPersona',
                            },
                            {
                                label: "Límite Crédito",
                                input: true,
                                type: 'decimal',
                                customIcon: 'attach_money',
                                fieldKey: 'limiteCredito',
                                value: data.limiteCredito || '',
                                onChangeFunc: (e) => setData({ ...data, limiteCredito: e.target.value })
                            },
                            {
                                label: "Activo",
                                check: true,
                                fieldKey: 'estatusCredito',
                                checked: data.estatusCredito,
                                labelPlacement: 'start',
                                style: 'justify-center mt-5',
                                onChangeFunc: (e) => setData({ ...data, estatusCredito: e.target.checked ? "1" : "0" }),
                            },
                        ]}
                        errors={errors}
                    />
                </div>
            }
        </div>
    );
}
export default AdministrarCreditos