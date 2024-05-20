import { useEffect, useState } from "react";
import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";

const motivoData = {
    motivo: '',
    id: '',
}
const motivoValidation = {
    motivo: 'required',
}

const Motivos = () => {
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(motivoData);
    const [motivos, setMotivos] = useState();
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

    const getMotivos = async () => {
        const response = await fetch(route("motivos.index"));
        const data = await response.json();
        setMotivos(data);
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        const result = validateInputs(motivoValidation, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("motivos.store") : route("motivos.update", data.id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getMotivos();
            setOpen(false);
        });
    };

    useEffect(() => {
        if (!motivos) getMotivos(),getMenuName();
        else setLoading(false);
    }, [motivos]);


    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {motivos && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData(motivoData);
                            handleModal();
                        }}
                        data={motivos}
                        columns={[
                            { header: "Motivo", accessor: "motivo" },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
    
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    handleModal();
                                }
                            },
                        ]}
                    />
                </div>
            )}
            
            <DialogComp
                dialogProps={{
                    model: 'motivo de prospección',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Motivo",
                        input: true,
                        type: 'text',
                        fieldKey: 'motivo',
                        value: data.motivo || '',
                        onChangeFunc: (e) => { setData({ ...data, motivo: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
};

export default Motivos;