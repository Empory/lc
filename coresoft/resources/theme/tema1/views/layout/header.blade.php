<header class="header">
    <div class="header__searchbar">
        <div class="container">
            <div class="header__searchbar__container">
                <form action="{{ route('search') }}" method="get">
                    <input class="header__searchbar__container__input" id="search" type="search" required="" name="q"
                        placeholder="{{ trans('index.search') }}" autocomplete="off">
                    <label class="header__searchbar__container__close material-button material-button--icon ripple"
                        for="search"><i class="material-icons">&#xE5CD;</i></label>
                </form>
            </div>
        </div>
    </div>
    <div class="header__appbar header__appbar_top_color">
        <div class="container">
            <div class="header__appbar--left">
                <div class="header__appbar--left__nav visible-mobile">
                    <i class="material-icons">menu</i>
                </div>
                <div class="header__appbar--left__logo">
                    @include('_particles.header.logo')
                </div>
            </div>

            <div class="header__appbar--right hide-mobile">



                {{--<div class="header_sosyal_ikonlar">
                    @if(get_buzzy_config('facebookpage'))
                        <a target="_blank" href="{!! get_buzzy_config('facebookpage') !!}"><i class="fa-brands fa-facebook"></i></a>
                    @endif
                    @if(get_buzzy_config('instagrampage'))
                        <a target="_blank" href="{!! get_buzzy_config('instagrampage') !!}"><i class="fa-brands fa-instagram"></i></a>
                    @endif
                    @if(get_buzzy_config('twitterpage'))
                        <a target="_blank" href="{!! get_buzzy_config('twitterpage') !!}"><i class="fa-brands fa-twitter"></i></a>
                    @endif
                </div>--}}

                <div class="header_hava_durumu">

                    <img src="https://www.mgm.gov.tr/sunum/tahmin-show-2.aspx?m=SAKARYA&basla=1&bitir=3" style="width:240px; height:73px;" alt="Sakarya Hava Durumu" title="Sakarya Hava Durumu" />
                    {{--<a href="#"><img src="{{ asset('assets/images/genel/weather.png') }}" alt="Hava Durumu"></a>--}}
                </div>

                <div class="header_doviz_kurlari">
                    <div id="W5192"></div>
                {{--<a href="#"><img src="{{ asset('assets/images/genel/doviz_logo.png') }}" alt="Döviz Kurları"></a>--}}
                </div>


                @if(get_buzzy_config('whatsapppage'))
                    <div class="header_whatsapp_dis">
                        <div class="header_whatsapp_sol">
                            <div class="header_whatsapp_text">İhbar Hattı</div>
                            <div class="header_whatsapp_numara"><a href="{{ get_buzzy_config('whatsapppage') }}" style="color: #444;">{{ get_buzzy_config('whatsappnumber') }}</a></div>
                        </div>
                        <div class="header_whatsapp_sag">
                            <a href="{{ get_buzzy_config('whatsapppage') }}"><img class="header_whatsapp_icon" src="{{ asset('assets/images/genel/whatsapp.png') }}" alt="Whatsapp"></a>
                        </div>
                    </div>
                @endif
            </div>

           {{-- <div class="header__appbar--right hide-mobile">
                 @include('_particles.header.reaction_icons')
            </div>--}}
        </div>
    </div>
    <div class="header__appbar header__appbar_menu">
        <div class="container">
            <div class="header__appbar--left hide-mobile">
                <div class="header__appbar--left__menu ">
                    @include('_particles.header.menu')
                </div>
            </div>
            <div class="header__appbar--right">
                @include('_particles.header.search')
                <div class="header__appbar--right__notice">
                    @include('_particles.header.create_button')
                </div>
                @include('_particles.header.user')
            </div>
        </div>
    </div>
</header>
@include('layout.header_mobile')
