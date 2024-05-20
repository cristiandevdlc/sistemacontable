
import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';

export default function TipoCartera() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [carteras, seCarteras] = useState();
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({ tipoCartera_nombre: "" });
    const [carteraId, setCarteraId] = useState(0);
    const [errors, setErrors] = useState({});

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true })
        } catch (error) { }
      };

    const getCartera = async () => {
        const responseE = await fetch(route("tipo-cartera.index"));
        const dataE = await responseE.json();
        seCarteras(dataE);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs({ tipoCartera_nombre: 'required' }, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("tipo-cartera.store") : route("tipo-cartera.update", carteraId);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            getCartera();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    useEffect(() => {
        if (!carteras) {
            getCartera();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [carteras])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(carteras && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={carteras}
                        add={() => {
                            setAction('create')
                            setData({ tipoCartera_nombre: "" })
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Tipo de cartera', accessor: 'tipoCartera_nombre' },

                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    setCarteraId(eprops.item.tipoCartera_idTipoCartera);
                                    setOpen(!open)
                                },
                            },
                        ]}
                    />
                </div>
            }

            <DialogComp
                dialogProps={{
                    model: 'tipo de cartera',
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
                        fieldKey: 'tipoCartera_nombre',
                        input: true,
                        type: "text",
                        value: data.tipoCartera_nombre,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                tipoCartera_nombre: e.target.value,
                            })
                        }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
