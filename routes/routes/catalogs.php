<?php

use App\Http\Controllers\admin\Cartera\CancelarPagosController;
use App\Http\Controllers\admin\Cartera\NotasCreditoController;
use App\Http\Controllers\admin\Cartera\PagosCarteraController;
use App\Http\Controllers\admin\Cartera\TimbradoPagosController;
use App\Http\Controllers\Admin\Catalogos\AdministrarCreditosController;
use App\Http\Controllers\admin\catalogos\AjusteInventariosController;
use App\Http\Controllers\admin\catalogos\AlmacenArticuloController;
use App\Http\Controllers\Admin\Catalogos\AlmacenController;
use App\Http\Controllers\Admin\Catalogos\AreasFuncionalesController;
use App\Http\Controllers\Admin\Catalogos\ArqueoController;
use App\Http\Controllers\Admin\Catalogos\ArticulosController;
use App\Http\Controllers\Admin\Catalogos\AsignacionTanqueController;
use App\Http\Controllers\Admin\Catalogos\AsuntoController;
use App\Http\Controllers\Admin\Catalogos\AuditoriaDetalleController;
use App\Http\Controllers\Admin\Catalogos\BancoController;
use App\Http\Controllers\Admin\Catalogos\CedisController;
use App\Http\Controllers\Admin\Catalogos\CentroCostosController;
use App\Http\Controllers\Admin\Catalogos\ColoniaRutaController;
use App\Http\Controllers\Admin\Catalogos\EstacionController;
use App\Http\Controllers\Admin\Catalogos\MenusMensajeController;
use App\Http\Controllers\Admin\Catalogos\PrecioController;
use App\Http\Controllers\Admin\Catalogos\ProximosPedidosController;
use App\Http\Controllers\Admin\Catalogos\ReportePreciosController;
use App\Http\Controllers\Admin\Catalogos\ReporteVendoresController;
use App\Http\Controllers\Admin\Catalogos\VendedorPuestoController;
use App\Http\Controllers\Admin\EmpresaController;
use App\Http\Controllers\Admin\Facturacion\ReporteFacturacionController;
use App\Http\Controllers\Admin\Sat\ConceptosProductosController;
use App\Http\Controllers\Admin\Sat\EstadoController;
use App\Http\Controllers\Admin\Sat\ImpuestoController;
use App\Http\Controllers\Admin\Sat\MetodoPagoController;
use App\Http\Controllers\Admin\Sat\MonedaController;
use App\Http\Controllers\Admin\Sat\PaisController;
use App\Http\Controllers\Admin\Sat\RegimenFiscalController;
use App\Http\Controllers\Admin\Sat\TipoRelacionController;
use App\Http\Controllers\Admin\Ventas\CambioLecturaController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VigilanciaController;
use App\Http\Controllers\XMLController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Catalogos\PreCorteController;
use App\Http\Controllers\Admin\Catalogos\FoliosController;
use App\Http\Controllers\Admin\Catalogos\PuntoRecorridoController;
use App\Http\Controllers\Admin\Catalogos\PuntoRondinController;
use App\Http\Controllers\Admin\Catalogos\RecorridoController;
use App\Http\Controllers\Admin\Catalogos\TipoCaptacionController;
use App\Http\Controllers\Admin\Catalogos\RedController;
use App\Http\Controllers\Admin\Catalogos\TipoServicioController;
use App\Http\Controllers\Admin\Catalogos\UnidadMedidaController;
use App\Http\Controllers\Admin\Catalogos\ZonaController;
use App\Http\Controllers\Admin\Sat\UsoCfdiController;
use App\Http\Controllers\Admin\Catalogos\TipoClienteController;
use App\Http\Controllers\Admin\Catalogos\TipoCarteraController;
use App\Http\Controllers\Admin\Catalogos\RutaController;
use App\Http\Controllers\Admin\Catalogos\TurnoController;
use App\Http\Controllers\Admin\Catalogos\UnidadController;
use App\Http\Controllers\Admin\RH\ISRController;
use App\Http\Controllers\Admin\Sat\ClavesMostrarController;
use App\Http\Controllers\Admin\Facturacion\FacturacionController;
use App\Http\Controllers\Admin\Catalogos\ClienteController;
use App\Http\Controllers\Admin\Catalogos\ClienteOtraEmpresaController;
use App\Http\Controllers\Admin\Catalogos\ClienteSucursalController;
use App\Http\Controllers\Admin\Catalogos\NumeroEconomicoController;
use App\Http\Controllers\Admin\Sat\MunicipioController;
use App\Http\Controllers\Admin\Sat\FormaspagoController;
use App\Http\Controllers\Admin\Catalogos\CorreoNotificacionController;
use App\Http\Controllers\Admin\Catalogos\CorreosClienteController;
use App\Http\Controllers\Admin\Catalogos\DensidadesController;
use App\Http\Controllers\Admin\Catalogos\ProductoController;
use App\Http\Controllers\Admin\Sat\ColoniasController;
use App\Http\Controllers\Admin\Telemark\MotivosCancelacionController;
use App\Http\Controllers\Admin\Telemark\OrigenPedidoController;
use App\Http\Controllers\Admin\Ventas\QuienConQuienController;
use App\Models\Admin\Catalogos\Cliente;
use App\Http\Controllers\Admin\Catalogos\ReposicionGasController;
use App\Http\Controllers\Admin\Catalogos\TanqueController;
use App\Http\Controllers\Admin\Catalogos\TanqueValvulaController;
use App\Http\Controllers\Admin\Catalogos\TipoTanqueController;
use App\Http\Controllers\Admin\Catalogos\ControlVehiculosController;
use App\Http\Controllers\Admin\Catalogos\listaVerificacionController;
use App\Http\Controllers\Admin\Catalogos\MotivoEntradaSalidaController;
use App\Http\Controllers\Admin\Catalogos\NivelCarburacionController;
use App\Http\Controllers\Admin\Catalogos\nivelGasolinaController;
use App\Http\Controllers\Admin\Catalogos\TipoValvulaController;
use App\Http\Controllers\Admin\Catalogos\ValvulaController;
use App\Http\Controllers\Admin\Catalogos\PartesUnidadController;
use App\Http\Controllers\Admin\Catalogos\TipoTanqueContoller;
use App\Http\Controllers\Admin\Catalogos\CargaRegistradaController;
use App\Http\Controllers\Admin\Catalogos\CompraController;
use App\Http\Controllers\Admin\Sat\LocalidadesController;
use App\Http\Controllers\Admin\RH\DocumentacionController;


