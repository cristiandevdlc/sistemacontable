<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use App\Models\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Config;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class CheckDatabase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si la ruta es de tipo API
        try {
            if ($request->is('api/*')) {
                if (in_array($request->path(), RouteServiceProvider::SKIPPED_ROUTES_DB)) {
                    $connection = Connection::find(Connection::DEFAULT_SERVER);
                } else {
                    $payload = JWTAuth::parseToken()->getPayload();
                    $connection = Connection::find($payload['connection']);
                }
            }

            // Verificar si la ruta es de tipo web
            else {
                $connection = null;
                if ($request->session()->has('connection')) {
                    $id = $request->session()->get('connection');
                    $connection = Connection::find($id);
                    // dd($connection);
                }
                if ($request->connection) {
                    $connection = Connection::find($request->connection);
                    // dd($connection)
                    if (!$connection) {
                        $connection = Connection::where('Servidor', '=', $request->host())->first();
                    }
                    $request->session()->put('connection', $connection['id']);
                }
                // dd($request->session()->has('connection'),$request->connection );
                if (!$request->session()->has('connection') && !$request->connection) {
                    $connection = Connection::where('Servidor', '=', $request->host())->first();

                    if (!$connection) $connection = Connection::find(Connection::DEFAULT_SERVER);
                    $request->session()->put('connection', $connection['id']);
                }
            }

            if (!$connection) $connection = Connection::find(Connection::DEFAULT_SERVER);

            $this->changeDatabaseHost($connection, $request);

            return $next($request);
        } catch (\Throwable $th) {
            if ($request->is('api/*')) {
                return response()->json([
                    'session' => false,
                    'message' => 'Sesion terminada, favor de cerrar sesión'
                ], 599);
            } else {
                return response()->redirectTo('login');
            }
        }
    }

    public function changeDatabaseHost($connection, $request)
    {
        $type = Connection::REMOTE;

        if ($connection['Servidor'] == $request->host()) {
            $type = Connection::LOCAL;
        }
        // dd($type, $connection, $request->host());
        DB::purge('sqlsrv');
        Config::set('database.connections.sqlsrv.database', $connection['database']);
        Config::set('database.connections.sqlsrv.username', $connection['username']);
        Config::set('database.connections.sqlsrv.password', $connection['password']);
        Config::set('database.connections.sqlsrv.port', $connection['port'] ? $connection['port'] : '1433');
        Config::set('database.connections.sqlsrv.host', $type == Connection::REMOTE ? $connection['host'] : $connection['Servidor']);
        DB::reconnect();
        DB::setDefaultConnection('sqlsrv');
    }
}
