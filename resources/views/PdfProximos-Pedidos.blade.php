<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabla de Información</title>
    <style>
        body {
            margin: 0;
            /* Eliminar margen por defecto del body */
            position: relative;
            /* Posición relativa para alinear la imagen */
        }

        .titulo {
            text-align: left;
            padding: 10px;
            color: black;
            font-size: 15px;
            margin-top: 50px;
        }

        .imagen {
            margin-left: 85%
        }



        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #E65100;
            color: white;
            /* Cambio de color del texto del encabezado a blanco */
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <h1>INTERGAS DEL NORTE</h1>
    <div class="imagen">
        <img class="imagen-esquina" src="https://www.intergasdelnorte.com/img/logo.png" alt="" width="100"
            height="50">

    </div>

    <div class="tabla-imagen">
        <table>
            <thead>
                <tr>
                    <th>Telefono</th>
                    <th>Nombre</th>
                    <th>Fecha Último Pedido</th>
                    <th>Promedio Consumo</th>
                    <th>Próximo Consumo</th>
                    <th>Calle</th>
                    <th>Colonia</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($Procedimiento as $item)
                    <tr>
                        <td>{{ $item['telefono'] }}</td>
                        <td>{{ $item['Nombre'] }}</td>
                        <td>{{ $item['fechaUltimoPedido'] }}</td>
                        <td>{{ $item['diasPromedioConsumo'] }}%</td>
                        <td>{{ $item['fechaEstimadaProximoConsumo'] }}</td>
                        <td>{{ $item['calle'] }}</td>
                        <td>{{ $item['Colonia_Nombre'] }}</td>

                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

</body>

</html>
