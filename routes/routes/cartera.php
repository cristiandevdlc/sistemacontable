<?php

use App\Http\Controllers\Admin\Cartera\AntiguedadClientesXCobrarController;
use App\Http\Controllers\Admin\Cartera\CargosClientesController;
use Illuminate\Support\Facades\Route;

Route::post('reporte-antiguedad-clientesXcobrar', [AntiguedadClientesXCobrarController::class, 'getReporteAntiguedadClientesXCobrar'])
    ->name('reporte-antiguedad-clientesXcobrar');
Route::post('reporte-cargos-clientes', [CargosClientesController::class, 'getReporteCargosCliente'])
    ->name('reporte-cargos-clientes');