use App\Http\Controllers\Admin\Catalogos\ConceptoRevisionController;
use App\Http\Controllers\Admin\Catalogos\CortesController;
use App\Http\Controllers\admin\Catalogos\CuentasBancoEmpresaController;
use App\Http\Controllers\Admin\Catalogos\IncidenciasPartesUnidadController;
use App\Http\Controllers\Admin\Catalogos\IncidenciasVerificacionController;
use App\Http\Controllers\admin\catalogos\MarcaCarrosController;
use App\Http\Controllers\admin\catalogos\ModeloCarroController;
use App\Http\Controllers\admin\catalogos\ModeloMarcasController;
use App\Http\Controllers\admin\catalogos\ModeloVehiculoController;
use App\Http\Controllers\admin\catalogos\ProveedorArticuloController;
use App\Http\Controllers\admin\catalogos\ProveedorController;
use App\Http\Controllers\Admin\Catalogos\PuestoController;
use App\Http\Controllers\Admin\Catalogos\SistemasController;
use App\Http\Controllers\admin\catalogos\SupervisorPuestoController;
use App\Http\Controllers\admin\catalogos\TipoVehiculoController;
use App\Http\Controllers\admin\catalogos\UsuarioAlmacenController;
use App\Http\Controllers\admin\Catalogos\UsuarioRondinController;
use App\Http\Controllers\Admin\Catalogos\VentaDetalleTienditaController;
use App\Http\Controllers\Admin\Catalogos\VentaEncabezadoTienditaController;
use App\Http\Controllers\admin\Facturacion\CancelacionFacturasController;
use App\Http\Controllers\Admin\Facturacion\CuentasBancoController;
use App\Http\Controllers\admin\Ventas\ReporteComparativoController;
use App\Http\Controllers\Admin\Ventas\ReporteRemisionesController;
use App\Models\Admin\Catalogos\ControlVehiculos;
use App\Models\Admin\Catalogos\PuntoRecorrido;
use App\Models\Admin\Catalogos\TanqueValvula;

Route::resource('usuarios', UserController::class)
    ->only(['index', 'store', 'update', 'destroy', 'show'])
    ->names(['index' => 'usuarios.index', 'store' => 'usuarios.store', 'update' => 'usuarios.update', 'destroy' => 'usuarios.destroy']);

Route::resource('roles', RolesController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'roles.index', 'store' => 'roles.store', 'update' => 'roles.update']);


Route::resource('menus', MenuController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'menus.index', 'store' => 'menus.store', 'update' => 'menus.update']);

Route::get('menus-tree', [MenuController::class, 'getTree'])->name('menus-tree');

Route::get('user-menu-permission', [UserController::class, 'userMenuPermission'])
    ->name('userMenuPermission');

Route::resource('bancos', BancoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'bancos.index', 'store' => 'bancos.store', 'update' => 'bancos.update']);

Route::resource('empresas', EmpresaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'empresas.index', 'store' => 'empresas.store', 'update' => 'empresas.update']);

Route::get('empresas-con-iconos', [EmpresaController::class, 'indexWithIcons'])
    ->name('empresas-con-iconos');

Route::get('empresas-loggeada', [EmpresaController::class, 'logged'])
    ->name('empresas-loggeada');

Route::get('empresa-user-icono', [EmpresaController::class, 'showWithIconsLogged'])->name('empresa-user-icono');

Route::get('empresa-con-icono/{id}', [EmpresaController::class, 'showWithIcons'])
    ->name('empresa-con-icono');

Route::resource('estacion', EstacionController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'estacion.index', 'store' => 'estacion.store', 'update' => 'estacion.update']);
Route::get('estaciones-activas', [EstacionController::class, 'getActiveStations'])->name('estacion.activa');


Route::resource('tipos-servicios', TipoServicioController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'tipos-servicios.index', 'store' => 'tipos-servicios.store', 'update' => 'tipos-servicios.update']);
Route::get('tipos-servicio-sinfiltros', [TipoServicioController::class, 'tipoServicioSinFiltros'])->name('tipos-servicio-sinfiltros');

Route::resource('unidades-de-medida', UnidadMedidaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'unidades-de-medida.index', 'store' => 'unidades-de-medida.store', 'update' => 'unidades-de-medida.update']);

Route::resource('uso-cfdi', UsoCfdiController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'uso-cfdi.index', 'store' => 'uso-cfdi.store', 'update' => 'uso-cfdi.update']);

Route::resource('zonas', ZonaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'zonas.index', 'store' => 'zonas.store', 'update' => 'zonas.update']);

// Route::resource('incidencias-parte-unidad', IncidenciasPartesUnidadController::class)
//     ->only(['index', 'store', 'update'])
//     ->names(['index' => 'incidencias-parte-unidad.index', 'store' => 'incidencias-parte-unidad.store', 'update' => 'incidencias-parte-unidad.update']);

Route::resource('incidencias-lista-verificacion', IncidenciasVerificacionController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'incidencias-lista-verificacion.index', 'store' => 'incidencias-lista-verificacion.store', 'update' => 'incidencias-lista-verificacion.update']);

Route::get('getzonaMunicipioEstado', [ZonaController::class, 'getzonaMunicipioEstado'])->name('getzonaMunicipioEstado');

