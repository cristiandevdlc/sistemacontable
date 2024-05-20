<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
        * {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
        }
        
        @page {
            size: 29.7cm 21cm;
            /* size: 21cm 29.7cm; */
            margin-top: 2px;
            margin-bottom: 0cm;
            orientation: landscape;
            border: 1px solid blue;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        .mb-10 {
            margin-bottom: 2.5rem;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 4px;
            text-align: center;
        }

        th {
            background-color: #FC4C02;
            color: white;
            /* Cambio de color del texto del encabezado a blanco */
        }

        .valves {
            border: 1px solid #ddd;
            color: white;
            text-align: center;
            background-color: #FC4C02;
        }

        tr:nth-child(even) {
            width: 100%;
        }

        .headerIndicator {
            background-color: #2B3F75;
            color: white;
        }
    </style>
</head>

@if ($type == 'active')

    <body>
        <table style="border: none; width: 100%; ">
            <tr style="border: none;">
                <td style=" border: none; text-align: left">
                    {{ $ciudadEmpresa->descripcionMunicipio }}, {{ $estadoEmpresa->descripcionEstado }}.
                    A {{ $fecha }}
                </td>
                <td style="border: none;"></td>
                <td style="border: none;"></td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; font-size: 30px; text-align: left">{{ $empresaNombre }}</td>
                <td style=" border: none;">
                </td>
                <td style="border: none; "></td>
                <p style="text-align: center;">
                    <img style="width: 200px" src="data:image/png;base64, {{ $empresaLogo }}" />
                </p>
                </td>
            </tr>
        </table>
        <div class="mb-10">
            <table>
                <tbody>
                    <tr>
                        <td style="font-size: 16px; width: 50%;">Cantidad de tanques asignados: {{ $tanquesAsignados }}
                        </td>
                        <td style="font-size: 16px; width: 50%;">Cantidad de tanques: {{ count($data) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            @foreach ($data as $key)
                <table class="mb-10">
                    <tbody>
                        <tr>
                            <th colspan="10" class="headerIndicator">Tanque</th>
                        </tr>
                        <tr>
                            <td class="valves">Tipo de Tanque</td>
                            <td class="valves">Precio</td>
                            <td class="valves">Capacidad</td>
                            <td class="valves">Serie</td>
                            <td class="valves">Unidad Medida</td>
                            <td class="valves">Comentarios</td>
                            <td class="valves">Fabricacion</td>
                            <td class="valves">Marca</td>
                            <td class="valves">Asignado</td>
                        </tr>
                        <tr>
                            <td>{{ $key['tipo_tanque']['nombre'] }}</td>
                            <td>{{ $key['precio'] }}</td>
                            <td>{{ $key['capacidad'] }}</td>
                            <td>{{ $key['serie'] }}</td>
                            <td>{{ $key['unidad_medida']['unidadMedida_nombre'] }}</td>
                            <td>{{ $key['ubicacion'] }}</td>
                            <td>{{ $key['fecha'] }}</td>
                            <td>{{ $key['marca'] }}</td>
                            @if (count($key['asignacion_tanque']) != 0)
                                @foreach ($key['asignacion_tanque'] as $asiTank)
                                    @if (array_key_exists('unidad', $asiTank))
                                        <td>{{ $asiTank['unidad']['unidad_numeroComercial'] }}</td>
                                    @endif
                                    @if (array_key_exists('cliente', $asiTank))
                                        <td>{{ $asiTank['cliente']['cliente']['cliente_nombrecomercial'] }}</td>
                                    @endif
                                    @if (array_key_exists('estacion', $asiTank))
                                        <td>{{ $asiTank['estacion']['estacion_nombre'] }}</td>
                                    @endif
                                @endforeach
                            @else
                                <td>---</td>
                            @endif
                        </tr>
                        <th class="headerIndicator" colspan="10">
                            Valvulas
                        </th>
                        <tr>
                            <td class="valves">Tipo de valvula</td>
                            <td class="valves">Nombre</td>
                            <td class="valves">Descripcion</td>
                            <td class="valves">Marca</td>
                            <td class="valves">Modelo</td>
                            <td class="valves">Tiempo de vida</td>
                            <td class="valves">No. Serie</td>
                            <td class="valves">Registro</td>
                            <td class="valves">Fecha valvula</td>
                        </tr>
                        @if (count($key['tanque_valvula']) != 0)
                            @foreach ($key['tanque_valvula'] as $valve)
                                <tr>
                                    <td>{{ $valve['valvula']['tipo_valvula']['nombre'] }}</td>
                                    <td>{{ $valve['valvula']['nombre'] }}</td>
                                    <td>{{ $valve['valvula']['descripcion'] }}</td>
                                    <td>{{ $valve['valvula']['marca'] }}</td>
                                    <td>{{ $valve['valvula']['modelo'] }}</td>
                                    <td>{{ $valve['valvula']['tiempoVida'] }}</td>
                                    <td>{{ $valve['valvula']['numSerie'] }}</td>
                                    <td>{{ $valve['valvula']['fechaRegistro'] }}</td>
                                    <td>{{ $valve['valvula']['fechaValvula'] }}</td>
                                </tr>
                            @endforeach
                        @else
                            <tr>
                                <td colspan="10">El tanque aun no tiene valvulas asignadas.</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            @endforeach
        </div>

    </body>
@else

    <body>
        <table style="border: none; width: 100%; ">
            <tr style="border: none;">
                <td style=" border: none; text-align: left">
                    {{ $ciudadEmpresa->descripcionMunicipio }}, {{ $estadoEmpresa->descripcionEstado }}.
                    A {{ $fecha }}
                </td>
                <td style="border: none;"></td>
                <td style="border: none;"></td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; font-size: 30px; text-align: left">{{ $empresaNombre }}</td>
                <td style=" border: none;">
                </td>
                <td style="border: none; "></td>
                <p style="text-align: center;">
                    <img style="width: 200px" src="data:image/png;base64, {{ $empresaLogo }}" />
                </p>
                </td>
            </tr>
        </table>
        <div class="mb-10">
            <table>
                <tbody>
                    <tr>
                        <td style="font-size: 16px;">Cantidad de tanques: {{ count($data) }}</td>
                        <td style="font-size: 16px;">Cantidad de tanques asignados: {{ $tanquesAsignados }}</td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px;">Cantidad de tanques activos: {{ $tanquesActivos }}</td>
                        <td style="font-size: 16px;">Cantidad de tanques inactivos: {{ $tanquesInactivos }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            @foreach ($data as $key)
                <table class="mb-10">
                    <tbody>
                        <tr>
                            <td colspan="10" class="headerIndicator">Tanque</td>
                        </tr>
                        <tr>
                            <td class="valves">Estatus</td>
                            <td class="valves">Tipo de Tanque</td>
                            <td class="valves">Precio</td>
                            <td class="valves">Capacidad</td>
                            <td class="valves">Serie</td>
                            <td class="valves">Unidad Medida</td>
                            <td class="valves">Comentarios</td>
                            <td class="valves">Fabricacion</td>
                            <td class="valves">Marca</td>
                            <td class="valves">Asignado</td>
                        </tr>
                        <tr>
                            @if ($key['activo'] == 1)
                                <td style="background-color: green; color: wheat">Activo</td>
                            @else
                                <td style="background-color: red; color: wheat">Inactivo</td>
                            @endif
                            <td>{{ $key['tipo_tanque']['nombre'] }}</td>
                            <td>{{ $key['precio'] }}</td>
                            <td>{{ $key['capacidad'] }}</td>
                            <td>{{ $key['serie'] }}</td>
                            <td>{{ $key['unidad_medida']['unidadMedida_nombre'] }}</td>
                            <td>{{ $key['ubicacion'] }}</td>
                            <td>{{ $key['fecha'] }}</td>
                            <td>{{ $key['marca'] }}</td>
                            @foreach ($key['asignacion_tanque'] as $asiTank)
                                @if (array_key_exists('unidad', $asiTank))
                                    <td>{{ $asiTank['unidad']['unidad_numeroComercial'] }}</td>
                                @endif

                                @if (array_key_exists('cliente', $asiTank))
                                    <td>{{ $asiTank['cliente']['cliente']['cliente_nombrecomercial'] }}</td>
                                @endif

                                @if (array_key_exists('estacion', $asiTank))
                                    <td>{{ $asiTank['estacion']['estacion_nombre'] }}</td>
                                @endif
                            @endforeach
                        </tr>
                        <th class="headerIndicator" colspan="10">
                            Valvulas
                        </th>
                        <tr>
                            <td class="valves">Estatus</td>
                            <td class="valves">Tipo de valvula</td>
                            <td class="valves">Nombre</td>
                            <td class="valves">Descripcion</td>
                            <td class="valves">Marca</td>
                            <td class="valves">Modelo</td>
                            <td class="valves">Tiempo de vida</td>
                            <td class="valves">No. Serie</td>
                            <td class="valves">Registro</td>
                            <td class="valves">Fecha valvula</td>
                        </tr>
                        </tr>
                        @if (count($key['tanque_valvula']) > 0)
                            @foreach ($key['tanque_valvula'] as $valve)
                                <tr>
                                    @if ($valve['valvula']['activo'] == 1)
                                        <td style="background-color: green; color: wheat">Activo</td>
                                    @else
                                        <td style="background-color: red; color: wheat">Inactivo</td>
                                    @endif
                                    <td>{{ $valve['valvula']['tipo_valvula']['nombre'] }}</td>
                                    <td>{{ $valve['valvula']['nombre'] }}</td>
                                    <td>{{ $valve['valvula']['descripcion'] }}</td>
                                    <td>{{ $valve['valvula']['marca'] }}</td>
                                    <td>{{ $valve['valvula']['modelo'] }}</td>
                                    <td>{{ $valve['valvula']['tiempoVida'] }}</td>
                                    <td>{{ $valve['valvula']['numSerie'] }}</td>
                                    <td>{{ $valve['valvula']['fechaRegistro'] }}</td>
                                    <td>{{ $valve['valvula']['fechaValvula'] }}</td>
                                </tr>
                            @endforeach
                        @else
                            <tr>
                                <td colspan="10" style="font-size:20px; ">No hay valvulas asignadas a este tanque</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            @endforeach
        </div>
    </body>
@endif

</html>
