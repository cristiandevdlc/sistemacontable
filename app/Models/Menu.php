<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    use HasFactory;
    public $table = 'menus';
    public $timestamps = false;
    public $primaryKey = 'menu_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'menu_nombre',
        'menu_idPadre',
        'menu_url',
        'menu_tooltip',
        'estatus',
    ];

    // public function scopeParentPermission(Builder $query)
    // {
    //     $query->when
    // }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Roles::class, 'menusxrole', 'menusxrole_idmenu', 'menusxrole_idrole');
    }

    public function menuPadre(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'menu_idPadre', 'menu_id');
    }
    public function childs(): HasMany
    {
        return $this->hasMany(Menu::class, 'menu_idPadre', 'menu_id');
    }
}
