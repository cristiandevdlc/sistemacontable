import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";

const stecData = {
    idproblema: "",
    descripcion: "",
    tiemporespuesta: "",
    tiempourgencia: "",
}
const stecValidations = {
    descripcion: "required",
    tiemporespuesta: "required",
    tiempourgencia: "required",
}
export default function STecnico() {
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [sTecnico, setsTecnico] = useState();
    const [data, setData] = useState(stecData);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    const fetchdata = async () => {
        const response = await fetch(route("stecnico.index"));
        const data = await response.json();
        setsTecnico(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(stecValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("stecnico.store") : route("stecnico.update", data.idproblema);
        const method = action === "create" ? "POST" : "PUT";

        await request(ruta, method, data).then(() => {
            fetchdata();
            handleModal();
        });
    };

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    useEffect(() => {
        if (!sTecnico) {
            fetchdata();
        } else {
            setLoading(false);
        }
    }, [sTecnico]);

    return (
        <>
            {loading && <LoadingDiv />}
            {sTecnico && !loading && (
                <>
                    <Datatable
                        data={sTecnico}
                        add={() => {
                            setAction("create");
                            setData(stecData);
                            handleModal();
                        }}
                        columns={[
                            { header: "Descripción", accessor: "descripcion" },
                            { header: "Tiempo Respuesta", accessor: "tiemporespuesta", },
                            { header: "Tiempo Urgencia", accessor: "tiempourgencia", },
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
                </>
            )}

            <DialogComp
                dialogProps={{
                    model: 'servicio técnico',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcion',
                        value: data.descripcion || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcion: e.target.value }) }
                        
                    },
                    {
                        label: "Tiempo respuesta",
                        input: true,
                        type: 'number',
                        fieldKey: 'tiemporespuesta',
                        value: data.tiemporespuesta || '',
                        onChangeFunc: (e) => {
                            const inputValue = e.target.value;
                            const validInput = inputValue; // Remove non-numeric characters
                            setData({
                                ...data,
                                tiemporespuesta: validInput,
                            });
                        },
                    },
                    {
                        label: "Tiempo urgencia",
                        input: true,
                        type: 'number',
                        fieldKey: 'tiempourgencia',
                        value: data.tiempourgencia || '',
                        // onChangeFunc: (e) => { setData({ ...data, tiempourgencia: e.target.value }) }

                        onChangeFunc: (e) => {
                            const inputValue = e.target.value;
                            const validInput = inputValue; // Remove non-numeric characters
                            setData({
                                ...data,
                                tiempourgencia: validInput,
                            });
                        },
                    },
                ]}
             />
        </>
    );
}
