import camionLogo from '../../../Admin/Telermark/ClientesPedidos/img/camion.png';
import { FieldDrawer } from "@/components/DialogComp";
import { ButtonComp } from "@/components/ButtonComp";
import React, { useState, useEffect } from "react";
import LoadingDiv from "@/components/LoadingDiv";
import Datatable from "@/components/Datatable";
import { Request } from "@/core/Request";
import moment from "moment";

const pagoData = {
    fechaInicio: moment().format('YYYY-MM-DD'),
    fechaFinal: moment().format('YYYY-MM-DD'),
    cliente: '',
    folioPago: '',
}

export default function PagosCartera() {
    const [selected, setSelected] = useState([]);
    const [data, setData] = useState(pagoData)
    const [state, setState] = useState({
        loading: false,
        clientes: [],
        pagos: []
    })

    const getClients = async () => setState({
        ...state,
        clientes: await Request._get(route('clientes.index')),
        loading: false
    })

    const getPagos = async () => setState({
        ...state,
        pagos: await Request._post(route('fecha-pago-cliente'), data)
    })

    const searchByFolio = async () => setState({
        ...state,
        pagos: await Request._post(route('folio-pago'), data)
    })

    const onSelect = ({ selectedRowKeys }) => setSelected(selectedRowKeys)


    const submit = async () => await Request._post(route('cancelar-pago'), { pagos: selected }, {
        error: { message: 'No se ha podido cancelar el pago' },
        success: { message: "Pago cancelado" },
    }).then(() => {
        getPagos()
    })

    useEffect(() => {
        getClients();
    }, []);

    useEffect(() => {
        getPagos()
    }, [data.fechaFinal, data.fechaInicio, data.cliente]);

    return (
        <div className='relative h-[100%] pb-4 px-3 -mt-4'>
            {state.loading && <LoadingDiv />}
            {!state.loading && (<>
                <div className='flex relative gap-3 sm:flex-col md:flex-row h-[90%]'>
                    <div className='flex flex-col gap-2 pt-4 min-w-[250px]'>
                        <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-0 '>
                            <h1>Buscar por folio de pago</h1>
                            <FieldDrawer
                                fields={[
                                    {
                                        label: 'Folio Pago',
                                        input: true,
                                        type: 'text',
                                        fieldKey: '',
                                        value: data.folioPago,
                                        onChangeFunc: (e) => setData({
                                            ...data,
                                            folioPago: e.target.value.replace(/\D/g, ""),
                                        })
                                    },
                                    {
                                        custom: true,
                                        customItem: () => (<>
                                            <ButtonComp
                                                label={<>Buscar</>}
                                                onClick={searchByFolio}
                                            />
                                        </>)
                                    }
                                ]}
                            />
                        </div>
                        <div className='flex flex-col shadow-md bg-[#FFFFFF] border-2 p-4 rounded-xl text-[#000000] gap-2'>
                            <h1>Buscar por fecha y cliente </h1>
                            <FieldDrawer
                                fields={[
                                    {
                                        label: 'Fecha Inicial',
                                        input: true,
                                        type: 'date',
                                        value: data.fechaInicio,
                                        onChangeFunc: (e) => setData({
                                            ...data,
                                            fechaInicio: e.target.value,
                                            folioPago: ''
                                        })
                                    },
                                    {
                                        label: 'Fecha Final',
                                        input: true,
                                        type: 'date',
                                        value: data.fechaFinal,
                                        onChangeFunc: (e) => setData({
                                            ...data,
                                            fechaFinal: e.target.value,
                                            folioPago: ''
                                        })
                                    },
                                    {
                                        label: 'Cliente',
                                        select: true,
                                        fieldKey: 'Cliente',
                                        value: data.cliente,
                                        options: state.clientes.map((reg) => ({
                                            ...reg,
                                            cliente_nombrecomercial: `${reg.cliente_idCliente} - ${reg.cliente_nombrecomercial}`
                                        })),
                                        data: 'cliente_nombrecomercial',
                                        valueKey: 'cliente_idCliente',
                                        onChangeFunc: (e) => setData({
                                            ...data,
                                            cliente: e,
                                            folioPago: ''
                                        })
                                    },
                                    {
                                        custom: true,
                                        customItem: () => (<>
                                            <ButtonComp
                                                disabled={selected.length == 0}
                                                className={selected.length && "!bg-pdf-color"}
                                                label={<>Cancelar pago</>}
                                                onClick={submit}
                                            />
                                        </>)
                                    }
                                ]}
                            />
                        </div>
                    </div>
                    <div className="relative col-span-10 mx-5 w-full mt-4">
                        {(state.pagos.length > 0) ? (
                            <Datatable
                                searcher={false}
                                virtual={true}
                                height={'200%'}
                                data={state.pagos}
                                selection={'multiple'}
                                selectedData={selected}
                                selectionFunc={onSelect}
                                columns={[
                                    // { header: "Folio Pago", width: '25%', cell: (eprops) => <>{console.log('item', eprops.item)}</> },
                                    { header: "Folio Pago", width: '22%', accessor: 'pago_idPago', },
                                    { header: "Cliente", width: '40%', accessor: 'cliente_nombrecomercial', },
                                    { header: "Pago Fecha", width: '20%', cell: (eprops) => <>{new Date(eprops.item.pago_fecha).formatMXNoTime()}</> },
                                    { header: "Importe", width: '30%', cell: (eprops) => <>${eprops.item.pago_total}</> },
                                ]}
                            />
                        ) : (
                            <div className='flex flex-col relative h-full items-center overflow-hidden self-center justify-center'>
                                <img className='object-scale-down w-96 non-selectable' src={camionLogo} alt="" />
                                <span className='text-gray-600 non-selectable'>La lista se encuentra vacía.</span>
                            </div>
                        )}
                    </div>
                </div>
            </>)}
        </div >
    )
}