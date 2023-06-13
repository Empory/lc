@extends("app")

@section('head_title', $page->title .' | '.get_buzzy_config('sitename') )
@section('body_class', "single-page")
@section("content")
<div class="buzz-container page-container">
    <div class="global-container container">
        @if($page->full_page == 0)
                <div class="content">
                    <div class="content-title"><h1>{{ $page->title }}</h1></div>

        @else

                <style>#secimIframe .content-box, .secimIframe .content-page{
                        max-width: 100% !important;
                        min-width: 100% !important;
                    }
                    #secimIframe .divlogo{
                        display: none !important;
                    }
                </style>
                <div class="global-container container" style="margin-top: -15px">
                    @handheld
                    <div class="content-title"><h1 style="font-size: 1em;text-align: center;">{{ $page->title }}</h1></div>
                    @elsehandheld
                    <div class="content-title"><h1 style="font-size: 1.5em;text-align: center;">{{ $page->title }}</h1></div>
                    @endhandheld

        @endif

            <div class="content-body clearfix">
                <div class="content-body__detail">
                    {!! $page->text  !!}
                </div>
            </div>
        </div>

        @if($page->full_page == 0)
        <div class="sidebar hide-mobile">
            @include('_particles.widget.ads', ['position' => 'PostPageSidebar', 'width' => '300', 'height' => 'auto'])

            @include('_particles.widget.follow')
        </div>
        @endif
    </div>
</div>


    @if($page->full_page == 1)
    <script>



        const iframe = document.getElementById('secimIframe');
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const myElement = iframeDoc.querySelector('div.content-box');
        const divlogo = iframeDoc.querySelector('div.divlogo');

        myElement.style.minWidth = '100%';
        myElement.style.maxWidth = '100%';
        divlogo.style.display = 'none';

    </script>
@endif
@endsection
