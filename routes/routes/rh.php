<?php

use App\Http\Controllers\Admin\Catalogos\CedisController;
use App\Http\Controllers\Admin\Catalogos\DepartamentoController;
use App\Http\Controllers\Admin\Catalogos\PuestoController;
use App\Http\Controllers\Admin\RH\CreditoDescuentoController;
use App\Http\Controllers\Admin\RH\DocumentacionController;
use App\Http\Controllers\Admin\RH\DocumentacionEmpleadoController;
use App\Http\Controllers\admin\RH\PeriodicidadController;
use App\Http\Controllers\Admin\RH\PersonaController;
use App\Http\Controllers\Admin\RH\TipoDocumentacionController;
use App\Http\Controllers\Admin\Sat\LocalidadesController;
use App\Http\Controllers\SolicitudCreditoController;
use App\Http\Controllers\SolicitudDescuentoController;
use Illuminate\Support\Facades\Route;

Route::get('/supervisores', [PersonaController::class, 'getSupervisores'])
    ->name('persona.supervisores');

Route::get('/vendedores', [PersonaController::class, 'getVendedores'])
    ->name('persona.vendedores');

Route::get('/vendedoresruta', [PersonaController::class, 'getVendedoresRuta'])
    ->name('persona.vendedoresruta');

Route::get('/tecnicos', [PersonaController::class, 'getTecnicos'])
    ->name('persona.tecnicos');

Route::get('/vendedores-puesto', [PersonaController::class, 'getVendedoresPuesto'])
    ->name('vendedores-puesto');

Route::get('/documentacion-empleado/{id}', [PersonaController::class, 'getDocumentaciones'])
    ->name('documentacion-de-empleado');

Route::resource('cedis', CedisController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'cedis.index', 'store' => 'cedis.store', 'update' => 'cedis.update']);

Route::resource('departamento', DepartamentoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'departamento.index', 'store' => 'departamento.store', 'update' => 'departamento.update']);

Route::resource('puesto', PuestoController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'puesto.index', 'store' => 'puesto.store', 'update' => 'puesto.update']);

Route::resource('tipo-documentacion', TipoDocumentacionController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'tipo-documentacion.store', 'index' => 'tipo-documentacion.index', 'update' => 'tipo-documentacion.update']);

Route::resource('periodicidad', PeriodicidadController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'periodicidad.store', 'index' => 'periodicidad.index', 'update' => 'periodicidad.update']);

Route::resource('documentacion', DocumentacionController::class)
    ->only(['store', 'index', 'update'])
    ->names(['store' => 'documentacion.store', 'index' => 'documentacion.index', 'update' => 'documentacion.update']);

Route::resource('documentacion-empleado', DocumentacionEmpleadoController::class)
    ->only(['store', 'index'])
    ->names(['store' => 'documentacion-empleado.store', 'index' => 'documentacion-empleado.index']);
    
Route::resource('personas', PersonaController::class)
    ->only(['index', 'store', 'update'])
    ->names(['index' => 'personas.index', 'store' => 'personas.store', 'update' => 'personas.update']);
    
Route::get('personas-usuario', [PersonaController::class, 'getUser'])->name('persona.usuario');

Route::get('persona-imagen/{id}', [PersonaController::class, 'getImage'])->name('persona.image');

Route::get('nombre-clientes', [PersonaController::class, 'nombreClientes'])->name('nombreClientes');
Route::get('get-empleados', [PersonaController::class, 'getAllEmployees'])->name('getAllEmployees');

Route::get('periodicidad-activos', [PeriodicidadController::class, 'periodicidadActivos'])->name('periodicidad-activos');