Route::get('precios', [ZonaController::class, 'getPriceZone'])->name('precios');
Route::post('PrecioLitro', [ZonaController::class, 'PrecioLitro'])->name('PrecioLitro');
Route::post('PrecioZona', [ZonaController::class, 'PrecioZona'])->name('PrecioZona');
Route::post('filterZone', [ZonaController::class, 'filterZone'])->name('filterZone');

Route::resource('precios', PrecioController::class)
    ->only(['index', 'store'])
    ->names(['index' => 'precios.index', 'store' => 'precios.store']);

Route::post('precios-zona', [PrecioController::class, 'filterPriceZone'])->name('precios-zona');

Route::resource('conceptos-productos', ConceptosProductosController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'conceptos-productos.index', 'store' => 'conceptos-productos.store', 'update' => 'conceptos-productos.update']);

Route::get('conceptos-productos-sin-clave', [ConceptosProductosController::class, 'conceptosSinClave'])->name('conceptos-productos.sin-clave');

Route::get('conceptos-productos-disponibles', [ConceptosProductosController::class, 'conceptosDisponibles'])->name('conceptos-productos.disponibles');

Route::resource('sat/estados', EstadoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat/estados.index', 'store' => 'sat/estados.store', 'update' => 'sat/estados.update']);

//obtener ESTADOSAPIA 
Route::get('estadosApi', [EstadoController::class, 'getEstadoApi'])->name('estadosApi');
// ---------------------------------------
Route::resource('sat/paises', PaisController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat/paises.index', 'store' => 'sat/paises.store', 'update' => 'sat/paises.update']);

Route::resource('sat/regimen-fiscal', RegimenFiscalController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat/regimen-fiscal.index', 'store' => 'sat/regimen-fiscal.store', 'update' => 'sat/regimen-fiscal.update']);

Route::resource('sat/tipo-relaciones', TipoRelacionController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat/tipo-relaciones.index', 'store' => 'sat/tipo-relaciones.store', 'update' => 'sat/tipo-relaciones.update']);

Route::resource('sat/moneda', MonedaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat/moneda.index', 'store' => 'sat/moneda.store', 'update' => 'sat/moneda.update']);

Route::resource('sat/metodo-pago', MetodoPagoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat/metodo-pago.index', 'store' => 'sat/metodo-pago.store', 'update' => 'sat/metodo-pago.update']);

Route::resource('sat/impuestos', ImpuestoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat/impuestos.index', 'store' => 'sat/impuestos.store', 'update' => 'sat/impuestos.update']);

Route::resource('red', RedController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'red.index', 'store' => 'red.store', 'update' => 'red.update']);

Route::get('comprobar-red/{id}', [RedController::class, 'comprobar'])->name('comprobar-red');
Route::get('historico-red/{id}', [RedController::class, 'getHistorico'])->name('historico-red');
// Route::Post('redAsignada/{id}', [RedController::class, 'redAsignada'])->name('Red-Asignada');

Route::resource('precorte', PreCorteController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'precorte.index', 'store' => 'precorte.store', 'update' => 'precorte.update']);

Route::resource('folios', FoliosController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'folios.index', 'store' => 'folios.store', 'update' => 'folios.update']);

Route::get('FolioDiversos', [FoliosController::class, 'FolioDiversos'])->name('FolioDiversos');
Route::get('FolioCarburacion', [FoliosController::class, 'FolioCarburacion'])->name('FolioCarburacion');


Route::get('FoliosRemisiones', [FoliosController::class, 'FoliosRemisiones'])->name('FoliosRemisiones');


Route::resource('turno', TurnoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'turno.index', 'store' => 'turno.store', 'update' => 'turno.update']);

Route::resource('captacion', TipoCaptacionController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'captacion.index', 'store' => 'captacion.store', 'update' => 'captacion.update']);

Route::resource('tipo-clientes', TipoClienteController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'tipo-clientes.index', 'store' => 'tipo-clientes.store', 'update' => 'tipo-clientes.update']);

Route::resource('tipo-cartera', TipoCarteraController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'tipo-cartera.index', 'store' => 'tipo-cartera.store', 'update' => 'tipo-cartera.update']);

Route::resource('rutas', RutaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'rutas.index', 'store' => 'rutas.store', 'update' => 'rutas.update']);


//No se si vaya aqui o en las rutas de telemark 
Route::get('rutas-servicio/{id}', [RutaController::class, 'getByService'])->name('rutas-por-servicio');
Route::get('rutas-matutinas-por-servicio/{id}', [RutaController::class, 'getMatutineRoutes'])->name('rutas-matutinas-por-servicio');

Route::get('rutas-sin-index', [RutaController::class, 'indexWithoutRelations'])->name('rutas-sin-index');

Route::resource('isrs', ISRController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'isrs.index', 'store' => 'isrs.store', 'update' => 'isrs.update']);
Route::get('isr-historico-pdf', [ISRController::class, 'generateISRPDF'])->name('isr-historico-pdf');

//resources indica las funcionalidades que tendra el controlador el only los metodos que se usaran los names apuntan a las rutas y el metodo que se usara

Route::resource('areas-funcionales', AreasFuncionalesController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'areas-funcionales.index', 'store' => 'areas-funcionales.store', 'update' => 'areas-funcionales.update']);

Route::resource('sat/claves-mostrar', ClavesMostrarController::class)
    ->only(['index', 'store'])
    ->names(['index' => 'claves-mostrar.index', 'store' => 'claves-mostrar.store']);

Route::post('sat/claves-mostrar-delete', [ClavesMostrarController::class, 'destroy'])->name('claves-mostrar.destroy');

Route::resource('facturacione', FacturacionController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'facturacione.index', 'store' => 'facturacione.store', 'update' => 'facturacione.update']);

Route::resource('punto-rondin', PuntoRondinController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'punto-rondin.index', 'store' => 'punto-rondin.store', 'update' => 'punto-rondin.update']);

