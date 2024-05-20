import request, { validateInputs } from '@/utils';
import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import Datatable from '@/components/Datatable'
import LoadingDiv from '@/components/LoadingDiv'
import DialogComp from '@/components/DialogComp'

export default function TipoCaptacion() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [tipoCaptacion, setTipoCaptacion] = useState();
    const [loading, setLoading] = useState(true)

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const { data, setData } = useForm({
        tipoCaptacion_idTipoCaptacion: '',
        tipoCaptacion_tipo: '',
    });
    const [captacionId, setCaptacionId] = useState(0);
    const [errors, setErrors] = useState({});
    const fetchdata = async () => {
        getCaptacion();
    };

    const getCaptacion = async () => {
        const responseE = await fetch(route("captacion.index"));
        const dataE = await responseE.json();
        setTipoCaptacion(dataE);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs({ tipoCaptacion_tipo: 'required' }, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("captacion.store") : route("captacion.update", captacionId);
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

    useEffect(() => {
        if (open && !tipoCaptacion) {
            getCaptacion();
        }
    }, [open])


    useEffect(() => {
        if (!tipoCaptacion) {
            getCaptacion();
            getMenuName();

        } else {
            setLoading(false)
        }
    }, [tipoCaptacion])

    return (
        <div className='relative h-[100%] pb-12 px-3 overflow-auto blue-scroll'>
            {loading &&
                <LoadingDiv />
            }
            {(tipoCaptacion && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={tipoCaptacion}
                        add={() => {
                            setAction('create')
                            setData({
                                tipoCaptacion_idTipoCaptacion: '',
                                tipoCaptacion_tipo: '',
                            })
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Giro Comercial', accessor: 'tipoCaptacion_tipo' },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setCaptacionId(eprops.item.tipoCaptacion_idTipoCaptacion);
                                    setOpen(!open)
                                },
                            },
                        ]}
                    />
                </div>
            }
            <DialogComp
                dialogProps={{
                    model: 'sector comercial',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Giro Comercial",
                        input: true,
                        type: 'text',
                        fieldKey: 'tipoCaptacion_tipo',
                        style: 'col-span-2',
                        value: data.tipoCaptacion_tipo,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                tipoCaptacion_tipo: e.target.value,
                            });
                        },
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
