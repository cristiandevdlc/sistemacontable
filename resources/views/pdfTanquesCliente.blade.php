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
                        <td style="font-size: 16px; width: 50%;">Cantidad de tanques asignados activos y asignados:
                            {{ $tanquesAsignados }}</td>
                        <td style="font-size: 16px; width: 25%; border: none;"></td>
                        <td style="font-size: 16px; width: 25%; border: none;"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            @foreach ($data as $key)
                <table class="mb-10">
                    <tbody>
                        <tr>
                            <th colspan="9" class="headerIndicator">
                                Cliente: {{ $clienteSucursal['cliente']['cliente_nombrecomercial'] }}
                                Sucursal: {{ $clienteSucursal['descripcion'] }}
                            </th>
                        </tr>
                        <tr>
                            <td class="valves">Instalación</td>
                            <td class="valves">Tanque</td>
                            <td class="valves">Tipo de tanque</td>
                            <td class="valves">Marca</td>
                            <td class="valves">Capacidad</td>
                            <td class="valves">Fabricación</td>
                            <td class="valves">Direccion sucursal</td>
                            <td class="valves">Asignador</td>
                            <td class="valves">Autorizador</td>
                        </tr>
                        <tr>
                            <td>{{ $key['fechaAsignacion'] }}</td>
                            <td>{{ $key['tanque']['serie'] }}</td>
                            <td>{{ $key['tanque']['tipo_tanque']['nombre'] }}</td>
                            <td>{{ $key['tanque']['marca'] }}</td>
                            <td>{{ $key['tanque']['capacidad'] }}</td>
                            <td>{{ $key['tanque']['fecha'] }}</td>
                            <td>Calle: {{ $clienteSucursal['calle'] }} Col.
                                {{ $clienteSucursal->colonia[0]->Colonia_Nombre }}, No.
                                {{ $clienteSucursal['numeroExterior'] }},
                                {{ $clienteSucursal->municipio[0]->descripcionMunicipio }},
                                {{ $clienteSucursal->estado[0]->descripcionEstado }}</td>
                            <td>{{ $key['usuario_asignacion']['usuario_nombre'] }}</td>
                            <td>{{ $key['usuario_autorizacion']['usuario_nombre'] }}</td>
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
                        <td style="font-size: 16px; width: 50%; ">Cantidad de tanques asignados activos y asignados:
                            {{ $tanquesAsignados }}</td>
                        <td style="font-size: 16px; width: 50%; ">Cantidad de tanques asignados inactivos:
                            {{ $tanquesDesasignados }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            @foreach ($data as $key)
                <table class="mb-10">
                    <tbody>
                        <tr>
                            <th colspan="11" class="headerIndicator">
                                Cliente: {{ $clienteSucursal['cliente']['cliente_nombrecomercial'] }}
                                Sucursal: {{ $clienteSucursal['descripcion'] }}
                            </th>
                        </tr>
                        <tr>
                            <td class="valves">Estatus</td>
                            <td class="valves">Fecha Instalacion</td>
                            <td class="valves">Tanque</td>
                            <td class="valves">Tipo de tanque</td>
                            <td class="valves">Marca</td>
                            <td class="valves">Capacidad</td>
                            <td class="valves">Fabricación</td>
                            <td class="valves">Direccion sucursal</td>
                            <td class="valves">Asignador</td>
                            <td class="valves">Autorizador</td>
                            <td class="valves">Fecha Desinstalacion</td>
                        </tr>
                        <tr>
                            @if ($key['estatus'] == 1)
                                <td style="background-color: green; color: wheat">Activo</td>
                            @else
                                <td style="background-color: red; color: wheat">Inactivo</td>
                            @endif
                            <td>{{ $key['fechaAsignacion'] }}</td>
                            <td>{{ $key['tanque']['serie'] }}</td>
                            <td>{{ $key['tanque']['tipo_tanque']['nombre'] }}</td>
                            <td>{{ $key['tanque']['marca'] }}</td>
                            <td>{{ $key['tanque']['capacidad'] }}</td>
                            <td>{{ $key['tanque']['fecha'] }}</td>
                            <td>Calle: {{ $clienteSucursal['calle'] }} Col.
                                {{ $clienteSucursal->colonia[0]->Colonia_Nombre }}, No.
                                {{ $clienteSucursal['numeroExterior'] }},
                                {{ $clienteSucursal->municipio[0]->descripcionMunicipio }},
                                {{ $clienteSucursal->estado[0]->descripcionEstado }}</td>
                            <td>{{ $key['usuario_asignacion']['usuario_nombre'] }}</td>
                            <td>{{ $key['usuario_autorizacion']['usuario_nombre'] }}</td>
                            @if ($key['fechaDesinstalacion'] == null)
                                <td>-</td>
                            @else
                                <td>{{ $key['fechaDesinstalacion'] }}</td>
                            @endif
                    </tbody>
                </table>
            @endforeach
        </div>

    </body>
@endif

</html>
