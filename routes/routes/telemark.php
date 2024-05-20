<?php

use App\Http\Controllers\Admin\Catalogos\ColoniaRutaController;
use App\Http\Controllers\Admin\Catalogos\ProductoController;
use App\Http\Controllers\Admin\Sat\MunicipioController;
use App\Http\Controllers\Admin\Telemark\ClientesPedidosController;
use App\Http\Controllers\Admin\Telemark\DireccionPedidosController;
use App\Http\Controllers\Admin\Telemark\EstatusController;
use App\Http\Controllers\Admin\Telemark\PedidosController;
use App\Http\Controllers\Admin\Telemark\PedidosDetalleController;
use App\Http\Controllers\Admin\Telemark\PedidosRutasController;
use App\Http\Controllers\Admin\Telemark\PreguntaEncuestaController;
use App\Http\Controllers\Admin\Telemark\ServTecSolucionesController;
use App\Http\Controllers\Admin\Telemark\MotivosCancelacionController;
use App\Http\Controllers\Admin\Telemark\ProspeccionController;
use App\Http\Controllers\Admin\Telemark\agentesvsusuariosController;
use App\Http\Controllers\Admin\Telemark\EncuestaClienteController;
use App\Http\Controllers\Admin\Telemark\MotivosController;
use App\Http\Controllers\Admin\Telemark\ReportesController;
use App\Http\Controllers\Admin\Telemark\ReporteDirClienteController;
use App\Http\Controllers\Admin\Telemark\ReporteConfClientesController;
use App\Http\Controllers\Admin\Telemark\ReposicionServTecController;
use App\Http\Controllers\Admin\Telemark\sTecnicoController;
use App\Http\Controllers\Admin\Telemark\VespxmatController;
use App\Http\Controllers\Admin\Ventas\QuienConQuienController;
use App\Http\Controllers\LocalizacionController;
use App\Models\Admin\Telemark\PedidosDetalle;
use App\Models\Admin\Telemark\Vespxmat;
use Illuminate\Support\Facades\Route;

Route::resource('clientes-pedidos', ClientesPedidosController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'clientes-pedidos.store', 'index' => 'clientes-pedidos.index', 'update' => 'clientes-pedidos.update']);

Route::post('/clientes-pedidos-search', [ClientesPedidosController::class, 'search'])
    ->name('clientes-pedidos.search');

Route::resource('preguntas-encuestas', PreguntaEncuestaController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'preguntas-encuestas.store', 'index' => 'preguntas-encuestas.index', 'update' => 'preguntas-encuestas.update']);

Route::resource('encuesta-cliente', EncuestaClienteController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'encuesta-cliente.store', 'index' => 'encuesta-cliente.index', 'update' => 'encuesta-cliente.update']);

Route::post('/no-answer', [EncuestaClienteController::class, 'noAnswer'])->name('no-answer');

Route::resource('serv-tec-soluciones', ServTecSolucionesController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'serv-tec-soluciones.store', 'index' => 'serv-tec-soluciones.index', 'update' => 'serv-tec-soluciones.update']);

Route::get('problemas-por-soluciones/{id}', [ServTecSolucionesController::class, 'problemaBysolucionTecnica'])->name('problemas-por-soluciones');

Route::resource('stecnico', sTecnicoController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'stecnico.store', 'index' => 'stecnico.index', 'update' => 'stecnico.update']);

Route::get('graficaServTecnico', [ClientesPedidosController::class, 'getGraficaServTecnico'])->name('graficaServTecnico');

Route::post('reporteServTecnico', [ClientesPedidosController::class, 'getReporteServTecnico'])->name('reporteServTecnico');

Route::resource('direccion-pedidos', DireccionPedidosController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'direccion-pedidos.store', 'index' => 'direccion-pedidos.index', 'update' => 'direccion-pedidos.update']);
// aq
Route::post('/PedidoOrigenRuta', [DireccionPedidosController::class, 'PedidosRuta'])->name('PedidoOrigenRuta');
Route::post('/getproductbypropiotipo', [ProductoController::class, 'getproductbypropiotipo'])->name('getproductbypropiotipo');
Route::get('/getProductsByCargas', [ProductoController::class, 'getProductsByCargas'])->name('getProductsByCargas');


Route::resource('vespxmatt', VespxmatController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'vespxmat.store', 'index' => 'vespxmat.index', 'update' => 'vespxmat.update']);
Route::post('/direcciones-number', [DireccionPedidosController::class, 'direcciones_number'])->name('direcciones-number');

