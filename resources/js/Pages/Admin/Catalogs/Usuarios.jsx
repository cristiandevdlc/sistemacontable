import "../../../../sass/TablesComponent/_tablesStyle.scss";
import AsignMenusDialog from "./Usuarios/AsignMenusDialog";
import request, { validateInputs } from "@/utils";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Tooltip } from "@mui/material";
import Chip from "@mui/material/Chip";
import '@/utils';
import moment from "moment";

const userValidations = {
    usuario_nombre: 'required',
    usuario_username: 'required',
}

const userData = {
    usuario_nombre: "",
    usuario_username: "",
    usuario_password: "",
    usuario_estatus: true,
    usuario_idRol: "",
    usuario_idPersona: ""
}

export default function Usuarios() {
    const [open, setOpen] = useState(false);
    const [assignMenu, setAssignMenu] = useState(false);
    const [action, setAction] = useState("create");
    const [usuarios, setUsuarios] = useState();
    const [errors, setErrors] = useState({});
    const { data, setData } = useForm(userData);
    const [usuario_idUsuario, setUsuario_idUsuario] = useState(0);
    const [roles, setRoles] = useState()
    const [personas, setPersonas] = useState()
    const [loading, setLoading] = useState(true);

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };


    useEffect(() => {
        if (!usuarios) {
            fetchdata();
        } else {
            setLoading(false);
        }
    }, [usuarios]);

    const fetchdata = async () => {
        const response = await fetch(route("usuarios.index"));
        const data = await response.json();
        setUsuarios(data);
        const rolesResponse = await fetch(route("roles.index"));
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(userValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        let ruta = "";
        let method = "";
        if (action === "create") {
            ruta = route("usuarios.store");
            method = "POST";
        } else if (action === "edit") {
            ruta = route("usuarios.update", usuario_idUsuario);
            method = "PUT";
        } else if (action === "destroy") {
            ruta = route("usuarios.destroy", usuario_idUsuario);
            method = "DELETE";
        } else if (action === "asignMenu") {
            ruta = route("usuarioxmenu", usuario_idUsuario);
            method = "PUT";
        }

        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
            setAssignMenu(false);
        });
    };

    const handleCloseModal = () => {
        setOpen(false);
        setErrors({});
        setUsuario_idUsuario("")
        setAction("create")
        setPersonas(null)
    };

    const getPersonas = async (idPersona) => {
        const personasResponse = await fetch(route("persona.usuario", { idUsuario: idPersona ? idPersona : null }));
        const personasData = await personasResponse.json();
        setPersonas(personasData);
    }

    useEffect(() => {
        fetchdata();
        getMenuName();
    }, [])

    useEffect(() => {
        if (!usuarios) {
            fetchdata();
        } else {
            setLoading(false);
        }
    }, [usuarios])

    useEffect(() => {
        if (data && personas) setOpen(true)
    }, [data, personas])

    useEffect(() => {
        if (action === "destroy") {
            submit();
        }
    }, [usuario_idUsuario]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {usuarios && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData(userData);
                            getPersonas();
                        }}
                        data={usuarios}
                        columns={[
                            {
                                header: "Nombre",
                                accessor: "usuario_nombre",
                            },
                            {
                                header: "Username",
                                accessor: "usuario_username",
                            },
                            {
                                header: "Ultimo login",
                                // accessor: "usuario_ultimologin",
                                cell: ({ item }) => item.usuario_ultimologin ? moment(item.usuario_ultimologin)
                                    .format('DD-MM-YYYY hh:mm a') : '-',
                            },
                            {
                                header: "Activo",
                                cell: (eprops) => (
                                    <>
                                        {eprops.item.usuario_estatus == 1 ? (
                                            <Chip
                                                label="Activo"
                                                color="success"
                                            />
                                        ) : (
                                            <Chip
                                                label="Inactivo"
                                                color="error"
                                            />
                                        )}
                                    </>
                                ),
                            },
                            {
                                header: "Acciones",
                                edit: (eprops) => {
                                    setAction("edit");
                                    setData({ ...eprops.item });
                                    // setOpen(!open);
                                    setUsuario_idUsuario(
                                        eprops.item.usuario_idUsuario
                                    );
                                    getPersonas(eprops.item.usuario_idPersona)
                                },
                                custom: (eprops) =>
                                (<Tooltip title="Permisos">
                                    <button
                                        onClick={() => {
                                            setAssignMenu(true);
                                            setData({
                                                ...eprops.item,
                                                usuario_password: "",
                                            });
                                        }}
                                        className="material-icons"
                                    >
                                        engineering
                                    </button>
                                </Tooltip>)
                            },
                        ]}
                    />
                </div>
            )}

            <DialogComp
                dialogProps={{
                    model: 'usuario',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => handleCloseModal(),
                    onSubmitState: () => submit
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: "text",
                        fieldKey: "usuario_nombre",
                        value: data.usuario_nombre,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                usuario_nombre: e.target.value,
                            }),
                    },
                    {
                        label: "Username",
                        input: true,
                        type: "text",
                        fieldKey: "usuario_username",
                        autoComplete: "username",
                        value: data.usuario_username,
                        isFocused: true,
                        onlyUppercase: false,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                usuario_username: e.target.value,
                            }),
                    },
                    {
                        label: "Password",
                        input: true,
                        type: "password",
                        autoComplete: "new-password",
                        fieldKey: "usuario_password",
                        value: data.usuario_password,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                usuario_password: e.target.value,
                            }),
                    },
                    {
                        label: "Rol",
                        select: true,
                        options: roles,
                        valueKey: "roles_id",
                        data: "roles_descripcion",
                        value: data.usuario_idRol,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                usuario_idRol: e,
                            }),
                    },
                    {
                        label: "Persona",
                        select: true,
                        options: action === "create" ? personas?.options : personas?.usuario,
                        valueKey: "IdPersona",
                        data: "nombre_completo",
                        value: data.usuario_idPersona,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                usuario_idPersona: e,
                            }),
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: "usuario_estatus",
                        checked: data.usuario_estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setData({
                            ...data,
                            usuario_estatus: e.target.checked ? "1" : "0",
                        }),
                    },
                ]}
                errors={errors}
            />
            <AsignMenusDialog
                assignMenu={assignMenu}
                assignMenuHandler={setAssignMenu}
                user={data}
            />
        </div>
    );
}
