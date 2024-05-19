<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Admin\Catalogos\AsignacionTanque;
use App\Models\admin\Catalogos\UsuarioAlmacen;
use App\Models\Admin\RH\Persona;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuario';
    public $timestamps = false;
    public $primaryKey = 'usuario_idUsuario';
    public $company;
    public $conexion;
    public const DEFAULT_COMPANY = 9;
    public const DEFAULT_CONECTION = 1;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario_nombre',
        'usuario_password',
        'usuario_username',
        'usuario_estatus',
        'usuario_idRol',
        'usuario_idPersona'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'usuario_password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'usuario_password' => 'hashed',
    ];

    function setCompany($company)
    {
        $this->company = $company;
    }

    function getCompany()
    {
        return $this->company;
    }

    function setConexion($conexion)
    {
        $this->conexion = $conexion;
    }

    function getConexion()
    {
        return $this->conexion;
    }

    public function getAuthPassword()
    {
        return $this->usuario_password;
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'companyId' => $this->company,
            'connection' => $this->conexion
        ];
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'usuarioxmenu', 'usuarioxmenu_idusuario', 'usuarioxmenu_idmenu')
            ->withPivot('usuarioxmenu_idusuario', 'usuarioxmenu_idmenu', 'usuarioxmenu_alta', 'usuarioxmenu_consulta', 'usuarioxmenu_especial', 'usuarioxmenu_cambio');
    }

    public function asignacionTanque()
    {
        return $this->hasMany(AsignacionTanque::class, 'idUsuarioAsignacion', 'usuario_idUsuario');
    }

    public function usuarioAlmacenes()
    {
        return $this->hasOne(UsuarioAlmacen::class, 'UsuarioAlmacen_idUsuario', 'usuario_idUsuario');
    }

    public function usuarioPersona()
    {
        return $this->hasOne(Persona::class, 'IdPersona', 'usuario_idPersona');
    }
}
