(function($) {
    "use strict";

    // Windows load

    $(window).on("load", function() {

        // Site loader 

        $(".loader-inner").fadeOut();
        $(".loader").delay(200).fadeOut("slow");

    });


    // Scroll to

    $('a.scroll').smoothScroll({
        speed: 800,
        offset: -60
    });



    // Site navigation setup

    var header = $('.header'),
        pos = header.offset(),
        blockTop = $('.block-top');

    $(window).scroll(function() {
        if ($(this).scrollTop() > pos.top + 500 && header.hasClass('default')) {
            header.fadeOut('fast', function() {
                $(this).removeClass('default').addClass('switched-header').fadeIn(200);
                blockTop.addClass('active');
            });
        } else if ($(this).scrollTop() <= pos.top + 500 && header.hasClass('switched-header')) {
            header.fadeOut('fast', function() {
                $(this).removeClass('switched-header').addClass('default').fadeIn(100);
                blockTop.removeClass('active');
            });
        }
    });




    //Hero resize


    var mainHero = $(" .hero .main-slider .slides li");
    function mainHeroResize() {
        mainHero.css('height', $(window).height());
    }

    $(function() {
            mainHeroResize()
        }),
        $(window).resize(function() {
            mainHeroResize()
        });




    // Slider

    $('.main-slider').flexslider({
        animation: "fade",
        slideshow: true,
        directionNav: false,
        controlNav: true,
        pauseOnAction: false,
        animationSpeed: 1000
    });


    $('.review-slider').flexslider({
        animation: "slide",
        slideshow: true,
        directionNav: true,
        controlNav: false,
        pauseOnAction: false,
        animationSpeed: 500
    });




    // Mobile menu

    var mobileBtn = $('.mobile-but');
    var nav = $('.main-nav ul');
    var navHeight = nav.height();

    $(mobileBtn).on("click", function() {
        $(".toggle-mobile-but").toggleClass("active");
        nav.slideToggle();
        $('.main-nav li a').addClass('mobile');
        return false;


    });

    $(window).resize(function() {
        var w = $(window).width();
        if (w > 320 && nav.is(':hidden')) {
            nav.removeAttr('style');
            $('.main-nav li a').removeClass('mobile');
        }

    });

    $('.main-nav li a').on("click", function() {
        if ($(this).hasClass('mobile')) {
            nav.slideToggle();
            $(".toggle-mobile-but").toggleClass("active");
        }

    });



    // Append images as css background

    $('.background-img').each(function() {
        var path = $(this).children('img').attr('src');
        $(this).css('background-image', 'url("' + path + '")').css('background-position', 'initial');
    });


    // Count down setup

    $('.countdown').countdown('2018/6/20', function(event) {
        $(this).html(event.strftime('%D days %H:%M:%S'));
    });




    //Twitter setup

    var config = {
        "id": '347821849301897217',
        "domId": 'tweets',
        "maxTweets": 3,
        "showRetweet": false,
        "showImages": false,
        "showUser": true,
        "showTime": true,
        "customCallback": handleTweets
    };

    function handleTweets(tweets) {
        var x = tweets.length;
        var n = 0;
        var element = $('.tweets');
        var listOfTweets = $('<ul>').addClass("slides");
        while (n < x) {
            var thisTweet = $('<li>');
            thisTweet.html(tweets[n]);
            listOfTweets.append(thisTweet);
            n++;
        }
        element.html(listOfTweets);
        $('.tweets').flexslider({
            animation: 'slide',
            controlNav: true,
            directionNav: false
        });
        return listOfTweets;
    }
    
    try {
        twitterFetcher.fetch(config);
    } catch (error) {
        console.warn("twitterFetcher no está disponible. Continuando sin él.");
    }

    // Tabbed content 

    $(".block-tabs li").on("click", function() {
        if (!$(this).hasClass("active")) {
            var tabNum = $(this).index();
            var nthChild = tabNum + 1;
            $(".block-tabs li.active").removeClass("active");
            $(this).addClass("active");
            $(".block-tab li.active").removeClass("active");
            $(".block-tab li:nth-child(" + nthChild + ")").addClass("active");

        }
    });


    // Track list player 

    var playlist = $('.album');
    var a = audiojs.create(playlist, {
        trackEnded: function() {
            var next = $('.playlist li.playing').next();
            if (!next.length) next = $('.playlist li').first();
            next.addClass('playing').siblings().removeClass('playing');
            audio1.load($('.as-link', next).attr('data-src'));
            audio1.play();
        }
    });

    var audio = a[0];
    var first = $('.playlist li .as-link').attr('data-src');
    $('.playlist li ').first().addClass('pause');
    audio.load(first);




    $('.playlist li').on('click', function() {
        if ($(this).attr('class') == 'playing') {
            $(this).addClass('pause');
            audio.playPause();
        } else {

            $(this).addClass('playing').removeClass('pause').siblings().removeClass('playing').removeClass('pause');
            audio.load($('.as-link', this).attr('data-src'));
            audio.play();
        }

        return false;

    });


    $('.toggle-lyrics').on('click', function() {
        $(this).closest('.playlist li').find('.block-lyrics').slideToggle();
        $(this).toggleClass('selected');
        return false;
    });


    // Audio Progress Bar

    document.addEventListener("DOMContentLoaded", function () {
        const audioPlayer = document.querySelector("audio.album"); // Reproductor principal
        const tracks = document.querySelectorAll(".as-link"); // Lista de canciones
    
        let currentProgressBar = null;
    
        tracks.forEach(track => {
            track.addEventListener("click", function () {
                const src = this.getAttribute("data-src");
                const progressBar = this.querySelector(".progress-bar");
    
                if (audioPlayer.src !== src) {
                    audioPlayer.src = src;
                    audioPlayer.load(); // Asegura que el audio se cargue completamente
                    audioPlayer.play();
                    currentProgressBar = progressBar;
                    requestAnimationFrame(updateProgress); // Asegura que la barra comience a actualizarse inmediatamente
                } else {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                        requestAnimationFrame(updateProgress); // Asegura que la barra comience a actualizarse al presionar play
                    } else {
                        audioPlayer.pause();
                    }
                }
            });
        });
    
        audioPlayer.addEventListener("play", function () {
            if (currentProgressBar) {
                requestAnimationFrame(updateProgress);
            }
        });
    
        function updateProgress() {
            if (currentProgressBar) {
                const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                currentProgressBar.value = percentage;
                if (!audioPlayer.paused && !audioPlayer.ended) {
                    requestAnimationFrame(updateProgress);
                }
            }
        }
    
        audioPlayer.addEventListener("ended", function () {
            if (currentProgressBar) {
                currentProgressBar.value = 0; // Reiniciar la barra cuando termina la canción
            }
        });
    
        document.querySelectorAll(".progress-bar").forEach(progressBar => {
            progressBar.addEventListener("click", function (event) {
                if (audioPlayer.src) {
                    const rect = progressBar.getBoundingClientRect();
                    const clickX = event.clientX - rect.left;
                    const newTime = (clickX / rect.width) * audioPlayer.duration;
                    audioPlayer.currentTime = newTime;
                    requestAnimationFrame(updateProgress); // Asegura que la barra se actualice al hacer clic
                }
            });
        });
    });   

    //Popup elements


    $('.popup-image').magnificPopup({
        type: 'image',
        fixedContentPos: false,
        fixedBgPos: false,
        mainClass: 'mfp-no-margins mfp-with-zoom',
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 300
        }
    });


    $('.popup-youtube, .popup-vimeo').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false
    });




    //Search form setup

    var btn = $('.main-nav li span.search-ico');
    var searchForm = {

        container: $('.block-search-form'),


        config: {
            effect: 'slideToggle',
            speed: '300'
        },

        init: function(config) {

            $.extend(this.config, config);
            btn.on('click', this.show);

        },

        show: function() {


            var sf = searchForm,
                container = sf.container,
                config = sf.config;

            if (container.is(':hidden')) {

                searchForm.close.call(container);
                searchForm.container[config.effect](config.speed);

            }
        },

        close: function() {

            var $this = $(this);

            if ($this.find('span.search-close').length) return;

            document.onkeydown = function(e) {
                e = e || window.event;
                if (e.keyCode == 27) {

                    $this[searchForm.config.effect](searchForm.config.effect.speed);
                }
            };

            $('<span class=close-search></span>')
                .prependTo($this)
                .on('click', function() {
                    $this[searchForm.config.effect](searchForm.config.effect.speed);
                })
        }
    };

    searchForm.init({
        effect: 'fadeToggle',
        speed: '300'
    });


})(jQuery);