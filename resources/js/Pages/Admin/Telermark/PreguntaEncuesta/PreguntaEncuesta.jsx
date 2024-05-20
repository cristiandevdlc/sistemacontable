import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import request, { validateInputs } from "@/utils";

const preguntasData = {
    id: "",
    pregunta: "",
    estatus: "",
    prioridad: "",
}
const preguntasValidations = {
    pregunta: "required",
    estatus: "required",
    prioridad: "required",
}

export default function PreguntaEncuesta() {
    const [data, setData] = useState(preguntasData);
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [Pregunta, setPregunta] = useState();
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

    const getPreguntas = async () => {
        const response = await fetch(route("preguntas-encuestas.index"));
        const data = await response.json();
        setPregunta(data);
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(preguntasValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("preguntas-encuestas.store") : route("preguntas-encuestas.update", data.id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getPreguntas();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    useEffect(() => {
        if (!Pregunta) getPreguntas(),getMenuName();
        else setLoading(false);
    }, [Pregunta]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {Pregunta && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        data={Pregunta}
                        add={() => {
                            setAction("create");
                            setData(preguntasData);
                            handleModal();
                        }}
                        columns={[
                            { header: "Pregunta", accessor: "pregunta" },
                            { header: "Prioridad", accessor: "prioridad", cell: ({ value }) => { return value == 0 ? "No importante" : "Importante"; }, },
                            { header: "Activo", cell: (eprops) => (<>{eprops.item.estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>), },
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
                    model: 'pregunta encuesta',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Pregunta",
                        input: true,
                        type: 'text',
                        fieldKey: 'pregunta',
                        value: data.pregunta || '',
                        onChangeFunc: (e) => { setData({ ...data, pregunta: e.target.value }) }
                    },
                    {
                        label: "Prioridad",
                        input: true,
                        type: 'text',
                        fieldKey: 'prioridad',
                        value: data.prioridad || '',
                        onChangeFunc: (e) => { setData({ ...data, prioridad: e.target.value }) }
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
        </div>
    );
}
