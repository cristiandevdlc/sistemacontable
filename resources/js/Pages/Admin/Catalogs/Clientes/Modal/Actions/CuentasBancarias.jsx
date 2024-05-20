import { FieldDrawer } from "@/components/DialogComp";
import { ButtonComp } from "@/components/ButtonComp";
import request, { validateInputs } from "@/utils";
import Datatable from '@/components/Datatable';
import { IntBankData, bankAccountValidations } from "../../IntCliente";
import { Chip, Divider } from "@mui/material";
import { useEffect, useState } from "react";


export default function CuentasBancarias({ data, bankState = IntBankData, setBankState, fetchData }) {
    const [selected, setSelected] = useState([])
    const [errors, setErrors] = useState({})
    const [aux, setAux] = useState(false)

    const updateAccount = ({ selectedRowKeys = [] }) => {
        if (selectedRowKeys) {
            setBankState({
                ...bankState,
                bankData: {
                    ...bankState.bankData,
                    ...selectedRowKeys[0]
                },
            })
        }

    }

    const submitData = async (e) => {
        e.preventDefault();

        setErrors({})
        const result = validateInputs(bankAccountValidations, bankState.bankData);
        if (!result.isValid) {
            console.log(result)
            setErrors(result.errors)
            return;
        }

        const url = bankState.bankData?.cuentasBancoCliente_idCuentasBancoCliente ?
            route('ClientBankAccounts.update', bankState.bankData?.cuentasBancoCliente_idCuentasBancoCliente) :
            route('ClientBankAccounts.store')
        const method = bankState.bankData?.cuentasBancoCliente_idCuentasBancoCliente ? 'PUT' : 'POST'
        await request(url, method, bankState.bankData)
        await fetchData()
        setAux(true)
    }

    useEffect(() => {
        if (aux) {
            setBankState({ ...bankState, bankData: IntBankData.bankData })
            setAux(false)
        }
    }, [aux]);

    return <div className="grid grid-cols-3 gap-x-4">
        <div className="grid grid-cols-1 sm:col-span-3 md:col-span-1 gap-x-4">
            <FieldDrawer
                errors={errors}
                fields={[
                    {
                        label: "Descripción",
                        input: true,
                        fieldKey: 'cuentasBancoCliente_descripcion',
                        value: bankState.bankData?.cuentasBancoCliente_descripcion || '',
                        onChangeFunc: (e) => setBankState({
                            ...bankState,
                            bankData: {
                                ...bankState.bankData,
                                cuentasBancoCliente_descripcion: e.target.value
                            }
                        })
                    },
                    {
                        label: "Banco",
                        select: true,
                        options: bankState.banksList,
                        data: 'banco_nombreBanco',
                        valueKey: 'banco_idBanco',
                        fieldKey: 'cuentasBancoCliente_idBanco',
                        value: bankState.bankData?.cuentasBancoCliente_idBanco || '',
                        onChangeFunc: (e) => setBankState({
                            ...bankState,
                            bankData: {
                                ...bankState.bankData,
                                cuentasBancoCliente_idBanco: e
                            }
                        })
                    },
                    {
                        label: "Cuenta",
                        input: true,
                        fieldKey: 'cuentasBancoCliente_cuentaBancaria',
                        value: bankState.bankData?.cuentasBancoCliente_cuentaBancaria || '',
                        onChangeFunc: (e) => setBankState({
                            ...bankState,
                            bankData: {
                                ...bankState.bankData,
                                cuentasBancoCliente_cuentaBancaria: e.target.value
                            }
                        })
                    },
                    {
                        label: "Activo",
                        check: true,
                        fieldKey: 'cuentasBancoCliente_estatus',
                        checked: bankState.bankData?.cuentasBancoCliente_estatus ?? '1',
                        style: 'justify-center mt-5',
                        onChangeFunc: (e) => setBankState({
                            ...bankState,
                            bankData: {
                                ...bankState.bankData,
                                cuentasBancoCliente_estatus: e.target.checked ? "1" : "0",
                            }
                        })
                    },
                    {
                        custom: true,
                        style: "col-span-full",
                        label: "Guardar cuenta",
                        customItem: ({ label }) => <><ButtonComp onClick={submitData} label={label} /></>
                    }
                ]}
            />
        </div>
        <div className="sm:col-span-3 md:col-span-2 mt-5">
            Cuentas bancarias
            <div style={{ zoom: 0.7 }}>
                <Datatable
                    searcher={false}
                    virtual={true}
                    selectionFunc={updateAccount}
                    selection={{ mode: 'single' }}
                    selectedData={selected}
                    data={Array.from(bankState.clientAccounts ?? [])}
                    columns={[
                        { header: "Descripción", width: '25%', cell: (eprops) => <>{eprops.item?.cuentasBancoCliente_descripcion}</> },
                        { header: "Banco", width: '25%', cell: (eprops) => <>{eprops.item?.banco.banco_nombreBanco}</> },
                        { header: "Cuenta", width: '40%', cell: (eprops) => <>{eprops.item?.cuentasBancoCliente_cuentaBancaria}</> },
                        {
                            header: "Activo", width: '10%', cell: (eprops) => <>
                                {eprops.item?.cuentasBancoCliente_estatus == 1 ?
                                    (<Chip label="Activa" color="success" size="small" />) :
                                    (<Chip label="Inactiva" color="error" size="small" />)}
                            </>
                        },
                    ]}
                />
            </div>
        </div>
    </div>;
}