import Imagen from '../ClientesPedidos/img/camion.png'
import { ButtonComp } from '@/components/ButtonComp'
import { useLocation } from 'react-router-dom'
import TextInput from '@/components/TextInput'
import Datatable from '@/components/Datatable'
import { useEffect, useState } from 'react'
import { Request } from '@/core/Request'
import { firstObj, noty } from '@/utils';

export default function Correcion_pedidos() {
    const [pedido, setPedido] = useState({ pedidoId: "" });
    // const [pedidod, setPedidod] = useState({ remision: "", Cantidad: "", Nombres: "", quienConQuien_idQuienConQuien: "" });
    const [data, setData] = useState([]);
    const [vendedores, setVendedores] = useState();
    const location = useLocation(null)

    const GetVendedores = async () => setVendedores(await Request._get(route("persona.vendedores")));

    useEffect(() => {
        GetVendedores();
        if (location.state) {
            setPedido({ pedidoId: Number(location.state.item) })
            getPedidos(Number(location.state.item));
            location.state = null
        }
    }, [data]);

    const getPedidos = async (id = pedido.pedidoId) => {
        const response = await Request._get(route('Correcion-Pedidos', id))
        setData(response)
        !(response.length > 0) && noty('No se encontraron pedidos', 'error');
    };

    const corregirPedido = async () => {
        if (data.length) {
            console.log("data",data)
            const response = await Request._post(route('actualizar-Pedidos'), { pedido: data });
            // console.log(response)
            if (response.status) {
                getPedidos()
                noty(response.message)
            }
            (!response.status) && noty(response.message, 'error')
        } else noty('Favor de seleccionar pedidos', 'error');
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="relative flex gap-3 relative justify-between mb-8">
                <div>
                    {(data.length > 0) && <button
                        className='btnAgregar mt-5'
                        onClick={(e) => corregirPedido()}
                    >
                        Corregir
                    </button>}
                </div>
                <div className='flex gap-3 w-[50%]'>
                    <TextInput
                        label="Folio"
                        className="block w-full  texts"
                        value={pedido.pedidoId || ""}
                        onChange={(e) => setPedido({
                            ...pedido,
                            pedidoId: e.target.value,
                        })}
                    />
                    <ButtonComp
                        label='Buscar'
                        onClick={(e) => getPedidos()}
                        disabled={!pedido.pedidoId}
                    />
                </div>
            </div>
            {
                data && data.length > 0 ? (
                    <>
                        <div className=''>
                            <Datatable
                                data={data}
                                virtual={true}
                                searcher={false}
                                handleRowUpdating={() => { }}
                                columns={[
                                    { header: 'Folio', accessor: 'pedidoId' },
                                    {
                                        header: 'Vendedores',
                                        accessor: 'IdPersona',
                                        lookup: {
                                            dataSource: vendedores,
                                            displayExpr: "nombre_completo",
                                            valueExpr: "IdPersona",
                                        }
                                    },
                                    { header: 'Remision', accessor: 'remision' },
                                    { header: 'Cantidad', accessor: 'Cantidad', dataType: 'number' },
                                ]}
                            />
                        </div>
                    </>
                ) : (
                    <div className='mt-5' style={{ border: '10px', borderColor: 'red' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={Imagen} alt="" style={{ textAlign: 'center', width: '30%', height: 'auto' }} />
                        </div>
                        <h2 style={{ textAlign: 'center', fontSize: '20px', color: 'gray', paddingBottom: '15px' }}>No se encontraron pedidos.</h2>
                        <div className='mt-20'></div>
                    </div>
                )
            }
        </div >
    )
}

