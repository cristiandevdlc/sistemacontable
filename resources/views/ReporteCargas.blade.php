<!DOCTYPE html>
<html>

<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <title>Reporte Cargas</title>
    <style>
        /* Estilos CSS para el PDF */
        @page {
            margin: 100px 50px;
        }

        body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            border: rgb(0, 0, 0) 2px solid;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-family: 'Arial', sans-serif;
        }

        th,
        td {
            border: 1px solid rgb(0, 0, 0);
            /* padding: 2px; */
            text-align: center;
        }

        .Contenedor-datos th {
            background-color: rgb(255, 255, 255);
            text-align: left;
            border: 1px solid rgb(255, 255, 255);
            padding: 2px;
        }


        .table-header th {
            background-color: rgb(255, 255, 255);
            text-align: center;
            border: 1px solid rgb(0, 0, 0);
            /* padding: 2px; */
        }

        h2 {
            font-size: 10px;
            font-family: 'Arial', sans-serif;
            text-align: left;
        }

        .letracontainer {
            font-size: 10px;
            text-align: center;
            font-weight: normal;
        }

        .letracontainerbold {
            font-size: 10px;
            text-align: center;
            font-weight: bold;
        }

        hr {
            height: 3px;
            width: 100%;

            background-color: black;
        }
    </style>
</head>

<body>
    <section>
        <table style="width:100%; border-collapse: collapse;">
            <tr class="Contenedor-datos">
                <th class="letracontainerbold" style="width: 20%"><img style="width:1.20in;height:0.55in;padding:10px" src="{{ $Datos->Imagen }}" /></th>
                <th class="letracontainer" style="width: 50%">
                    <h2 class="letracontainerbold" style="text-align:center;">FORMATO PARA REPORTE DE CARGAS EN UNIDAD DE ESTACIONARIO:</h2>
                    <h2 class="letracontainerbold" style="text-align:center;">{{ $Datos->NombreEmpresa }}</h2>
                </th>
                <th class="letracontainerbold" style="width: 30%">
                    <table style="width:100%; border-collapse: collapse;">
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: left;background:white;color:black;">IDENTIFICACION: FOR-SP-002-I-COAH-14188</th>
                        </tr>
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: left;background:white;color:black;">REVISION: 02</th>
                        </tr>

                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: left;background:white;color:black;">INICIO VIG: 15/12/2022</th>
                        </tr>
                    </table>
                </th>

            </tr>

        </table>


        <table style="width:100%; border-collapse: collapse;">
            <tr class="table-header">
                <th class="letracontainerbold" style="text-align: center;background:black;color:white;">DEPARTAMENTO DE SEGURIDAD PATRIMONAL</th>
            </tr>
        </table>
        <table style="width:100%; border-collapse: collapse;">
            <tr class="Contenedor-datos">
                <th class="letracontainer"><strong>NOMBRE DEL OFICIAL ENCARGADO:</strong> </th>
                <th class="letracontainer"><strong>FECHA:</strong> {{ $Datos->Fecha }}</th>
            </tr>
        </table>


        <table style="width:100%;height:80%; border-collapse: collapse;">
            <tr class="table-header">
                <th class="letracontainerbold">ITEM</th>
                <th class="letracontainerbold">N° ECONOMICO</th>
                <th class="letracontainerbold">TITULAR</th>
                <th class="letracontainerbold">AYUDANTE</th>
                <th class="letracontainerbold">CARGA</th>
                <th class="letracontainerbold">% INICIAL</th>
                <th class="letracontainerbold">% FINAL </th>
                <th class="letracontainerbold">LECTURA INICIAL</th>
                <th class="letracontainerbold">LECTURA FINAL</th>
                <th class="letracontainerbold">VENTA</th>
            </tr>
            @foreach ($Conceptos as $item)
            <tr class="table-header">
                <td class="letracontainer" style="width:5%">{{ $item->ITEM }}</td>
                <td class="letracontainer" style="width:10%">{{ $item->unidad_numeroComercial }}</td>
                <td class="letracontainer" style="width:25%">{{ $item->Titular }}</td>
                <td class="letracontainer" style="width:25%">{{ $item->Ayudante }}</td>
                <td class="letracontainer" style="width:5%"> {{ number_format($item->carga, 4, '.', ',') }} </td>
                <td class="letracontainer" style="width:5%">{{ $item->porcentaje_inicial }}</td>
                <td class="letracontainer" style="width:5%">{{ $item->Porcentaje_final }}</td>
                <td class="letracontainer" style="width:5%">{{ number_format($item->Salida, 4, '.', ',')  }}</td>
                <td class="letracontainer" style="width:5%">{{ number_format($item->Ingreso, 4, '.', ',') }}</td>
                <td class="letracontainer" style="width:5%">{{ number_format($item->venta, 4, '.', ',')  }}</td>
            </tr>
            @endforeach
        </table>

    </section>

</body>

</html>