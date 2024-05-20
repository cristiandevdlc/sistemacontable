<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ConnectionsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\UserController;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Tymon\JWTAuth\Facades\JWTAuth;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Route::get('/{path}', [RouteController::class, 'route'])->where('path', '.*')
// ->middleware(['auth']);

Route::middleware(['authWeb', 'database'])->group(function () {
    Route::get('database-configuration', [ConnectionsController::class, 'create']);
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});


Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout')->middleware('auth');

Route::get('/{path}', [DashboardController::class, 'index'])
    ->middleware(['auth','authWeb', 'database', 'permission'])
    ->where('path', '^(?!login).*')
    ->where('path', '^(?!logout).*')
    ->where('path', '^(?!unities).*')
    ->where('path', '^(?!api).*')
    // ->where('path', '^(?!errors).*')
    ->name('dashboard');

// Reoute::get('/getMenus', [])


// Route::get('api/user/menus', [UserController::class, 'menus'])->middleware('auth')->name('user.menus');


require __DIR__ . '/auth.php';
