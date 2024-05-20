import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import request from "@/utils";
import { FieldDrawer } from "@/components/DialogComp";
import { Request } from "@/core/Request";

export default function CrearUsuario({ open, handleOpen, data }) {
    const [roles, setRoles] = useState();
    const [usuarios, setUsuarios] = useState();
    const [dataUsuario, setDataUsuario] = useState({
        usuario_nombre: '',
        usuario_idRol: '',
        usuario_username: '',
        usuario_password: generatePassword(),
        usuario_estatus: "1",
    });

    const getRoles = async () => {
        const response = await request(route('roles.index',))
        setRoles(response)
    }
    const getUsuarios = async () => {
        const response = await request(route('usuarios.index',))
        setUsuarios(response)
    }


    const generateUsername = (data) => {
        const nombres = data.Nombres.split(' ');
        const apellidoPaterno = data.ApePat || '';
        const apellidoMaterno = data.ApeMat || '';
        let username = nombres[0].charAt(0).toUpperCase();
        if (nombres.length > 1) {
            username += nombres[1].charAt(0).toUpperCase();
        }
        username += nombres[0].charAt(nombres[0].length - 1).toUpperCase();
        if (nombres.length > 1) {
            username += nombres[1].charAt(nombres[1].length - 1).toUpperCase();
        }
        username += apellidoPaterno.charAt(0).toUpperCase();
        username += apellidoPaterno.charAt(apellidoPaterno.length - 1).toUpperCase();
        username += apellidoMaterno.charAt(0).toUpperCase();
        username += apellidoMaterno.charAt(apellidoMaterno.length - 1).toUpperCase();
        const year = new Date(data.FechaNacimiento).getFullYear();
        username += year.toString().slice(-2);

        let usernameExists = true;
        let i = 1;
        let newUsername = username;
        while (usernameExists) {
            const existingUser = usuarios?.find(user => user.usuario_username === newUsername);
            if (!existingUser) {
                usernameExists = false;
            } else {
                i++;
                newUsername = username + i;
            }
        }
        return newUsername;
    }


    function generatePassword() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }

    const submit = async () => {
        const requestData = {
            usuario_nombre: data.nombreCompleto,
            usuario_idRol: dataUsuario.usuario_idRol,
            usuario_username: generateUsername(data),
            usuario_password: dataUsuario.usuario_password,
            usuario_estatus: dataUsuario.usuario_estatus,
            usuario_idPersona: data.IdPersona
        };
        const res = await Request._post(route("usuarios.store"), requestData, { enabled: true, error: { message: 'Error al crear el usuario', type: 'error' }, success: { message: "Usuario Creado", type: 'success' } })
    }

    useEffect(() => {
        getRoles()
        getUsuarios()
        // console.log('data', data)
    }, [])

    return (
        <div className="h-full">
            <div className="flex flex-col gap-2 pt-4 min-w-[300px]">
                <FieldDrawer
                    fields={[
                        {
                            label: 'Nombre',
                            input: true,
                            type: 'text',
                            fieldKey: '',
                            value: data.nombreCompleto,
                            onChangeFunc: (e) => setDataUsuario({
                                ...dataUsuario,
                                nombreCompleto: e.target.value,
                            })
                        },
                        {
                            label: 'Rol',
                            select: true,
                            options: roles,
                            type: 'text',
                            fieldKey: '',
                            data: "roles_descripcion",
                            valueKey: "roles_id",
                            value: dataUsuario.usuario_idRol,
                            onChangeFunc: (e) => setDataUsuario({
                                ...dataUsuario,
                                usuario_idRol: e,
                            })
                        },
                        {
                            label: 'Nombre de Usuario',
                            input: true,
                            type: 'text',
                            fieldKey: '',
                            disabled: true,
                            value: generateUsername(data),
                            onChangeFunc: (e) => setDataUsuario({
                                ...dataUsuario,
                                usuario_username: e.target.value,
                            })
                        },
                        {
                            label: 'Contraseña',
                            input: true,
                            type: 'text',
                            fieldKey: '',
                            disabled: true,
                            value: dataUsuario.usuario_password,
                            onChangeFunc: (e) => setDataUsuario({
                                ...dataUsuario,
                                usuario_password: e.target.value,
                            })
                        },
                        {
                            label: "Activo",
                            check: true,
                            fieldKey: 'usuario_estatus',
                            checked: dataUsuario.usuario_estatus,
                            style: 'justify-center',
                            onChangeFunc: (e) => setDataUsuario({
                                ...dataUsuario,
                                usuario_estatus: e.target.checked ? "1" : "0",
                            }),
                        },

                    ]}
                />
            </div>
            <div className="flex justify-end mt-9">
                <Button color={"success"} onClick={submit}> Crear Usuario </Button>
            </div>
        </div>
    );
}
