import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useState, useEffect } from "react";

const motivosData = {
    idmotivocancelacion: "",
    motivo_cancelacion: "",
    HoraHabil: "",
}
const motivosValidations = {
    motivo: "required",
    HoraHabil: "required",
}

const MotivosCancelacion = () => {
    const [action, setAction] = useState("create");
    const [data, setData] = useState(motivosData);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [motivo, setMotivo] = useState();

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };    

    const getMotivo = async () => {
        const response = await fetch(route("motivos-cancelacion.index"));
        const data = await response.json();
        setMotivo(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(motivosValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("motivos-cancelacion.store") : route("motivos-cancelacion.update", data.idmotivocancelacion);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getMotivo();
            setOpen(!open);
        });
    };

    useEffect(() => {
        if (!motivo) getMotivo(),getMenuName();
        else setLoading(false);
    }, [motivo]);

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {motivo && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData(motivosData);
                            handleModal();
                        }}
                        data={motivo}
                        columns={[
                            { header: "Motivo Cancelación", accessor: "motivo" },
                            { header: "Hora Hábil", accessor: "HoraHabil" },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item, });
                                    handleModal();
                                },
                            },
                        ]}
                    />
                </div>
            )}
            
            <DialogComp
                dialogProps={{
                    model: 'motivos cancelación',
                    width: 'sm',
                    openState: open,
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
                    {
                        label: "Hora habil",
                        input: true,
                        type: 'number',
                        fieldKey: 'HoraHabil',
                        value: data.HoraHabil || '',
                        onChangeFunc: (e) => { setData({ ...data, HoraHabil: e.target.value }) }
                    },
                ]}
                errors={errors}
            />
        </div>
    );
};

export default MotivosCancelacion;
