const mix = require('laravel-mix');
const webpack = require('webpack');
const RTLCSSPlugin = require('rtlcss-webpack-mix-plugin');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
    output: {},
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new RTLCSSPlugin({
            filename: '[name]-rtl.css'
        })
    ]
})
    .setResourceRoot('/assets/')
    .setPublicPath('public/assets')

    .js(
        [
            'resources/assets/js/buzzy.js',
            'resources/assets/js/buzzy-auth.js',
            'resources/assets/js/buzzy-share.js',
            'resources/assets/js/buzzy-timeline.js',
            'resources/assets/js/buzzy-quizzes.js'
        ],
        'public/assets/js/app.min.js'
    ) // modern, buzzyfeed, viralmag, boxed theme

    .js(
        [
            'resources/assets/js/buzzy.js',
            'resources/assets/js/buzzy-auth.js',
            'resources/assets/js/buzzy-share.js',
            'resources/assets/js/buzzy-timeline.js',
            'resources/assets/js/buzzy-quizzes.js'
        ],
        'public/assets/theme/default/js/app.min.js'
    )

    .js('resources/assets/js/buzzyeditor.js', 'public/assets/js/buzzyeditor.min.js')

    .js('resources/assets/js/buzzy-comments.js', 'public/assets/js/comments.js')

    .js('resources/assets/js/buzzy-messages.js', 'public/assets/js/buzzy-messages.js')

    .extract([
        'jquery',
        'sweetalert',
        'jquery-lazy',
        'jquery-modal',
        'jscroll',
        'nprogress',
        'theia-sticky-sidebar'
    ]);

mix.setResourceRoot('/assets/')
    .setPublicPath('public/assets')
    // gloval plugins css
    .styles(
        [
            'node_modules/nprogress/nprogress.css',
            'node_modules/jquery-modal/jquery.modal.css',
            'node_modules/sweetalert/dist/sweetalert.css',
            //buzzeditor
            'node_modules/air-datepicker/dist/css/datepicker.min.css',
            'node_modules/selectize/dist/css/selectize.default.css'
        ],
        'public/assets/css/plugins.css'
    )

    // application
    .sass('resources/assets/sass/modern.scss', 'public/assets/css/application.css')

    // buzzyfeed theme
    .sass(
        'resources/assets/sass/buzzyfeed.scss',
        'public/assets/theme/buzzyfeed/css/style.css'
    )

    // viralmag theme
    .sass(
        'resources/assets/sass/viralmag.scss',
        'public/assets/theme/viralmag/css/style.css'
    )

    // tema1 theme
    .sass(
        'resources/assets/sass/tema1.scss',
        'public/assets/theme/tema1/css/style.css'
    )

    // boxed theme
    .sass('resources/assets/sass/boxed.scss', 'public/assets/theme/boxed/css/style.css')

    // default theme
    .sass(
        'resources/assets/sass/default.scss',
        'public/assets/theme/default/css/style.css'
    );

mix.setResourceRoot('/assets/')
    .setPublicPath('public/assets')
    // admin
    .sass('resources/assets/sass/admin/admin.scss', 'public/assets/admin/css/admin.css')
    .sass(
        'resources/assets/sass/admin/installer.scss',
        'public/assets/admin/css/installer.css'
    )
    .sass(
        'resources/assets/sass/admin/mailbox.scss',
        'public/assets/admin/css/mailbox.css'
    )
    .sass('resources/assets/sass/admin/menu.scss', 'public/assets/admin/css/menu.css')
    .sass(
        'resources/assets/sass/admin/starting.scss',
        'public/assets/admin/css/starting.css'
    );

// admin scripts
mix.scripts(
    ['resources/assets/adminjs/adminlte.js', 'resources/assets/adminjs/buzzy.js'],
    'public/assets/admin/js/app.js'
);
// admin scripts
mix.scripts(
    'resources/assets/adminjs/buzzymailbox.js',
    'public/assets/admin/js/buzzymailbox.js'
);
mix.scripts(
    'resources/assets/adminjs/dashboard.js',
    'public/assets/admin/js/dashboard.js'
);
mix.scripts(
    'resources/assets/adminjs/datatable.js',
    'public/assets/admin/js/datatable.js'
);
mix.scripts('resources/assets/adminjs/feeds.js', 'public/assets/admin/js/feeds.js');
mix.scripts('resources/assets/adminjs/menus.js', 'public/assets/admin/js/menus.js');
