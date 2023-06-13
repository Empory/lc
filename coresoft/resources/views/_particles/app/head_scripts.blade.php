<link
    href="https://fonts.googleapis.com/css?family={{  get_buzzy_theme_config('googlefont', get_buzzy_config('googlefont', 'Roboto')) }}"
    rel='stylesheet' type='text/css' />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
<link type="text/css" rel="stylesheet" href="{{  asset('assets/css/plugins.css?v='.config('buzzy.version'), null, false) }}" />
<link type="text/css" rel="stylesheet" href="{{ asset('assets/css/application'. get_buzzy_rtl_prefix() .'.css?v='.config('buzzy.version')) }}" />

@handheld
<style>
    .footer-menu li {
        width: 50%;
    }
    .footer-right {
        margin-top: 20px;
    }
    .headline {
        padding: 0 15px !important;
    }
    .headline__blocks__header__title--tall {
        font-size: 1.2em;
    }
</style>
@endhandheld