Route::resource('recorridos', RecorridoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'recorridos.index', 'store' => 'recorridos.store', 'update' => 'recorridos.update']);

Route::resource('recorridos-puntos', PuntoRecorridoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'recorridos-puntos.index', 'store' => 'recorridos-puntos.store', 'update' => 'recorridos-puntos.update']);

Route::resource('unidades', UnidadController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'unidades.index', 'store' => 'unidades.store', 'update' => 'unidades.update']);

Route::resource('supervisor-puesto', SupervisorPuestoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'supervisor-puesto.index', 'store' => 'supervisor-puesto.store', 'update' => 'supervisor-puesto.update']);

Route::get('unidades-con-ruta', [UnidadController::class, 'getWithRoute'])->name('getUnidadesConRuta');
Route::get('unidades-por-control/{id}', [UnidadController::class, 'controlVehiculos'])->name('unidades-por-control');
Route::get('unidades-por-tiposervicio/{id}', [UnidadController::class, 'getByServiceType'])->name('unidades-por-tiposervicio');
// Route::get('unidades-por-tiposervicioTok/{id}', [UnidadController::class, 'getByServiceTypeTok'])->name('unidades-por-tiposervicioTok');
// Route::get('unidades-por-tiposervicioEst/{id}', [UnidadController::class, 'getByServiceTypeEst'])->name('unidades-por-tiposervicioEst');
// Route::get('unidades-por-tiposervicioPort/{id}', [UnidadController::class, 'getByServiceTypePort'])->name('unidades-por-tiposervicioPort');
Route::get('unidades-ventas-estacionarias', [UnidadController::class, 'QCQTodayEstacionary'])->name('unidades-ventas-estacionarias');
Route::get('unidades-ventas-portatil', [UnidadController::class, 'QCQTodayPortable'])->name('unidades-ventas-portatil');
Route::get('impuesto', [ImpuestoController::class, 'impuesto'])->name('impuesto');


Route::get('UnidadEstacionario', [UnidadController::class, 'UnidadEstacionario'])->name('UnidadEstacionario');
Route::post('unidad/files', [UnidadController::class, 'downloadFiles'])->name('unidad-files');
Route::post('unidad/upload/files', [UnidadController::class, 'uploadFiles'])->name('unidad-upload-files');
Route::get('unidades-tiposervicio-por-entradasalida/{id}', [UnidadController::class, 'getByUnitsXTypeES'])->name('unidades-tiposervicio-por-entradasalida');
Route::post('unidadesVendedor', [UnidadController::class, 'unidades_vendedor'])->name('unidadesVendedor');
Route::post('vendedorunidad', [UnidadController::class, 'vendedorunidad'])->name('vendedorunidad');

Route::resource('centroscostos', CentroCostosController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'centroscostos.index', 'store' => 'centroscostos.store', 'update' => 'centroscostos.update']);

Route::resource('municipio', MunicipioController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'municipio.index', 'store' => 'municipio.store', 'update' => 'municipio.update']);

Route::get('/getMunicipioPorEstadoApi', [MunicipioController::class, 'getMunicipioPorEstadoApi'])->name('getMunicipioPorEstadoApi');

Route::get('/municipios-por-zona', [MunicipioController::class, 'getMunicipioPorZona'])->name('municipios-por-zona');

Route::resource('productos', ProductoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'productos.index', 'store' => 'productos.store', 'update' => 'productos.update']);
Route::get('productos-por-tiposervicio/{id}', [ProductoController::class, 'getProductsByService'])->name('productos-por-tiposervicio');
Route::post('productos-historico-remision', [ProductoController::class, 'getHistoricoRemision'])->name('productos-historico.remision');

Route::resource('vendedor-puestos', VendedorPuestoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'vendedor-puestos.index', 'store' => 'vendedor-puestos.store', 'update' => 'vendedor-puestos.update']);

Route::resource('asuntos', AsuntoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'asuntos.index', 'store' => 'asuntos.store', 'update' => 'asuntos.update']);

Route::resource('correo-notificaciones', CorreoNotificacionController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'correo-notificaciones.index', 'store' => 'correo-notificaciones.store', 'update' => 'correo-notificaciones.update']);

//RUTA PARA OBTENER MENSAJE DE STEPS DEL PROCEDIMIENTO //
Route::post('NameMenu', [MenusMensajeController::class, 'MensajeStepsMenus'])->name('NameMenu');


Route::get('correos-por-asuntos/{id}', [CorreoNotificacionController::class, 'correosByAsuntos'])->name('correos-por-asuntos');


Route::get('documentacion-por-tipo/{id}', [DocumentacionController::class, 'docBytipo'])->name('documentacion-por-tipo');



Route::resource('formas-pago', FormasPagoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'formas-pago.index', 'store' => 'formas-pago.store', 'update' => 'formas-pago.update']);

Route::get('FormaTelemark', [FormasPagoController::class, 'FormaTelemark'])->name('FormaTelemark');


Route::resource('clientes', ClienteController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'clientes.index', 'store' => 'clientes.store', 'update' => 'clientes.update']);
Route::get('select-clientes', [ClienteController::class, 'clientesPorCobrarSelect'])->name('select-clientes');

Route::get('bank/accounts/client/{id}', [CuentasBancoController::class, 'index'])->name('getClientBankAccounts');
Route::post('bank/accounts', [CuentasBancoController::class, 'store'])->name('ClientBankAccounts.store');
Route::put('bank/accounts/{id}', [CuentasBancoController::class, 'update'])->name('ClientBankAccounts.update');

Route::resource('numeros-economicos', NumeroEconomicoController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'numeros-economicos.store', 'index' => 'numeros-economicos.index', 'update' => 'numeros-economicos.update']);

Route::get('/paises/{id}', [EstadoController::class, 'buscarPorPais'])
    ->name('estados.byPais');

