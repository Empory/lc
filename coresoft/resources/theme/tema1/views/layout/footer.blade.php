@include('_particles.footer.back-to-top')
<div class="clear"></div>
<footer class="footer-bottom category-dropdown_sec sec_cat3 clearfix clearfix">
    <div class="container">



            <div class="footer-left">
                @include('_particles.footer.menu')
            </div>
            <div class="footer-right">
                @include('_particles.footer.logo')

                {{--footer_social_links--}}
                @php($social_links = collect(config('buzzy.social_links'))->filter(function($item, $provider){
                return get_buzzy_config( $provider.'page') > '';
                })->map(function($item, $provider){
                return array_merge($item, [
                'url' => get_buzzy_config( $provider.'page', $item['url'] ?? ''),
                'follow_text' => get_buzzy_config( $provider.'page_btn_text', $item['follow_text'] ?? ''),
                ]);
                }) )
                @if(count($social_links) > 0)
                        <div class="footer_social_links">
                            @foreach ($social_links as $provider => $item)
                                <a href="{!!  $item['url'] !!}" class="social-{{$provider}}" target="_blank" rel="nofollow">
                                    <img width="26px" src="{{ url($item['icon']) }}" />
                                </a>
                            @endforeach
                        </div>
                @endif
                {{--footer_social_links--}}


            </div>


        {{--@include('_particles.header.language_picker')--}}

       {{-- <div class="footerAlt">
            @include('_particles.footer.copyright')
        </div>--}}

    </div>


    <div class="container copyrightContainer">
        <div class="footerAlt">
            @include('_particles.footer.copyright')
        </div>
    </div>


    <?php if(@$_COOKIE['cookie_accept'] != '1'){ ?>
    <div class="cookie_popup">
        <div class="cookie_popup_cer">
        <div class="cookie_popup_text">Sizlere daha iyi hizmet sunabilmek adına sitemizde <a href="#">çerez</a> konumlandırmaktayız. Kişisel verileriniz, KVKK ve GDPR kapsamında toplanıp işlenir. Detaylı bilgi almak için <a href="#">Veri Politikamızı / Aydınlatma Metnimizi</a> inceleyebilirsiniz. Sitemizi kullanarak, çerezleri kullanmamızı kabul etmiş olacaksınız.</div>

        <div class="cookie_popup_close" onclick="cookie_bant_kaldir();" tabindex="2"> X </div>

        </div>
    </div>
    <?php } ?>





</footer>

@php($checkPopupAds = \App\Widgets::where('type', 'PopupAds')->where('display', 'on')->get())
@if(count($checkPopupAds))
        <?php if(@$_COOKIE['close_popup_ads'] != '1'){ ?>
    <div class="popupReklamDis">
        <div class="popReklamCerceve">
            <i class="fa fa-times popupKapatButonu" aria-hidden="true"></i>
            <div class="popupReklamICerik">
                @include('_particles.widget.ads', ['position' => 'PopupAds', 'width' => 'auto', 'height' => 'auto'])
            </div>
        </div>
    </div>
    <?php } ?>
@endif

<style>
    .whatsappSipDis {
        position: fixed;
        bottom: 5px;
        right: 15px;
        z-index: 5;
    }
</style>


@if(get_buzzy_config('whatsapppage'))
@handheld

<div class="whatsappSipDis">
    <a href="{{ get_buzzy_config('whatsapppage') }}">
        <img width="40px" src="{{ url('').'/assets/images/social_icons/whatsapp.svg' }}">
    </a>
</div>

@endhandheld

@endif
