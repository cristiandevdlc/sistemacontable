import { Calculate, PictureAsPdf } from '@mui/icons-material';
import { handleExportToExcel } from './ExcelReporteProximos';
import { ButtonComp } from '@/components/ButtonComp';
import LoadingDiv from '@/components/LoadingDiv';
import SelectComp from '@/components/SelectComp';
import TextInput from '@/components/TextInput';
import Datatable from '@/components/Datatable';
import { useEffect, useState } from 'react';
import { fileDownloader } from '@/utils';
import { Request } from '@/core/Request';
import moment from 'moment';

export default function ProximosPedidos() {
    const [data, setData] = useState({
        tipoServicio: '',
        dias: 0,
    })
    const [state, setState] = useState({
        proximosPedidosFiltr: [],
        proximosPedidos: [],
        tiposServicio: [],
        loading: true
    })

    const getProximosPedidos = async () => {
        const [
            proximosPedidos,
            tiposServicio
        ] = await Promise.all([
            Request._get(route('proximos-pedidos.index')),
            Request._get(route('tipos-servicios.index')),
        ]);
        setState({
            proximosPedidosFiltr: proximosPedidos,
            proximosPedidos: proximosPedidos,
            tiposServicio: tiposServicio,
            loading: false
        })
    }

    const handlePdfDownloader = async () => fileDownloader(route('generatePDFProximos'), 'POST', { Procedimiento: state.proximosPedidosFiltr }, 'proximosPedidos.pdf')

    const handleDescargarExcel = () => handleExportToExcel(state.proximosPedidosFiltr);

    const filterData = (tipoServ = data.tipoServicio, dias = data.dias) => {
        const fechaActual = moment()
        const fechaLimite = moment().add(dias, 'days').add(1, 'day')

        const filteredOrders = state.proximosPedidos
            .filter(ped => dias ? moment(ped.fechaEstimadaProximoConsumo).isBetween(fechaActual, fechaLimite) : true)
            .filter(ped => tipoServ != '' ? ped.idTipoServicio == tipoServ : true)

        setState({ ...state, proximosPedidosFiltr: filteredOrders })
    }

    useEffect(() => { getProximosPedidos() }, []);

    useEffect(() => { filterData() }, [data]);

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <div className='flex items-center justify-center h-screen'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className='flex gap-6  md:flex-row sm:flex-col '>
                    <div className='flex flex-col min-w-[30vh] gap-4'>
                        <div className='border-2 w-full shadow-md px-4 pb-3 rounded-xl'>
                            <SelectComp
                                label="Servicios"
                                options={state.tiposServicio}
                                value={data.tipoServicio}
                                firstLabel={'TODOS'}
                                onChangeFunc={(e) => setData({ ...data, tipoServicio: e })}
                                data="tipoServicio_descripcion"
                                valueKey="tipoServicio_idTipoServicio"
                            />
                            <TextInput
                                label="Dias"
                                className="block w-full mt-1 texts"
                                type="number"
                                name="Cantidad"
                                value={data.dias}
                                onChange={(e) => setData({ ...data, dias: e.target.value })}
                            />
                            <ButtonComp label={(<>Refrescar</>)} onClick={getProximosPedidos} />
                            <ButtonComp
                                disabled={state.proximosPedidosFiltr.length == 0}
                                color={state.proximosPedidosFiltr.length > 0 ? '#1b5e20' : '#7c7c7c'}
                                label={(<><Calculate className='mr-2' />  Excel</>)}
                                onClick={handleDescargarExcel}
                            />
                            <ButtonComp
                                disabled={state.proximosPedidosFiltr.length == 0}
                                color={state.proximosPedidosFiltr.length > 0 ? '#af2828' : '#7c7c7c'}
                                label={(<><PictureAsPdf className='mr-2' />  PDF</>)}
                                onClick={handlePdfDownloader}
                            />
                        </div>
                    </div>
                    <div className='w-full md:h-[85vh] sm:h-[100vh]'>
                        <Datatable
                            data={state.proximosPedidosFiltr}
                            searcher={false}
                            virtual={true}
                            columns={[
                                { width: '40%', header: 'Cliente', accessor: 'Nombre' },
                                { width: '20%', header: 'telefono', accessor: 'telefono' },
                                { width: '25%', header: 'Proximo pedido', accessor: 'fechaEstimadaProximoConsumo', cell: ({ item }) => item.fechaEstimadaProximoConsumo },
                                { width: '15%', header: 'Prom. consumo', accessor: 'diasPromedioConsumo' },
                            ]}
                        />
                    </div>
                </div>
            }
        </div>
    );

}