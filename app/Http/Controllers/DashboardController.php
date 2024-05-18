<?php

namespace App\Http\Controllers;

use App\Models\Admin\Telemark\agentesvsusuarios;
use App\Models\Connection;
use App\Models\Menu;
use App\Models\Roles;
use App\Models\User;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Tymon\JWTAuth\Facades\JWTAuth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {


        $data = [];
        $token = Session::get('token');
        $data['token'] = $token;


        // $tInstance = new Token($token);
        // $payload = JWTAuth::decode($tInstance);
        // dd($token, $payload);
        // $user = auth()->setToken($token)->user();
        // dd($user);
        // $user = JWTAuth::parseToken($token)->authenticate();
        // dd($user);
        // dd(URL::previousPath());
        // return ["AAAAAAA", $request->user()];
        $user = $request->user();
        $data['user'] = $user;
        // $agente = agentesvsusuarios::where('usuarioid', $user->usuario_idUsuario)->first();
        // $rol = Roles::where('roles_id', $user->usuario_idRol)->first();
        // if ($rol) $menu = Menu::where('menu_id', $rol['roles_menuInicio'])->first();

        // dd([
        //     "user" => $user,
        //     "agente" => $agente,
        //     "rol" => $rol,
        //     "menu" => $menu
        // ]);

        // if($agente)
        //     $data['isAgent'] = true;
        if (URL::previousPath() === '/login') {
            if ($rol && $menu)
                $data['menuInicio'] = $menu;
            else {
                $data['menuInicio']['menu_url'] = 'dashboard';
            }
        }

        // $request->header('Authorization',);
        if (str_contains($request->url(), Connection::DEVELOP_ENVIROMENT)) {
            $com = Connection::find(Session::get('connection'));
            $data['localServerInfo'] =  $com['Ciudad'] . ': ' . $com['host'] . ':' . $com['port'];
        }

        // usuario_idRol

        return Inertia::render('Home', $data);
    }
}
