<?php
/*if(@$_GET['dev'] == 'pak'){
    setcookie('dev', 'pak', time() + (86400 * 300), "/");
}

if(@$_GET['dev'] != 'pak'){
    if(@$_COOKIE['dev'] != 'pak'){
        die('::');
    }
}*/

define('MINIMUM_VERSION', '7.4.0');
if (version_compare(PHP_VERSION, MINIMUM_VERSION, '<')) exit('<font size="20">You need at least <font color="red">PHP ' . MINIMUM_VERSION . '</font> to install this application.</font>');
if (!file_exists(__DIR__ . '/../coresoft/.env')) {
    copy(__DIR__ . '/../coresoft/.env.example', __DIR__ . '/../coresoft/.env');
}
/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| our application. We just need to utilize it! We'll simply require it
| into the script here so that we don't have to worry about manual
| loading any of our classes later on. It feels great to relax.
|
*/

require __DIR__ . '/../coresoft/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Turn On The Lights
|--------------------------------------------------------------------------
|
| We need to illuminate PHP development, so let us turn on the lights.
| This bootstraps the framework and gets it ready for use, then it
| will load up this application so that we can run it and send
| the responses back to the browser and delight our users.
|
*/

$app = require_once __DIR__ . '/../coresoft/bootstrap/app.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request
| through the kernel, and send the associated response back to
| the client's browser allowing them to enjoy the creative
| and wonderful application we have prepared for them.
|
*/

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
