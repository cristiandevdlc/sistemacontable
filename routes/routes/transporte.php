<?php

use App\Http\Controllers\Admin\Catalogos\ControlVehiculosController;
use App\Http\Controllers\Admin\Catalogos\PuntoRecorridoController;
use App\Http\Controllers\Admin\Transporte\TransporteCartaPorteController;
use App\Http\Controllers\Admin\Transporte\TransporteConfiguracionAutotransporteController;
use App\Http\Controllers\Admin\Transporte\TransporteDestinoController;
use App\Http\Controllers\Admin\Transporte\TransporteOperadoresController;
use App\Http\Controllers\Admin\Transporte\TransporteOperadorUnidadController;
use App\Http\Controllers\Admin\Transporte\TransporteOrigenController;
use App\Http\Controllers\Admin\Transporte\TransporteOrigenDestinoController;
use App\Http\Controllers\VigilanciaController;
use Illuminate\Support\Facades\Route;

Route::resource('transporte-operadores', TransporteOperadoresController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'transporte-operadores.store', 'index' => 'transporte-operadores.index', 'update' => 'transporte-operadores.update']);
Route::get('transporte-operadores-tracto', [TransporteOperadoresController::class, 'fetchOperadoresTracto'])->name('transporte-operadores-tracto');

Route::resource('transporte-destino', TransporteDestinoController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'transporte-destino.store', 'index' => 'transporte-destino.index', 'update' => 'transporte-destino.update']);

Route::resource('transporte-origen', TransporteOrigenController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'transporte-origen.store', 'index' => 'transporte-origen.index', 'update' => 'transporte-origen.update']);

Route::resource('transporte-origen-destino', TransporteOrigenDestinoController::class)
    ->only(['store', 'index', 'update', 'show'])
    ->names(['store' => 'transporte-origen-destino.store', 'index' => 'transporte-origen-destino.index', 'update' => 'transporte-origen-destino.update', 'show' => 'transporte-origen-destino.show']);

Route::resource('operadores-unidad', TransporteOperadorUnidadController::class)
    ->only(['store', 'index', 'update', 'show'])
    ->names(['store' => 'operadores-unidad.store', 'index' => 'operadores-unidad.index', 'update' => 'operadores-unidad.update', 'show' => 'operadores-unidad.show']);
Route::get('operadores-unidad-activo', [TransporteOperadorUnidadController::class, 'getActiveData'])->name('operadores-unidad-activo');

Route::resource('configuracion-autotransporte', TransporteConfiguracionAutotransporteController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'configuracion-autotransporte.store', 'index' => 'configuracion-autotransporte.index', 'update' => 'configuracion-autotransporte.update']);

/* Todos para carta porte */
Route::get('numero-cliente/{id}', [TransporteCartaPorteController::class, 'searchByNoClient'])->name('buscar-por-numerocliente');
Route::get('operadores-activos', [TransporteCartaPorteController::class, 'operadoresActivos'])->name('buscar-por-operadoractivo');
Route::get('folios-tipoc', [TransporteCartaPorteController::class, 'foliosTipoC'])->name('folios-tipoc');
Route::get('ultimo-numero-folio/{id}', [TransporteCartaPorteController::class, 'ultimoNumeroFolio'])->name('ultimo-numero-folio');
Route::get('habilitar-destinos-segun-origen/{id}', [TransporteCartaPorteController::class, 'habilitarDestinosSegunOrigen'])->name('habilitar-destinos-segun-origen');
Route::get('qr-vigilancia-rondin/{id}', [PuntoRecorridoController::class, 'qrRecorrido'])->name('qr-vigilancia-rondin');

Route::post('reporte-vigilancia', [ControlVehiculosController::class, 'reporteVigilancia'])
    ->name('reporte-vigilancia');


Route::post('reporte-portail-kilometraje', [VigilanciaController::class, 'ReporteKilometrajePortatil'])
    ->name('reporte-portail-kilometraje');

Route::post('reporte-portail-cargas', [VigilanciaController::class, 'ReporteCargasPortatil'])
    ->name('reporte-portail-cargas');


Route::post('update-control-vigilanica', [ControlVehiculosController::class, 'updateControlVigilancia'])
    ->name('update-control-vigilanica');

Route::post('update-cargas-vigilanica', [ControlVehiculosController::class, 'updateCargasVigilancia'])
    ->name('update-cargas-vigilanica');
