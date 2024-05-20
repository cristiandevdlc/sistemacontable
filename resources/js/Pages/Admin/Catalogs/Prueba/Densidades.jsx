import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Datatable from "@/components/Datatable";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import request, { validateInputs } from "@/utils";

export default function Densidades() {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [densidades, setDensidades] = useState();
    const [errors, setErrors] = useState({});    
    const {data,setData } = useForm({
        Densidad_densidad: "",
        Densidad_idDensidad: "",
    });

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getDensidades = async () => {
        const responseE = await fetch(route("densidades.index"));
        const dataE = await responseE.json();
        setDensidades(dataE);
    };

    useEffect(() => { 
        if (!densidades) {
            getDensidades();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [densidades]);

    const submit = async (e) => {
        e.preventDefault();
        
        setErrors({})
        const result = validateInputs({ Densidad_densidad: 'required' }, data);
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("densidades.store") : route("densidades.update", data.Densidad_idDensidad);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getDensidades();
            setOpen(!open);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {densidades && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData({
                                Densidad_densidad: "",
                                Densidad_idDensidad: "",
                                Densidad_fecha: "",
                            });
                            setOpen(!open);
                        }}
                        data={densidades}
                        columns={[
                            { header: "Densidades", accessor: "Densidad_densidad" },
                            { header: "Fecha", cell: ({item})=> new Date(item.Densidad_fecha).formatMXNoTime() },
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'densidad',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Densidad",
                        input: true,
                        type: 'number',
                        fieldKey: 'Densidad_densidad',
                        style: 'col-span-2',
                        value: data.Densidad_densidad,
                        onChangeFunc: (e) => {
                            const inputValue = e.target.value;
                            const validInput = inputValue; // Remove non-numeric characters
                            setData({
                                ...data,
                                Densidad_densidad: validInput,
                            });
                        },
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
