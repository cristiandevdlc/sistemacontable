import request, { validateInputs } from '@/utils';
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";

const metodoPagoData = {
    catalogoMetodoPagoSAT_descripcion: '',
    catalogoMetodoPagoSAT_id: ''
}
const metodoPagoValidations = {
    catalogoMetodoPagoSAT_descripcion: ['required', 'max:250'],
}

export default function MetodosDePago() {
    const [data, setData] = useState(metodoPagoData);
    const [metodosPago, setMetodosPago] = useState();
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        if (!metodosPago) {
            getPayMethods();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [metodosPago]);

    const getPayMethods = async () => {
        const response = await fetch(route("sat/metodo-pago.index"));
        const data = await response.json();
        setMetodosPago(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(metodoPagoValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("sat/metodo-pago.store") : route("sat/metodo-pago.update", data.catalogoMetodoPagoSAT_id)
        const method = action === "create" ? "POST" : action === "edit" ? "PUT" : "DELETE";
        await request(ruta, method, data).then(() => {
            getPayMethods();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };
    
    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {metodosPago && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={metodosPago}
                        add={() => {
                            setAction('create')
                            setData(metodoPagoData)
                            handleModal()
                        }}
                        columns={[
                            { header: "Nombre", accessor: "catalogoMetodoPagoSAT_descripcion" },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    handleModal();
                                },
                            },
                        ]}
                    />
                </div>
            )}

            
            <DialogComp
                dialogProps={{
                    model: 'metodo de pago',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'catalogoMetodoPagoSAT_descripcion',
                        value: data.catalogoMetodoPagoSAT_descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, catalogoMetodoPagoSAT_descripcion: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
