import Datatable from '@/components/Datatable'
import request, { camionLogo, noty } from '@/utils'
import { Chip } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const EditBankCount = ({ state, dispatch }) => {
    const [data, setData] = useState(state.cuentasBancoList)
    const [edited, setEdited] = useState(false)

    const handleChipClick = (item, newStatus) => {
        const index = data.findIndex(element => element === item);
        if (index !== -1) {
            const newData = [...data]
            newData[index] = { ...item, CuentasBancoEmpresa_Estatus: newStatus }
            setData(newData)
        }
        setEdited(true)
    };

    const onChangeCuenta = (e) => {
        const index = data.findIndex(element => element === e.oldData);
        if (index !== -1) {
            const newData = [...data]
            newData[index] = { ...e.oldData, CuentasBancoEmpresa_Cuenta: e.newData.CuentasBancoEmpresa_Cuenta }
            setData(newData)
        }
        setEdited(true)
    };

    const updateAccounts = async () => {
        try {
            await request(route('update-cuentas-banco-by-empresa'), "POST", { cuentas: data }, { enabled: true, success: { type: 'success', message: "Datos actualizados." } })
            setEdited(false)
        } catch {
            noty('Ocurrió un error al actualizar los datos.', 'error')
        }
    }

    useEffect(() => {
        edited && dispatch({ type: 'SET_CONFIRM', payload: true })
        !edited && dispatch({ type: 'SET_CONFIRM', payload: false })
    }, [edited])

    return (
        <article className='h-full'>
                {data?.length > 0 ? (
                    <section className='flex flex-col h-full justify-between'>
                        <Datatable
                            data={data}
                            virtual={true}
                            searcher={false}
                            handleRowUpdating={(e) => onChangeCuenta(e)}
                            editingMode={{ mode: "cell", allowUpdating: true }}
                            columns={[
                                {
                                    width: '40%', header: "Descripción", accessor: "CuentasBancoEmpresa_Descripcion", cell: ({ item }) =>
                                        <div>{item.CuentasBancoEmpresa_Descripcion}</div>
                                },
                                { width: '40%', header: "No. Cuenta", accessor: "CuentasBancoEmpresa_Cuenta" },
                                {
                                    width: '20%', header: "Estatus", accessor: "CuentasBancoEmpresa_Estatus", cell: ({ item }) =>
                                        item.CuentasBancoEmpresa_Estatus === '1' ? (
                                            <Chip label="Activa" color="success" onClick={() => handleChipClick(item, '0')} />
                                        ) : (
                                            <Chip label="Inactiva" color="error" onClick={() => handleChipClick(item, '1')} />
                                        )
                                }
                            ]}
                        />
                        <section>
                            <button
                                className={`h-[48px] rounded-lg text-center w-full text-white ${edited ?'bg-accept-color' : 'bg-disabled-color'}`}
                                disabled={!edited}
                                onClick={() => updateAccounts()}
                            >
                                Actualizar
                            </button>
                        </section>
                    </section>
                ) : (
                    <section className='flex flex-col relative h-[90%] items-center overflow-hidden self-center justify-center'>
                        <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                        <span className='text-gray-600 non-selectable'>Sin cuentas de banco.</span>
                    </section>
                )
                }
        </article>
    )
}

export default EditBankCount