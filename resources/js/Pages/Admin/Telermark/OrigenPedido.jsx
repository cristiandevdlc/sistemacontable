import request, { validateInputs } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';
import DialogComp from '@/components/DialogComp';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';

const origenpData = {
    idorigen: "",
    descripcion: "",
    autorizacion: 0,
}
const origenpValidations = {
    descripcion: "required",
    autorizacion: "required",
}

const OrigenPedido = () => {
    const [action, setAction] = useState("create");
    const [data, setData] = useState(origenpData);
    const [loading, setLoading] = useState(true);
    const [origenp, setOrigenp] = useState();
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

    const getOrigenp = async () => {
        const response = await fetch(route("origen-pedidos.index"));
        const data = await response.json();
        setOrigenp(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(origenpValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }
        const ruta = action === "create" ? route("origen-pedidos.store") : route("origen-pedidos.update", data.idorigen);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getOrigenp();
            setOpen(!open);
        });
    };

    useEffect(() => {
        if (!origenp) getOrigenp(), getMenuName();
        else setLoading(false);
    }, [origenp]);

    const handleModal = () => {
        setOpen(!open);
        setErrors({});
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {origenp && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(origenpData)
                            handleModal()
                        }}
                        data={origenp}
                        columns={[
                            { header: 'Descripción', accessor: 'descripcion' },
                            { header: 'Autorización', accessor: 'autorizacion', cell: eprops => eprops.item.autorizacion === '1' ? (<Chip label='Autorizado' color='success' size='small' />) : (<Chip label='No autorizado' color='error' size='small' />) },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    handleModal()
                                },
                            }
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'origen pedido',
                    width: 'sm',
                    openState: open,
                    style: 'grid grid-cols-1',
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
                        label: "Autorización",
                        check: true,
                        fieldKey: 'autorizacion',
                        checked: data.autorizacion,
                        labelPlacement: 'start',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            autorizacion: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
        </div>
    )
}

export default OrigenPedido
1