import { Checkbox, Dialog, DialogContent, DialogTitle, DialogActions, Button, FormGroup } from "@mui/material";
import { useState, useEffect } from "react";
import MultiSelect from "./MultiSelect";
import { Tree } from "primereact/tree";
import { noty } from "@/utils";

export default function AsignMenusDialog(props) {
    const [allChecked, setAllChecked] = useState({
        usuarioxmenu_alta: { checked: true, partialChecked: false },
        usuarioxmenu_cambio: { checked: true, partialChecked: false },
        usuarioxmenu_consulta: { checked: true, partialChecked: false },
        usuarioxmenu_especial: { checked: true, partialChecked: false }
    })
    const [allMenus, setAllMenus] = useState();
    const [assignedMenus, setAssignedMenus] = useState();
    const [finalMenus, setFinalMenus] = useState()
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(null);
    const [userRole, setUserRole] = useState([])
    const initialSelectedPermissions = {}
    const initialSelectedNodes = {}
    let allPermissionChecks = {
        usuarioxmenu_alta: { checked: true, partialChecked: false },
        usuarioxmenu_cambio: { checked: true, partialChecked: false },
        usuarioxmenu_consulta: { checked: true, partialChecked: false },
        usuarioxmenu_especial: { checked: true, partialChecked: false }
    }
    const [permissionsCount, setPermissionsCount] = useState({
        total: 0,
        usuarioxmenu_alta: 0,
        usuarioxmenu_cambio: 0,
        usuarioxmenu_consulta: 0,
        usuarioxmenu_especial: 0
    })

    const fetchdata = async () => {
        const menusResponse = await fetch(route("menus-tree"));
        const dataMenus = await menusResponse.json();
        const menusAssignedResponse = await fetch(route("usuarioxmenu.index", props.user.usuario_idUsuario));
        const dataMenusAssigned = await menusAssignedResponse.json();
        return { dataMenus, dataMenusAssigned }
    };

    const saveUserMenus = async () => {
        const menus = [];

        function getElements(node) {
            if (!Object.values(node.permissions).every((permission) => permission === '0')) {
                menus.push({
                    usuarioxmenu_idmenu: node.key,
                    usuarioxmenu_alta: node.permissions.usuarioxmenu_alta,
                    usuarioxmenu_cambio: node.permissions.usuarioxmenu_cambio,
                    usuarioxmenu_consulta: node.permissions.usuarioxmenu_consulta,
                    usuarioxmenu_especial: node.permissions.usuarioxmenu_especial,
                })
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach((child) => getElements(child))
            }
        }
        allMenus.forEach((node) => getElements(node))

        try {
            await fetch(
                route("usuarioxmenu.update", props.user.usuario_idUsuario),
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        menus: menus,
                        rolId: userRole
                    }),
                }
            ).finally(() => {
                setOpenDialog(false)
                noty('Guardado con éxito.', 'success')
            });
        } catch {
            noty('Ocurrió un error al guardar.', 'error')
        }
    };

    function calcularValores(obj) {
        if (obj) permissionsCount.total = permissionsCount.total + 1
        const menuInfo = assignedMenus.find((menu) => menu.menu_id === obj.key);

        initialSelectedPermissions[obj.key] = obj
        // Verificar si el objeto actual existe en dataMenusAssigned
        let permisos = {
            permissions: {
                usuarioxmenu_alta: menuInfo?.pivot.usuarioxmenu_alta || '0',
                usuarioxmenu_cambio: menuInfo?.pivot.usuarioxmenu_cambio || '0',
                usuarioxmenu_consulta: menuInfo?.pivot.usuarioxmenu_consulta || '0',
                usuarioxmenu_especial: menuInfo?.pivot.usuarioxmenu_especial || '0'
            }
        }

        checkPerPermission(permisos.permissions)

        initialSelectedPermissions[obj.key] = Object.assign(initialSelectedPermissions[obj.key], permisos)

        if (obj.children && obj.children.length > 0) {
            for (const hijo of obj.children) {
                calcularValores(hijo)
            }
        } else {
            if (menuInfo) {
                if (Object.values(permisos.permissions).every((x) => x === '1')) {
                    initialSelectedNodes[obj.key] = { checked: true, partialChecked: false }
                    // tiene todos
                } else if (Object.values(permisos.permissions).some((x) => x === '1')) {
                    initialSelectedNodes[obj.key] = { checked: false, partialChecked: true }
                    // tiene algunos
                } else {
                    // No tienen ninguno
                }
            }
        }
        // initialSelectedNodes[obj.key] = { checked: allChilds, partialChecked: someChilds }
    }

    const checkPerPermission = (permisos) => {
        for (const permiso in permisos) {
            const permisoKey = permiso; // Almacena la clave para evitar problemas de referencia

            if (!allPermissionChecks[permisoKey]) {
                allPermissionChecks[permisoKey] = {
                    checked: false,
                    partialChecked: false
                };
            }
            // permissionsCount[permisoKey] = (permisos[permisoKey] === '0') ? (permissionsCount[permisoKey] - 1) : (permissionsCount[permisoKey] + 1)
            allPermissionChecks[permisoKey].checked = (permisos[permisoKey] === '0') ? false : allPermissionChecks[permisoKey].checked;
            allPermissionChecks[permisoKey].partialChecked = allPermissionChecks[permisoKey].checked ? false : ((permisos[permisoKey] === '1') ? true : allPermissionChecks[permisoKey].partialChecked);
        }
    }

    const checkAllPermission = (permiso) => {
        const { name, checked } = permiso.target
        const updatedAllMenus = [...allMenus];

        const updatePermissions = (menu) => {
            if (name === 'allAlta') {
                menu.permissions.usuarioxmenu_alta = checked ? '1' : '0';
            } else if (name === 'allCambio') {
                menu.permissions.usuarioxmenu_cambio = checked ? '1' : '0';
            } else if (name === 'allConsulta') {
                menu.permissions.usuarioxmenu_consulta = checked ? '1' : '0';
            } else if (name === 'allEspecial') {
                menu.permissions.usuarioxmenu_especial = checked ? '1' : '0';
            }
        };

        const updatePermissionsRecursive = (menu) => {
            updatePermissions(menu);
            checkPerPermission(menu.permissions);
            setAllChecked({
                ...allPermissionChecks
            });

            if (menu.children && menu.children.length > 0) {
                menu.children.forEach((child) => {
                    updatePermissionsRecursive(child);
                });
            }
        };

        updatedAllMenus.forEach((menu) => {
            updatePermissionsRecursive(menu);
        });

        setAllMenus(updatedAllMenus)
    }

    const updateGlobalCheck = (permisos) => {
        for (const permisoKey in allPermissionChecks) {
            const permisoValue = permisos[permisoKey] || '0';
            // console.log(permisoValue)
            allPermissionChecks[permisoKey].checked = permisoValue === '1';
            allPermissionChecks[permisoKey].partialChecked = permisoValue === '1' ? false : allPermissionChecks[permisoKey].partialChecked;
        }
        // console.log('allPermissionChecks', allPermissionChecks)
    };

    const handleOnChangeCheck = (e, node) => {
        const { name, checked } = e.target;
        // console.log('allMenus', allMenus)

        const updatedNode = { ...node };
        const updatedAllMenus = [...allMenus];

        const updatePermissions = (menu) => {
            if (name === 'alta') {
                menu.permissions.usuarioxmenu_alta = checked ? '1' : '0';
            } else if (name === 'cambio') {
                menu.permissions.usuarioxmenu_cambio = checked ? '1' : '0';
            } else if (name === 'consulta') {
                menu.permissions.usuarioxmenu_consulta = checked ? '1' : '0';
            } else if (name === 'especial') {
                menu.permissions.usuarioxmenu_especial = checked ? '1' : '0';
            }
        };

        const updateParentPermissions = (menu) => {
            if (menu.idPadre && menu.idPadre !== '0') {
                const parentMenu = findMenuByNodeKey(menu.idPadre, updatedAllMenus);
                Object.assign(parentMenu, { permissions: { usuarioxmenu_alta: '1', usuarioxmenu_cambio: '1', usuarioxmenu_consulta: '1', usuarioxmenu_especial: '1' } })
                if (parentMenu) {
                    // updatePermissions(parentMenu); // Actualiza los permisos del menú padre
                    updateParentPermissions(parentMenu); // Llama a la función de manera recursiva para el menú padre
                }
            }
        };

        updatePermissions(updatedNode); // Actualiza los permisos del menú actual
        updateParentPermissions(updatedNode); // Actualiza los permisos del menú padre
        updateGlobalCheck(updatedNode);

        setAllMenus(updatedAllMenus);
    };

    const setRolePermissions = (e, rol, action) => {
        const updatedAllMenus = [...allMenus];

        if (userRole.length !== 0) {
            userRole.forEach((role, index) => {
                const exist = userRole.find((role) => role == rol.roles_id)
                if (exist) userRole.splice(index, 1)
                else userRole.push(rol.roles_id)
            })
        } else {
            userRole.push(rol.roles_id)
        }

        rol.menus.forEach((roleMenu) => {
            const updatedNode = {
                key: roleMenu.menu_id,
                label: roleMenu.menu_nombre,
                data: roleMenu.menu_tooltip,
                idPadre: roleMenu.menu_idPadre,
                permissions: {
                    usuarioxmenu_alta: '1',
                    usuarioxmenu_cambio: '1',
                    usuarioxmenu_consulta: '1',
                    usuarioxmenu_especial: '0'
                }
            };

            function SetRole(key, menus) {
                for (const menu of menus) {
                    if (menu.key == key) {
                        return Object.assign(menu, updatedNode);
                    } else if (menu.children && menu.children.length > 0) {
                        SetRole(key, menu.children)
                    }
                }
            }

            SetRole(roleMenu.menu_id, updatedAllMenus)
        })

        setAssignedMenus(updatedAllMenus)
    }

    // Función para encontrar un menú por su clave de nodo
    const findMenuByNodeKey = (key, menus) => {
        for (const menu of menus) {
            if (menu.key == key) {
                return menu;
            } else if (menu.children && menu.children.length > 0) {
                const foundMenu = findMenuByNodeKey(key, menu.children);
                if (foundMenu) {
                    return foundMenu;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        if (props.assignMenu == true) {
            fetchdata()
                .then((res) => {
                    setAllMenus(res.dataMenus)
                    setAssignedMenus(res.dataMenusAssigned)
                })
            // .finally(() => {
            //     setOpenDialog(true);
            // });
        } else {
            setAssignedMenus(null)
            setAllMenus(null)
            setSelectedKeys(null)
            setFinalMenus(null)
        }
    }, [props.assignMenu]);

    // useEffect(() => {
    //     if (openDialog) {
    //         // checkPerPermission(allChecked)
    //         console.log(permissionsCount)
    //     }
    // }, [permissionsCount])

    useEffect(() => {
        if (!finalMenus && allMenus && assignedMenus) {
            allMenus.forEach((menu) => {
                calcularValores(menu);
            });
            setAllChecked({
                ...allPermissionChecks
            })
            setSelectedKeys(initialSelectedNodes)
            setFinalMenus(initialSelectedPermissions)
        } else if (finalMenus) {
            setOpenDialog(true);
        }
        // console.log('permissionsCount', permissionsCount)
    }, [finalMenus, assignedMenus])

    useEffect(() => {
        if (!openDialog) {
            props.assignMenuHandler(false)
            setUserRole([])
        }
    }, [openDialog])

    const customNodeTemplate = (node) => {
        let alta = node.permissions?.usuarioxmenu_alta === '1' ? true : false
        let cambio = node.permissions?.usuarioxmenu_cambio === '1' ? true : false
        let consulta = node.permissions?.usuarioxmenu_consulta === '1' ? true : false
        let especial = node.permissions?.usuarioxmenu_especial === '1' ? true : false
        return (
            <>
                <div className="flex w-full justify-between">
                    {/* <th className="grid w-full content-center"> */}
                    <div className="grid w-full content-center p-treenode-label">
                        {node.label}
                    </div>
                    {/* </th> */}
                    {node.children.length === 0 &&
                        <div className="flex w-full justify-end space-x-[88px]">
                            <div className="h-full grid items-center">
                                <input type="checkbox"
                                    name="alta"
                                    checked={alta}
                                    onChange={(e) => handleOnChangeCheck(e, node)}
                                />
                            </div>
                            <div className="h-full grid items-center">
                                <input type="checkbox"
                                    name="cambio"
                                    checked={cambio}
                                    onChange={(e) => handleOnChangeCheck(e, node)}
                                />
                            </div>
                            <div className="h-full grid items-center">
                                <input type="checkbox"
                                    name="consulta"
                                    checked={consulta}
                                    onChange={(e) => handleOnChangeCheck(e, node)}
                                />
                            </div>
                            <div className="h-full grid items-center">
                                <input type="checkbox"
                                    name="especial"
                                    checked={especial}
                                    onChange={(e) => handleOnChangeCheck(e, node)}
                                />
                            </div>
                            {/* <Checkbox
                                name="alta"
                                checked={alta}
                                onChange={(e) => handleOnChangeCheck(e, node)}
                            />
                            <Checkbox
                                name="cambio"
                                checked={cambio}
                                onChange={(e) => handleOnChangeCheck(e, node)}
                            />
                            <Checkbox
                                name="consulta"
                                checked={consulta}
                                onChange={(e) => handleOnChangeCheck(e, node)}
                            />
                            <Checkbox
                                name="especial"
                                checked={especial}
                                onChange={(e) => handleOnChangeCheck(e, node)}
                            /> */}
                        </div>
                    }
                </div >
            </>
        );
    };

    return (
        <Dialog open={openDialog} maxWidth="lg" fullWidth>
            <DialogTitle>
                Asignar menus a: {props.user.usuario_nombre}
            </DialogTitle>
            <DialogContent>
                {allMenus &&
                    <div className="flex flex-col justify-content-center">
                        <div className="grid">
                            <div className="w-full pb-3 p-input-icon-left">
                                <MultiSelect parentHandleChecker={setRolePermissions} />
                            </div>
                            <div className="justify-self-end w-[37%] top-36 right-14">
                                <div className="grid space-x-1 grid-cols-12">
                                    <div className="text-center col-span-4">
                                        <div>
                                            Alta
                                        </div>
                                        <div>
                                            <input type="checkbox"
                                                name="allAlta"
                                                checked={allChecked.usuarioxmenu_alta.checked}
                                                indeterminate={allChecked.usuarioxmenu_alta.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            />
                                            {/* <Checkbox
                                                name="allAlta"
                                                checked={allChecked.usuarioxmenu_alta.checked}
                                                indeterminate={allChecked.usuarioxmenu_alta.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            /> */}
                                        </div>
                                    </div>
                                    <div className="text-center col-span-2">
                                        <div>
                                            Cambio
                                        </div>
                                        <div>
                                            <input type="checkbox"
                                                name="allCambio"
                                                checked={allChecked.usuarioxmenu_cambio.checked}
                                                indeterminate={allChecked.usuarioxmenu_cambio.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            />
                                            {/* <Checkbox
                                                name="allCambio"
                                                checked={allChecked.usuarioxmenu_cambio.checked}
                                                indeterminate={allChecked.usuarioxmenu_cambio.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            /> */}
                                        </div>
                                    </div>
                                    <div className="text-center col-span-3">
                                        <div>
                                            Consulta
                                        </div>
                                        <div>
                                            <input type="checkbox"
                                                name="allConsulta"
                                                checked={allChecked.usuarioxmenu_consulta.checked}
                                                indeterminate={allChecked.usuarioxmenu_consulta.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            />
                                            {/* <Checkbox
                                                name="allConsulta"
                                                checked={allChecked.usuarioxmenu_consulta.checked}
                                                indeterminate={allChecked.usuarioxmenu_consulta.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            /> */}
                                        </div>
                                    </div>
                                    <div className="text-center col-span-3">
                                        <div>
                                            Especial
                                        </div>
                                        <div>
                                            <input type="checkbox"
                                                name="allEspecial"
                                                checked={allChecked.usuarioxmenu_especial.checked}
                                                indeterminate={allChecked.usuarioxmenu_especial.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            />
                                            {/* <Checkbox
                                                name="allEspecial"
                                                checked={allChecked.usuarioxmenu_especial.checked}
                                                indeterminate={allChecked.usuarioxmenu_especial.partialChecked}
                                                onChange={(e) => checkAllPermission(e)}
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Tree
                            key={"key"}
                            id="newMenusForm"
                            value={allMenus}
                            // selectionMode="checkbox"
                            // selectionKeys={selectedKeys}
                            // filterTemplate
                            filter
                            filterMode="lenient"
                            filterPlaceholder="Buscar"
                            // onFilterValueChange={(value) => setFilteredValue(value)}
                            pt={{
                                root: { className: 'w-full  md:w-30rem' },
                                container: { className: "" }
                            }}
                            onSelectionChange={(e) => {
                                setSelectedKeys(e.value)
                            }}
                            nodeTemplate={customNodeTemplate}
                        />
                    </div>
                }
            </DialogContent>
            <DialogActions className={'mt-4'}>
                <Button color="error" onClick={() => { setOpenDialog(false), props.assignMenuHandler(false) }}>Cancelar</Button>
                <Button color="success" type="submit" onClick={saveUserMenus}>Guardar cambios</Button>
            </DialogActions>
        </Dialog>
    );
}
