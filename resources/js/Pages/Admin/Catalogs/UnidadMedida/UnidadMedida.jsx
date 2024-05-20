import request, { validateInputs } from '@/utils';
import DialogComp from "@/components/DialogComp";
import LoadingDiv from '@/components/LoadingDiv';
import Datatable from '@/components/Datatable';
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

const umaValidations = {
    unidadMedida_nombre: ['required', 'max:20'],
    unidadMedida_clave: ['required', 'max:3'],
}

const umaData = {
    unidadMedida_idUnidadMedida: "",
    unidadMedida_nombre: "",
    unidadMedida_clave: "",
}

export default function UnidadMedida() {
    const [unidadMedida, setunidadMedida] = useState();
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const { data, setData } = useForm(umaData);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true })
        } catch (error) { }
      };
    
    const fetchdata = async () => {
        try {
            const responseE = await fetch(route("unidades-de-medida.index"));
            const dataE = await responseE.json();
            setunidadMedida(dataE);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(umaValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("unidades-de-medida.store") : route("unidades-de-medida.update", data.unidadMedida_idUnidadMedida);
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
        document.title = 'Intergas | Unidad de medida';

        if (!unidadMedida) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [unidadMedida])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(unidadMedida && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={unidadMedida}
                        add={() => {
                            setAction('create')
                            setData(umaData)
                            setOpen(!open)
                        }}
                        columns={[
                            { header: 'Nombre', accessor: 'unidadMedida_nombre' },
                            { header: 'Clave', accessor: 'unidadMedida_clave' },
                            {
                                header: 'Acciones', edit: eprops => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    setOpen(!open)
                                }
                            }
                        ]}
                    />
                </div>
            }
            <DialogComp
                dialogProps={{
                    model: 'unidad medida',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: "text",
                        fieldKey: "unidadMedida_nombre",
                        value: data.unidadMedida_nombre,
                        autoComplete: "Nombre",
                        isFocused: true,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                unidadMedida_nombre: e.target.value,
                            }),
                    },
                    {
                        label: "Clave",
                        input: true,
                        type: "text",
                        fieldKey: "unidadMedida_clave",
                        value: data.unidadMedida_clave,
                        autoComplete: "Nombre",
                        isFocused: true,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                unidadMedida_clave: e.target.value,
                            }),
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
