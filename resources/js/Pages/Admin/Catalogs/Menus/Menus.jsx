import "../../../../../sass/MenusComponent/_leftMenu.scss";
import request, { validateInputs } from '@/utils';
import DialogComp from "@/components/DialogComp";
import LoadingDiv from '@/components/LoadingDiv'
import Datatable from '@/components/Datatable'
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Chip } from "@mui/material";

const menuValidations = {
    menu_nombre: ['required', 'max:50'],
    menu_url: 'required',
    menu_tooltip: 'required',
    menu_idPadre: 'required'
}
const menuData = {
    menu_id: "",
    menu_nombre: "",
    menu_url: "",
    menu_tooltip: "",
    menu_idPadre: 0,
    estatus: '1',
}

export default function Menus() {
    const [action, setAction] = useState("create");
    const [loading, setLoading] = useState(true)
    const { data, setData } = useForm(menuData);
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [menus2, setMenus2] = useState();
    const [menus, setMenus] = useState();

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    const fetchdata = async () => {
        const response = await fetch(route("menus.index"));
        const data = await response.json();
        setMenus(data);
    };

    const submit = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(menuValidations, data)
        if (!result.isValid) {
            setErrors(result.errors)
            return;
        }

        const ruta = action === "create" ? route("menus.store") : route("menus.update", data.menu_id)
        const method = action === "create" ? "POST" : "PUT";
        await request(ruta, method, data).then(() => {
            fetchdata();
            setOpen(!open);
        });
    };

    const handleModal = () => {
        setMenus2([{ menu_id: 0, menu_nombre: "Raiz" }].concat(menus))
        setOpen(!open);
        setErrors({});
    };

    useEffect(() => {
        if (!menus) {
            fetchdata();
            getMenuName();
        } else {
            setLoading(false)
        }
    }, [menus])

    return (
        <div className="relative h-[100%] pb-2 px-3 overflow-auto blue-scroll">
            {loading &&
                <LoadingDiv />
            }
            {(menus && !loading) &&
                <div className='sm:h-[97%] md:h-[90%]'>
                    <Datatable
                        title="dasdasd"
                        data={menus}
                        add={() => {
                            setAction('create')
                            setData(menuData)
                            handleModal(!open)
                        }}
                        columns={[
                            { header: 'Nombre', accessor: 'menu_nombre' },
                            { header: 'Url', accessor: 'menu_url' },
                            // { header: 'Tooltip', accessor: 'menu_tooltip' },
                            {
                                header: 'Menu padre', cell: ({ item }) => (
                                    // <span>{item.menu_padre ? item.menu_padre.menu_nombre : '/'}</span>
                                    <span>{
                                        `${item.menu_padre?.menu_padre?.menu_nombre ? '/ ' + item.menu_padre?.menu_padre?.menu_nombre : ''}
                                        ${item.menu_padre?.menu_nombre ? '/ ' + item.menu_padre?.menu_nombre : '/'}`
                                    }</span>
                                )
                            },
                            {
                                header: 'Activo', cell: ({ item }) => <>{item.estatus == 1 ? (<Chip label="Activo" color="success" size="small" />) : (<Chip label="Inactivo" color="error" size="small" />)}</>,
                            },
                            {
                                header: 'Acciones', edit: eprops => {
                                    setAction('edit')
                                    setData({ ...eprops.item })
                                    handleModal(!open)
                                }
                            }
                        ]}
                    />
                </div>
            }
            <DialogComp
                dialogProps={{
                    model: 'menú',
                    width: 'sm',
                    openState: open,
                    actionState: action,
                    openStateHandler: () => setOpen(!open),
                    onSubmitState: () => submit,
                    style: 'grid grid-cols-3 gap-x-4'
                }}
                fields={[
                    {
                        label: "Nombre",
                        input: true,
                        type: "text",
                        fieldKey: "menu_nombre",
                        value: data.menu_nombre,
                        onlyUppercase: false,
                        autoComplete: "nombre",
                        style: 'col-span-full',
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                menu_nombre: e.target.value,
                            }),
                    },
                    {
                        label: "Menus",
                        input: false,
                        select: true,
                        style: 'col-span-full',
                        options: (menus2 ?? []).map((menu) => {
                            return {
                                ...menu,
                                menu_nombre: `${menu.menu_padre?.menu_padre?.menu_nombre ? '/ ' + menu.menu_padre?.menu_padre?.menu_nombre : ''} ${menu.menu_padre?.menu_nombre ? '/ ' + menu.menu_padre?.menu_nombre : ''} ${'/ ' + menu.menu_nombre}`
                            }
                        }),
                        fieldKey: "menu_idPadre",
                        value: data.menu_idPadre,
                        onChangeFunc: (newValue) =>
                            setData({
                                ...data,
                                menu_idPadre: newValue,
                            }),
                        data: "menu_nombre",
                        valueKey: "menu_id",
                    },
                    {
                        label: "Menú Url",
                        input: true,
                        type: "text",
                        value: data.menu_url,
                        fieldKey: "menu_url",
                        onlyUppercase: false,
                        style: 'col-span-full',
                        autoComplete: "nombre",
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                menu_url: e.target.value,
                            }),
                    },
                    {
                        label: "Menú tooltip",
                        input: true,
                        type: "text",
                        fieldKey: "menu_tooltip",
                        onlyUppercase: false,
                        style: 'col-span-2',
                        value: data.menu_tooltip,
                        onChangeFunc: (e) =>
                            setData({
                                ...data,
                                menu_tooltip: e.target.value,
                            }),
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: data.estatus,
                        style: 'pt-2 justify-center col-span-1',
                        onChangeFunc: (e) => setData({
                            ...data,
                            estatus: e.target.checked ? "1" : "0",
                        })
                    },

                ]}
                errors={errors}
            />
        </div>
    );
}
