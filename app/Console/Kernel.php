<?php

namespace App\Console;

use App\Models\Admin\Catalogos\Red;
use App\Models\Admin\Catalogos\Ruta;
use App\Models\Admin\Catalogos\Unidad;
use App\Models\Admin\RH\Persona;
use App\Models\Admin\Ventas\QuienConQuien;
use DateTime;
use DateTimeZone;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Date;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $zonaHorariaMexico = new DateTimeZone('America/Mexico_City');
        // $schedule->command('create:who')
        // ->dailyAt('3:00')
        // // ->cron('* * * * *')
        // ->timezone($zonaHorariaMexico);
        $schedule->command('notify:pending-orders')
            ->dailyAt('20:00')
            // ->everyMinute()
            // ->cron('* * * * *')
            ->timezone($zonaHorariaMexico);
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
