import { intAddressData, intClienteData, intOrderData, intStateModule, videoFinished } from "./intClientePedidos";
import CPOrderDetail from "./modules/CPOrderDetail";
import CPAddressInfo from "./modules/CPAddressInfo";
import CPClientInfo from "./modules/CPClientInfo";
import LoadingDiv from "@/components/LoadingDiv";
import DialogComp from "@/components/DialogComp";
import CPHistorico from "./modules/CPHistorico";
import { useLocation } from "react-router-dom";
import MapWithSearch from "./MapWithSearch";
import { Request } from "@/core/Request";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { noty } from "@/utils";

const addressCtrl = { add: 0, list: 1, search: 2 }
export default function ClientesPedidos() {
    const [defaultDetail, setDefaultDetail] = useState({ pedidoId: null, direccionPedidosId: null })
    const [addressData, setAddressData] = useState(intAddressData)
    const [clientData, setClientData] = useState(intClienteData)
    const [orderData, setOrderData] = useState(intOrderData)
    const [refreshAddress, setRefreshAddress] = useState(0)
    const [state, setState] = useState(intStateModule)
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    const getCatalogs = async () => {
        const [
            addressInfoRes,
            productsRes,
            paymentMethod,
            stecnico
        ] = await Promise.all([
            Request._get(route('address-info-telemark')),
            Request._get(route('productos.index')),
            Request._get(route('FormaTelemark')),
            Request._get(route('stecnico.index')),
        ])
        // console.log(paymentMethod)
        setState({
            ...state,
            states: addressInfoRes.estados,
            cities: addressInfoRes.municipios,
            suburbs: addressInfoRes.colonias,
            paymentMethods: paymentMethod,
            stecnico: stecnico,
            products: productsRes,
            allProducts: productsRes,
        })
        setLoading(false)
        getLocationData()
    }

    const getLocationData = () => {
        if (location.state) {
            const { item, showPedido } = location.state;
            setClientData({ ...clientData, telefono: item.telefono });

            const defaultVal = { pedidoId: item.pedidoId ?? null, direccionPedidosId: item.direccionPedidosId ?? null }
            setDefaultDetail(defaultVal)
        }
    }

    const changeControl = (control = addressCtrl.add, now = true) => {
        if (now) setState({ ...state, controlAddress: control })
        else return { ...state, controlAddress: control }
    }

    const getClientData = async (callerId = clientData.telefono, addressId = defaultDetail.direccionPedidosId) => {
        const response = await Request._get(route('clientes-number', callerId), {
            error: { message: 'El cliente no existe' }
        })

        if (response.status) {
            setClientData({ ...intClienteData, ...response.cliente, saved: true })

            if (!addressId && !defaultDetail.pedidoId) {
                if (response.direccionPrincipal) {
                    setAddressData({
                        ...intAddressData,
                        ...response.direccionPrincipal,
                        saved: true
                    })
                }
            }
            else {
                if (addressId && !defaultDetail.pedidoId) {
                    setAddressData({
                        ...intAddressData,
                        ...response.direcciones.find(dir => dir.direccionPedidosId == addressId),
                        saved: true
                    })
                }
                else {
                    setAddressData({
                        ...intAddressData,
                        ...response.direcciones.find(dir => dir.direccionPedidosId == response
                            .pedidos
                            .find(dir =>
                                dir.pedidos.map(ped => ped.pedidoId).includes(defaultDetail.pedidoId)
                            )?.direccionPedidosId
                        ),
                        saved: true
                    })
                }
            }

            setState({
                ...state,
                ...changeControl(addressCtrl.add, false),
                // allProducts: response.productos,
                allOrders: response.pedidos,
            })
        } else
            resetAllData()

    }

    const refreshHistory = async () => Request._get(route('clientes-number', clientData.telefono))
        .then(response => setState((prev) => ({
            ...prev,
            historic: response.pedidos.find(p =>
                p.direccionPedidosId == addressData.direccionPedidosId
            )?.pedidos,
            allOrders: response.pedidos
        })))

    const resetAllData = () => {
        setOrderData({ ...intOrderData, PaymentMethodId: state.paymentMethods[0]?.formasPago_idFormasPago })
        setState({ ...state, historic: [], allOrders: [], /* allProducts: [], products: [], */ })
        setClientData({ ...intClienteData, telefono: clientData.telefono })
        setDefaultDetail({ pedidoId: null, direccionPedidosId: null })
        setAddressData({ ...intAddressData })
    }

    useEffect(() => {
        setOrderData({
            ...orderData,
            orderDetails: {
                ...intOrderData.orderDetails,
                Cantidad: orderData.orderDetails.Cantidad
            }
        })
        if (addressData.direccionPedidosId) {
            setState({
                ...state,
                // products: state.allProducts.find(p =>
                //     p.direccionPedidosId == addressData.direccionPedidosId
                // )?.productos,
                historic: state.allOrders.find(p =>
                    p.direccionPedidosId == addressData.direccionPedidosId
                )?.pedidos
            })
        }
    }, [addressData.direccionPedidosId]);

    useEffect(() => {
        if (addressData.zipCode && addressData.zipCode.length == 5 && !addressData.ColoniaId) {
            const code = addressData.zipCode
            const colonia = state.suburbs.find(col => col.c_CodigoPostal == code)
            colonia && setAddressData({
                ...intAddressData,
                ...addressData,
                ColoniaId: colonia.Colonia_Id,
            })
            !colonia && noty('C.P. sin colonias', 'warning')
        }
    }, [addressData.zipCode]);

    useEffect(() => {
        if (addressData.ColoniaId) {
            const colId = addressData.ColoniaId;
            const colonia = state.suburbs.find(s => s.Colonia_Id == colId);
            const munId = colonia.Colonia_IdMunicipio;
            const ciudad = state.cities.find(s => s.idMunicipio == munId);

            setAddressData({
                ...intAddressData,
                ...addressData,
                zipCode: colonia.c_CodigoPostal,
                municipio: ciudad.idMunicipio,
                estado: ciudad.idestado,
            })
        }
    }, [addressData.ColoniaId]);

    useEffect(() => {
        if (loading)
            getCatalogs()
    }, [loading]);

    useEffect(() => {
        if (clientData.telefono?.length == 10) getClientData(clientData.telefono)
        else resetAllData()
    }, [clientData.telefono]);

    useEffect(() => {
        if (state.orderFinished) {
            setTimeout(() => {
                setState(prev => ({ ...prev, orderFinished: false }))
                refreshHistory()
            }, 2000)
        }
    }, [state.orderFinished]);


    return (
        <div className="clientePedidos relative h-[100%] pb-12 px-3 overflow-auto blue-scroll">
            {loading && <LoadingDiv />}
            {!loading && (
                <div className="grid  min-[1000px]:grid-cols-2 h-full justify-items-center gap-x-3">
                    <div className="w-full">
                        <div className="flex flex-col">
                            <CPClientInfo data={clientData} setData={setClientData} />
                            <hr className="mx-5 my-1" />
                            <CPAddressInfo
                                data={addressData}
                                setData={setAddressData}
                                setState={setState}
                                state={state}
                                clientData={clientData}
                                setClientData={setClientData}
                                setOrderData={setOrderData}
                                tabsControl={changeControl} />
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col">
                            <CPOrderDetail
                                state={state}
                                setState={setState}
                                data={orderData}
                                setData={setOrderData}
                                addressData={addressData}
                                refresh={refreshHistory}
                                defaultDetail={defaultDetail}
                            />
                            <hr className="mx-3 my-3" />
                            <CPHistorico
                                state={state}
                                refresh={refreshHistory}
                                defaultDetail={defaultDetail}
                            />
                        </div>
                    </div>
                </div>
            )}

            <DialogComp
                dialogProps={{
                    openState: state.orderFinished || state.openGeolocation,
                    model: state.orderFinished ? 'Orden creada exitosamente' : 'Geomapa',
                    width: state.orderFinished ? 'sm' : 'md',
                    customTitle: true,
                    fullWidth: true,
                    actionState: "create",
                    openStateHandler: () => setState({
                        ...state,
                        orderFinished: false,
                        openGeolocation: false
                    }),
                    onSubmitState: () => { },
                    customAction: () => <></>,
                    style: `grid ${state.orderFinished && 'justify-items-center'}`
                }}
                fields={[
                    state.orderFinished && {
                        custom: true,
                        customItem: () => <>
                            <img src={videoFinished} alt="" style={{ width: '300px', height: 'auto' }} loop={false} autoPlay={true} />
                        </>
                    },
                    state.openGeolocation && {
                        custom: true,
                        customItem: () => <>
                            <div className="w-full">
                                <MapWithSearch
                                    addressData={addressData}
                                    setAddressData={setAddressData}
                                    state={state}
                                    setState={setState}
                                />
                            </div>
                        </>
                    }
                ]}
            />
        </div>

    )
}
