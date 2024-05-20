<?php

use App\Http\Controllers\Admin\Catalogos\DensidadesController;
use App\Http\Controllers\Admin\Facturacion\FacturacionCarburacionController;
use App\Http\Controllers\Admin\RH\CreditoDescuentoController;
use App\Http\Controllers\Admin\Ventas\CambioLecturaController;
use App\Http\Controllers\Admin\Ventas\CargaAutorizadaController;
use App\Http\Controllers\Admin\Ventas\FacturacionRemisionesController;
use App\Http\Controllers\Admin\Ventas\MantenimientoVentaController;
use App\Http\Controllers\Admin\Ventas\QuienConQuienController;
use App\Http\Controllers\admin\Ventas\ReporteComparativoController;
use App\Http\Controllers\Admin\Ventas\ReporteRemisionesController;
use App\Http\Controllers\Admin\Ventas\VentasPortatilController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\SatController;
use Illuminate\Support\Facades\Route;

Route::resource('quien-con-quien', QuienConQuienController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'quien-con-quien.store', 'index' => 'quien-con-quien.index', 'update' => 'quien-con-quien.update']);

Route::get('quien-by-service/{id}', [QuienConQuienController::class, 'getByService'])->name('quien-con-quien.byService');

Route::resource('cargas-autorizadas', CargaAutorizadaController::class)
    ->only(['store', 'show', 'update', 'index'])
    ->names(['store' => 'carga-autorizada.store', 'show' => 'carga-autorizada.show', 'update' => 'carga-autorizada.update', 'index' => 'carga-autorizada.index']);

Route::post('datos-generales-ventas', [VentasPortatilController::class, 'datosGeneralesVentas'])->name('datos-generales-ventas');
Route::post('DatosAyudantes', [VentasPortatilController::class, 'DatosAyudantes'])->name('DatosAyudantes');
Route::post('remisiones-unidad', [VentasPortatilController::class, 'remisionUnidad'])->name('remisiones.unidad');
Route::post('validar-remision-unidad', [VentasPortatilController::class, 'validarRemisionUnidad'])->name('validar-remision-unidad');

Route::post('get-reporte-remision', [ReporteRemisionesController::class, 'getReporte'])->name('getReporteRemision');


Route::post('venta-estacionario', [VentasPortatilController::class, 'store'])->name('venta-estacionario');
// Route::post('ventasportailEncabezado', [VentasPortatilController::class, 'storeRv'])->name('ventasportailEncabezado');
Route::get('EmpresaRemision', [VentasPortatilController::class, 'EmpresaRemision'])->name('EmpresaRemision');

Route::get('CorreoCorte', [VentasPortatilController::class, 'CorreoCorte'])->name('CorreoCorte');



//------------------------Mantenimiento Ventas------------------------------------------//
Route::post('mantenimientoVenta', [MantenimientoVentaController::class, 'getMantenimientoEstacionario'])->name('mantenimientoVenta');
Route::post('mantenimientoVentaActualizar', [MantenimientoVentaController::class, 'actualizar'])->name('mantenimientoVentaActualizar');

//------------tabla principal------------------------//

Route::post('GetbydVentaEncabezadoVenta', [MantenimientoVentaController::class, 'GetdetalleMantenimientoVenta'])->name('GetbydVentaEncabezadoVenta');
Route::post('cancelarVenta', [MantenimientoVentaController::class, 'cancelarVenta'])->name('cancelarVenta');


//-----------------FacturacionRemisiones---------------------//
Route::post('getFacturacionesRemisiones', [FacturacionRemisionesController::class, 'getFacturacionesRemisiones'])->name('getFacturacionesRemisiones');
Route::post('GenerarArchivos', [SatController::class, 'GenerarArchivos'])->name('GenerarArchivos');
Route::post('GenerarFacturacionCarburacion', [FacturacionCarburacionController::class, 'GenerarFacturacionCarburacion'])->name('GenerarFacturacionCarburacion');