Route::get('/estados/{id}', [MunicipioController::class, 'buscarPorIdYCheque'])
    ->name('municipio.byEstado');

Route::resource('colonia-rutas', ColoniasController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'colonia-rutas.store', 'index' => 'colonia-rutas.index', 'update' => 'colonia-rutas.update']);

//Ruta para obtener las colonias por municipio y estadoApi DIPOMEX
Route::get('getColoniasPorMunicipioPorEstadoApi', [ColoniasController::class, 'getColoniasPorMunicipioPorEstadoApi'])->name('getColoniasPorMunicipioPorEstadoApi');
//Ruta para Obtener coloniias municipio y su estado por codigo postal 
Route::get('getColoniasMunicipioEstadoPorCodigoPostalApi', [ColoniasController::class, 'getColoniasMunicipioEstadoPorCodigoPostalApi'])->name('getColoniasMunicipioEstadoPorCodigoPostalApi');


//quien
Route::resource('quien-con-quien', QuienConQuienController::class)
    ->only(['store', 'index', 'update', 'destroy', 'desglosadoRutas'])
    ->names(['store' => 'quien-con-quien.store', 'index' => 'quien-con-quien.index', 'update' => 'quien-con-quien.update', 'destroy' => 'quien-con-quien.destroy', 'desglosadoRutas' => 'quien-con-quien.desglosadoRutas']);

Route::resource('origen-pedidos', OrigenPedidoController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'origen-pedidos.store', 'index' => 'origen-pedidos.index', 'update' => 'origen-pedidos.update']);

Route::resource('densidades', DensidadesController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'densidades.store', 'index' => 'densidades.index', 'update' => 'densidades.update']);

Route::resource('colonias', ColoniasController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'colonias.index', 'store' => 'colonias.store', 'update' => 'colonias.update']);

Route::get('/colonias/{id}', [ColoniasController::class, 'buscarPorId'])
    ->name('colonia.byMunicipio');
Route::get('colonia-por-cp/{id}', [ColoniasController::class, 'searchByPostalCode'])->name('colonia-por-cp');

// obtener los municipios por estado  //
Route::post('/buscarPorEstado', [MunicipioController::class, 'buscarPorEstado'])->name('buscarPorEstado');
Route::post('/buscarPorEstadoTelemark', [MunicipioController::class, 'buscarPorEstadoTelemark'])->name('buscarPorEstadoTelemark');
Route::get('/address-info-telemark', [MunicipioController::class, 'addressTelemark'])
    ->name('address-info-telemark');

Route::post('/buscarPorMunicipio', [ColoniasController::class, 'buscarPorMunicipio'])->name('buscarPorMunicipio');

Route::post('/getApiBaseDatosColonias', [ColoniasController::class, 'buscarDetallesPorCodigoPostal'])->name('getApiBaseDatosColonias');


Route::resource('cliente-otra-empresa', ClienteOtraEmpresaController::class)
    ->only(['index', 'store'])
    ->names(['index' => 'cliente-otra-empresa.index', 'store' => 'cliente-otra-empresa.store']);

Route::get('cliente-empresa/{id}', [ClienteOtraEmpresaController::class, 'getByClient'])
    ->name('cliente-empresa-by-client');

Route::resource('correos-clientes', CorreosClienteController::class)
    ->only(['show', 'store', 'update', 'destroy'])
    ->names(['show' => 'correos-clientes.show', 'store' => 'correos-clientes.store', 'update' => 'correos-clientes.update', 'destroy' => 'correos-clientes.destroy']);

Route::resource('tipos-tanques', TipoTanqueController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'tipos-tanques.index', 'store' => 'tipos-tanques.store', 'update' => 'tipos-tanques.update']);

Route::resource('tanques', TanqueController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'tanques.index', 'store' => 'tanques.store', 'update' => 'tanques.update']);
Route::get('tanque-pdf-activo/{id}', [TanqueController::class, 'getTankPDFData'])->name('tanque-pdf-activo');
Route::get('tanque-pdf-cliente/{id}', [TanqueController::class, 'tanquePdfCliente'])->name('tanque-pdf-cliente');


Route::resource('control-vehiculos', ControlVehiculosController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'control-vehiculos.index', 'store' => 'control-vehiculos.store', 'update' => 'control-vehiculos.update']);


Route::resource('reporte-precios', ReportePreciosController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'reporte-precios.index', 'store' => 'reporte-precios.store', 'update' => 'reporte-precios.update', 'show' => 'reporte-precios.show']);

Route::post('filtrado', [ReportePreciosController::class, 'filtrado'])->name('filtrado');


Route::resource('motivo-entrada-salida', MotivoEntradaSalidaController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'motivo-entrada-salida.index', 'store' => 'motivo-entrada-salida.store', 'update' => 'motivo-entrada-salida.update', 'show' => 'motivo-entrada-salida.show']);

Route::post('peticion', [MotivoEntradaSalidaController::class, 'peticion'])->name('Motivo');


Route::post('UpdatePrecio', [PrecioController::class, 'update'])->name('UpdatePrecio');



Route::resource('lista-verificacion', listaVerificacionController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'lista-verificacion.index', 'store' => 'lista-verificacion.store', 'update' => 'lista-verificacion.update', 'show' => 'lista-verificacion.show']);

Route::resource('nivel-gasolina', nivelGasolinaController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'nivel-gasolina.index', 'store' => 'nivel-gasolina.store', 'update' => 'nivel-gasolina.update']);

Route::resource('nivel-carburacion', NivelCarburacionController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'nivel-carburacion.index', 'store' => 'nivel-carburacion.store', 'update' => 'nivel-carburacion.update']);

Route::resource('tipos-valvulas', TipoValvulaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'tipos-valvulas.index', 'store' => 'tipos-valvulas.store', 'update' => 'tipos-valvulas.update']);


