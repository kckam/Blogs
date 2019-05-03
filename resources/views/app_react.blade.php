<!DOCTYPE html>
    <html lang="{{ app()->getLocale() }}">
    <head>
    
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height" />
        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="app_env" content="{{ env('APP_ENV') }}">
        <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css">
        <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    </head>
    <body>
        {{-- <div id="welcome_loader" class="loader">
            <span class="text">Loading...</span>
        </div> --}}
        <div id="app">
                
        </div>
      
        <script async src="{{ mix('js/app.js') }}"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </body>
    </html>
   