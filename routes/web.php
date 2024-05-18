<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// Route::get('/{path}', function () {
//     return Inertia::render('Home', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::middleware(['authWeb', 'database'])->group(function () {
//     // Route::get('database-configuration', [ConnectionsController::class, 'create']);
//     Route::get('login', [AuthenticatedSessionController::class, 'create'])
//         ->name('login');
//     Route::post('login', [AuthenticatedSessionController::class, 'store']);
// });


// Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
//     ->name('logout')->middleware('auth');

Route::get('/{path}', [DashboardController::class, 'index'])
    // ->middleware(['auth','authWeb', 'database', 'permission'])
    ->where('path', '^(?!login).*')
    ->where('path', '^(?!logout).*')
    ->where('path', '^(?!unities).*')
    ->where('path', '^(?!api).*')
    // ->where('path', '^(?!errors).*')
    ->name('dashboard');



// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// require __DIR__.'/auth.php';
