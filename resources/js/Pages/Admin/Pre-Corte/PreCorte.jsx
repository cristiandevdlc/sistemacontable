import request, { moneyFormat, numberFormat, validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp'
import LoadingDiv from '@/components/LoadingDiv'
import Datatable from '@/components/Datatable'
import { useEffect, useState } from 'react'

const precorteData = {
    preCorte_fechaInicio: "",
    preCorte_cantidad: "",
    preCorte_estacionario: "",
    // preCorte_idEmpresa: ""
}

const precorteValidations = {
    preCorte_fechaInicio: "required",
    preCorte_cantidad: "required",
    preCorte_estacionario: "required",
    // preCorte_idEmpresa: "required"
}

export default function PreCorte() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(["edit"]);
    const [precorte, setprecorte] = useState();
    const [loading, setLoading] = useState(true)
    const [empresas, setEmpresas] = useState([])
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(precorteData);
    const [precorteID, setprecorteId] = useState(0);

    const fetchdata = async () => {
        getPrecorte();
        getEmpresas();
    };

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };


    const getPrecorte = async () => {
        const response = await fetch(route("precorte.index"));
        const data = await response.json();
        setprecorte(data);
    };

    const getEmpresas = async () => {
        const response = await fetch(route("empresas.index"));
        const data = await response.json();
        setEmpresas(data);
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(precorteValidations, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("precorte.store") : route("precorte.update", precorteID);
        const method = action === "create" ? "POST" : action === "edit" ? "PUT" : "DELETE";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        document.title = 'Intergas | Precorte';

        if (open && !precorte) {
            getPrecorte();
            getEmpresas();

        }
    }, [open])

    useEffect(() => {
        if (!precorte) {
            getPrecorte();
            getEmpresas();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [precorte])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(precorte && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={precorte}
                        add={() => {
                            setAction('create')
                            setData(precorteData)
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Estacionario', cell: ({ item }) => `$ ${moneyFormat(item.preCorte_estacionario)}` },
                            { header: 'Cantidad', cell: ({ item }) => `$ ${moneyFormat(item.preCorte_estacionario)}` },
                            // { header: 'Fecha Inicio', accessor: 'preCorte_fechaInicio' },
                            { header: 'Fecha Inicio', cell: ({ item }) => <span>{(new Date(item.preCorte_fechaInicio)).formatMXNoTime()}</span> },
                            { header: 'Empresa', accessor: 'empresa', cell: ({ item }) => <span>{item.empresa.empresa_razonSocial}</span> },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setprecorteId(eprops.item.preCorte_idPreCorte);
                                    setOpen(!open)
                                },
                            }
                        ]}
                    />
                </div>
            }
            <DialogComp
                dialogProps={{
                    model: 'precorte',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Estacionario",
                        fieldKey: 'preCorte_estacionario',
                        input: true,
                        type: "decimal",
                        value: data.preCorte_estacionario,
                        customIcon: 'attach_money',
                        onChangeFunc: (e) => {
                            const inputValue = e.target.value;
                            const validInput = inputValue; // Remove non-numeric characters
                            setData({
                                ...data,
                                preCorte_estacionario: validInput
                            });
                        },
                    },
                    {
                        label: "Cantidad",
                        fieldKey: 'preCorte_cantidad',
                        input: true,
                        type: "decimal",
                        value: data.preCorte_cantidad,
                        customIcon: 'attach_money',
                        onChangeFunc: (e) => {
                            const inputValue = e.target.value;
                            const validInput = inputValue; // Remove non-numeric characters
                            setData({
                                ...data,
                                preCorte_cantidad: validInput
                            });
                        },
                    },
                    {
                        label: "Fecha de inicio",
                        fieldKey: 'preCorte_fechaInicio',
                        input: true,
                        type: "date",
                        min: "1800-01-01",
                        value: data.preCorte_fechaInicio,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                preCorte_fechaInicio: e.target.value,
                            }),
                    },
                    // {
                    //     label: "Empresa",
                    //     fieldKey: 'preCorte_idEmpresa',
                    //     input: false,
                    //     select: true,
                    //     options: empresas,
                    //     value: data.preCorte_idEmpresa || '',
                    //     onChangeFunc: (newValue) =>
                    //         setData({
                    //             ...data,
                    //             preCorte_idEmpresa: newValue,
                    //         }),
                    //     data: "empresa_razonComercial",
                    //     valueKey: "empresa_idEmpresa",
                    // },
                ]}
                errors={errors}
            />
        </div>

    );
}
