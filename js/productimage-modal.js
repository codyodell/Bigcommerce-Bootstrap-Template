$().ready( function(){

    parentSlideNumber = $("#product-image-modal").data('bs.modal').options.parentSlideNumber || 0;

    config.carousel.product_modal = {
        selector: '#product-image-carousel-modal',
        nav: '#carousel-thumbnails-modal',
        controls: '#product-image-carousel-modal nav',
        slides: '.carousel-inner',
        images: ThumbURLs,
        descriptions: ImageDescriptions,
        thumbnail_selector: '#product-modal-thumbnail-',
        index: parentSlideNumber,
        interval: false
    };

    config.imagezoom.elevate_zoom_modal = {
        cursor: 'pointer',
        gallery: 'product-image-gallery-modal',
        galleryActiveClass: 'active',
        scrollZoom: true,
        easing: true,
        zoomType: 'inner'
    };

    BigCommerceProductModalCarousel();
});

function BigCommerceProductModalCarousel(){

    $('.total-modal-images', config.carousel.product_modal.controls).text(config.carousel.product_modal.images.length);

    console.log( $('#product-image-modal').data('bs.carousel') );

    $(config.carousel.product_modal.images).each( function(index, value){

        var slideImage = $('<img />').attr({

                src: value,
                alt: config.carousel.product_modal.descriptions[index],
                'data-image': value,
                'data-zoom-image': value,
                id: config.carousel.product_modal.thumbnail_selector.replace('#', '') + index
            });

        $(config.carousel.product_modal.thumbnail_selector + index ).imagesLoaded( function (){

            $(config.carousel.product_modal.thumbnail_selector + index).show();
        });

        $(config.carousel.product_modal.slides, config.carousel.product_modal.selector).append( 

            $('<li />').addClass('item').attr({

                'data-image': value,
                'data-zoom-image': value
            }).html( slideImage )
        );
    });

    // Initialize image zoom on current image
    $(config.carousel.product_modal.thumbnail_selector + parentSlideNumber).elevateZoom( 

        config.imagezoom.elevate_zoom_modal 
    );

    $('li:eq(' + parentSlideNumber + ')', config.carousel.product_modal.slides).addClass('active');
    $('li:eq(' + parentSlideNumber + ')', config.carousel.product_modal.nav).addClass('active');

    $('li', config.carousel.product_modal.nav).each( function(){

        $(this).attr({

            'data-slide-to': $(this).index(),
            'data-target': config.carousel.product_modal.selector
        });
    });

    $(config.carousel.product_modal.selector).carousel({

        pause: true,
        interval: config.carousel.product_modal.interval
    }).on('slide.bs.carousel', function (e) {
        
        var nextH = $(e.relatedTarget).height();
        console.log(nextH)
        console.log( $(this).find('.active.item').parent() )
        $(this).find('.active.item').parent().animate({
            height: nextH
        }, 500);
    }).carousel(parentSlideNumber);

    $('li', config.carousel.product_modal.nav).on('click', function(e){

        setActiveModalThumbnail( $(this).index() );
    });
    
    $(config.carousel.product_modal.selector).on('slid.bs.carousel', function (e) {
        
        setActiveModalThumbnail( $('.item.active', config.carousel.product_modal.selector).index() );
    });

    function setActiveModalThumbnail(idx){

        config.carousel.product_modal.index = idx;

        var prevSlideIndex = $('li.active', config.carousel.product_modal.nav).index();

        $('li.active', config.carousel.product_modal.nav).removeClass('active');

        $('li:eq(' + config.carousel.product_modal.index + ')', config.carousel.product_modal.nav).addClass('active');



        $('.current-modal-image-index').text( config.carousel.product_modal.index + 1 );



        $('.zoomContainer').remove();

        console.log('Removing Zoom Data', config.carousel.product_modal.thumbnail_selector + prevSlideIndex);

        $(config.carousel.product_modal.thumbnail_selector + prevSlideIndex ).removeData('elevateZoom');

        console.log('Adding Zoom Data', config.carousel.product_modal.thumbnail_selector + config.carousel.product_modal.index);

        $(config.carousel.product_modal.thumbnail_selector + config.carousel.product_modal.index).elevateZoom(

            config.imagezoom.elevate_zoom_modal
        );

        $('.zoomContainer').css({ 'z-index': 9999 });

        $('.item img.active', config.carousel.product_modal.selector).removeClass('active');

        $(config.carousel.product_modal.thumbnail_selector + config.carousel.product_modal.index).addClass('active');
    }
}