Route::get('tipos-valvulas.activas', [TipoValvulaController::class, 'getAvailablesValvesTypes'])->name('tipos-valvulas.activas');
Route::get('tipos-tanques.activos', [TipoTanqueController::class, 'getAvailablesTanksTypes'])->name('tipos-tanques.activos');

Route::resource('tanques-valvulas', TanqueValvulaController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'tanques-valvulas.index', 'store' => 'tanques-valvulas.store', 'update' => 'tanques-valvulas.update', 'show' => 'tanques-valvulas.show']);
/* Route::put('tanques-valvulas-desactivar/{id}', [TanqueValvulaController::class, 'disableAsignedValveInTankValvesListAndValves'])->name('tanques-valvulas.desactivar'); */

Route::resource('valvulas', ValvulaController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'valvulas.index', 'store' => 'valvulas.store', 'update' => 'valvulas.update', 'show' => 'valvulas.show']);
Route::get('valvulas-activas/{id}', [ValvulaController::class, 'availableValvesToTankAsign'])->name('valvulas.activas');
//resources indica las funcionalidades que tendra el controlador el only los metodos que se usaran los names apuntan a las rutas y el metodo que se usara

Route::resource('partes-unidad', PartesUnidadController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'partes-unidad.index', 'store' => 'partes-unidad.store', 'update' => 'partes-unidad.update']);

Route::resource('cliente-sucursal', ClienteSucursalController::class)
    ->only(['store', 'update', 'show'])
    ->names(['store' => 'cliente-sucursal.store', 'update' => 'cliente-sucursal.update', 'show' => 'cliente-sucursal.show']);

Route::resource('asignacion-tanque-por-tipo', AsignacionTanqueController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'asignacion-tanque-por-tipo.index', 'store' => 'asignacion-tanque-por-tipo.store', 'update' => 'asignacion-tanque-por-tipo.update']);

Route::post('asignacion-tanque-por-tipo-pdf', [AsignacionTanqueController::class, 'completeComodatoPDFInfo'])->name('asignacion-tanque-por-tipo-pdf.infoPdf');

Route::resource('proximos-pedidos', ProximosPedidosController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'proximos-pedidos.index', 'store' => 'proximos-pedidos.store', 'update' => 'proximos-pedidos.update']);

Route::post('filtrado-proximos', [ProximosPedidosController::class, 'filterProximosPorTipoServicio'])->name('filtrado-proximos');

Route::resource('cargas-registradas', CargaRegistradaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'cargas-registradas.index', 'store' => 'cargas-registradas.store', 'update' => 'cargas-registradas.update']);

Route::get('cargas-por-registros/{id}', [ProductoController::class, 'getCargaByRegistro'])->name('cargas-por-registros');
Route::get('estados-filtrados', [MunicipioController::class, 'EstadosFiltrados'])->name('estados-filtrados');
Route::get('devuelve-llenos', [CargaRegistradaController::class, 'getDevuelveLlenos'])->name('devuelve-llenos');

Route::post('getZonaEstado', [CedisController::class, 'getZonaEstado'])->name('getZonaEstado');

Route::resource('sat-localidades', LocalidadesController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'sat-localidades.index', 'store' => 'sat-localidades.store', 'update' => 'sat-localidades.update']);
Route::resource('conceptosRevision', ConceptoRevisionController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'conceptosRevision.index', 'store' => 'conceptosRevision.store', 'update' => 'conceptosRevision.update']);


Route::resource('auditoria', SistemasController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'auditoria.index', 'store' => 'auditoria.store', 'update' => 'auditoria.update']);


Route::resource('auditoria-detalles', AuditoriaDetalleController::class)
    ->only(['index', 'show', 'store', 'update'])
    ->names(['index' => 'auditoria-detalles.index', 'show' => 'auditoria-detalles.show', 'store' => 'auditoria-detalles.store', 'update' => 'auditoria-detalles.update']);


Route::resource('articulos', ArticulosController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'articulos.index', 'store' => 'articulos.store', 'update' => 'articulos.update', 'show' => 'articulos.show']);

Route::resource('almacen', AlmacenController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'almacen.index', 'store' => 'almacen.store', 'update' => 'almacen.update', 'show' => 'almacen.show']);

Route::resource('administrar-creditos', AdministrarCreditosController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'administrar-creditos.index', 'store' => 'administrar-creditos.store', 'update' => 'administrar-creditos.update', 'show' => 'administrar-creditos.show']);

Route::get('clientes-por-creditos/{id}', [AdministrarCreditosController::class, 'ClientesByCreditos'])->name('clientes-por-creditos');

Route::resource('venta-encabezado', VentaEncabezadoTienditaController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'venta-encabezado.index', 'store' => 'venta-encabezado.store', 'update' => 'venta-encabezado.update', 'show' => 'venta-encabezado.show']);

Route::post('clientes-compras', [VentaEncabezadoTienditaController::class, 'sumaComprasCliente'])->name('clientes-compras');
Route::post('clientes-creditoslimite', [AdministrarCreditosController::class, 'ClientesByCreditos'])->name('clientes-creditoslimite');
Route::get('credit-status-per-client', [VentaEncabezadoTienditaController::class, 'creditStatusPerClient'])->name('creditStatusPerClient');

Route::resource('venta-detalle', VentaDetalleTienditaController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'venta-detalle.index', 'store' => 'venta-detalle.store', 'update' => 'venta-detalle.update', 'show' => 'venta-detalle.show']);

Route::resource('cortes', CortesController::class)
    ->only(['index', 'store', 'update', 'show'])
    ->names(['index' => 'cortes.index', 'store' => 'cortes.store', 'update' => 'cortes.update', 'show' => 'cortes.show']);

Route::resource('CambioLectura', CambioLecturaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'CambioLectura.index', 'store' => 'CambioLectura.store', 'update' => 'CambioLectura.update']);

Route::resource('compra', CompraController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'compra.index', 'store' => 'compra.store', 'update' => 'compra.update']);

