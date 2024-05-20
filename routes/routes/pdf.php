<?php


//CONTROLLER NOMINA
use App\Http\Controllers\PDFControllerNomina;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\SatController;

use Illuminate\Support\Facades\Route;

//ruta pdf nomina
Route::post('/generate-solicitud-nomina', [PDFController::class, 'generarSolicitudNomina'])->name('solicitud-nomina');
Route::post('/generate-gafete', [PDFController::class, 'generateGAFETE'])->name('generar-gafete');
Route::post('/generate-contrato', [PDFController::class, 'generateContratoPDF'])->name('generar-contrato');
Route::post('generate-contrato-de-comodato', [PDFController::class, 'generateContratoDeComodatoPDF'])->name('generate-contrato-de-comodato');

Route::post('generatePDFProximos', [PDFController::class, 'generateProximosPedidosPDF'])->name('generatePDFProximos');
Route::post('/generate-tank-active', [PDFController::class, 'generateTankActive'])->name('generate-tank-active');
Route::post('/generate-tank-client', [PDFController::class, 'generateClientTank'])->name('generate-tank-client');
Route::post('/generate-isr', [PDFController::class, 'generateISR'])->name('generate-irs');
Route::post('/generateVentasPDF', [PDFController::class, 'generateVentasPDF'])->name('generateVentasPDF');
Route::post('/generateVentasEstacionarioPDF', [PDFController::class, 'generateVentasEstacionarioPDF'])->name('generateVentasEstacionarioPDF');
Route::post('/CorteGeneral', [PDFController::class, 'CorteGeneral'])->name('CorteGeneral');
Route::post('/generatePdf', [PDFController::class, 'generatePdf'])->name('generatePdf');


Route::post('/CorteDia', [PDFController::class, 'CorteDia'])->name('CorteDia');
Route::get('/Facturacion', [SatController::class, 'Facturacion'])->name('Facturacion');
Route::post('/generarYEnviarXML', [SatController::class, 'generarYEnviarXML'])->name('generarYEnviarXML');









