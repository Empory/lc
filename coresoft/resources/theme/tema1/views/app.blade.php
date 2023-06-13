<!doctype html>
<html @include("_particles.app.html_attr")>

<head>
    @include("_particles.app.head_meta_tags")

    @include("_particles.app.head_scripts")
    <link rel="stylesheet" href="{{ asset('assets/theme/tema1/css/style'. get_buzzy_rtl_prefix() .'.css?v='.config('buzzy.version')) }}" />
    <link rel="stylesheet" href="{{ asset('assets/plugins/owlcarousel/owl.carousel.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/plugins/owlcarousel/owl.theme.default.min.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

    @include("style")

    @yield("header")

    @include("_particles.app.head_code")
</head>

<body class="@yield('body_class')">
    @include("layout.header")

    @yield("content")

    @include("layout.footer")

    @include("_particles.app.footer_scripts")

    @yield("footer")

    <script src="{{ asset('assets/plugins/owlcarousel/owl.carousel.min.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/js/all.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


    @handheld
    <script>
        var homeSLiderNav = true;
    </script>
    @elsehandheld
    <script>
        var homeSLiderNav = false;
    </script>
    @endhandheld


    <script>

        function cookie_bant_kaldir(){
            $('.cookie_popup').remove();
            setCookie('cookie_accept', '1', 365);
        }

        function popReklamGizle(){
            $('.popupReklamDis').remove();
            setCookie('close_popup_ads', '1', 1);
        }

        $(".popReklamCerceve").click(function(event){
            $("html").one("click",function() { popReklamGizle(); });
        });
        $(".popupReklamDis").click(function(){ popReklamGizle(); });

        function setCookie(name, value, days, saat = '') {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        $(document).ready(function() {

            var bigimage = $("#homeslider1big");
            var thumbs = $("#homeslider1thumbs");
            //var totalslides = 10;
            var syncedSecondary = true;

            bigimage
                .owlCarousel({
                    lazyLoad: true,
                    items: 1,
                    slideSpeed: 2000,
                    nav: homeSLiderNav,
                    autoplay: true,
                    dots: false,
                    loop: true,
                    responsiveRefreshRate: 200,
                    navText: [
                        '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
                        '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
                    ]
                })
                .on("changed.owl.carousel", syncPosition);

            thumbs
                .on("initialized.owl.carousel", function() {
                    thumbs
                        .find(".owl-item")
                        .eq(0)
                        .addClass("current");
                })
                .owlCarousel({
                    items: 10,
                    dots: false,
                    nav: false,
                    navText: [
                        '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
                        '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
                    ],
                    smartSpeed: 200,
                    slideSpeed: 500,
                    slideBy: 4,
                    responsiveRefreshRate: 100
                })
                .on("changed.owl.carousel", syncPosition2);

            function syncPosition(el) {
                //if loop is set to false, then you have to uncomment the next line
                //var current = el.item.index;

                //to disable loop, comment this block
                var count = el.item.count - 1;
                var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

                if (current < 0) {
                    current = count;
                }
                if (current > count) {
                    current = 0;
                }
                //to this
                thumbs
                    .find(".owl-item")
                    .removeClass("current")
                    .eq(current)
                    .addClass("current");
                var onscreen = thumbs.find(".owl-item.active").length - 1;
                var start = thumbs
                    .find(".owl-item.active")
                    .first()
                    .index();
                var end = thumbs
                    .find(".owl-item.active")
                    .last()
                    .index();

                if (current > end) {
                    thumbs.data("owl.carousel").to(current, 100, true);
                }
                if (current < start) {
                    thumbs.data("owl.carousel").to(current - onscreen, 100, true);
                }
            }

            function syncPosition2(el) {
                if (syncedSecondary) {
                    var number = el.item.index;
                    bigimage.data("owl.carousel").to(number, 100, true);
                }
            }

            thumbs.on("mouseover", ".owl-item", function(e) {
                e.preventDefault();
                var number = $(this).index();
                bigimage.data("owl.carousel").to(number, 300, true);
            });
        });




        var bigimage2 = $("#homeslider2");
        var thumbs2 = $("#homeslider2thumbs");
        //var totalslides = 10;
        var syncedSecondary = true;

        bigimage2
            .owlCarousel({
                lazyLoad: true,
                items: 1,
                slideSpeed: 2000,
                nav: homeSLiderNav,
                autoplay: true,
                dots: false,
                loop: true,
                responsiveRefreshRate: 200,
                navText: [
                    '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
                    '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
                ]
            })
            .on("changed.owl.carousel", syncPosition);

        thumbs2
            .on("initialized.owl.carousel", function() {
                thumbs2
                    .find(".owl-item")
                    .eq(0)
                    .addClass("current");
            })
            .owlCarousel({
                items: 15,
                dots: false,
                nav: false,
                navText: [
                    '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
                    '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
                ],
                smartSpeed: 300,
                slideSpeed: 700,
                slideBy: 4,
                responsiveRefreshRate: 100
            })
            .on("changed.owl.carousel", syncPosition2);

        function syncPosition(el) {
            //if loop is set to false, then you have to uncomment the next line
            //var current = el.item.index;

            //to disable loop, comment this block
            var count = el.item.count - 1;
            var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

            if (current < 0) {
                current = count;
            }
            if (current > count) {
                current = 0;
            }
            //to this
            thumbs2
                .find(".owl-item")
                .removeClass("current")
                .eq(current)
                .addClass("current");
            var onscreen = thumbs2.find(".owl-item.active").length - 1;
            var start = thumbs2
                .find(".owl-item.active")
                .first()
                .index();
            var end = thumbs2
                .find(".owl-item.active")
                .last()
                .index();

            if (current > end) {
                thumbs2.data("owl.carousel").to(current, 100, true);
            }
            if (current < start) {
                thumbs2.data("owl.carousel").to(current - onscreen, 100, true);
            }
        }

        function syncPosition2(el) {
            if (syncedSecondary) {
                var number = el.item.index;
                bigimage2.data("owl.carousel").to(number, 100, true);
            }
        }

        thumbs2.on("mouseover", ".owl-item", function(e) {
            e.preventDefault();
            var number = $(this).index();
            bigimage2.data("owl.carousel").to(number, 300, true);
        });



        $('#yazarlar-slider').owlCarousel({
            lazyLoad: true,
            items: 1,
            slideSpeed: 2000,
            autoplay: false,
            dots: true,
            loop: true,
        });

        $('#home-videolar-slider').owlCarousel({
            lazyLoad: true,
            items: 1,
            slideSpeed: 2000,
            autoplay: false,
            dots: true,
            loop: false,
        })

    </script>

    <script>
    var script = document.createElement("script");
    script.onload = function() {
    //onScriptLoad();
        $(function(){
            typeof $.fn.paraceviriciWidget == "function" &&
            $("#W5192").paraceviriciWidget({
                widget:"boxrow",
                wData:{
                    category:0,
                    currency:"USD-EUR-GBP"
                },
                wSize:{
                    wWidth:250,
                    wHeight:70
                },
                wBase: {
                    rCombine: 0
                },
                wFrame: {
                    wBR: 3
                },
                wContent: {
                    pBuy: 0
                }
            });
        });
        console.log('onScriptLoad', 'onScriptLoad');
    };
    script.onerror = function() {
        console.log('widget.js error')
    //onScriptError();
    };
    script.src = "https://paracevirici.com/servis/widget/widget.js";
    document.head.appendChild(script);
    </script>



    @include("_particles.app.footer_code")
</body>



</html>
