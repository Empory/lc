@extends("app")
@section('header')
@if(get_buzzy_config('p_amp') === 'on')
<link rel="amphtml" href="{{ url('amp') }}">
@endif
@endsection
@section("content")

@handheld
<style>
    .homeslider2Cer {
        display: block;
    }
    .homeslider2Cer .homeslider2Dis {
        width: 100%;
    }
    .homeslider2Cer .homeVideoAlaniDis {
        width: 100%;
    }
    .anasayfa_kose_yazilari_dis .columns4 {
        width: 100% !important;
    }

    .content-timeline__item.content-viral__item.columns4 {
         width: 100%;
         float: left;
    }
    #homeslider1big.owl-theme .owl-next, #homeslider1big.owl-theme .owl-prev, #homeslider2.owl-theme .owl-next, #homeslider2.owl-theme .owl-prev {
        background: #333333ad;
        line-height: 33px;
        width: 30px;
    }

</style>
@endhandheld
<style>.yazarYaziAdi{overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}</style>




<div class="buzz-container">


    <div class="global-container container ">
        @include('_particles.widget.ads', ['position' => 'HeaderBelow', 'width' => '728', 'height' => 'auto'])
    </div>
    {{ show_headline_posts($lastFeaturestop) }}
    <div class="global-container container ">
        @include('_particles.widget.ads', ['position' => 'Homencolfirst', 'width' => 'auto', 'height' => 'auto'])
    </div>
    <div class="global-container container ">
        <div class="full-width">

            <div id="homeslider1big" class="owl-carousel owl-theme">

                @foreach($mainSlides as $key => $item)
                    <div class="item">
                        <a href="{{ $item->post_link }}"><img  data-src="{{ makepreview($item->main_slide_image, 'b', 'posts') }}" class="owl-lazy"  alt="{{ $item->title }}"></a>
                    </div>
                @endforeach

            </div>


            <div id="homeslider1thumbs" class="owl-carousel owl-theme hide-mobile">
                @foreach($mainSlides as $key => $item)
                    <div class="item">
                        <h1>{{ $loop->index + 1 }}</h1>
                    </div>
                @endforeach
            </div>


            @handheld

            @if(count($opinionColumnists) > 0)
            <section class="widthFull anasayfa_one_cikanlar_dis mb-10" style="padding: 4px 0 2px 1px;">
                <div class="anasayfa_son_dakika_banner title">
                    KÖŞE YAZARLARI
                </div>
                <div class="owl-carousel owl-theme" id="yazarlar-slider" style="margin-top: -23px;">
                        @foreach($opinionColumnists as $item)
                            <div class="item yazarlarSlideDis">

                                <img src="{{ makepreview($item->icon , 'b', 'members/avatar') }}" alt="" />

                                <a href="{{ url('haber/'.$item->slug) }}">
                                <header class="yazarlarSlideHeader">
                                    <div class="yazarlarSlideYazarAdi">{{ str_limit($item->name, 55) }}</div>
                                    <div class="yazarlarSlideYaziAdi">{{ str_limit($item->title, 55) }}</div>
                                </header>
                                </a>
                            </div>
                        @endforeach
                </div>
            </section>
            @endif

            @elsehandheld

            @if(count($opinionColumnists) > 0)
            <div class="widthFull anasayfa_kose_yazilari_dis mb-10">
                <div class="title">KÖŞE YAZARLARI</div>
                <div class="container">
                    <div class="row homecolums">

                        @foreach($opinionColumnists as $item)

                            <div class="content-timeline__item content-viral__item columns4 is-active auto_load">
                                <article class="headline__blocks headline__blocks--large ">
                                    <div class="headline__blocks__image"><img src="{{ makepreview($item->icon , 'b', 'members/avatar') }}" alt="{{ $item->name }}"></div>
                                    <a class="headline__blocks__link" href="{{ url('haber/'.$item->slug) }}" title="{{ $item->name }}" ></a>
                                    <header class="headline__blocks__header">
                                        <h2 class="headline__blocks__header__title_1 yazar_adi headline__blocks__header__title--large">{{ str_limit($item->name, 55) }}</h2>
                                        <h2 class="headline__blocks__header__title_1 yazarYaziAdi headline__blocks__header__title--large">{{ str_limit($item->title, 55) }}</h2>

                                    </header>
                                </article>
                            </div>



                        @endforeach


                    </div>
                </div>
            </div>
            @endif

            @endhandheld






            @handheld

            <section class="widthFull mb-10">

                    <section class="row homecolums homeslider2Cer">

                        <div class="homeslider2Dis">

                            <div id="homeslider2" class="owl-carousel owl-theme">
                                @foreach($mainSlides2 as $key => $item)
                                    <div class="item">
                                        <a href="{{ $item->post_link }}"><img data-src="{{ makepreview($item->main_slide_image, 'b', 'posts') }}" class="owl-lazy" alt="{{ $item->title }}"></a>
                                    </div>
                                @endforeach
                            </div>

                            <div id="homeslider2thumbs" class="owl-carousel owl-theme hide-mobile">
                                @foreach($mainSlides2 as $key => $item)
                                    <div class="item"><h1>{{ $loop->index + 1 }}</h1></div>
                                @endforeach
                            </div>

                        </div>


                        <section class="widthFull anasayfa_one_cikanlar_dis mb-10" style="padding: 4px 2px 2px 2px;">
                            <div class="anasayfa_son_dakika_banner title">
                                ÖNE ÇIKAN VİDEOLAR
                            </div>
                            <ol class="sidebar-trend owl-carousel owl-theme" id="home-videolar-slider" style="margin-top: -20px;">
                                @foreach($homeVideos as $item)
                                    <li class="item sidebar-trend__item home_video_item">
                                        <a class="sidebar-trend__item__link" href="{{ $item->post_link }}" title="{{ $item->title }}" >
                                            <figure class="sidebar-trend__item__body">
                                                <img class="sidebar-trend__item__image lazyload" data-src="{{ makepreview($item->thumb, 's', 'posts') }}" alt="{{ $item->title }}" width="350" height="300">
                                                <figcaption class="sidebar-trend__item__caption">
                                                    <div class="sidebar-trend__item--bottom">
                                                        <span class="sidebar-trend__item__icon"><i class="material-icons">&#xE037;</i></span>
                                                        <h3 class="sidebar-trend__item__title">{{ $item->title }}</h3>
                                                    </div>
                                                </figcaption>
                                            </figure>
                                        </a>
                                    </li>
                                @endforeach
                            </ol>
                        </section>


                    </section>


            @elsehandheld

            <div class="widthFull mb-10">
                <div class="container">
                    <div class="row homecolums homeslider2Cer">

                        <div class="homeslider2Dis">

                            <div id="homeslider2" class="owl-carousel owl-theme">
                                @foreach($mainSlides2 as $key => $item)
                                    <div class="item">
                                        <a href="{{ $item->post_link }}"><img data-src="{{ makepreview($item->main_slide_image, 'b', 'posts') }}" class="owl-lazy" alt="{{ $item->title }}"></a>
                                    </div>
                                @endforeach
                            </div>

                            <div id="homeslider2thumbs" class="owl-carousel owl-theme hide-mobile">
                                @foreach($mainSlides2 as $key => $item)
                                    <div class="item"><h1>{{ $loop->index + 1 }}</h1></div>
                                @endforeach
                            </div>

                        </div>



                        <div class="homeVideoAlaniDis">
                            <ol class="sidebar-trend owl-carousel owl-theme" id="home-videolar-slider">
                                @foreach($homeVideos as $item)
                                    <li class="item sidebar-trend__item home_video_item">
                                        <a class="sidebar-trend__item__link" href="{{ $item->post_link }}" title="{{ $item->title }}" >
                                            <figure class="sidebar-trend__item__body">
                                                <img class="sidebar-trend__item__image lazyload" data-src="{{ makepreview($item->thumb, 's', 'posts') }}" alt="{{ $item->title }}" width="350" height="300">
                                                <figcaption class="sidebar-trend__item__caption">
                                                    <div class="sidebar-trend__item--bottom">
                                                        <span class="sidebar-trend__item__icon"><i class="material-icons">&#xE037;</i></span>
                                                        <h3 class="sidebar-trend__item__title">{{ $item->title }}</h3>
                                                    </div>
                                                </figcaption>
                                            </figure>
                                        </a>
                                    </li>
                                @endforeach
                            </ol>
                        </div>


                    </div>
                </div>
            </div>

            @endhandheld




            <div class="widthFull anasayfa_one_cikanlar_dis mb-10">
                <div class="title">ÖNE ÇIKAN HABERLER</div>
                <div class="container">
                    <div class="row homecolums">

                        @foreach($oneCikanlar as $item)

                            <div class="content-timeline__item content-viral__item columns4 is-active auto_load">
                                <article class="headline__blocks headline__blocks--large ">



                                    <div class="headline__blocks__image headline__blocks__image_home "><img src="{{ makepreview($item->thumb, 'b', 'posts') }}" alt="{{ $item->title }}">
                                        <div class="badges">
                                            @if( $item->type=='news')
                                                {{--<div class="badge haber_turu"><i class="fas fa-camera"></i></div>--}}
                                            @elseif( $item->type=='video')
                                                <div class="badge haber_turu"><i class="fa-solid fa-circle-play"></i></div>
                                            @endif
                                        </div>
                                    </div>
                                    <a class="headline__blocks__link" href="{{ $item->post_link }}" title="{{ $item->title }}" ></a>
                                    <header class="headline__blocks__header">
                                        <h2 class="headline__blocks__header__title_1 headline__blocks__header__title--large">{{ str_limit($item->title, 55) }}</h2>

                                    </header>
                                </article>
                            </div>


                        @endforeach


                    </div>
                </div>
            </div>





        </div>




        {{--<div class="sidebar hide-mobile">
            <div class="sidebar--fixed">
                @include('_particles.widget.follow')

                @if(count($lastNews) > 0)
                <div class="colheader formula">
                    <h3 class="header-title">{{ $HomeColSec2Tit1 > "" ? $HomeColSec2Tit1 : trans('index.latest', ['type' => trans('index.news') ]) }}
                    </h3>
                </div>
                <div class="content-timeline__right__list">
                    @include('pages.indexrightpostloadpage')
                </div>
                @endif

                @include('_particles.widget.videos')

                @if(get_buzzy_config('HomeCol3Trends') != '0')
                @include('_particles.widget.trending', ['name'=> trans('index.posts')])
                @endif

                @include('_particles.widget.ads', ['position' => 'Footer', 'width' => '300', 'height' => 'auto'])
            </div>
        </div>--}}


    </div>
</div>
@endsection
