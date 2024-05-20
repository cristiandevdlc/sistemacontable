<?php

use App\Http\Controllers\Admin\Catalogos\PuntoRecorridoController;
use App\Http\Controllers\Admin\Catalogos\RecorridoController;
use App\Http\Controllers\admin\Catalogos\RondinController;
use App\Http\Controllers\admin\Catalogos\RondinDetalleController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
// use App\Http\Controllers\CitiesConnectionsController;
use App\Http\Controllers\ConnectionsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Facades\JWTAuth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|git 
*/


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('jwt', function () {
    $users = User::all();

    $users[0]->setCompany(User::DEFAULT_COMPANY);
    $token = JWTAuth::fromUser($users[0]);
    return response()->json([
        "token" => $token
    ]);
});


Route::prefix('')
    ->middleware(['database', 'jwt'])
    ->group(function () {
        require __DIR__ . '/routes/ventas.php';
        require __DIR__ . '/routes/callcenter.php';
        require __DIR__ . '/routes/catalogs.php';
        require __DIR__ . '/routes/telemark.php';
        require __DIR__ . '/routes/rh.php';
        require __DIR__ . '/routes/pdf.php';
        require __DIR__ . '/routes/transporte.php';
        require __DIR__ . '/routes/cartera.php';

        Route::get('user/menus', [UserController::class, 'menus'])->name('user.menus');
        Route::get('user/cambio-empresa/{id}', [UserController::class, 'cambiarEmpresaUsuarios'])->name('user.cambio-empresa');
        Route::get('rolesxmenu', [RolesController::class, 'getAllRolesMenu'])->name('rolesxmenu.index');
        Route::get('rolesxmenu/{id}', [RolesController::class, 'getRolesMenu'])->name('rolesxmenu.show');
        Route::put('rolesxmenu/{id}', [RolesController::class, 'rolesxmenu'])->name('rolesxmenu.update');
        Route::post('rolesxmenu/usersPerRole', [RolesController::class, 'usersPerRole'])->name('rolesxmenu.usersPerRole');
        Route::get('usuarioxmenu/{id}', [UserController::class, 'getUsuarioMenu'])->name('usuarioxmenu.index');
        Route::put('usuarioxmenu/{id}', [UserController::class, 'usuarioxmenu'])->name('usuarioxmenu.update');
    });

Route::post('/login', [AuthenticatedSessionController::class, 'login'])->name('api-login');

Route::post('database-configuration', [ConnectionsController::class, 'store'])
    ->name('databaseConfiguration');
// Route::get('connections', [CitiesConnectionsController::class, 'index'])->name('connections');

// Route::post('rondin-recorrido', [PuntoRecorridoController::class, 'RecorridosByPunto']);
// Route::post('rondin', [RondinController::class, 'store'])->name('rondin');
// Route::post('rondin-detalle', [RondinDetalleController::class, 'store'])->name('rondinDetalle');

Route::prefix('mobile')
    ->middleware(['jwt'])
    ->group(function () {
        Route::post('rondin-recorrido', [PuntoRecorridoController::class, 'RecorridosByPunto']);
        Route::post('rondin', [RondinController::class, 'store']);
        Route::get('rondines', [RondinController::class, 'index']);
        Route::post('rondin-detalle', [RondinDetalleController::class, 'store']);
    });
Route::prefix('mobile')
    ->group(function () {
        Route::get('recorridos', [RecorridoController::class, 'index']);
    });
