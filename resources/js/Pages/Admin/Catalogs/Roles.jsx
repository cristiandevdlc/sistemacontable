import "../../../../sass/TablesComponent/_tablesStyle.scss";
import AsignMenusDialog from "./Roles/AsignMenusDialog";
import request, { validateInputs } from "@/utils";
import DialogComp from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, Tooltip } from "@mui/material";
import { Tree } from 'primereact/tree';

const rolesValidation = { roles_descripcion: ['required', 'max:150'] }
const rolesData = { roles_descripcion: "" }

export default function Roles() {
    const [state, setState] = useState(true)
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState("create");
    const [roles, setRoles] = useState();
    const [assignMenu, setAssignMenu] = useState(false);
    const [rol_idRol, setRol_idRol] = useState(0); 
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const { data, setData } = useForm(rolesData);



    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, {enabled: true});
        } catch (error) { }
    };




    const fetchdata = async () => {
        const response = await fetch(route("roles.index"));
        const data = await response.json();
        setRoles(data);
    };

    useEffect(() => {
        if (!roles) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false);
        }
    }, [roles]);

    useEffect(() => {
        fetchdata();
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        setErrors({})
        const result = validateInputs(rolesValidation, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("roles.store") : route("roles.update", rol_idRol);
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
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
            {roles && !loading && (
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        add={() => {
                            setAction("create");
                            setData(rolesData);
                            setOpen(!open);
                        }}
                        data={roles}
                        columns={[
                            { header: "Nombre", accessor: "roles_descripcion" },
                            {
                                header: "Acciones",
                                cell: (eprops) => (
                                    <>
                                        <Tooltip title="Editar">
                                            <button
                                                className="material-icons"
                                                onClick={() => {
                                                    setAction("edit");
                                                    setData({ ...eprops.item });
                                                    setOpen(!open);
                                                    setRol_idRol(
                                                        eprops.item.roles_id
                                                    );
                                                }}
                                            >
                                                edit
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Asignar Menus">
                                            <button
                                                onClick={() => {
                                                    setAssignMenu(true);
                                                    setData({ ...eprops.item });
                                                }}
                                                className="material-icons"
                                            >
                                                engineering
                                            </button>
                                        </Tooltip>
                                    </>
                                ),
                            },
                        ]}
                    />
                </div>
            )}

            <AsignMenusDialog
                assignMenu={assignMenu}
                assignMenuHandler={setAssignMenu}
                rol={data}
            ></AsignMenusDialog>

            <DialogComp
                dialogProps={{
                    model: 'rol',
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
                        fieldKey: "roles_descripcion",
                        value: data.roles_descripcion,
                        autoComplete: "Nombre",
                        isFocused: true,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                roles_descripcion: e.target.value,
                            }),
                    },
                ]}
                errors={errors}
            />
        </div>
    );
}
