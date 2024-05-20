import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import '../../../../../sass/TablesComponent/_tablesStyle.scss';
import { GraficaReportePrecio } from "./GraficaReportePrecio"
import { handleExportToExcel } from './ExcelReportePrecios';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ButtonComp } from '@/components/ButtonComp';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useRef, useEffect } from 'react'
import SelectComp from '@/components/SelectComp'
import { Calculate } from '@mui/icons-material'
import { Chart } from 'primereact/chart';
import request, { noty, numberFormat } from '@/utils';
import LoadingDiv from '@/components/LoadingDiv';

export default function ReportePrecios() {
    const [state, setState] = useState({ loading: true })
    const [zona, setzona] = useState();
    const [productos, setProductos] = useState();
    const [reportes, setReportes] = useState([]);
    const [selectedZonaName, setSelectedZonaName] = useState('');
    const [selectedZona, setSelectedZona] = useState('');
    const [selectedProducto, setSelectedProducto] = useState('');
    const [chartData, setChartData] = useState();
    const [compList, setCompList] = useState({ allData: [] });
    const [chartOptions, setChartOptions] = useState({});
    const chart = useRef()

    const getMenuName = async () => {
        try {
          // Obtener la ruta actual
          const rutaCompleta = location.pathname;
          const segmentos = rutaCompleta.split('/');
          const nombreModulo = segmentos[segmentos.length - 1]
          const requestData = await request(route("NameMenu"), 'POST', { modulo: nombreModulo }, { enabled: true });
        } catch (error) { }
      };

    //funcion para el boton cuando se de click //
    const handleBuscarClick = async () => {
        const requestBody = { zona: selectedZona, producto: selectedProducto };
        const requestData = await request(route("filtrado"), 'POST', requestBody, { enabled: true, error: { message: 'Hubo un error en la peticion', type: 'error' } });

        // Verificar si no hay datos
        if (!requestData || requestData.Procedimiento.length === 0) {
            new Noty({
                text: "No hay datos para mostrar",
                type: "error",
                theme: "metroui",
                layout: "bottomRight",
                timeout: 2000,
            }).show();
        }
        // se setea los datos
        setReportes(requestData);
        setCompList(requestData)
        // se convierte el obj en array para poder leerlos en la grafica //
        const preciosArray = Object.values(requestData.Procedimiento).map(item => numberFormat(item.precio));

        // se convierte el obj en array para poder leerlos en la grafica pero con la propiedad fecha //
        const FechaArray = Object.values(requestData.Procedimiento).map(item => item.fecha);

        const { dataSet, options } = GraficaReportePrecio(FechaArray, preciosArray, compList);
        setChartData(dataSet);
        setChartOptions(options);
    };

    // funcion para verificar el id de la zona seleecionada
    const handleZonaChange = (selectedValue, selectedOption) => {
        setSelectedZona(selectedValue); // Actualizar el estado con el ID de la zona seleccionada
        setSelectedZonaName(selectedOption?.data?.zona_descripcion || ''); // Actualizar el estado con el nombre de la zona seleccionada
    };

    // funcion para la descarga en excel 
    const handleDescargarClick = async () => {
        if (reportes && reportes.Procedimiento && reportes.Procedimiento.length > 0) {
            noty('Descargando...')
            // Exportar los datos a Excel utilizando el componente DataTableExcel
            const dataToExport = reportes.Procedimiento.map((item) => ({
                fecha: item.fecha,
                anterior: item.anterior,
                precio: item.precio,
                diferencia: item.diferencia,
            }));

            // aqui se hace la busqueda del nombre de la zona para que se muestre en el excel
            const filtrazona = zona.filter((zon) => zon.zona_idZona === selectedZona);
            handleExportToExcel(dataToExport, handleZonaChange, filtrazona[0].zona_descripcion);
        } else noty('No hay datos para descargar', error)
    };
    // aqui verificamos el id del producto selecionado 
    const handleProductoChange = (event) => {
        setSelectedProducto(event);
    };

    const fetchdata = async () => {
        getZonas();
        getProductos();
    };

    const dataSource = new DataSource({
        store: new ArrayStore({
            data: reportes && reportes.Procedimiento ? reportes.Procedimiento : [],
        }),
    });

    //obtenemos las zonas
    const getZonas = async () => {
        const response = await fetch(route("zonas.index"));
        const data = await response.json();
        setzona(data);
    };
    //obtenemos los producto
    const getProductos = async () => {
        const responseE = await fetch(route("productos.index"));
        const dataE = await responseE.json();
        setProductos(dataE);
    };

    useEffect(() => {
        fetchdata();
        getMenuName();
    }, [])

    useEffect(() => {
        if (zona && productos) setState({})
    }, [zona, productos])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            {state.loading &&
                <div className='flex place-content-center h-[90vh] w-full'>
                    <LoadingDiv />
                </div>
            }
            {!state.loading &&
                <div className='md:grid md:grid-cols-12 sm:flex sm:flex-col gap-4' style={{ marginTop: '10px' }}>
                    <div className='flex flex-col col-span-2 gap-2 pt-4 min-w-[230px]'>
                        <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-5 pb-8'>
                            <SelectComp
                                label="Zona"
                                options={zona}
                                value={selectedZona}
                                onChangeFunc={handleZonaChange}
                                data="zona_descripcion"
                                valueKey="zona_idZona"
                            />
                            <SelectComp
                                label="Producto"
                                options={productos}
                                value={selectedProducto}
                                onChangeFunc={handleProductoChange}
                                data="producto_nombre"
                                valueKey="producto_idProducto"
                            />
                            <ButtonComp
                                icon={<SearchIcon />}
                                onClick={handleBuscarClick}
                                label='Refrescar datos'
                                // color={(selectedZona && selectedProducto) ? '': ''}
                                disabled={!(selectedZona && selectedProducto)}
                            />
                            <ButtonComp
                                icon={<Calculate />}
                                onClick={handleDescargarClick}
                                label='Exportar a excel'
                                color='#2e7d32'
                            />
                        </div>
                    </div>
                    {reportes && (
                        <div className='relative col-span-10 mx-1 max-[1630px]:ml-20 max-[1250px]:ml-28 max-[1050px]:ml-32 max-[900px]:ml-40 max-[767px]:ml-0'>
                            <div className='virtualTable blue-scroll max-h-[92%] monitor-table'>
                                <DataGrid
                                    dataSource={dataSource}
                                    showRowLines={true}
                                    showColumnLines={true}
                                    className='sm:min-w-[10px] md:min-w-[10px]'
                                >
                                    <Editing
                                        mode="cell"
                                        allowUpdating={true}
                                    />
                                    <Column dataField="fecha" caption=' Fecha' allowEditing={false} valueExpr="fecha" displayExpr="fecha" />
                                    <Column dataField="anterior" caption='Precio Anterior' allowEditing={false} valueExpr="anterior" displayExpr="anterior" />
                                    <Column dataField="precio" caption='Precio' allowEditing={false} valueExpr="Precio" displayExpr="Precio" />
                                    <Column dataField="diferencia" caption='Diferencia' allowEditing={false} valueExpr="diferencia" displayExpr="diferencia" />
                                </DataGrid>
                            </div>
                            {chartData &&
                                <div className="max-[1080px]:col-span-full col-span-8 h-[650px]">
                                    <div className='flex flex-col col-span-2 gap-2 pt-5'>
                                        <div className='flex flex-col border-2 rounded-lg shadow-sm p-3 gap-5 pb-8'>
                                            <Chart ref={chart} className="h-[75%]" type="line" data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                </div>
            }
        </div>
    );
}