Route::get('/clientes-number/{phone}', [ClientesPedidosController::class, 'clientes_number'])->name('clientes-number');

Route::post('/phone-numberClient', [ClientesPedidosController::class, 'phone_numberClient'])->name('phone-numberClient');

Route::resource('motivos-cancelacion', MotivosCancelacionController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'motivos-cancelacion.store', 'index' => 'motivos-cancelacion.index', 'update' => 'motivos-cancelacion.update']);

Route::get('/motivos-cancelacion-habiles', [MotivosCancelacionController::class, 'getMotivosByHora'])->name('motivos-cancelacion-habiles');

Route::resource('prospeccion', ProspeccionController::class)
    ->only(['store', 'index', 'update', 'destroy'])
    ->names(['store' => 'prospeccion.store', 'index' => 'prospeccion.index', 'update' => 'prospeccion.update', 'destroy' => 'prospeccion.destroy']);

Route::resource('motivos', MotivosController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'motivos.store', 'index' => 'motivos.index', 'update' => 'motivos.update']);

Route::resource('pedidos', PedidosController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'pedidos.store', 'index' => 'pedidos.index', 'update' => 'pedidos.update']);

Route::get('getOrderStadistic', [PedidosController::class, 'getOrderStadistic'])
    ->name('getOrderStadistic');

Route::resource('pedidos-detalle', PedidosDetalleController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'pedidos-detalle.store', 'index' => 'pedidos-detalle.index', 'update' => 'pedidos-detalle.update']);

Route::post('/historialpedidos', [PedidosController::class, 'historialpedidos'])->name('historialpedidos');
Route::post('/ordenes', [PedidosController::class, 'ordenes'])->name('ordenes');
Route::post('/detallepedido', [PedidosController::class, 'detallepedido'])->name('detallepedido');
Route::get('/prospeccion-producto', [ProspeccionController::class, 'Prospeccionproducto'])->name('Prospeccion-producto');
Route::get('/operadora', [ProspeccionController::class, 'operadora'])->name('operadora');



Route::post('/prospecciones-filtradas', [ProspeccionController::class, 'filtradoBySOD'])->name('prospecciones-filtradas');

Route::post('colonia-rutas', [ColoniaRutaController::class, 'store'])->name('colonia-rutas.store');
Route::post('colonia-rutas-ciudad', [ColoniaRutaController::class, 'getByCity'])->name('colonia-rutas.byCity');
Route::post('colonia-rutas-servicio', [ColoniaRutaController::class, 'getByService'])->name('colonia-rutas.byService');

Route::post('/direction_Client', [DireccionPedidosController::class, 'direction_Client'])->name('direction_Client');

Route::post('/quienconquien-para-cliente', [ClientesPedidosController::class, 'quienConQuienParaCliente'])->name('quienconquien-para-cliente');

Route::post('/productshow', [ProductoController::class, 'producto_show'])->name('productshow');

Route::resource('agentesvsusuarios', agentesvsusuariosController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'agentesvsusuarios.store', 'index' => 'agentesvsusuarios.index', 'update' => 'agentesvsusuarios.update']);

Route::get('/servicios-en-transito', [PedidosController::class, 'getOnTransitService'])->name('servicios-en-transito');
Route::post('/getOnTransitServiceOrders', [PedidosController::class, 'getOnTransitServiceOrders'])->name('getOnTransitServiceOrders');
Route::get('/dias-con-pedidos', [PedidosController::class, 'diasConPedidos'])->name('dias-con-pedidos');



Route::post('vespxmat-por-ser', [VespxmatController::class, 'getByService'])->name('vespxmat-por-ser.byService');

Route::post('vespxmat-multiple-up', [VespxmatController::class, 'updateMultiple'])->name('vespxmat.updateMultiple');

Route::post('vespxmat-rutas-matutitnas-disponibles-por-servicio', [VespxmatController::class, 'getAvailableMatutineRoutes'])->name('vespxmat-rutas-matutitnas-disponibles-por-servicio');
Route::get('vespxmat-rutas-matutitnas-con-vespertinas/{id}', [VespxmatController::class, 'getCurrentSyncVespRoute'])->name('vespxmat-rutas-matutinas-con-vespertinas');
Route::get('vespxmat-rutas-vespertinas-por-servicio/{id}', [VespxmatController::class, 'getRoutesVespServices'])->name('vespxmat-rutas-vespertinas-por-servicio');
Route::post('vespxmat-pasar-rutas/{id}', [VespxmatController::class, 'changeRoutes'])->name('vespxmat-pasar-rutas');

