import { useState, useEffect } from "react";
import request, { fileDownloader, requestMultipart, validateInputs, } from "@/utils";
import Datatable from "@/components/Datatable";
import DialogComp from '@/components/DialogComp'
import LoadingDiv from '@/components/LoadingDiv'

const SupervisorPuesto = () => {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ open: false, loading: true })
    const [data, setData] = useState({ idpuesto: 0, idsupervisor: 0 })
    const [puesto, setPuesto] = useState()
    const [supervisorPuesto, setsupervisorPuesto] = useState()

    const getPuesto = async () => {
        const response = await request(route("puesto.index"));
        setPuesto(response);
    };
    const getSupervisorPuesto = async () => {
        const response = await request(route("supervisor-puesto.index"));
        setsupervisorPuesto(response);
    };

    useEffect(() => {
        if (!supervisorPuesto) {
            getPuesto()
            getSupervisorPuesto()
        } else {
            setState({ ...state, loading: false });
        }
    }, [!supervisorPuesto]);

    const submit = async (e) => {
        e.preventDefault();
        setErrors({})
        // const result = validateInputs({ Descripcion: ['required', 'max:35'] }, data)
        // if (!result.isValid) {
        //     setErrors(result.errors)
        //     return;
        // }
        const ruta = action === "create" ? route("supervisor-puesto.store") : route("supervisor-puesto.update", data.idsupervisor);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getSupervisorPuesto();
            handleCloseModal();
        })
    };

    const handleCloseModal = () => {
        setState({...state, open:!state.open});
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
             {state.loading &&
                <LoadingDiv />}
            {supervisorPuesto && !state.loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(supervisorPuesto)
                            handleCloseModal()
                        }}
                        data={supervisorPuesto}
                        columns={[
                            { header: 'Puesto Supervisor', accessor: 'departamento', cell: eprops => eprops.item.puesto.nombre },
                            {
                                header: "Acciones", edit: (eprops) => {
                                    setAction('edit')
                                    setData(eprops.item)
                                    setState({ ...state, open: !state.open })
                                },
                            }
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit,
                    actionState: action,
                    openState: state.open,
                    model: 'Puesto',
                    width: 'sm',
                    style: 'grid grid-cols-2 ',
                }}
                fields={[

                    {
                        label: "Puesto Supervisor",
                        select: true,
                        options: puesto,
                        value: data.idpuesto,
                        style: 'col-span-2',
                        onChangeFunc: (e) => setData({ ...data, idpuesto: e }),
                        data: 'nombre',
                        valueKey: 'IdPuesto',
                        fieldKey: 'idpuesto',
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}


export default SupervisorPuesto;