<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>

<head>

    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            padding-top: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-align: center;
        }

        .image {
            width: 32%;
            height: 35%;
            /* Ajusta el ancho según tus necesidades */
        }

        .rounded-image {
            border-radius: 150%;
            width: 20%;
            position: absolute;
            top: 1.10in;
            left: 1.72in;
            width: 1.20in;
            height: 1.20in;
        }

        .puesto {
            font-weight:
                normal;
            font-size: 9pt;
            color: #000000;
        }


        @font-face {
            font-family: "PUESTO";
            src: url(../fonts/Mustica/MusticaPro-Bold.ttf);
        }
        @font-face {
            font-family: "ID";
            src: url(../fonts/Mustica/MusticaPro-Regular.ttf);
        }

        @font-face {
            font-family: "NAMES";
            src: url(../fonts/Mustica/MusticaPro-Medium);
        }

      

        .custom-div3 {
            font-family: 'PUESTO';
            font-weight: 800;
            font-style: bold;
            text-decoration: none;
            font-size: 15px;
        }

        .custom-divnames {
            /* font-weight: 800;
            font-style: bold; */
            text-align: left;
            font-size: 15px;
            text-align: center
            
        }

        .custom-divid {
            font-family: 'ID';
            /* font-weight: 800;
            font-style: bold; */
            font-size: 15px;
            text-align: center
           
        }

        .custom-divtel {
            font-family: 'ID';
            /* font-weight: 800;
            font-style: bold; */
            font-size: 15px;
            text-align: center;
            color: #e63912;
           
        }

        .custom-divdep {
            font-weight: 800;
            font-style: bold;
            font-size: 10px;
            color: #ffffff;
            text-align: center
           
        }


        
    </style>
</head>

<body>
    <div class="container">
        <img class="image" src="{{ public_path('storage/gafete/gafete1.jpg') }}" />
        <img class="image" src="{{ public_path('storage/gafete/gafete2.jpg') }}" />
        <div style="position: absolute; top: 2.35in; left: 0.90in; width: 3.00in; line-height: 0.15in; text-align:left; font-family: 'PUESTO';  zoom: 0.50;">
            

            <div class="custom-divnames">
                {{ $nombre }}
            </div>
        </div>
        <div style="position: absolute; top: 2.55in; left: 0.88in; width: 3.00in; line-height: 0.10in; text-align:left;">
            <div class="custom-divnames">
                {{ $ap }}     {{ $am }} 
            </div>
        </div>
        <div style="position: absolute; top: 2.85in; left: 0.90in; width: 3.00in; line-height: 0.15in;">

            <div class="custom-div3">
                {{ $puesto }}
            </div>

        </div>
        <div style="position: absolute; top: 3.10in; left: 1.40in; width: 1.80in; line-height: 0.17in;">


            <div class="custom-divid">
                ID: {{ $id }}
            </div>
        </div>

        <div style="position: absolute; top: 2.70in; left: 4.30in; width: 1.80in; line-height: 0.17in;">


            <div class="custom-divtel">
                7333 33 33
            </div>
        </div>

        <div style="position: absolute; top: 0.16in; left: 1.00in; width: 2.80in; line-height: 0.17in;">


            <div class="custom-divdep">
              {{$departamento}}
            </div>
        </div>

        <img class="rounded-image" src="{{ $imagen }}" />
        {{-- <img class="rounded-image" src="{{ public_path('storage/gafete/ri_1.jpeg') }}" /> --}}
    </div>
</body>

</html>