Route::post('vespxmat-cambiar-rutas', [VespxmatController::class, 'changeRutes'])->name('vespxmax-cambiar-rutas');

Route::get('estatus-pedidos', [ClientesPedidosController::class, 'getEstatus'])->name('estatus-pedidos');

Route::get('/Correcion-Pedidos/{id}', [PedidosController::class, 'CorrecionPedidos'])->name('Correcion-Pedidos');
Route::post('/actualizar-Pedidos', [PedidosDetalleController::class, 'actualizarPedidos'])->name('actualizar-Pedidos');
// Route::post('/vendedor-quienconquien', [PedidosDetalleController::class, 'VendedorQuienconquien'])->name('vendedor-quienconquien');
Route::post('/vendedor-quienconquien', [QuienConQuienController::class, 'getEmployeesByWho'])->name('vendedor-quienconquien');

Route::prefix('reportes')->group(function () {
    Route::post('desglosado-rutas', [QuienConQuienController::class, 'desglosadoRutas'])->name('desglosado-rutas');
    Route::post('desglosado-rutas-excel', [QuienConQuienController::class, 'desglosadoRutasExcel'])->name('desglosado-rutas-excel');
    Route::post('servicios/anuales', [ReportesController::class, 'serviciosAnuales'])->name('reporteServiciosAnuales');
    Route::post('comparacion/servicios', [ReportesController::class, 'comparacionServicios'])->name('reporteComparacionServicios');
    
    Route::post('pedidos-diarios', [ReportesController::class, 'pedidosDiarios'])->name('reporte-pedidos-diarios');
    Route::post('pedidos-operadora', [ReportesController::class, 'pedidosOperadora'])->name('reporte-pedidos-operadora');
});

Route::post('localizacion', [LocalizacionController::class, 'getlocalizacion'])->name('localizacion');
Route::post('servicespendient', [LocalizacionController::class, 'servicespendient'])->name('servicespendient');
Route::post('Localizacion_servicio', [LocalizacionController::class, 'Localizacion_servicio'])->name('Localizacion_servicio');



Route::resource('estatus', EstatusController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'estatus.store', 'index' => 'estatus.index', 'update' => 'estatus.update']);

Route::post('/Georeporte', [EstatusController::class, 'Georeporte'])->name('Georeporte');
Route::post('/Recorrido', [EstatusController::class, 'Recorrido'])->name('Recorrido');



Route::post('/actualizarFechaPedido', [PedidosDetalleController::class, 'actualizarFechaPedido'])->name('actualizarFechaPedido');

Route::get('estatus-pedidos', [PedidosController::class, 'estatusPedidos'])->name('estatus-pedidos');

Route::post('/reportes', [PedidosController::class, 'reportes'])->name('reportes');

Route::resource('PedidosRuta', PedidosRutasController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'PedidosRuta.store', 'index' => 'PedidosRuta.index', 'update' => 'PedidosRuta.update']);


Route::resource('reposicion-serv-tec', ReposicionServTecController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'reposicion-serv-tec.store', 'index' => 'reposicion-serv-tec.index', 'update' => 'reposicion-serv-tec.update']);

Route::post('/totales-dir-clientes', [ReporteDirClienteController::class, 'getDirClientesTotales'])->name('totales-dir-clientes');

Route::post('/buscar-dir-clientes', [ReporteDirClienteController::class, 'getDirClientesBusqueda'])->name('buscar-dir-clientes');

Route::post('/clientes-by-ruta', [ReporteDirClienteController::class, 'getClientesInRuta'])->name('clientes-by-ruta');

Route::post('/all-clientes-by-ruta', [ReporteDirClienteController::class, 'getAllClientesInRuta'])->name('all-clientes-by-ruta');

Route::post('/clientes-by-producto', [ReporteDirClienteController::class, 'getProductoInColonia'])->name('clientes-by-producto');

Route::post('/clientes-by-colonia', [ReporteDirClienteController::class, 'getClientesInColonia'])->name('clientes-by-colonia');

Route::post('/clientes-by-totales', [ReporteDirClienteController::class, 'getClientesByTotales'])->name('clientes-by-totales');

Route::get('/muns-for-telemark', [MunicipioController::class, 'getMunsTelemark'])->name('muns-for-telemark');

Route::post('/confCliente-operadora', [ReporteConfClientesController::class, 'confClienteByOperadora'])->name('confCliente-operadora');

Route::post('/promedios-encuesta', [ReporteConfClientesController::class, 'getPromEncuesta'])->name('promedios-encuesta');
