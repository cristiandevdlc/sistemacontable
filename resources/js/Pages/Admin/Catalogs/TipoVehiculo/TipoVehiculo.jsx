import Datatable from '@/components/Datatable';
import DialogComp from '@/components/DialogComp';
import LoadingDiv from '@/components/LoadingDiv';
import { useEffect, useState } from 'react';
import request, { validateInputs } from "@/utils";

const TipoVehiculo = () => {
    const [action, setAction] = useState('create')
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ loading: true, open: false, tipo: null })
    const [data, setData] = useState({ idTipoVehiculo: 0, descripcionTipo: null })
    const [tipoVehiculo, setTipoVehiculo] = useState()

    const getTipo = async () => {
        const response = await fetch(route("tipo-vehiculo.index"));
        const data = await response.json();
        setTipoVehiculo(data);
    };

    const submit = async (e) => {
        // const result = validateInputs(AlmacenValidaciones, data)
        // if (!result.isValid) {
        //     setErrors(result.errors)
        //     return;
        // }
        // e.preventDefault();
        const ruta = action === "create" ? route("tipo-vehiculo.store", 'POST', { enabled: true, success: { type: 'success', message: "Creado Correctamente" } }) : route("tipo-vehiculo.update", data.idTipoVehiculo);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getTipo();
            setState({ ...state, open: !state.open });
        });
    };

    const handleCloseModal = () => {
        setState({ ...state, open: !state.open, action: '' });
        setData({descripcionTipo: null})
    }

    useEffect(() => {
        if (!tipoVehiculo)
            getTipo();
        else setState({ ...state, loading: false });
    }, [tipoVehiculo]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            {tipoVehiculo && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(data)
                            handleCloseModal()
                        }}
                        data={tipoVehiculo}
                        columns={[
                            { header: 'Tipo', accessor: 'descripcionTipo' },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData(eprops.item)
                                    setState({ ...state, open: true })
                                },
                            }
                        ]}
                    />
                </div>
            )}


            <DialogComp
                dialogProps={{
                    model: 'Tipo de Vehiculo',
                    width: 'sm',
                    openState: state.open,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Tipo de vehiculo",
                        input: true,
                        type: 'text',
                        fieldKey: 'descripcionTipo',
                        value: data.descripcionTipo || '',
                        onChangeFunc: (e) => { setData({ ...data, descripcionTipo: e.target.value }) }
                    },
                ]}
                errors={errors}
            />

        </div>
    );
}
export default TipoVehiculo