Route::resource('proveedor', ProveedorController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'proveedor.index', 'store' => 'proveedor.store', 'update' => 'proveedor.update']);

Route::resource('proveedor-articulo', ProveedorArticuloController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'proveedor-articulo.index', 'store' => 'proveedor-articulo.store', 'update' => 'proveedor-articulo.update']);

Route::resource('almacen-articulo', AlmacenArticuloController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'almacen-articulo.index', 'store' => 'almacen-articulo.store', 'update' => 'almacen-articulo.update']);

Route::resource('usuario-almacen', UsuarioAlmacenController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'usuario-almacen.index', 'store' => 'usuario-almacen.store', 'update' => 'usuario-almacen.update']);

Route::resource('ajustes', AjusteInventariosController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'ajustes.index', 'store' => 'ajustes.store', 'update' => 'ajustes.update']);

Route::resource('modelo-carro', ModeloMarcasController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'modelo-carro.index', 'store' => 'modelo-carro.store', 'update' => 'modelo-carro.update']);

Route::resource('marca-carros', MarcaCarrosController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'marca-carros.index', 'store' => 'marca-carros.store', 'update' => 'marca-carros.update']);

Route::resource('tipo-vehiculo', TipoVehiculoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'tipo-vehiculo.index', 'store' => 'tipo-vehiculo.store', 'update' => 'tipo-vehiculo.update']);

Route::resource('modelo-vehiculo', ModeloVehiculoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'modelo-vehiculo.index', 'store' => 'modelo-vehiculo.store', 'update' => 'modelo-vehiculo.update']);

Route::resource('pago-cartera', PagosCarteraController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'pago-cartera.index', 'store' => 'pago-cartera.store', 'update' => 'pago-cartera.update']);

Route::resource('pago-detalle', PagosCarteraController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'pago-detalle.index', 'store' => 'pago-detalle.store', 'update' => 'pago-detalle.update']);

Route::resource('banco-empresa-cuenta', CuentasBancoEmpresaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'banco-empresa-cuenta.index', 'store' => 'banco-empresa-cuenta.store', 'update' => 'banco-empresa-cuenta.update']);
    
Route::get('cuentas-banco-by-empresa', [CuentasBancoEmpresaController::class, 'getCuentasByEmpresa'])->name('cuentas-banco-by-empresa');
Route::post('update-cuentas-banco-by-empresa', [CuentasBancoEmpresaController::class, 'updateCuentasByEmpresa'])->name('update-cuentas-banco-by-empresa');

Route::resource('notas-credito', NotasCreditoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'notas-credito.index', 'store' => 'notas-credito.store', 'update' => 'notas-credito.update']);

Route::resource('comparativos', ReporteComparativoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'comparativos.index', 'store' => 'comparativos.store', 'update' => 'comparativos.update']);

//ReporteVendedores
Route::post('vendedoresReporte', [ReporteVendoresController::class, 'filtradoReporteVendedores'])->name('vendedoresReporte');
Route::post('tanquesReporte', [ReporteVendoresController::class, 'Tanques'])->name('tanquesReporte');
Route::post('detalleRemision', [ReporteVendoresController::class, 'detalleRemision'])->name('detalleRemision');
Route::get('LecturaActivada', [CambioLecturaController::class, 'LecturaActivada'])->name('LecturaActivada');

Route::post('control-estacionario', [ControlVehiculosController::class, 'controlEstacionario'])
    ->name('controlEstacionario');

Route::post('control-portail', [ControlVehiculosController::class, 'controlPortatil'])
    ->name('controlPortatil');

Route::post('control-utilitario', [ControlVehiculosController::class, 'controlUtilitario'])
    ->name('controlUtilitario');

Route::get('get-control-visita', [ControlVehiculosController::class, 'getVisitas'])
    ->name('getControlVisita');

Route::post('control-visita', [ControlVehiculosController::class, 'controlVisita'])
    ->name('controlVisita');

Route::post('correoCondiciones', [ControlVehiculosController::class, 'correoCondiciones'])
    ->name('correoCondiciones');



