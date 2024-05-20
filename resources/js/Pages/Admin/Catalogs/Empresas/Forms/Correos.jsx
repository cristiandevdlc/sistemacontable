import { FieldDrawer } from '@/components/DialogComp';
import React, { useState } from 'react'
import { EmpresaData } from "../intEmpresa";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from "@mui/material";

const CorreosForm = ({
    state,
    dispatch,

}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <FieldDrawer
                fields={[
                    {
                        label: 'CORREO',
                        input: true,
                        type: 'text',
                        fieldKey: 'empresa_correoNotificacion',
                        value: state.empresa.empresa_correoNotificacion,
                        onChangeFunc: (e) => dispatch({ type: 'SET_CORREO', payload: e.target.value })
                    },
                    {
                        label: 'HOST',
                        input: true,
                        type: 'text',
                        fieldKey: 'empresa_host',
                        value: state.empresa.empresa_host,
                        onChangeFunc: (e) => dispatch({ type: 'SET_HOST', payload: e.target.value })
                    },
                    {
                        label: 'PUERTO',
                        input: true,
                        type: 'text',
                        fieldKey: 'empresa_puerto',
                        value: state.empresa.empresa_puerto,
                        onChangeFunc: (e) => dispatch({ type: 'SET_PUERTO', payload: e.target.value })
                    },
                    {
                        label: 'CORREO PASSWORD',
                        input: true,
                        type: showPassword ? 'text' : 'password',
                        fieldKey: 'empresa_passwordCorreo',
                        value: state.empresa.empresa_passwordCorreo ,
                        onChangeFunc: (e) => dispatch({ type: 'SET_PASSWORD_CORREO', payload: e.target.value })

                    },
                    {
                        label: 'SEGURIDAD SSL',
                        check: true,
                        fieldKey: 'empresa_seguridadSSL',
                        checked: state.empresa.empresa_seguridadSSL,
                        labelPlacement: 'top',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => dispatch({ type: 'SET_SEGURIDAD_SSL', payload: e.target.checked ? "1" : "0" })
                    },
                ]}
            />
          

            <section className='flex justify-between mt-[35%]'>
            <Button
                onClick={() => setShowPassword(!showPassword)}>
                {
                    !showPassword ? <VisibilityOffIcon> </VisibilityOffIcon> : <VisibilityIcon></VisibilityIcon>
                }
               {
                    !showPassword ? 'Mostrar Contraseña' : 'Ocultar Contraseña'
                }
            </Button>
                <Button
                >
                    <Button onClick={() => dispatch({ type: 'SUBMIT_EMPRESA', payload: true })}>Guardar</Button>
                </Button>

            </section>
        </div>
    )
}

export default CorreosForm;