Route::post('FacturacionConsultas', [FacturaController::class, 'FacturacionConsultas'])->name('FacturacionConsultas');
Route::post('XmlVisualizar', [FacturaController::class, 'XmlVisualizar'])->name('XmlVisualizar');
Route::post('getproducts', [FacturacionCarburacionController::class, 'getproducts'])->name('getproducts');
Route::post('ConvertirLitros', [FacturacionCarburacionController::class, 'ConvertirLitros'])->name('ConvertirLitros');




Route::post('BuscarDocumento', [FacturaController::class, 'BuscarDocumento'])->name('BuscarDocumento');
Route::post('DetallesFactura', [FacturaController::class, 'DetallesFactura'])->name('DetallesFactura');
Route::post('EnviarFacturacionEmail', [SatController::class, 'EnviarFacturacionEmail'])->name('EnviarFacturacionEmail');
Route::post('CancelarFactura', [FacturaController::class, 'CancelarFactura'])->name('CancelarFactura');
Route::post('TimbrarFactura', [FacturaController::class, 'TimbrarFactura'])->name('TimbrarFactura');
Route::get('ShowDensidades', [DensidadesController::class, 'ShowDensidades'])->name('ShowDensidades');


Route::post('DiarioVentas', [FacturaController::class, 'DiarioVentas'])->name('DiarioVentas');
Route::post('CorreoFactura', [SatController::class, 'CorreoFactura'])->name('CorreoFactura');
Route::post('GenerarArchivosRemisiones', [FacturacionRemisionesController::class, 'GenerarArchivos'])->name('GenerarArchivosRemisiones');
Route::post('EnvioCorreoUno', [SatController::class, 'EnvioCorreoUno'])->name('EnvioCorreoUno');
















Route::post('FacturacionConsultas', [FacturaController::class, 'FacturacionConsultas'])->name('FacturacionConsultas');
Route::post('XmlVisualizar', [FacturaController::class, 'XmlVisualizar'])->name('XmlVisualizar');
Route::post('getproducts', [FacturacionCarburacionController::class, 'getproducts'])->name('getproducts');

Route::post('BuscarDocumento', [FacturaController::class, 'BuscarDocumento'])->name('BuscarDocumento');
Route::post('DetallesFactura', [FacturaController::class, 'DetallesFactura'])->name('DetallesFactura');
Route::post('EnviarFacturacionEmail', [SatController::class, 'EnviarFacturacionEmail'])->name('EnviarFacturacionEmail');
Route::post('CancelarFactura', [FacturaController::class, 'CancelarFactura'])->name('CancelarFactura');
Route::post('TimbrarFactura', [FacturaController::class, 'TimbrarFactura'])->name('TimbrarFactura');

Route::post('DiarioVentas', [FacturaController::class, 'DiarioVentas'])->name('DiarioVentas');
Route::post('CorreoFactura', [SatController::class, 'CorreoFactura'])->name('CorreoFactura');
Route::post('GenerarArchivosRemisiones', [FacturacionRemisionesController::class, 'GenerarArchivos'])->name('GenerarArchivosRemisiones');
Route::post('EnvioCorreoUno', [SatController::class, 'EnvioCorreoUno'])->name('EnvioCorreoUno');

Route::post('FacturacionDiversos', [FacturacionRemisionesController::class, 'FacturacionDiversos'])->name('FacturacionDiversos');
Route::post('CorreoFacturacion', [FacturacionRemisionesController::class, 'CorreoFacturacion'])->name('CorreoFacturacion');
Route::post('GenerarArchivos', [SatController::class, 'GenerarArchivos'])->name('GenerarArchivos');
Route::resource('solicitud/credito/descuento', CreditoDescuentoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'credito-descuento.index', 'store' => 'credito-descuento.store', 'update' => 'credito-descuento.update']);

Route::post('get/solicitud/credito/descuento', [CreditoDescuentoController::class, 'getFilteredRequest'])->name('credito-descuento.get');
