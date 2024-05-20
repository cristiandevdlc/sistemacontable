import Datatable from '@/components/Datatable'
import LoadingDiv from '@/components/LoadingDiv'
import { Chip } from '@mui/material'
import { useState, useEffect } from 'react'
import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp'

const puestoData = {
    IdPuesto: 0,
    IdDepartamento: '',
    nombre: '',
    estatus: 0,
    TieneHorasExtra: 0,
    esSupervisor: 0
}

const puestoValidations = {
    IdDepartamento: 'required',
    nombre: 'required',
    estatus: 'required',
    TieneHorasExtra: 'required',
}

const Puesto = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState("create");
    const [jobs, setJobs] = useState();
    const [departments, setDepartments] = useState();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(puestoData);

    const getJobs = async () => {
        const response = await request(route("puesto.index"));
        console.log(response);
        setJobs(response);
    };

    const getDepartments = async () => {
        const response = await request(route("departamento.index"));
        setDepartments(response);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        if (data.nombre.trim() === "") {
            newErrors.nombre = "El nombre es requerido.";
            isValid = false;
        }
        if (typeof data.nombre !== "string" || data.nombre.trim() === "") {
            newErrors.IdDepartamento = "El departamento es requerido.";
            isValid = false;
        }
        if (data.estatus !== 0 && data.estatus !== 1) {
            newErrors.estatus = "El estatus es requerido";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const submit = async (e) => {
        // setLoading(true)
        e.preventDefault();

        setErrors({})
        const result = validateInputs(puestoValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("puesto.store") : route("puesto.update", data.IdPuesto);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getJobs();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        if (!jobs) {
            getJobs();
            getDepartments();
        } else {
            setLoading(false);
        }
    }, [jobs]);

    return (
        <>
            {loading && <LoadingDiv />}
            {jobs && !loading && (
                <>
                    <Datatable
                        data={jobs}
                        add={() => { setAction("create"); setData({ IdPuesto: "", IdDepartamento: "", nombre: "", estatus: 0, TieneHorasExtra: 0, }); setOpen(!open); }}
                        columns={[
                            { header: "Nombre", accessor: "nombre" },
                            { header: "Departamento", accessor: "departamento", cell: (eprops) => (<span>{eprops.item.departamento.nombre}</span>), },
                            {
                                header: "Activo", accessor: "estatus",
                                cell: (eprops) => Number(eprops.item.estatus) === 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />),
                            },
                            {
                                header: "Hrs. Extra", accessor: "TieneHorasExtra",
                                cell: (eprops) => Number(eprops.item.TieneHorasExtra) === 1 ? (<Chip label="Si" color="success" size="small" />) : (<Chip label="No" color="error" size="small" />),
                            },
                            {
                                header: "Supervisor", accessor: "TieneHorasExtra",
                                cell: (eprops) => Number(eprops.item.esSupervisor) === 1 ? (<Chip label="Si" color="success" size="small" />) : (<Chip label="No" color="error" size="small" />),
                            },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    setOpen(!open)
                                },
                            },
                        ]}
                    />
                </>
            )}
            <DialogComp dialogProps={{
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit,
                actionState: action,
                openState: open,
                model: 'Puesto',
                width: 'sm',
                style: 'grid grid-cols-3 ',
            }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: 'text',
                        fieldKey: 'nombre',
                        value: data.nombre || '',
                        style: 'col-span-full',
                        onChangeFunc: (e) => { setData({ ...data, nombre: e.target.value }) }
                    },
                    {
                        label: "Departamento",
                        select: true,
                        options: departments || [],
                        value: data.IdDepartamento,
                        style: 'col-span-full',
                        onChangeFunc: (e) => setData({ ...data, IdDepartamento: e }),
                        data: 'nombre',
                        valueKey: 'IdDepartamento',
                        fieldKey: 'IdDepartamento',
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        labelPlacement: 'top',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                    {
                        label: "Horas extras",
                        check: true,
                        fieldKey: 'TieneHorasExtra',
                        checked: data.TieneHorasExtra,
                        labelPlacement: 'top',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            TieneHorasExtra: e.target.checked ? "1" : "0",
                        }),
                    },
                    {
                        label: "Es supervisor",
                        check: true,
                        checked: data.esSupervisor,
                        labelPlacement: 'top',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            esSupervisor: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </>
    );
};

export default Puesto;
