@if(count($lastFeaturestop)>0)
<section class="headline-style-1 hide-phone">
    <div class="global-container container">
        @foreach($lastFeaturestop->slice(0,3) as $key => $item)


        <article class="headline__blocks headline__blocks--triple">

            <div class="anasayfa_son_dakika_banner">
                <img src="{{ asset('assets/images/genel/son_dakika.jpg') }}" alt="Son Dakika">
            </div>


            <div class="headline__blocks__image" style="background-image: url({{ makepreview($item->thumb, 'b', 'posts') }})"></div>

            <a class="headline__blocks__link" href="{{ $item->post_link }}" title="{{ $item->title }}"></a>
            <header class="headline__blocks__header">
                <h2 class="headline__blocks__header__title  headline__blocks__header__title--tall home_son_dakika_text">{{ $item->title }}</h2>
            </header>
        </article>
        @endforeach
        <div class="clear"></div>
    </div>
</section>
@include('_particles.grid.mobile')
@endif
