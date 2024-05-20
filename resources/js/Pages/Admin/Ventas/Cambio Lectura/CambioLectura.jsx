import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';
import Chip from "@mui/material/Chip";

const CambioLectura = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true)
    const [action, setAction] = useState('create');
    const [turns, setTurns] = useState();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({ idmotivocambiolectura: 0, descripcion: '', estatus: '' });

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const handleCloseModal = () => {
        setOpen(!open);
        setErrors({});
    }

    const getTurns = async () => {
        const response = await fetch(route('CambioLectura.index'));
        const data = await response.json();
        setTurns(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs({ descripcion: ['required', 'max:30'] }, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === 'create' ? route('CambioLectura.store') : route('CambioLectura.update', data.idmotivocambiolectura);
        const method = action === 'create' ? 'POST' : 'PUT';

        await request(ruta, method, data).then(() => {
            setOpen(!open);
            getTurns();
        })
    };

    useEffect(() => {
        document.title = 'Intergas | Cambio Lectura';
        if (!turns) {
            getTurns()
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [turns]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(turns && !loading) &&
                <>
                    <Datatable
                        data={turns}
                        add={() => {
                            setAction('create')
                            setData({ idmotivocambiolectura: 0, descripcion: '', estatus: '' })
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Descripcion', accessor: 'descripcion' },
                            { header: "Activo", cell: (eprops) => (<>{eprops.item.estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>), },


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
                </>
            }
            <DialogComp
                dialogProps={{
                    model: 'Cambio lectura',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    style: 'grid gap-x-4',
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Descripción",
                        fieldKey: 'descripcion',
                        input: true,
                        type: "text",
                        value: data.descripcion,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                descripcion: e.target.value,
                            })
                        }
                    },

                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-6',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        })
                    },

                ]}
                errors={errors}
            />
        </div>
    );
};

export default CambioLectura