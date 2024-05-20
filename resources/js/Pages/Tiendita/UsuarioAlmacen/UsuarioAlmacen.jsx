import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import DialogComp from '@/components/DialogComp';
import request, { validateInputs } from "@/utils";
import LoadingDiv from '@/components/LoadingDiv';
import usuarioAlmacenData, { usuarioAlmacenValidations } from "./IntUsuarioAlmacen";

const UsuarioAlmacen = () => {
    const [action, setAction] = useState("create");
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ loading: true, open: false, usuarioAlmacen: null, almacen: null, usuario: null });
    const [data, setData] = useState(usuarioAlmacenData)
    const [usuarioAlmacenResponse, setUsuarioAlmacenResponse] = useState()

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const getFetchData = async () => {
        const [usuariosResponse, almacenResponse, usuarioAlmacenResponse] = await Promise.all([
            fetch(route("usuarios.index")).then(res => res.json()),
            fetch(route("almacen.index")).then(res => res.json()),
            fetch(route("usuario-almacen.index")).then(res => res.json()),
        ]);
        setUsuarioAlmacenResponse(usuarioAlmacenResponse)
        return { usuariosResponse, almacenResponse, usuarioAlmacenResponse };
    }

    const submit = async (e) => {
        const result = validateInputs(usuarioAlmacenValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            console.log('errors', errors)
            return;
        }
        e.preventDefault();
        const ruta = action === "create" ? route("usuario-almacen.store") : route("usuario-almacen.update", data.UsuarioAlmacen_id);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            getFetchData()
            setState({ ...state, open: !state.open });
        });
    };

    const handleCloseModal = () => {
        setState({ ...state, open: !state.open, action: '' });
        // setData(data)
    }

    useEffect(() => {
        getMenuName()
        getFetchData()
            .then((res) => {
                setData(res.usuarioAlmacenResponse);
                setState({
                    ...state,
                    usuarioAlmacen: res.usuarioAlmacenResponse,
                    almacen: res.almacenResponse,
                    usuario: res.usuariosResponse,
                    loading: false
                });
            });
    }, []);

    // useEffect(() => {
    //     data
    //     console.log('data', data);
    // }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <LoadingDiv />
            }
            {usuarioAlmacenResponse && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction('create')
                            setData(usuarioAlmacenResponse)
                            handleCloseModal()
                        }}
                        data={usuarioAlmacenResponse}
                        columns={[
                            { header: 'Usuario', accessor: 'UsuarioAlmacen_idUsuario', cell: eprops => eprops.item.user.usuario_nombre },
                            { header: 'Almacén', accessor: 'UsuarioAlmacen_idUsuario', cell: eprops => eprops.item.almacen.almacen_nombre },
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
                    model: 'Usuario almacén',
                    width: 'sm',
                    openState: state.open,
                    style: 'grid grid-cols-1 gap-4',
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Usuario",
                        input: false,
                        select: true,
                        options: state.usuario,
                        value: data.UsuarioAlmacen_idUsuario,
                        onChangeFunc: (newValue) =>
                            setData({ ...data, UsuarioAlmacen_idUsuario: newValue, }),
                        data: "usuario_nombre",
                        valueKey: "usuario_idUsuario",
                    },
                    {
                        label: "Almacén",
                        input: false,
                        select: true,
                        options: state.almacen,
                        value: data.UsuarioAlmacen_idAlmacen,
                        onChangeFunc: (newValue) =>
                            setData({ ...data, UsuarioAlmacen_idAlmacen: newValue }),
                        data: "almacen_nombre",
                        valueKey: "almacen_id",
                    },


                ]}
                errors={errors}
            />
        </div>
    )
}
export default UsuarioAlmacen