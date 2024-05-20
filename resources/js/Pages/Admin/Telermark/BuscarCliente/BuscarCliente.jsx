import Datatable from '@/components/Datatable'
import InputLabel from '@/components/InputLabel'
import SelectComp from '@/components/SelectComp'
import TextInput from '@/components/TextInput'
import selectOptImg from '../../../../../png/camion.png'
import request, { noty } from '@/utils'
import { useForm } from '@inertiajs/react'
import { Checkbox, FormControlLabel } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, Route, useNavigate } from 'react-router-dom'
import ShortcutIcon from '@mui/icons-material/Shortcut';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import LoadingDiv from '@/components/LoadingDiv'
import { useContext } from "react";
import UserMenusContext from "@/Context/UserMenusContext";
import { Tooltip } from '@mui/material';

const BuscarCliente = () => {
    const { userMenus, selectedMenu, SetSelectedMenuFunc } = useContext(UserMenusContext);
    const [state, setState] = useState({
        loading: true,
        loadingInfo: false,
        ciudades: [],
        colonias: [],
        clientes: null,
        consumoMes: null
    })
    const { data, setData } = useForm({ checkCiudad: false })
    const [pagesPermission, setPagesPermission] = useState({
        clientePedidos: false,
        pedidoRuta: false
    })

    const getMenuName = async () => {
        try {
            // Obtener la ruta actual
            const rutaCompleta = location.pathname;
            const segmentos = rutaCompleta.split('/');
            const nombreModulo = segmentos[segmentos.length - 1]
            await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
    };

    useEffect(() => {
        if (Array.isArray(userMenus)) {
            const clientePedidos = 'clientes-pedidos'
            const pedidoRuta = 'pedidos-ruta'

            const result = {
                clientePedidos: false,
                pedidoRuta: false,
            };
            userMenus.every((um1) => {
                if (um1.menu_url == clientePedidos) {
                    result.clientePedidos = true;
                } else if (um1.menu_url == pedidoRuta) {
                    result.pedidoRuta = true;
                } else {
                    um1.childs.every((um2) => {
                        if (um2.menu_url == clientePedidos) {
                            result.clientePedidos = true;
                        } else if (um2.menu_url == pedidoRuta) {
                            result.pedidoRuta = true;
                        } else {
                            um2.childs.every((um3) => {
                                if (um3.menu_url == clientePedidos) {
                                    result.clientePedidos = true;
                                } else if (um3.menu_url == pedidoRuta) {
                                    result.pedidoRuta = true;
                                }
                                return true
                            })
                        }
                        return true
                    })
                }
                return true
            })

            setPagesPermission(result)
            // if (result !== null) {
            //     setPostPermission(result.pivot.usuarioxmenu_alta == 1 ? true : false)
            //     setPutPermission(result.pivot.usuarioxmenu_cambio == 1 ? true : false)
            //     setSpecialPermission(result.pivot.usuarioxmenu_especial == 1 ? true : false)
            // }
        }
    }, [userMenus]);
    const navigate = useNavigate();

    //#region estilo de input
    // const inputRef = useRef(null);
    // const handleKeyUp = () => {
    //     const inputValue = inputRef.current.value;
    //     inputRef.current.setAttribute('value', inputValue);
    // };
    //#endregion

    const getMunicipios = async () => {
        const responseMunicipio = await fetch(route("municipio.index"));
        const dataMunicipio = await responseMunicipio.json();
        return dataMunicipio
    }

    const getColonias = async () => {
        const filteredColoniaResponse = await fetch(
            route("colonia.byMunicipio", data.idMunicipio)
        );
        const filteredColoniaData = await filteredColoniaResponse.json();
        if (filteredColoniaData.length === 0) {
            new Noty({
                text: "No hay colonias de este municipio.",
                type: "error",
                theme: "metroui",
                layout: "bottomRight",
                timeout: 2000,
            }).show();
        }
        setState({ ...state, colonias: filteredColoniaData });
    }

    const redirectToCliente = (e) => {
        const item = e.selectedRowsData[0];
        const showPedido = false;
        const state = { item, showPedido };
        const url = '/clientes-pedidos';
        navigate(url, { state });
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setState({ ...state, loadingInfo: true })
        try {
            const response = await request(route('clientes-pedidos.search'), 'POST', data, { enabled: true, error: { message: "No se encontraron registros." }, success: { message: "Registros obtenidos." } })
            setState({ ...state, clientes: response.clientes, consumoMes: response.consumoUltimoMes })
        } catch (error) {
            noty('Ocurrió un error al obtener los registros.', 'error')
        }
    }

    useEffect(() => {
        getMenuName()
        getMunicipios()
            .then((res) => {
                setState({ ...state, ciudades: res, loading: false })
            })
    }, [])

    useEffect(() => {
        setData({ ...data, ColoniaId: '' })
        if (data.idMunicipio) getColonias()
    }, [data.idMunicipio])

    return (
        <div className='relative h-[100%] pb-4 px-3 overflow-auto blue-scroll'>
            {state.loading &&
                <LoadingDiv />
            }
            {!state.loading &&
                <>
                    <form action='#' onSubmit={onSubmit} className='gap-6 flex-col sm:w-full md:w-[275px] sm:float-none md:float-left border-2 rounded-xl relative px-4 pb-4'>
                        <div className='flex flex-col'>
                            {/* <div className='input-box'>
                                        <input ref={inputRef} onKeyUp={handleKeyUp} type="text" id="fname" name="fname" autoComplete="off" aria-labelledby="placeholder-fname" />
                                        <label className="placeholder-text" for="fname" id="placeholder-fname">
                                            <div className="text">First Name</div>
                                        </label>
                                    </div> */}
                            {/* <div className='flex flex-row justify-between'> */}
                            <div>
                                <TextInput label="Nombre" prevent={true} value={data.Nombre} className='w-full' id="nombre" type="text" onChange={e => setData({ ...data, Nombre: e.target.value })} />
                            </div>
                            <div>
                                <TextInput label="Apellido Paterno" prevent={true} value={data.Apellido1} className='w-full' id="apellido_paterno" type="text" onChange={e => setData({ ...data, Apellido1: e.target.value })} />
                            </div>
                            <div>
                                <TextInput label="Apellido Materno" prevent={true} value={data.Apellido2} className='w-full' id="apellido_materno" type="text" onChange={e => setData({ ...data, Apellido2: e.target.value })} />
                            </div>
                            <div>
                                <TextInput label="Calle" prevent={true} value={data.calle} className='w-full' id="calle" type="text" onChange={e => setData({ ...data, calle: e.target.value })} />
                            </div>
                            <div>
                                <TextInput label="No." prevent={true} value={data.numeroExterior} className='w-full' id="numero" type="text" onChange={e => setData({ ...data, numeroExterior: e.target.value })} />
                            </div>
                            <div>
                                <InputLabel htmlFor="telefono"></InputLabel>
                                <TextInput label="Teléfono" prevent={true} value={data.telefono} className='w-full' id="telefono" type="text" onChange={e => setData({ ...data, telefono: e.target.value })} />
                            </div>
                            <div>
                                <TextInput label="Empresa" prevent={true} value={data.nombreNegocio} className='w-full' id="empresa" type="text" onChange={e => setData({ ...data, nombreNegocio: e.target.value })} />
                            </div>
                            <div className='flex content-center'>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                            checked={data.checkCiudad || false}
                                            onChange={(e) => setData({ ...data, checkCiudad: e.target.checked })}
                                        />
                                    }
                                    label="Ciudad" />
                            </div>
                            <div>
                                <SelectComp
                                    options={state.ciudades}
                                    virtual={true}
                                    value={data.idMunicipio || ''}
                                    label={'Ciudad'}
                                    data="descripcionMunicipio"
                                    valueKey="idMunicipio"
                                    secondKey={data.idMunicipio}
                                    disabled={!data.checkCiudad}
                                    onChangeFunc={(newValue) =>
                                        setData({
                                            ...data,
                                            idMunicipio: newValue,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <SelectComp
                                    label="Colonia"
                                    options={state.colonias}
                                    virtual={true}
                                    value={data.ColoniaId || ''}
                                    data="Colonia_Nombre"
                                    valueKey="Colonia_Id"
                                    secondKey={data.ColoniaId}
                                    disabled={(data.checkCiudad && data.idMunicipio) ? false : true}
                                    onChangeFunc={(newValue) =>
                                        setData({
                                            ...data,
                                            ColoniaId: newValue,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className='pt-3 mt-2 text-center'>
                            <button type='submit' className='bg-[#1B2654] text-white w-full rounded-lg p-3' onClick={onSubmit}>Buscar</button>
                        </div>
                    </form>
                    <div className='relative flex flex-col h-full items-stretch sm:pl-0 md:pl-4'>
                        {!state.loadingInfo && (state.clientes ? (
                            <div className='sm:mt-4 md:mt-0'>
                                <Datatable
                                    virtual={true}
                                    data={state.clientes}
                                    searcher={false}
                                    selectionFunc={redirectToCliente}
                                    columns={[
                                        { header: "No. Cliente", accessor: "clientePedidosId" },
                                        { header: "Origen", accessor: "origen_descripcion" },
                                        { header: "Cliente", accessor: "nombre_completo" },
                                        { header: "Calle", accessor: "calle" },
                                        { header: "No.", accessor: "numeroExterior" },
                                        { header: "Colonia", accessor: "Colonia_Nombre" },
                                        { header: "Locacion", accessor: "descripcionMunicipio" },
                                        { header: "Estado", accessor: "descripcionEstado" },
                                        { header: "Empresa", accessor: "nombreNegocio" },
                                        {
                                            header: "Acciones",
                                            cell: eprops => (
                                                <>
                                                    {
                                                        pagesPermission.clientePedidos && (
                                                            <Tooltip title='Hacer pedido'>
                                                                <Link to={'/clientes-pedidos'} state={{ item: { telefono: eprops.item?.telefono, direccionPedidosId: eprops.item?.direccionPedidosId }, showPedido: false }} >
                                                                    <ShortcutIcon />
                                                                </Link>
                                                            </Tooltip>
                                                        )
                                                    }
                                                    {
                                                        pagesPermission.pedidoRuta && (
                                                            <Tooltip title='Ir a pedido ruta'>
                                                                {/* <Link to={'/pedidos-ruta'} state={{ item: { direccionPedidosId: eprops.item?.direccionPedidosId } }}> */}
                                                                <Link to={'/pedidos-ruta'} state={{ item: eprops.item }}>
                                                                    <DirectionsCarFilledIcon />
                                                                </Link>
                                                            </Tooltip>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    ]}
                                />
                                <div className='flex flex-row justify-between mt-7 bg-[#1B2654] text-white p-2 rounded-md'>
                                    <span>
                                        Total de clientes: {state.clientes.length}
                                    </span>
                                    <span>
                                        Consumo ultimo mes: {state.consumoMes}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center h-[80vh] w-full'>
                                <img className='scale-[70%] non-selectable' src={selectOptImg} alt="" />
                            </div>
                        ))
                        }
                        {state.loadingInfo && (
                            <LoadingDiv />
                        )}
                    </div>
                </>
            }
        </div >
    )
}

export default BuscarCliente