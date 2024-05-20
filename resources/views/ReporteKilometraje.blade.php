<!DOCTYPE html>
<html>

<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <title>Reporte Kilometraje</title>
    <style>
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
            border: 1px solid rgb(8, 8, 8);
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
            text-align: left;
            border: 1px solid rgb(0, 0, 0);
            /* padding: 2px; */
        }

        .table-header2 th {
            background-color: rgb(255, 255, 255);
            text-align: left;
            border: 1px solid rgb(255, 255, 255);
            border-right: 1px black;
            /* padding: 2px; */
        }

        .columna {
            text-align: right;
        }


        h2 {
            font-size: 10px;
            font-family: 'Arial', sans-serif;
            text-align: left;
        }

        .letracontainer {
            font-size: 13px;
            font-weight: normal;
        }

        .letracontainerbold {
            font-size: 13px;
            font-weight: bold;
        }
    </style>
</head>

<body>

    <section>
        <table style="width:100%; border-collapse: collapse;">
            <tr class="Contenedor-datos">
                <th class="letracontainerbold" style="width: 20%"><img style="width:1.20in;height:0.55in;padding:10px" src="{{ $Datos->Imagen }}" /></th>
                <th class="letracontainer" style="width: 50%">
                    <h2 class="letracontainerbold" style="text-align:center;">FORMATO PARA REPORTE DE KILOMETRAJE EN
                        UNIDAD DE ESTACIONARIO:</h2>
                    <h2 class="letracontainerbold" style="text-align:center;">{{ $Datos->NombreEmpresa }}</h2>
                </th>
                <th class="letracontainerbold" style="width: 30%">
                    <table style="width:100%; border-collapse: collapse;">
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: center;background:white;color:black;">
                                IDENTIFICACION</th>

                        </tr>
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: center;background:white;color:black;font-size:8px">
                                FOR-SP-002-I-COAH-14188</th>
                        </tr>
                    </table>
                    <table>
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: left">REVISION:</th>
                            <th class="letracontainer" style="text-align: right">02</th>
                        </tr>
                        <tr>
                            <td class="letracontainerbold" style="text-align: left">INICIO VIG.</td>
                            <td class="letracontainer" style="text-align: right"> 15/12/2022 </td>
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
                <th class="letracontainerbold">NOMBRE DEL OFICIAL ENCARGADO:</th>
                <th class="letracontainerbold">FECHA:{{ $Datos->Fecha }}</th>
            </tr>
        </table>

        <table style="width:100%;height:78%; border-collapse: collapse;">
            <tr class="table-header">
                <th class="letracontainerbold" style="text-align: center">UNIDAD
                    <table>
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: center;width:20%">ITEM:</th>
                            <th class="letracontainerbold" style="text-align: center;width:80%">NUMERO ECONOMICO:</th>
                        </tr>
                    </table>
                </th>
                <th class="letracontainerbold" style="text-align: center">KILOMETRAJE
                    <table>
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: center;width:50%">INICIAL:</th>
                            <th class="letracontainerbold" style="text-align: center;width:50%">FINAL:</th>
                            <th class="letracontainerbold" style="text-align: center;width:50%">RECORRIDO:</th>
                        </tr>
                    </table>
                </th>

                <th class="letracontainerbold" style="text-align: center">COMBUSTIBLE
                    <table>
                        <tr class="table-header">
                            <th class="letracontainerbold" style="text-align: center;width:50%">INICIAL:</th>
                            <th class="letracontainerbold" style="text-align: center;width:50%">FINAL:</th>
                        </tr>
                    </table>
                </th>

            </tr>
            @foreach ($Conceptos as $item)
            <tr class="table-data">
                <td class="letracontainer" style="text-align: center">
                    <table>
                        <tr class="table-header">
                            <td style="text-align: center;width:20%">{{ $item->ITEM }}</td>
                            <td style="text-align: center;width:80%">{{ $item->unidad_numeroComercial }}</td>
                        </tr>
                    </table>
                </td>
                <td class="letracontainer" style="text-align: center">
                    <table>
                        <tr class="table-header">
                            <td style="text-align: center;width:50%">{{ number_format($item->kiloSalida, 4, '.', ',')  }}</td>
                            <td style="text-align: center;width:50%">{{ number_format($item->kiloEntrada, 4, '.', ',')  }}</td>
                            <td style="text-align: center;width:50%">{{ number_format($item->Kilometros_Recorridos, 4, '.', ',')  }}</td>
                        </tr>
                    </table>
                </td>
                <td class="letracontainer" style="text-align: center">
                    <table>

                        <tr class="table-header">
                            <td style="text-align: center;width:50%">{{ $item->Gasolina_inicial }}</td>
                            <td style="text-align: center;width:50%">{{ $item->Gasolina_Final }}</td>
                        </tr>

                    </table>
                </td>

            </tr>
            @endforeach
        </table>


    </section>

</body>

</html>