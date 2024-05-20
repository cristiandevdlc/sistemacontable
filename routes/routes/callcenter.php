<?php

use App\Http\Controllers;
use App\Http\Controllers\CallCenterController;
use Illuminate\Support\Facades\Route;

Route::get('/obtenerCallerId', [CallCenterController::class, 'obtenerCallerId'])->name('obtenerCallerId');
Route::get('/detailCall', [CallCenterController::class, 'detailCall'])->name('detailCall');
Route::post('/QualificationCall', [CallCenterController::class, 'QualificationCall'])->name('QualificationCall');
Route::post('/Logeo', [CallCenterController::class, 'Logeo'])->name('Logeo');
Route::post('/estatusllamada', [CallCenterController::class, 'estatusllamada'])->name('estatusllamada');
