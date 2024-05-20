import { FieldDrawer } from "@/components/DialogComp";
import LoadingDiv from "@/components/LoadingDiv";
import request from "@/utils";
import loading from './../../Admin/Facturacion/img/cargando.gif';
import facturaCancelada from './../../Admin/Facturacion/img/M.gif';
import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom'


const CancelacionFactura = () => {
    const location = useLocation()
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ loading: false, facturas: '', folioSAT: '', ClienteRFC: '', importe: '', IE: '',Tipo:'' });
    const [showCancelada, setShowCancelada] = useState(false)

    const Location = async () => {
        if (location.state) {
            const { item } = location.state;
            console.log(item)
            setState({
                factura: item.idFactura || null, // O puedes asignar otro valor en caso de que no haya un ID de factura
                folioSAT: item.idFactura,
                ClienteRFC: item.cliente_rfc,
                importe: item.Importe,
                IE: 'N',
                Tipo:item.tipoFactura
            });
            
       
        }
    };

    useEffect(() => {
        Location();
    }, [])

    const cancelarFactura = async () => {
        setState({ ...state, loading: true });

        const response = await request(route("cancelar-factura"), 'POST', state, { enabled: true });
        const responseText = JSON.stringify(response);
        setState({ ...state, loading: false });
        setShowCancelada(true)
        setTimeout(() => { setShowCancelada(false) }, 1300);
        new Noty({ text: "Tu factura ha sido cancelada", type: "info", theme: "metroui", layout: "bottomRight", timeout: 6000 }).show();
        setState({ loading: false, facturas: '', folioSAT: '', ClienteRFC: '', importe: '', IE: '',Tipo:'' });
    };


    return (
        <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
            {state.loading && <div className='flex items-center justify-center h-screen w-screen'><LoadingDiv /></div>}
            {!state.loading &&
                <>
                    {showCancelada ? (<>
                        <div className='flex items-center justify-center h-screen w-screen'>
                            <img
                                src={facturaCancelada}
                                alt="Factura Cancelada"
                                style={{ width: '20%', height: 'auto' }}
                            />
                        </div>

                    </>
                    ) : (
                        <>
                            <div className="flex flex-col sm:max-w-[100%] md:max-w-[18%] w-full gap-3 px-1 pb-2">
                                <div className='border-2 w-full shadow-md px-3 pb-4 rounded-xl'>
                                    <FieldDrawer
                                        fields={[
                                            {
                                                label: 'Folio SAT / UUID',
                                                input: true,
                                                type: 'text',
                                                fieldKey: 'Movimiento',
                                                value: state.folioSAT,
                                                onChangeFunc: (e) => setState({ ...state, folioSAT: e.target.value })
                                            },
                                            {
                                                label: 'RFC Cliente',
                                                input: true,
                                                type: 'text',
                                                fieldKey: 'rfc cliente',
                                                value: state.ClienteRFC,
                                                onChangeFunc: (e) => setState({ ...state, ClienteRFC: e.target.value })
                                            },
                                            {
                                                label: 'Total Comprobante',
                                                input: true,
                                                type: 'text',
                                                fieldKey: 'Importe',
                                                value: state.importe,
                                                onChangeFunc: (e) => setState({ ...state, importe: e.target.value })
                                            },
                                            {
                                                label: 'Tipo Factura',
                                                select: true,
                                                fieldKey: 'Tipo Factura',
                                                value: state.IE,
                                                options: [
                                                    {
                                                        id: "E",
                                                        value: "E"
                                                    },
                                                    {
                                                        id: "I",
                                                        value: "I"
                                                    },
                                                    {
                                                        id: "N",
                                                        value: "N"
                                                    },
                                                    {
                                                        id: "P",
                                                        value: "P"
                                                    },
                                                    {
                                                        id: "T",
                                                        value: "T"
                                                    },
                                                ],
                                                data: 'value',
                                                valueKey: 'id',
                                                onChangeFunc: (e) => {
                                                    setState({ ...state, IE: e })
                                                }
                                            },
                                        ]}
                                    />
                                    <button className='bg-[#1B2654] text-white w-full rounded-lg p-3 mt-4' onClick={cancelarFactura} disabled={state.loading}>
                                        {state.loading ? 'Cancelando factura...' : 'Cancelar Factura'}
                                    </button>
                                </div>

                                {/* <div className='flex flex-col shadow-md px-3 pt-3 pb-4 border-2  rounded-xl'>
                                <span>Acciones</span>
                                <Button variant="contained" style={{ background: '#1B2654', marginTop: '10px', textAlign: 'left', height: '40px', borderRadius: '10px', width: '100%', fontWeight: 'bold', opacity: '0.9' }} onClick={(e) => { LimpiarRow(); setMetodo(false); }}>Enviar correo  <EmailIcon /></Button>
                                <Button variant="contained" style={{ background: '#FC4C02', marginTop: '10px', textAlign: 'center', height: '40px', borderRadius: '10px', width: '100%', fontWeight: 'bold', }} disabled={selectedItems.length === 0} onClick={(e) => { DiarioVentas(); }} endIcon={<span className="material-icons"><SignalCellularAltIcon /></span>}> Diario de Ventas </Button>

                                <Tooltip title="Seleccionar todas las facturas">
                                    <Button variant="contained" style={{ background: 'green', marginTop: '10px', textAlign: 'left', height: '40px', borderRadius: '10px', width: '100%', fontWeight: 'bold', }} onClick={(e) => { handleSelectAll() }}><FormatListBulletedIcon /></Button>
                                </Tooltip>
                                <Tooltip title="Quitar todas las selecciones">
                                    <Button variant="contained" style={{ background: '#036cf5', marginTop: '10px', textAlign: 'center', height: '50px', borderRadius: '10px', width: '100%', fontWeight: 'bold', }} onClick={(e) => { handleDeselectAll() }}><FormatLineSpacingIcon /></Button>
                                </Tooltip>
                            </div> */}
                            </div>

                            <div className='flex flex-col w-full gap-4 items-stretch' >
                                <div className="w-full monitor-table" >

                                    {/* <Datatable
                                    data={facturacion}
                                    searcher={false}
                                    columns={[
                                        {
                                            header: "Facturas",
                                            accessor: "Estatus",
                                            width: '50%',
                                            cell: (eprops) => (
                                                <>
                                                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
                                                        <div class="h-32 rounded-lg bg-white-200 lg:col-span-2" style={{ background: '#1B2654', color: 'white' }}>
                                                            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3" style={{ padding: '2%', textAlign: 'left', position: 'relative' }}>
                                                                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                                                    <input type="checkbox" color="success" className="ml-[10px] w-[30px] h-[30px]"
                                                                        style={{ color: "green", borderRadius: "10px" }}
                                                                        onChange={() => handleCheckboxChange(eprops.item.facturaDiversos_idFacturaDiversos)}
                                                                        checked={selectedItems.includes(eprops.item.facturaDiversos_idFacturaDiversos)}
                                                                    />

                                                                </div>
                                                                <InfoItem label="Cliente" value={eprops.item.cliente.cliente_nombrecomercial} />
                                                                <InfoItem label="Correo" value={eprops.item.facturaDiversos_idCliente} />
                                                                <InfoItem label="Tipo" value={eprops.item.tipo.catalogoMetodoPagoSAT_descripcion ? eprops.item.tipo.catalogoMetodoPagoSAT_descripcion : "S/N METODO DE PAGO"} />
                                                                <InfoItem label="Fecha" value={eprops.item.facturaDiversos_fecha} />
                                                                <InfoItem label="Folio" value={eprops.item.facturaDiversos_idFacturaDiversos} />
                                                                <InfoItem label="Importe" value={parseFloat(eprops.item.facturaDiversos_importe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ? `$ ${parseFloat(eprops.item.facturaDiversos_importe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N IMPORTE"} />
                                                                <InfoItem label="Remisiones" value={eprops.item.facturaDiversos_idCliente} />
                                                                <InfoItem label="Usuario" value={eprops.item.usuario.usuario_nombre} />
                                                                <InfoItem label="IVA" value={parseFloat(eprops.item.facturaDiversos_iva).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ? `$ ${parseFloat(eprops.item.facturaDiversos_iva).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N IVA"} />
                                                                <InfoItem label="Vendedor" value={eprops.item.facturaDiversos_idCliente} />
                                                                <InfoItem label="Observaciones" value={eprops.item.facturaDiversos_observaciones} />
                                                                <InfoItem label="Total" value={parseFloat(eprops.item.facturaDiversos_total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ? `$ ${parseFloat(eprops.item.facturaDiversos_total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : "S/N TOTAL"} />
                                                            </div>

                                                        </div>
                                                        
                                                      


                                                    </div>
                                                </>
                                            ),
                                        },
                                    ]}
                                /> */}
                                </div>
                            </div>
                        </>
                    )}
                </>
            }
        </div >
        //         <div className='flex w-full mt-4 gap-4 sm:flex-col md:flex-row'>
        //             {state.loading && (


        //                 <LoadingDiv />


        //             )}


        // {showCancelada && (
        //                     <img
        //                         src={facturaCancelada}
        //                         alt="Factura Cancelada"
        //                         style={{ width: '20%', height: 'auto' }}
        //                     />

        //             )}




        //             {!state.loading &&
        //                 <>
        //                     <section className='gap-6 flex-col sm:float-none md:float-left border-2 rounded-xl relative px-4 pb-4'>
        //                       
        //                     </section>
        //                 </>
        //             }
        //         </div>
    )
};

export default CancelacionFactura;
