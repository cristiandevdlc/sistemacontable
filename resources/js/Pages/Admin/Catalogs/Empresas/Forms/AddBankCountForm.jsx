import { FieldDrawer } from '@/components/DialogComp'
import { Button } from '@mui/material';
import React from 'react'

const AddBankCountForm = ({
    state,
    dispatch,
}) => {
    return (
        <article className='h-full flex flex-col justify-between'>
            <FieldDrawer
                fields={[
                    {
                        label: 'Banco',
                        select: true,
                        fieldKey: 'Banco',
                        value: state.cuentasBanco.CuentasBancoEmpresa_idBanco,
                        options: state.catalog.BANKS,
                        data: 'banco_Descripcion',
                        valueKey: 'banco_idBanco',
                        onChangeFunc: (e) => {
                            dispatch({ type: 'SET_BANCO_SELECTED', payload: { idBanco: e } })
                        }
                    },
                    {
                        label: 'Número de cuenta',
                        input: true,
                        type: 'text',
                        fieldKey: 'Movimiento',
                        value: state.cuentasBanco.CuentasBancoEmpresa_Cuenta,
                        onChangeFunc: (e) => dispatch({ type: 'SET_NO_CUENTA', payload: e.target.value })
                    },
                    {
                        label: 'Descripción',
                        input: true,
                        type: 'text',
                        fieldKey: 'CuentasBancoEmpresa_Descripcion',
                        value: state.cuentasBanco.CuentasBancoEmpresa_Descripcion,
                        onChangeFunc: (e) => dispatch({ type: 'SET_DESCRIPCION_CUENTA', payload: e.target.value })
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'estatus',
                        checked: state.cuentasBanco.CuentasBancoEmpresa_Estatus,
                        labelPlacement: 'end',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => dispatch({ type: 'SET_CB_STATUS', payload: e.target.checked })
                    },
                    {
                        custom: true,
                        customItem: () => (
                            <section>
                                <button
                                    className='h-[48px] rounded-lg text-center w-full text-white bg-accept-color'
                                    onClick={() => dispatch({ type: 'CREATE_BANK_ACCOUNT', payload: true })}
                                >
                                    Crear
                                </button>
                            </section>
                        )
                    }
                ]}
                errors={state.errors}
            />
        </article>
    )
}

export default AddBankCountForm