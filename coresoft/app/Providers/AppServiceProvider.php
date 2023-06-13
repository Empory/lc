<?php

namespace App\Providers;

use App\Managers\ThemeManager;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('recaptcha', 'App\\Validators\\ReCaptcha@validate');
        Schema::defaultStringLength(191);
        Paginator::useBootstrap();

        $theme = get_buzzy_theme();
        app(ThemeManager::class)->init($theme);

        if (env('APP_FORCE_HTTPS') == true) {
            \URL::forceScheme('https');
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerDevProviders();
    }

    private function registerDevProviders()
    {

        if ($this->app->environment() === 'production'){
            // Override the default public_path()
            $this->app->bind('path.public', function () {
                return base_path().'/../public_html'; // Ensure that the path reaches your new document root/public html folder
            });
        };

        if ($this->ideHelperExists()) {
            $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
        }
    }

    private function ideHelperExists()
    {
        return class_exists(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
    }
}
