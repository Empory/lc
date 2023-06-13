<section class="headline visible-phone">
    <div class="anasayfa_son_dakika_banner" style="margin-bottom: -4px;">
        <img src="{{ asset('assets/images/genel/son_dakika.jpg') }}" alt="Son Dakika">
    </div>
    <div class="slider" id="headline-slider" data-pagination="true" data-navigation="false">
        <div class="slider__list">
            @foreach($lastFeaturestop->slice(0,3) as $key => $item)
            <article class="slider__item headline__blocks headline__blocks--phone">
                <div class="headline__blocks__image" style="background-image: url({{ makepreview($item->thumb, 'b', 'posts') }})"></div>
                <a class="headline__blocks__link" href="{{ $item->post_link }}" title="{{ $item->title }}"></a>
                <header class="headline__blocks__header">
                    <h2 class="headline__blocks__header__title  headline__blocks__header__title--tall home_son_dakika_text">{{ $item->title }}</h2>
                </header>
            </article>
            @endforeach
        </div>
    </div>
</section>
