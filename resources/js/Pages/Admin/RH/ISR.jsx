import request, { numberFormat, validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';

const isrData = {
    IdIsr: '',
    IdUsuario: '',
    LimiteInferior: '',
    LimiteSuperior: '',
    CuotaFija: '',
    Porcentaje: '',
    Estatus: '1',
}

const isrValidations = {
    IdUsuario: 'required',
    LimiteInferior: 'required',
    LimiteSuperior: 'required',
    CuotaFija: 'required',
    Porcentaje: 'required',
}

export default function ISR() {
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState();
    const [data, setData] = useState(isrData);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [IdIsr, setISRId] = useState(0);
    const [isrs, setIsrs] = useState();

    const fetchdata = async () => {
        getIsrs();
        getUsuarios();
    };

    const getIsrs = async () => {
        const response = await request(route("isrs.index"));
        setIsrs(response);

    };
    const getUsuarios = async () => {
        const response = await request(route("usuarios.index"));
        setUsuarios(response);
    };

    useEffect(() => {
        if (!isrs) {
            fetchdata();
        } else {
            setLoading(false)
        }
    }, [isrs]);

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(isrValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("isrs.store") : route("isrs.update", IdIsr);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };
    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    const generarReporteHistorico = async () => {
        try {
            const response = await request(route('isr-historico-pdf'))
            await fetch(route('generate-irs'), {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: response }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.blob();
                    } else {
                        throw new Error("Error al generar el archivo PDF");
                    }
                })
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = 'Reporte historido de ISRS.pdf';
                    link.click();
                    URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(isrs && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => { setErrors({}); setAction('create'); setData(isrData); setOpen(!open); }}
                        virtual={true}
                        data={isrs}
                        columns={[
                            { width: '13%', header: 'Usuario', accessor: 'usuarios', cell: eprops => eprops.item.usuarios?.usuario_nombre },
                            { width: '13%', header: 'Limite Inferior', cell: ({ item }) => numberFormat(item.LimiteInferior) },
                            { width: '13%', header: 'Limite Superior', cell: ({ item }) => numberFormat(item.LimiteSuperior) },
                            { width: '13%', header: 'Cuota Fija', cell: ({ item }) => numberFormat(item.CuotaFija) },
                            { width: '13%', header: 'Porcentaje', cell: ({ item }) => `${numberFormat(item.Porcentaje)}%` },
                            { width: '13%', header: 'Fecha', accessor: 'FechaRegistro', cell: ({ item }) => (new Date(item.FechaRegistro)).formatMX() },
                            { width: '10%', header: 'Activo', cell: eprops => <> {eprops.item.Estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)} </> },
                            { width: '10%', header: "Acciones", edit: (eprops) => { setAction('edit'); setErrors({}); setData({ ...eprops.item }); setISRId(eprops.item.IdIsr); setOpen(!open); } }
                        ]} />
                    <div className='mt-3'>
                        <button onClick={generarReporteHistorico} className="bg-[#2B3F75] hover:bg-[#5f74ad] transition-colors duration-500 hover:cursor-pointer px-10 py-3 text-white  rounded-lg ">Ver historico</button>
                    </div>
                </div>
            }
            <DialogComp
                dialogProps={{
                    model: 'ISR',
                    width: 'md',
                    openState: open,
                    actionState: action,
                    style: 'grid grid-cols-2 gap-x-4',
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Usuario",
                        fieldKey: 'IdUsuario',
                        input: false,
                        select: true,
                        options: usuarios,
                        value: data.IdUsuario,
                        onChangeFunc: (newValue) => { setData({ ...data, IdUsuario: newValue, }); },
                        data: "usuario_nombre",
                        valueKey: "usuario_idUsuario",
                    },
                    {
                        label: "Limite Inferior",
                        fieldKey: 'LimiteInferior',
                        input: true,
                        type: "decimal",
                        value: data.LimiteInferior,
                        onChangeFunc: (e) => setData({ ...data, LimiteInferior: e.target.value, }),
                    },
                    {
                        label: "Limite Superior",
                        fieldKey: 'LimiteSuperior',
                        input: true,
                        type: "decimal",
                        value: data.LimiteSuperior || "",
                        onChangeFunc: (e) => setData({ ...data, LimiteSuperior: e.target.value }),
                    },
                    {
                        label: "Couta Fija",
                        fieldKey: 'CuotaFija',
                        input: true,
                        type: "decimal",
                        value: data.CuotaFija,
                        onChangeFunc: (e) => setData({ ...data, CuotaFija: e.target.value, }),
                    },
                    {
                        label: "Porcentaje",
                        fieldKey: 'Porcentaje',
                        input: true,
                        type: "decimal",
                        value: data.Porcentaje,
                        onChangeFunc: (e) => setData({ ...data, Porcentaje: e.target.value, }),
                    },
                    {
                        label: "Activo",
                        fieldKey: 'Estatus',
                        select: true,
                        options: action === 'create' ? [{ id: 1, value: "Activo" }] : [{ id: 1, value: "Activo" }, { id: 0, value: "Inactivo" },],
                        value: data.Estatus || "",
                        onChangeFunc: (e) => { setData((prev) => ({ ...prev, Estatus: e })); },
                        data: "value",
                        valueKey: "id",
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}