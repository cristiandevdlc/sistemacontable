import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv'
import DialogComp from '@/components/DialogComp'
import Datatable from '@/components/Datatable'
import { useEffect, useState } from 'react'

const monedaData = {
    catalogoMonedaSAT_id: "",
    catalogoMonedaSAT_descripcion: "",
    catalogoMonedaSAT_clave: ""
}
const monedaValidations = {
    catalogoMonedaSAT_descripcion: ["required", 'max:250'],
    catalogoMonedaSAT_clave: "required",
}

export default function Moneda() {
    const [action, setAction] = useState("create");
    const [data, setData] = useState(monedaData);
    const [loading, setLoading] = useState(true)
    const [monedas, setMonedas] = useState();
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };

    const getMonedas = async () => {
        const responseE = await fetch(route("sat/moneda.index"));
        const dataE = await responseE.json();
        setMonedas(dataE);
    };

    useEffect(() => {
        if (!monedas) {
            getMonedas();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [monedas])

    const submit = async (e) => {
        e.preventDefault();
        
        setErrors({})
        const result = validateInputs(monedaValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("sat/moneda.store") : route("sat/moneda.update", data.catalogoMonedaSAT_id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getMonedas();
            setOpen(!open);
        });
    };
    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };
    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(monedas && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(monedaData)
                            handleModal()
                        }}
                        data={monedas}
                        columns={[
                            { header: 'Clave', accessor: 'catalogoMonedaSAT_clave' },
                            { header: 'Moneda', accessor: 'catalogoMonedaSAT_descripcion' },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    handleModal();
                                },
                            }
                        ]}
                    />
                </div>
            }

            <DialogComp
                dialogProps={{
                    model: 'moneda',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1',
                    actionState: action,
                    openStateHandler: () => { handleModal(); },
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Clave",
                        input: true,
                        type: 'text',
                        maxLength:"15",
                        fieldKey: 'catalogoMonedaSAT_clave',
                        value: data.catalogoMonedaSAT_clave || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoMonedaSAT_clave: e.target.value }) }
                    },
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'catalogoMonedaSAT_descripcion',
                        value: data.catalogoMonedaSAT_descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoMonedaSAT_descripcion: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}

