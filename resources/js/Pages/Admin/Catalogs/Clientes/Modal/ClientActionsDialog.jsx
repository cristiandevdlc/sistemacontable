import clienteData, { IntBankData, IntClienteSucursal, IntEnterpriseList, IntStateDialogClient } from "../IntCliente";
import CreditosDescuentosFormulario from "./Actions/CreditosDescuentosFormulario";
import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import TrasladoDeEmpresa from "./Actions/TrasladoDeEmpresa";
import BackIcon from '../../../../../../png/LeftArrow.png';
import UserMenusContext from "@/Context/UserMenusContext";
import CuentasBancarias from "./Actions/CuentasBancarias";
import '../../../../../../sass/_detallesDialogSyle.scss';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import Sucursal from "./Actions/Sucursal";
import Correos from "./Actions/Correos";
import { useState } from "react";
import request from "@/utils";

const dialogMenus = {
    mainMenu: 0,
    emails: 1,
    address: 2,
    wallet: 3,
    enterprise: 4,
    bankAccounts: 5,
}

export default function ClientActionsDialog({ open = false, dialogHandler = () => { }, data = clienteData, setData = () => { }, getClientes = () => { } }) {
    const { userMenus, selectedMenu, SetSelectedMenuFunc } = useContext(UserMenusContext);
    const [allClienteSucursal, setAllClienteSucursal] = useState(IntClienteSucursal);
    const [activeMenu, setActiveMenu] = useState(dialogMenus.mainMenu);
    const [states, setStates] = useState(IntStateDialogClient);
    const [empresas, setEmpresas] = useState(IntEnterpriseList);
    const [bankStates, setBankStates] = useState(IntBankData)
    const location = useLocation();

    const menuHandler = (_menu) => {
        if (_menu !== dialogMenus.mainMenu)
            setStates({ ...states, loading: true, largeDialog: false })
        if (_menu === dialogMenus.address) {
            setStates({ ...states, loading: true, largeDialog: true })
            fetchClientSucursal(data.cliente_idCliente)
        }
        if (_menu === dialogMenus.enterprise) {
            setStates({ ...states, loading: true, largeDialog: false })
            fetchEmpresas()
        }
        if (_menu === dialogMenus.bankAccounts) {
            setStates({ ...states, loading: true, largeDialog: false })
            fetchBankAccounts()
        }
        if (activeMenu !== dialogMenus.address || activeMenu !== dialogMenus.enterprise)
            setActiveMenu(_menu)
    }

    const fetchClientSucursal = async (id) => {
        const response = await request(route('cliente-sucursal.show', id))
        setAllClienteSucursal({ ...allClienteSucursal, sucursalesCliente: [...response] })
    }

    const fetchEmpresas = async () => {
        const resEmpresa = await request(route('empresas.index'))
        const resClientEmpresa = await request(route('cliente-empresa-by-client', data.cliente_idCliente))
        setEmpresas({ empresaList: resEmpresa, empresaClient: resClientEmpresa })
    }

    const fetchBankAccounts = async () => {
        const [
            bankList,
            clientAccounts
        ] = await Promise.all([
            request(route("bancos.index")),
            request(route('getClientBankAccounts', data.cliente_idCliente), 'GET', {}, { enabled: true })
        ])

        setBankStates({
            ...bankStates,
            banksList: bankList,
            clientAccounts: clientAccounts,
            bankData: {
                ...bankStates.bankData,
                cuentasBancoCliente_idCliente: data.cliente_idCliente
            }
        })
    }

    const enableRepoGas = async () => {
        await request(
            route("clientes.update", data.cliente_idCliente),
            'PUT',
            { ...data, cliente_estatusReposicion: data.cliente_estatusReposicion == '1' ? '0' : '1' },
            {
                enabled: true,
                success: { message: `Se ha ${data.cliente_estatusReposicion == '1' ? 'deshabilitado' : 'habilitado'} la reposición` },
                error: { message: "Ha habido un error al realizar la acción", type: 'error' }
            },
        )
        setData({ ...data, cliente_estatusReposicion: data.cliente_estatusReposicion == '1' ? '0' : '1' })
        getClientes()
    }

    useEffect(() => {
        if (activeMenu === dialogMenus.address || activeMenu === dialogMenus.enterprise || activeMenu === dialogMenus.bankAccounts) setStates({ ...states, loading: false })
    }, [allClienteSucursal, empresas, bankStates]);

    useEffect(() => {
        setStates({
            ...states,
            loading: activeMenu === dialogMenus.address || activeMenu === dialogMenus.enterprise || activeMenu === dialogMenus.bankAccounts,
            largeDialog: activeMenu === dialogMenus.address || activeMenu === dialogMenus.bankAccounts
        })
    }, [activeMenu]);

    useEffect(() => {
        if (Array.isArray(userMenus)) {
            const clientePedidos = location.pathname.substring(1)
            let result = {}
            userMenus.every((um1) => {
                if (um1.menu_url == clientePedidos && um1.pivot.usuarioxmenu_especial == 1) result = { ...states, specialPermission: true }
                else {
                    um1.childs.every((um2) => {
                        if (um2.menu_url == clientePedidos && um2.pivot.usuarioxmenu_especial == 1) result = { ...states, specialPermission: true }
                        else {
                            um2.childs.every((um3) => {
                                if (um3.menu_url == clientePedidos && um3.pivot.usuarioxmenu_especial == 1) result = { ...states, specialPermission: true }
                                return true
                            })
                        }
                        return true
                    })
                }
                return true
            })

            setStates(result)
        }
    }, [userMenus]);

    return <>
        <Dialog open={open} onClose={() => { }} fullWidth={true} maxWidth={states.largeDialog ? 'lg' : 'md'}>
            <DialogTitle className='flex justify-between' style={{ backgroundColor: 'white' }}>
                <>Acciones del cliente</><div onClick={dialogHandler}><CloseIcon className='cursor-pointer' /></div>
            </DialogTitle>
            <div className='flex justify-center'><Divider className='w-[95%]' /></div>
            <DialogContent style={{ backgroundColor: 'white' }}>
                <div className='sm:grid-cols-1 md:grid md:grid-cols-8 gap-4 h-[550px] '>
                    <div className={`monitor-dialog-details sm:col-span-5 ${states.largeDialog ? "md:col-span-2" : "md:col-span-3"} sm:mb-4 md:mb-0 sm:h-[70%] md:h-full p-3`}>
                        <div className='grid sm:grid-cols-2 md:grid-cols-1 w-full h-full gap-2 p-3  gap-y-5'>
                            <TextDetail label='Nombre comercial' data={data.cliente_nombrecomercial} />
                            <TextDetail label='Razón social' data={data.cliente_razonsocial} />
                            <TextDetail label='Telefono' data={data.cliente_telefono} />
                            <TextDetail label='RFC' data={data.cliente_rfc} />
                            <TextDetail label='Pais' data={data.pais?.descripcionPais} />
                            <TextDetail label='Estado' data={data.estado?.descripcionEstado} />
                            <TextDetail label='Localidad' data={data.cliente_localidad} />
                        </div>

                    </div>
                    <div className={`wrapper ${states.largeDialog ? "md:col-span-6" : "md:col-span-5"} sm:pb-5 md:pb-0`}>
                        <div className={`monitor-dialog-options buttons-box ${activeMenu === dialogMenus.mainMenu || states.loading ? 'active-box' : ''}`}>
                            <DialogButtons
                                click={() => menuHandler(dialogMenus.emails)}
                                label={'Correos'}
                                img={'email'}
                                size={states.specialPermission ? buttonNumber.six : buttonNumber.two}
                            />
                            <DialogButtons
                                click={() => menuHandler(dialogMenus.address)}
                                label={'Direcciones'}
                                img={'home_filled'}
                                size={states.specialPermission ? buttonNumber.six : buttonNumber.two}
                            />
                            <DialogButtons
                                click={() => menuHandler(dialogMenus.enterprise)}
                                label={`Traslado de empresa`}
                                img={'apartment'}
                                size={states.specialPermission ? buttonNumber.six : buttonNumber.two}
                            />
                            {states.specialPermission && <DialogButtons
                                click={() => menuHandler(dialogMenus.wallet)}
                                label={'Creditos / Descuentos'}
                                img={'local_offer'}
                            />}
                            {states.specialPermission && <DialogButtons
                                click={() => menuHandler(dialogMenus.bankAccounts)}
                                label={`Cuentas bancarias`}
                                img={'account_balance'}
                            />}
                            {states.specialPermission && <DialogButtons
                                click={() => enableRepoGas()}
                                label={`Reposicion de gas ${data.cliente_estatusReposicion == '1' ? 'activa' : 'inactiva'}`}
                                img={'propane_tank'}
                                color={data.cliente_estatusReposicion == '1' ? buttonColors.success : buttonColors.disabled}
                            />}
                        </div>
                        <div className={`monitor-dialog-options action ${activeMenu !== dialogMenus.mainMenu && !states.loading ? 'active-box' : ''}`}>
                            <div className='flex flex-col w-full h-full gap-3'>
                                <div>
                                    <button onClick={() => menuHandler(dialogMenus.mainMenu)}>
                                        <img className="non-selectable" src={BackIcon} alt="Menú principal" />
                                    </button>
                                </div>
                                <div className='h-full'>
                                    {activeMenu === dialogMenus.emails && <Correos data={data} />}
                                    {(activeMenu === dialogMenus.address && !states.loading) && <Sucursal allClienteSucursal={allClienteSucursal} />}
                                    {activeMenu === dialogMenus.wallet && <CreditosDescuentosFormulario data={data} setData={setData} />}
                                    {(activeMenu === dialogMenus.enterprise && !states.loading) && <TrasladoDeEmpresa data={data} empresas={empresas} />}
                                    {(activeMenu === dialogMenus.bankAccounts && !states.loading) && <CuentasBancarias
                                        data={data}
                                        bankState={bankStates}
                                        setBankState={setBankStates} 
                                        fetchData={fetchBankAccounts}
                                        />
                                    }
                                </div>
                            </div>
                        </div>

                        {/* LOADING ANIMATION */}
                        {states.loading && <div className='absolute w-full h-full bg-[#c0c0c03a]'></div>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
}

const TextDetail = ({ label, data }) => {
    return <>
        <div className='flex flex-col'>
            <span>{label}</span>
            <span className='text-[14px] mt-1 text-[#D1D1D1]'>{data}</span>
        </div>
    </>
}

const buttonColors = {
    primary: 'order-button',
    disabled: 'asignar-button-grey',
    success: 'asignar-button-green',
}

const buttonNumber = {
    one: 560,
    two: 200,
    three: 200,
    four: 135,
    five: 94,
    six: 70,
}

const DialogButtons = ({ click, label, img, color = buttonColors.primary, size = buttonNumber.six }) => {
    const matches = useMediaQuery('(min-width:768px)');
    return <>
        <button className={`${color} col-span-2 sm:h-[100%] md:h-[100%]`} onClick={click}>
            <div className='img-box'>
                <div className='blur-thing' />
                <div className="img h-full w-[40%]">
                    <div className={`material-icons w-full h-full`} style={{
                        fontSize: size
                    }} >{img}</div>
                </div>
            </div>
            <span>{label}</span>
        </button>
    </>
}