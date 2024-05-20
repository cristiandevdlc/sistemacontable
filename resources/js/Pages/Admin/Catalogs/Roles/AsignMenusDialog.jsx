import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    Checkbox,
    Divider
} from "@mui/material";
import { Tree } from "primereact/tree";
import request, { noty } from "@/utils";
import SelectComp from "@/components/SelectComp";

export default function AsignMenusDialog(props) {
    const [state, setState] = useState({ mainMenuList: [], mainMenuSelected: null, showConfirmDialog: false, confirmSave: false, updateUsers: false, usersList: [] })
    const [allMenus, setAllMenus] = useState();
    const [assignedMenus, setAssignedMenus] = useState();
    const [selectedKeys, setSelectedKeys] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    let initialSelectedNodes = {};

    const fetchdata = async () => {
        // Obtener los datos de dataMenus y dataMenusAssigned
        const menusResponse = await fetch(route("menus-tree"));
        const dataMenus = await menusResponse.json();
        setAllMenus(dataMenus);
        const menusAssignedResponse = await fetch(route("rolesxmenu.show", props.rol.roles_id));
        const dataMenusAssigned = await menusAssignedResponse.json();
        setAssignedMenus(dataMenusAssigned)

        return { dataMenus, dataMenusAssigned }
    };

    // Función para calcular los valores de checked y partialChecked
    function calcularValores(obj, assignedMenus) {
        // Verificar si el objeto actual existe en dataMenusAssigned
        const menuInfo = assignedMenus.find((menu) => menu.menu_id === obj.key);

        if (menuInfo) {
            // Verificar si el objeto actual tiene hijos (children)
            if (obj.children && obj.children.length > 0) {
                let todosHijosSeleccionados = true;
                let algunosHijosSeleccionados = false;

                // Recorrer los hijos del objeto actual y calcular sus valores
                for (const hijo of obj.children) {
                    const hijoValores = calcularValores(hijo, assignedMenus);

                    // Verificar si al menos un hijo no está seleccionado
                    if (!hijoValores) {
                        todosHijosSeleccionados = false;
                        algunosHijosSeleccionados = true;
                    }
                }

                // Verificar si ambos campos deben ser `false` para no agregar el objeto
                if (!(todosHijosSeleccionados === false && algunosHijosSeleccionados === false)) {
                    // Actualizar los valores de checked y partialChecked
                    if (todosHijosSeleccionados) {
                        initialSelectedNodes[obj.key] = { checked: true, partialChecked: false, label: menuInfo.menu_nombre };
                    } else if (algunosHijosSeleccionados) {
                        initialSelectedNodes[obj.key] = { checked: false, partialChecked: true, label: menuInfo.menu_nombre };
                    }
                }
            } else {
                // No hay hijos, usar valores predeterminados
                initialSelectedNodes[obj.key] = { checked: true, partialChecked: false, label: menuInfo.menu_nombre, toList: true };
            }

            // Verificar si ambos campos son `false` y eliminar el objeto
            if (initialSelectedNodes[obj.key].checked === false && initialSelectedNodes[obj.key].partialChecked === false) {
                delete initialSelectedNodes[obj.key];
            }
        } else {
            // El objeto no se encuentra en dataMenusAssigned, usar valores predeterminados
            // initialSelectedNodes[obj.key] = { checked: false, partialChecked: false };
            return
        }

        // Devuelve los valores calculados para el objeto actual
        return initialSelectedNodes[obj.key];
    }

    const saveUserMenus = async () => {
        const menus = Object.keys(selectedKeys);
        if (!state.showConfirmDialog && !state.confirmSave) {
            const originalMenus = assignedMenus.map(menu => menu.menu_id.toString())
            const newMenus = originalMenus.length < menus.length ? menus.some((menu) => {
                const sameMenu = originalMenus.find(oMenu => menu === oMenu)
                if (!sameMenu) {
                    return true
                }
            }) : originalMenus.some((menu) => {
                const sameMenu = menus.find(oMenu => menu === oMenu)
                if (!sameMenu) {
                    return true
                }
            })
            if (newMenus && !state.confirmSave) {
                const usersInRole = await request(route('rolesxmenu.usersPerRole'), 'POST', { idRol: props.rol.roles_id }, { enabled: true })
                if (usersInRole.usuarios.length !== 0) {
                    return setState({ ...state, showConfirmDialog: true, usersList: usersInRole.usuarios })
                }
            }
            try {
                await request(route('rolesxmenu.update', props.rol.roles_id), 'PUT', { menus_ids: menus, menuInicio: state.mainMenuSelected, updateUsers: state.updateUsers, usersList: state.usersList }, { enabled: true })
                    .then(() => {
                        initialSelectedNodes = {}
                        setState({ ...state, showConfirmDialog: false, confirmSave: false, updateUsers: false, usersList: [] })
                        setOpenDialog(false), props.assignMenuHandler(false)
                        noty('Datos guardados.', 'success');
                    })
            } catch {
                noty('Ocurrió un error al guardar los datos.', 'error')
            }
        } else if (state.confirmSave) {
            // try {
            await request(route('rolesxmenu.update', props.rol.roles_id), 'PUT', { menus_ids: menus, menuInicio: state.mainMenuSelected, updateUsers: state.updateUsers, usersList: state.usersList }, { enabled: true })
                .then(() => {
                    initialSelectedNodes = {}
                    setState({ ...state, showConfirmDialog: false, confirmSave: false, updateUsers: false, usersList: [] })
                    setOpenDialog(false), props.assignMenuHandler(false)
                    noty('Datos guardados.', 'success');
                })
            // } catch {
            //     noty('Ocurrió un error al guardar los datos.', 'error')
            // }
        }
    };

    const handleOnChangeCheck = (e) => {
        const keys = Object.keys(e);
        const mainList = {}
        function addMenuName(obj) {
            const menuInfo = keys.find((key) => parseInt(key) == obj.key);
            if (menuInfo) {
                if (obj.children && obj.children.length > 0) {
                    let todosHijosSeleccionados = true;
                    let algunosHijosSeleccionados = false;

                    // Recorrer los hijos del objeto actual y calcular sus valores
                    for (const hijo of obj.children) {
                        const hijoValores = addMenuName(hijo);
                        // Verificar si al menos un hijo no está seleccionado
                        if (!hijoValores) {
                            todosHijosSeleccionados = false;
                            algunosHijosSeleccionados = true;
                        }
                    }

                    // Verificar si ambos campos deben ser `false` para no agregar el objeto
                    if (!(todosHijosSeleccionados === false && algunosHijosSeleccionados === false)) {
                        // Actualizar los valores de checked y partialChecked
                        if (todosHijosSeleccionados) {
                            mainList[obj.key] = { checked: true, partialChecked: false, label: obj.label };
                        } else if (algunosHijosSeleccionados) {
                            mainList[obj.key] = { checked: false, partialChecked: true, label: obj.label };
                        }
                    }
                } else {
                    // No hay hijos, usar valores predeterminados
                    mainList[obj.key] = { checked: true, partialChecked: false, label: obj.label, toList: true };
                }

                // Verificar si ambos campos son `false` y eliminar el objeto
                if (mainList[obj.key].checked === false && mainList[obj.key].partialChecked === false) {
                    delete mainList[obj.key];
                }
            } else {
                return
            }
            return mainList[obj.key]
        }

        allMenus.forEach((obj) => {
            addMenuName(obj)
        })
        setSelectedKeys(mainList)
    };

    const getMainMenuList = () => {
        let auxArr = []
        const selectedEntries = Object.entries(selectedKeys)
        selectedEntries.forEach((item) => {
            if (item[1].toList) auxArr.push({ key: parseInt(item[0]), label: item[1].label })
        })
        setState({ ...state, mainMenuList: auxArr, mainMenuSelected: props.rol.roles_menuInicio })
    }

    useEffect(() => {
        if (selectedKeys) getMainMenuList()
    }, [selectedKeys])

    useEffect(() => {
        if (state.confirmSave) saveUserMenus()
    }, [state.confirmSave])

    useEffect(() => {
        if (props.assignMenu == true) {
            // setState({ ...state, mainMenuSelected: props.rol.roles_menuInicio })
            fetchdata()
                .then((res) => {
                    // Itera sobre los objetos en dataMenus y calcula los valores de checked y partialChecked
                    res.dataMenus.forEach((obj) => {
                        calcularValores(obj, res.dataMenusAssigned);
                    });
                    setSelectedKeys(initialSelectedNodes)
                }).then(() => {
                    setOpenDialog(true);
                });
        }
    }, [props.assignMenu]);

    return (
        <Dialog open={openDialog} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ backgroundColor: "white" }}>
                Asignar menus al rol: {props.rol.roles_descripcion}
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: "white" }}>
                <div className="flex flex-col justify-content-center gap-4 blue-scroll">
                    <SelectComp
                        data={"label"}
                        value={state.mainMenuSelected || ''}
                        onChangeFunc={(e) => setState({ ...state, mainMenuSelected: e })}
                        valueKey={"key"}
                        options={state.mainMenuList}
                        disabled={state.mainMenuList.length === 0 ? true : false}
                        virtual={true}
                        // firstOption={field.firstOption}
                        // firstLabel={field.firstLabel}
                        label={'Selecciona el menu de inicio para este rol'}
                    />
                    <Tree
                        value={allMenus}
                        selectionMode="checkbox"
                        selectionKeys={selectedKeys}
                        filter
                        filterMode="lenient"
                        filterPlaceholder="Buscar"
                        pt={{
                            root: { className: 'w-full  md:w-30rem bg-black' }
                        }}
                        onSelectionChange={(e) => {
                            handleOnChangeCheck(e.value)
                        }}
                    // nodeTemplate={customNodeTemplate}
                    ></Tree>
                    <Dialog open={state.showConfirmDialog} maxWidth="xs" fullWidth>
                        <DialogTitle sx={{ backgroundColor: "white" }}>
                            Advertencia
                        </DialogTitle>
                        <div className='flex justify-center'>
                            <Divider className='w-[95%]' />
                        </div>
                        <DialogContent sx={{ backgroundColor: "white" }}>
                            <div className="flex flex-col justify-content-center gap-4 blue-scroll">
                                <span>
                                    Existen usuarios con este rol, ¿Deseas cambiar sus menus por los nuevos?
                                </span>
                            </div>
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: "white" }}>
                            <Button color="error" onClick={() => setState({ ...state, showConfirmDialog: false, confirmSave: false, updateUsers: false, usersList: [] })}>Cancelar</Button>
                            <Button color="success" type="submit" onClick={() => setState({ ...state, /* showConfirmDialog: false, */ confirmSave: true })}>Solo guardar</Button>
                            <Button color="success" type="submit" onClick={() => setState({ ...state, /* showConfirmDialog: false, */ confirmSave: true, updateUsers: true })}>Guardar y cambiar</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "white" }}>
                <Button color="error" onClick={() => { setOpenDialog(false), props.assignMenuHandler(false), initialSelectedNodes = {} }}>Cancelar</Button>
                <Button color="success" type="submit" onClick={saveUserMenus}>Guardar cambios</Button>
            </DialogActions>
        </Dialog>
    );
}
