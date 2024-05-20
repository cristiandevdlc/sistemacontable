import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';

const fpData = {
    formasPago_cveFormasPago: "",
    formasPago_descripcion: "",
    formasPago_bancarizado: '1',
    formasPago_telemark: ""
};

const fpValidations = {
    formasPago_cveFormasPago: "required",
    formasPago_descripcion: "required",
    formasPago_bancarizado: "required",
    formasPago_telemark: "required"
}

const FormasPago = () => {
    const [action, setAction] = useState("create")
    const [loading, setLoading] = useState(true)
    const [payForms, setPayForms] = useState()
    const { data, setData } = useForm(fpData);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false)

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const fetchData = async () => {
        const response = await fetch(route("formas-pago.index"));
        const data = await response.json();
        setPayForms(data);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        if (data.formasPago_cveFormasPago == "") {
            newErrors.formasPago_cveFormasPago = "La clave es requerida.";
            isValid = false;
        }
        if (data.formasPago_descripcion == "") {
            newErrors.formasPago_descripcion = "La descripción es requerida.";
            isValid = false;
        }
        if (data.formasPago_telemark == "") {
            newErrors.formasPago_telemark = "La forma de pago es requerida.";
            isValid = false;
        }


        setErrors(newErrors);
        return isValid;
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(fpValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("formas-pago.store") : route("formas-pago.update", data.formasPago_idFormasPago)
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchData();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    }

    useEffect(() => {
        getMenuName();
    }, [])

    useEffect(() => {
        if (!payForms) {
            fetchData()
        } else {
            setLoading(false)
        }
    }, [payForms])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(payForms && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={payForms}
                        add={() => {
                            setAction('create')
                            setData(fpData)
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Clave', accessor: 'formasPago_cveFormasPago' },
                            { header: 'Descripción', accessor: 'formasPago_descripcion' },
                            { header: 'Forma de pago telemark', accessor: 'formasPago_telemark' },
                            { header: 'Bancarizado', accessor: 'formasPago_bancarizado', cell: eprops => eprops.item.formasPago_bancarizado === '1' ? (<Chip label='Si' color='success' size='small' />) : (<Chip label='No' color='error' size='small' />) },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    setOpen(!open)
                                },
                            }
                        ]}
                    />
                </div>
            }
            <DialogComp


                dialogProps={{
                    model: 'forma de pago',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        input: true,
                        label: 'Clave',
                        type: 'text',
                        value: data.formasPago_cveFormasPago,
                        onChangeFunc: (e) => {
                            if (e.target.value.length < 3)
                                setData({ ...data, formasPago_cveFormasPago: e.target.value })
                        }
                    },
                    {
                        input: true,
                        label: 'Descripcion',
                        type: 'text',
                        value: data.formasPago_descripcion,
                        onChangeFunc: (e) => {
                            setData({ ...data, formasPago_descripcion: e.target.value })
                        }
                    },
                    {
                        input: true,
                        label: 'Desc. Pago Telemark',
                        type: 'text',
                        value: data.formasPago_telemark,
                        onChangeFunc: (e) => {
                            setData({ ...data, formasPago_telemark: e.target.value })
                        }
                    },
                    {
                        check: true,
                        label: 'Bancarizado',
                        checked: data.formasPago_bancarizado,
                        labelPlacement: 'end',
                        style: 'col-span-2 justify-center',
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                formasPago_bancarizado: e.target.checked ? "1" : "0",
                            })
                        }
                    }
                ]}
                errors={errors}
            />
        </div>
    )
}

export default FormasPago