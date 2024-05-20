import { useState, useEffect } from "react";
import Datatable from "@/components/Datatable";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import request, { validateInputs } from "@/utils";

const tServicioData = {
    tipoServicio_descripcion: '',
    tipoServicio_tiempoPorVencer: '',
    tipoServicio_tiempoVencido: '',
    tipoServicio_idTipoServicio: '',
}
const tServicioValidations = {
    tipoServicio_descripcion: 'required',
    tipoServicio_tiempoPorVencer: 'required',
    tipoServicio_tiempoVencido: 'required',
}

export default function TipoServicio() {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [tipoServicio, setTipoServicio] = useState();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(tServicioData);

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
        const responseE = await fetch(route("tipos-servicios.index"));
        const dataE = await responseE.json();
        setTipoServicio(dataE);
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(tServicioValidations, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("tipos-servicios.store") : route("tipos-servicios.update", data.tipoServicio_idTipoServicio);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    useEffect(() => {
        if (!tipoServicio) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [tipoServicio]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {tipoServicio && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={tipoServicio}
                        add={() => {
                            setAction("create");
                            setData(tServicioData);
                            handleModal()
                        }}
                        columns={[
                            { header: "Tipo de servicio", accessor: "tipoServicio_descripcion" },
                            { header: "Tiempo Por Vencer", accessor: "tipoServicio_tiempoPorVencer" },
                            { header: "Tiempo Vencido", accessor: "tipoServicio_tiempoVencido" },
                            { header: "Fecha de alta", cell: ({item}) => item.tipoServicio_fechaAlta ? (new Date(item.tipoServicio_fechaAlta)).formatMXNoTime() : '' },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    handleModal()
                                    setAction("edit");
                                    setData(eprops.item);
                                },
                            },
                        ]}
                    />
                </div>
            )}


            <DialogComp
                dialogProps={{
                    model: 'tipo de cartera',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    style: 'grid gap-x-4',
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Descripción",
                        fieldKey: 'tipoServicio_descripcion',
                        input: true,
                        type: "text",
                        value: data.tipoServicio_descripcion,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                tipoServicio_descripcion: e.target.value,
                            })
                        }
                    },
                    {
                        label: "Tiempo para vencer",
                        fieldKey: 'tipoServicio_tiempoPorVencer',
                        input: true,
                        type: "number",
                        value: data.tipoServicio_tiempoPorVencer,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                tipoServicio_tiempoPorVencer: e.target.value,
                            })
                        }
                    },
                    {
                        label: "Tiempo por vencido",
                        fieldKey: 'tipoServicio_tiempoVencido',
                        input: true,
                        type: "number",
                        value: data.tipoServicio_tiempoVencido,
                        onChangeFunc: (e) => {
                            setData({
                                ...data,
                                tipoServicio_tiempoVencido: e.target.value,
                            })
                        }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