Route::post('detalles-venta', [VentaDetalleTienditaController::class, 'CompraCliente'])->name('detalles-venta');
Route::post('compra-productos', [VentaDetalleTienditaController::class, 'CompraProductos'])->name('compra-productos');
Route::post('reporte-clientes-pdf', [VentaDetalleTienditaController::class, 'reporteClientePDF'])->name('reporte-clientes-pdf');
Route::post('reporte-ventas-total-pdf', [VentaDetalleTienditaController::class, 'reporteVentasTotales'])->name('reporte-ventas-total-pdf');
Route::post('iniciar-corte', [CortesController::class, 'iniciarCorte'])->name('iniciar-corte');
Route::post('finalizar-corte', [CortesController::class, 'finalizarCorte'])->name('finalizar-corte');
Route::post('efectivo-caja', [CortesController::class, 'efectivoCaja'])->name('efectivo-caja');
Route::post('relizar-compra-credito', [CortesController::class, 'realizarCompraCredito'])->name('relizar-compra-credito');
Route::post('arqueo-inv', [AlmacenArticuloController::class, 'ArqueoInv'])->name('arqueo-inv');
Route::post('ajuste-inventarios', [AjusteInventariosController::class, 'AjusteAlmacenXArticulos'])->name('ajuste-inventarios');
Route::post('cortes-almacen', [CortesController::class, 'CorteAlmacen'])->name('cortes-almacen');
Route::post('restar-articulos', [ArticulosController::class, 'restarProductos'])->name('restar-articulos');
Route::get('/sumar-total', [VentaEncabezadoTienditaController::class, 'sumarTotal'])->name('sumar-total');
Route::get('/reporte-cortes-pdf', [CortesController::class, 'reporteCortesPDF'])->name('reporte-cortes-pdf');
Route::post('proveedor-por-articulo', [ProveedorArticuloController::class, 'ProveedoresByArticulos'])->name('proveedor-por-articulo');
Route::post('articulos-prov', [ProveedorArticuloController::class, 'articulosDelProveedor'])->name('articulos-prov');
Route::post('almacen-prov', [ProveedorArticuloController::class, 'almacenProveedor'])->name('almacen-prov');
Route::post('cortes-detalle', [CortesController::class, 'cortesDetalle'])->name('cortes-detalle');
Route::post('rondin-recorrido', [PuntoRecorridoController::class, 'RecorridosByPunto'])->name('rondin-recorrido');
Route::post('departamento-puesto', [PuestoController::class, 'PuestoByDepartamento'])->name('departamento-puesto');
Route::post('punto-seleccionado', [PuntoRondinController::class, 'puntoSelected'])->name('punto-seleccionado');
Route::post('modelo-marca', [ModeloMarcasController::class, 'ModeloByMarca'])->name('modelo-marca');
Route::post('modelo-año', [ModeloMarcasController::class, 'AñoByModelo'])->name('modelo-año');
Route::post('cilindros-año', [ModeloMarcasController::class, 'CilindrosByAño'])->name('cilindros-año');
Route::post('cuenta-cliente', [CuentasBancoController::class, 'cuentaCliente'])->name('cuenta-cliente');
Route::get('usuario-articulos', [UsuarioAlmacenController::class, 'UsuarioAlmacenXArticulos'])->name('usuario-articulos');
Route::post('/numero-cliente', [PagosCarteraController::class, 'numeroCliente'])->name('numero-cliente');
Route::get('/almacen-usuario', [UsuarioAlmacenController::class, 'almacenUsuario'])->name('almacen-usuario');
Route::post('cancelar-factura', [CancelacionFacturasController::class, 'CancelarFactura'])->name('cancelar-factura');
Route::post('obtener-timbres', [EmpresaController::class, 'obtenerTimbres'])->name('obtener-timbres');
Route::post('folio-pago', [CancelarPagosController::class, 'folioPago'])->name('folio-pago');
Route::post('fecha-pago-cliente', [CancelarPagosController::class, 'fechaPagoCliente'])->name('fecha-pago-cliente');
Route::post('cancelar-pago', [CancelarPagosController::class, 'CancelarPago'])->name('cancelar-pago');
Route::post('pagos-timbrados', [TimbradoPagosController::class, 'obtenerPagosTimbrado'])->name('pagos-timbrados');
Route::post('PagosXml', [XMLController::class, 'PagosXml'])->name('PagosXml');
Route::post('NotasCreditoXml', [XMLController::class, 'NotasCreditoXml'])->name('NotasCreditoXml');
Route::post('/factura-cliente', [NotasCreditoController::class, 'facturaCliente'])->name('factura-cliente');
Route::post('/factura-sin-timbrar', [NotasCreditoController::class, 'facturasSinTimbrar'])->name('factura-sin-timbrar');
Route::post('/facturas-timbradas', [NotasCreditoController::class, 'facturasTimbradas'])->name('facturas-timbradas');
Route::post('/clientes-ncr', [NotasCreditoController::class, 'ConsultaClientesNCR'])->name('clientes-ncr');
Route::post('/facturas-ncr', [NotasCreditoController::class, 'ConsultaNCR'])->name('facturas-ncr');
Route::post('/cancelar-ncr', [NotasCreditoController::class, 'CancelarNCR'])->name('cancelar-ncr');
Route::post('index-filter', [listaVerificacionController::class, 'indexFILTER'])->name('index-filter');
Route::post('reporte-pagos', [PagosCarteraController::class, 'reportePagosCliente'])->name('reporte-pagos');
Route::post('Reporte-Factura', [ReporteFacturacionController::class, 'indexreportefacturacion'])->name('Reporte-Factura');

Route::post('reporte-pagos-cancelados', [PagosCarteraController::class, 'reportePagosCanceladosCliente'])->name('reporte-pagos-cancelados');
Route::post('pagos-todos', [PagosCarteraController::class, 'PagosClienteTodos'])->name('pagos-todos');
Route::post('pagos-todos-cancelados', [PagosCarteraController::class, 'PagosClienteTodosCancelados'])->name('pagos-todos-cancelados');

Route::post('reporte-año-cliente', [ReporteComparativoController::class, 'ReporteAñoCliente'])->name('reporte-año-cliente');
Route::post('reporte-mes-cliente', [ReporteComparativoController::class, 'ReporteMesCliente'])->name('reporte-mes-cliente');
Route::post('reporte-mes-unidad', [ReporteComparativoController::class, 'ReporteMesUnidad'])->name('reporte-mes-unidad');
Route::post('reporte-mes-vendedor', [ReporteComparativoController::class, 'ReporteMesVendedor'])->name('reporte-mes-vendedor');
Route::post('reporte-mes-vendedor-estacionario', [ReporteComparativoController::class, 'ReporteMesVendedorEstacionario'])->name('reporte-mes-vendedor-estacionario');
Route::post('reporte-mes-ruta', [ReporteComparativoController::class, 'ReporteMesRuta'])->name('reporte-mes-ruta');
Route::post('reporte-mes-ruta-portatil', [ReporteComparativoController::class, 'ReporteMesRutaPortatil'])->name('reporte-mes-ruta-portatil');

Route::post('ReporteKilometraje', [VigilanciaController::class, 'ReporteKilometraje'])->name('ReporteKilometraje');
Route::post('ReporteCargas', [VigilanciaController::class, 'ReporteCargas'])->name('ReporteCargas');
Route::post('unidadeds-tiposervicio', [UnidadController::class, 'UnidadesByTipoServicio'])->name('unidadeds-tiposervicio');
Route::post('reporte-remisiones', [ReporteRemisionesController::class, 'reporteRemisiones'])->name('reporte-remisiones');


