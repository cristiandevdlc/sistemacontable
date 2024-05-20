import Datatable from "@/components/Datatable";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import { useState, useEffect } from "react";
import request, { validateInputs } from '@/utils';
import { Chip } from "@mui/material";

const periodicidadValidations = {
    clave: "required",
    descripcion: "required",
    estatus: "boolean",
}

const Periodicidad = () => {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ loading: false, open: false });
    const [data, setData] = useState({ idPeriodicidad: "", clave: "", descripcion: "", estatus: "" })
    const [periodicidad, setPeriodicidad] = useState()

    const getPeriodicidad = async () => {
        const response = await fetch(route("periodicidad.index"));
        const data = await response.json();
        setPeriodicidad(data);
    };

    useEffect(() => {
        if (!periodicidad) getPeriodicidad();
        else setState({ ...state, loading: false });
    }, [periodicidad]);

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(periodicidadValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("periodicidad.store") : route("periodicidad.update", data.idPeriodicidad);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getPeriodicidad();
            setState({ ...state, open: !state.open });
        });
    };

    const handleModal = () => {
        setState({ ...state, open: !state.open, action: '' });
        setData({ clave: "", descripcion: "", estatus: "" })
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading && <LoadingDiv />}
            {periodicidad && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(data)
                            handleModal()
                        }}
                        data={periodicidad}
                        columns={[
                            { header: 'Clave', accessor: 'clave' },
                            { header: 'Descripción', accessor: 'descripcion' },
                            { header: 'Activo', accessor: 'estatus', cell: eprops => eprops.item.estatus === '1' ? (<Chip label='Activo' color='success' size='small' />) : (<Chip label='Inactivo' color='error' size='small' />) },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    setState({ ...state, open: true })
                                },
                            }
                        ]}
                    />
                </div>
            )}
            <DialogComp
                dialogProps={{
                    model: 'Periodicidad',
                    width: 'sm',
                    openState: state.open,
                    style: 'grid grid-cols-1',
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Clave",
                        input: true,
                        type: 'text',
                        fieldKey: 'clave',
                        value: data.clave || '',
                        onChangeFunc: (e) => { setData({ ...data, clave: e.target.value.replace(/\D/g, "") }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcion',
                        value: data.descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcion: e.target.value }) }
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        labelPlacement: 'start',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
export default Periodicidad;