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
            size: 21cm 29.7cm;
            margin-top: 2px;
            margin-bottom: 0cm;
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

    <div>

        <table class="mb-10">
            <tbody>
                <tr>
                    <td class="headerIndicator">Estatus</td>
                    <td class="headerIndicator">Usuario</td>
                    <td class="headerIndicator">Limite Inferior</td>
                    <td class="headerIndicator">Limite Superior</td>
                    <td class="headerIndicator">Cuota Fija</td>
                    <td class="headerIndicator">Porcentaje</td>
                    <td class="headerIndicator">Fecha</td>
                </tr>
                @foreach ($data as $key)
                    <tr>
                        @if ($key['Estatus'] == 1)
                            <td style="background-color: green; color: wheat">Activo</td>
                        @else
                            <td style="background-color: red; color: wheat">Inactivo</td>
                        @endif
                        <td>{{ $key['usuarios']['usuario_nombre'] }}</td>
                        <td>{{ $key['LimiteInferior'] }}</td>
                        <td>{{ $key['LimiteSuperior'] }}</td>
                        <td>{{ $key['CuotaFija'] }}</td>
                        <td>{{ $key['Porcentaje'] }}</td>
                        <td>{{ $key['FechaRegistro'] }}</td>
                    </tr>
                @endforeach

            </tbody>
        </table>
    </div>
</body>

</html>
