<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
@php
    use Carbon\Carbon;
@endphp

<head>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <style type="text/css">
        @page {
            margin: 0;
            /* Eliminar márgenes */
        }

        body {
            width: 100%;
            height: 100%;
            background-color: rgb(255, 255, 255);
            /* Rotate div */

            -webkit-transform: rotate(270deg);
            -moz-transform: rotate(270deg);
            -o-transform: rotate(270deg);
            -ms-transform: rotate(270deg);
            transform: rotate(270deg);

        }

        table,
        th,
        td {
            border: 1px solid rgb(255, 255, 255);
            border-collapse: collapse;
            font-size: 12px;
            font-family: 'Arial', sans-serif;
        }

        .fila {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            /* padding: 10px; */
            padding-top: 20%;
        }

        .columna {
            flex: 1;
            padding: 10px;
        }

        .logo {
            max-width: 100%;
            height: auto;
        }

        .titulo {
            font-style: normal;
            font-size: 12pt;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            color: #000000;
            text-align: center;
            margin: 0;
        }

        .subtitulo {
            font-style: normal;
            font-weight: normal;
            font-size: 13pt;
            font-family: 'Arial', sans-serif;
            color: #000000;
            text-align: center;
            margin: 0;
            padding-top: 10px;
        }

        .texto-derecha {
            font-style: normal;
            font-weight: normal;
            font-size: 12pt;
            font-family: 'Arial', sans-serif;
            color: #000000;
            text-align: right;
            margin: 0;
        }

        hr {
            margin: 10px 0;
            border: none;
            border-top: 1px solid #000;
        }
    </style>
</head>

<body>

    <div class="fila">
        <div class="columna">
            <img style="position:absolute;width:2.12in;height:0.75in;padding-top:40px"
            src="{{ $data->empresaLogo }}"  />
        </div>
        <div class="columna">
            <br>
            <p class="titulo">{{ $data->empresa->empresa_razonSocial ? $data->empresa->empresa_razonSocial : 'Sin nombre' }}</p>
            <p class="subtitulo">Diario de ventas:</p>
            <p class="subtitulo"> <strong>Del:</strong> {{ $data->fechaInicio->format('d/m/Y') }} <strong>AL: </strong>{{ $data->fechaFin->format('d/m/Y') }}</p>
        </div>

       
        <div class="columna">
            <p class="texto-derecha">Fecha:
                {{ Carbon::now()->format('d/m/Y') }}
            </p>
            <p class="texto-derecha">Hora:
                {{ \Carbon\Carbon::now()->format('h:i:s A') }}
            </p>
        </div>
    </div>

    <hr style="border-color: orange;">
    <hr style="border-color: orange;">


    <table style="width:100%; border-collapse: collapse;">
        <tr>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">FECHA</th>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">FOLIO</th>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">CLIENTE</th>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">TIPO. VENTA</th>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">ESTATUS</th>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">IMPORTE</th>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">IMPUESTO</th>
            <th style="background-color: rgb(255, 255, 255); text-align: center;">TOTAL</th>
        </tr>

        @foreach ($data->resultados as $concepto)
            <tr>
                <td style="text-align: center;">{{ \Carbon\Carbon::parse($concepto['Fecha'])->format('d/m/Y') }}</td> factura_fecha
                <td style="text-align: center;">{{ $concepto['Folio'] }}</td> factura_folio
                <td style="text-align: center;">{{ $concepto['Cliente'] }}</td>
                <td style="text-align: center;">{{ $concepto['Tipo'] }}</td>
                <td style="text-align: center;">
                    @if ($concepto['Estatus'] == 1)
                        ACTIVA
                    @elseif($concepto['Estatus'] == 0)
                        INACTIVA
                    @endif  
                </td>
                <td style="text-align: right;">{{ number_format($concepto['Importe'], 2, '.', ',') }}</td>  
                <td style="text-align: right;"> {{ number_format($concepto['Iva'], 2, '.', ',') }} </td>  
                <td style="text-align: right;">{{ number_format($concepto['Total'], 2, '.', ',') }}</td>
            </tr>
        @endforeach
        <hr style="border-color: rgb(255, 255, 255);">
        <tr>
            <td style="text-align: left;">Total de documentos:   {{$data->totalObjetos}}</td>
            <td style="text-align: left;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: right;">$ {{ number_format($data->totalImporte, 2, '.', ',') }}</td>
            <td style="text-align: right;">$ {{ number_format($data->totalIvaRetencion, 2, '.', ',') }} </td>
            <td style="text-align: right;">$ {{ number_format($data->totalTotal, 2, '.', ',') }}</td>
        </tr>
    </table>

   

</body>

</html>
