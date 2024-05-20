import request, { validateInputs } from '@/utils';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useState, useEffect } from 'react';

const Turno = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true)
    const [action, setAction] = useState('create');
    const [turns, setTurns] = useState();
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({ turno_idTurno: 0, turno_nombreTurno: '' });

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true })
        } catch (error) { }
    };

    const handleCloseModal = () => {
        setOpen(!open);
        setErrors({});
    }

    const getTurns = async () => {
        const response = await fetch(route('turno.index'));
        const data = await response.json();
        setTurns(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs({ turno_nombreTurno: ['required', 'max:30'] }, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === 'create' ? route('turno.store') : route('turno.update', data.turno_idTurno);
        const method = action === 'create' ? 'POST' : 'PUT';
        await request(ruta, method, data).then(() => {
            setOpen(!open);
            getTurns();
        })
    };

    useEffect(() => {
        document.title = 'Intergas | Turno';
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
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={turns}
                        add={() => {
                            setAction('create')
                            setData({ turno_idTurno: 0, turno_nombreTurno: '' })
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Nombre', accessor: 'turno_nombreTurno' },
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
                    model: 'turno',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    style: 'grid gap-x-4',
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        fieldKey: 'turno_nombreTurno',
                        input: true,
                        type: "text",
                        value: data.turno_nombreTurno,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                turno_nombreTurno: e.target.value,
                            })
                        }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
};

export default Turno