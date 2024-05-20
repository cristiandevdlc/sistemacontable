import request, { fileDownloader, requestMultipart, validateInputs, } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import Imagen from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';

const dptoData = {
    IdDepartamento: 0,
    nombre: "",
    estatus: 0,
    departamentoPadre: 0
}
const puestoData = {
    IdPuesto: 0,
    IdDepartamento: '',
    nombre: '',
    estatus: 0,
    TieneHorasExtra: 0,
}

const Departamento = () => {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState("create");
    const [departments, setDepartments] = useState();
    const [departments2, setDepartments2] = useState();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(dptoData, puestoData);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState([])
    const [puestos, setPuestos] = useState()

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getDepartments = async () => {
        const dataDepartamento = await request(route("departamento.index"));
        setDepartments(dataDepartamento);
        setDepartments2(dataDepartamento);
        const dataPuestos = await request(route("puesto.index"));
        setPuestos(dataPuestos);
    };

    const handleCloseModal = () => {
        setDepartments2([{ IdDepartamento: 0, nombre: "Raiz" }].concat(departments))
        setOpen(!open);
        setOpen2(false);
        setErrors({});
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs({ nombre: ['required', 'max:35'] }, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("departamento.store") : route("departamento.update", data.IdDepartamento);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            handleCloseModal();
            getDepartments();
        })
    };

    useEffect(() => {
        if (!departments) {
            getDepartments();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [departments]);

    const submit2 = async (e) => {
        const ruta = action === "create" ? route("puesto.store") : route("puesto.update", data.IdPuesto);
        const method = action !== "create" ? "PUT" : "POST";

        await request(ruta, method, { ...data, IdDepartamento: departamentoSeleccionado[0]?.IdDepartamento }).then(() => {
            handleCloseModal();
            getDepartments();
            setErrors({});
        });
    };

    const handleSelection = ({ selectedRowKeys }) => setDepartamentoSeleccionado(selectedRowKeys);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            <div className="grid grid-cols-10 gap-10">
                <div className="col-span-5 text-center">
                    <h4>Departamento</h4>
                    {departments && !loading && (
                        <Datatable
                            data={departments}
                            virtual={true}
                            add={() => {
                                setAction("create");
                                setData(dptoData);
                                setOpen(!open);
                            }}

                            selectedData={departamentoSeleccionado}
                            selectionFunc={handleSelection}
                            selection='single'
                            columns={[
                                { width: '50%', header: 'Nombre', accessor: 'nombre' },
                                {
                                    header: 'Depto padre', cell: ({ item }) => (
                                        <span>{
                                            `${item.dpto_padre?.dpto_padre?.nombre ? '/ ' + item.dpto_padre?.dpto_padre?.nombre : ''}
                                            ${item.dpto_padre?.nombre ? '/ ' + item.dpto_padre?.nombre : '/'}`
                                        }</span>
                                    )
                                },
                                {
                                    width: '25%', header: "Activo", accessor: "estatus",
                                    cell: (eprops) => eprops.item.estatus === "1" ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)
                                },
                                {
                                    width: '25%', header: "Acciones",
                                    edit: (eprops) => {
                                        setAction("edit");
                                        setData({ ...eprops.item });
                                        setOpen(!open);
                                    },
                                },
                            ]}
                        />
                    )}


                </div>

                <div className="col-span-5 text-center">
                    <h4>Puestos</h4>
                    {departamentoSeleccionado && puestos ? (
                        <Datatable
                            data={puestos.filter(p => p.IdDepartamento == departamentoSeleccionado[0]?.IdDepartamento)}
                            virtual={true}
                            add={() => {
                                setAction("create");
                                setData(puestoData);
                                setOpen2(!open2);
                            }}
                            columns={[
                                { width: '55%', header: 'Nombre', accessor: 'Nombre', cell: eprops => eprops.item.nombre },
                                {
                                    width: '15%', header: "Activo", accessor: "estatus",
                                    cell: (eprops) => eprops.item.estatus === "1" ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)
                                },
                                {
                                    width: '15%', header: "Horas extra", accessor: "TieneHorasExtra",
                                    cell: (eprops) => eprops.item.TieneHorasExtra === "1" ? (<Chip label="Si" color="success" size="small" />) : (<Chip label="No" color="error" size="small" />)
                                },
                                {
                                    width: '15%', header: "Acciones",
                                    edit: (eprops) => {
                                        setAction("edit");
                                        setData({ ...eprops.item });
                                        setOpen2(!open2);
                                    },
                                },
                            ]}
                        />
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={Imagen} alt="" style={{ textAlign: 'center', width: '60%', height: 'auto', marginTop: '100px', marginRight: '45px' }} className="h-56 w-full object-cover sm:h-full" />
                            </div>
                            <h2 style={{ fontSize: '21px', padding: '10px', marginLeft: '0%' }}>Seleccione un departamento</h2>
                        </>
                    )}
                </div>
            </div>

            <DialogComp
                dialogProps={{
                    model: 'departamento',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1 ',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: 'text',
                        fieldKey: 'nombre',
                        value: data.nombre || '',
                        onChangeFunc: (e) => { setData({ ...data, nombre: e.target.value }) }
                    },
                    {
                        label: "Depende De",
                        input: false,
                        select: true,
                        style: 'col-span-full',
                        options: (departments2 ?? []).map((departments) => {
                            return {
                                ...departments,
                                nombre: `${departments.dpto_padre?.dpto_padre?.nombre ? '/ ' + departments.dpto_padre?.dpto_padre?.nombre : ''} ${departments.dpto_padre?.nombre ? '/ ' + departments.dpto_padre?.nombre : ''} ${'/ ' + departments.nombre}`
                            }
                        }),
                        fieldKey: "departamentoPadre",
                        value: data.departamentoPadre,
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                departamentoPadre: newValue,
                            }),
                        data: "nombre",
                        valueKey: "IdDepartamento",
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />


            <DialogComp dialogProps={{
                openStateHandler: () => handleCloseModal(),
                onSubmitState: () => submit2,
                actionState: action,
                openState: open2,
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
                        style: 'col-span-3',
                        onChangeFunc: (e) => { setData({ ...data, nombre: e.target.value }) }
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
        </div>
    );
};

export default Departamento;
