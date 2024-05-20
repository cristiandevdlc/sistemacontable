
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

<div class="grid h-screen px-4 bg-white place-content-center">
    <div class="text-center">
        <img src="{{ asset('img/DSC_5329_@2x.png') }}" style="width: 500px; height: auto;">
      <h1
        class="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl"
      >
        Error 403
      </h1>
  
      <p class="mt-4 text-gray-500">No se tiene permiso para acceder al recurso. <br/> Solicitar permiso al recurso al jefe de departamento o al departamento de sistemas.</p>
    </div>
  </div>

<script>
    setTimeout(function() {
      var appUrl = "{{ env('APP_URL') }}";
      var redirectUrl = '/dashboard';
      window.location = redirectUrl;
    }, 5000);
  </script>
  
  