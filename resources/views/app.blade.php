<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title inertia> Intergas</title>
  <link rel="icon" href="{{ asset('favicon.ico') }}">
  {{-- <meta http-equiv="Content-Security-Policy" content="default-src 'self' maps.googleapis.com *.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' maps.googleapis.com *.googleapis.com;"> --}}
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/noty@3.2.0-beta/lib/noty.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/noty@3.2.0-beta/lib/noty.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/noty@3.2.0-beta/lib/themes/metroui.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="https://unpkg.com/@googlemaps/js-api-loader/dist/index.min.js"></script>
  <script type="module">
    import {
      initializeApp
    import {
      getMessaging,
      getToken,
      onMessage
    };
    }

    const messaging = getMessaging(app);
    // console.log(messaging)

    //   Notification.requestPermission().then(function(permission) {
    //     return getToken(messaging, {
    //       vapidKey: "BChb16zPmctcOluqjLuyCHFSkNqViEQSIpwyVfnJoYpgtVf9Edt68WAkONAalbx3MjJn92gGwHtvUZ3NWT9euD4"
    //     })
    //   }).then(function(token) {



    //     fetch(url, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvZGFzaGJvYXJkIiwiaWF0IjoxNzAxMTgzMTEwLCJleHAiOjE3MDEyNjk1MTAsIm5iZiI6MTcwMTE4MzExMCwianRpIjoiakpWSm9sRWVmNmVMVWhNZyIsInN1YiI6IjMiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwiY29tcGFueUlkIjo5LCJjb25uZWN0aW9uIjoxfQ.JG7od9VzGk_AEajtEts_HuLAwYKQ9_pGQXz6Chfpp9I'
    //         },
    //         body: JSON.stringify(tokenData),
    //       })
    //       .then((response) => {
    //         if (!response.ok) {
    //           throw new Error(HTTP error! Status: ${response.status});
    //         }
    //         return response.json();
    //       })
    //       .then((data) => {
    //         console.log(data);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });


    //   }).catch(function(err) {
    //     console.log(Token Error :: ${err});
    //   });
    // }


    // messaging.onMessage(function({
    //   data: {
    //     body,
    //     title
    //   }
    // }) {
    //   new Notification(title, {
    //     body
    //   });
    // });
  </script>

  @routes
  @viteReactRefresh
  @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
  @inertiaHead
</head>

<body class="font-sans antialiased">
  @inertia
</body>

</html>