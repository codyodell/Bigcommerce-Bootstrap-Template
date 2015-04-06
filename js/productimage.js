$().ready( function(){

    config.carousel.product = {
    	selector: '#product-image-carousel',
    	nav: '#carousel-thumbnails',
    	controls: '#product-image-carousel nav',
    	slides: '.carousel-inner',
    	images: ZoomImageURLs,
    	descriptions: ProductImageDescriptions,
    	thumbnail_selector: '#product-thumbnail-',
    	index: 1,
    	interval: 6000
    };
    config.modal.product = {
    	modal: '#product-image-modal'
    };
    config.imagezoom.elevate_zoom = {
    	cursor: 'pointer',
        gallery: 'product-image-gallery',
        galleryActiveClass: 'active',
        easing: true,
        zoomType: 'inner',
        scrollZoom: true,
        zoomWindowFadeIn: 200,
    	zoomWindowFadeOut: 1000
    };

    BigCommerceProductCarousel();
});

function BigCommerceProductCarousel(){

    $('.total-images', config.carousel.product.controls).text(config.carousel.product.images.length);

    $(config.carousel.product.images).each( function(index, value){

        var slideImage = $('<img />').attr({

                src: value,
                alt: config.carousel.product.descriptions[index],
                'data-image': value,
                'data-zoom-image': value,
                id: config.carousel.product.thumbnail_selector.replace('#', '') + index
            });

      	$(config.carousel.product.thumbnail_selector + index ).imagesLoaded( function (){

            $(config.carousel.product.thumbnail_selector + index).show();
        });

        $(config.carousel.product.slides, config.carousel.product.selector).append( 

            $('<li />').addClass('item').attr({

            	'data-image': value,
            	'data-zoom-image': value
            }).html( slideImage )
        );
    });

    $(config.carousel.product.thumbnail_selector + '0').elevateZoom(config.imagezoom.elevate_zoom);

    $('li:first-child', config.carousel.product.slides).addClass('active');
    $('li:first-child', config.carousel.product.nav).addClass('active');

    $('li', config.carousel.product.nav).each( function(){

        $(this).attr({

            'data-slide-to': $(this).index(),
            'data-target': config.carousel.product.selector
        });
    });

    $(config.carousel.product.selector).carousel({

        interval: config.carousel.product.interval
    }).on('slide.bs.carousel', function (e) {
        var nextH = $(e.relatedTarget).height();
        console.log(nextH)
        console.log( $(this).find('.active.item').parent() )
        $(this).find('.active.item').parent().animate({
            height: nextH
        }, 500);
    });;

    $('li', config.carousel.product.nav).on('click', function(e){

        setActiveThumbnail( $(this).index() );
    });
    
    $(config.carousel.product.selector).on('slid.bs.carousel', function (e) {
        
        setActiveThumbnail( $('.item.active', config.carousel.product.selector).index() );
    });

    function setActiveThumbnail(idx){

    	config.carousel.product.index = idx;

    	var prevSlideIndex = $('li.active', config.carousel.product.nav).index();

    	$('li.active', config.carousel.product.nav).removeClass('active');

        $('li:eq(' + config.carousel.product.index + ')', config.carousel.product.nav).addClass('active');

        $('.current-image-index').text( config.carousel.product.index + 1 );

        $(config.modal.product.modal).data('parent-slide-number', config.carousel.product.index );
        
		$('.zoomContainer').remove();

        $(config.carousel.product.thumbnail_selector + prevSlideIndex ).removeData('elevateZoom');

        $(config.carousel.product.thumbnail_selector + config.carousel.product.index).elevateZoom(

            config.imagezoom.elevate_zoom
        );

        $('.item img.active', config.carousel.product.selector).removeClass('active');

        $(config.carousel.product.thumbnail_selector + config.carousel.product.index).addClass('active');


    }

    $(".carousel-inner .item").click( function(e){

        e.preventDefault();

        $('.zoomContainer').remove();

        $(config.carousel.product.selector).carousel('pause');

        $(config.carousel.product.thumbnail_selector + $('.item img.active', config.carousel.product.selector).index() ).removeData('elevateZoom');

        $("#product-image-modal").modal({

            remote: config.ShopPath + '/productimage.php?product_id=' + productId
        });
    });

	$('body').on('hidden.bs.modal', '#product-image-modal', function (e) { 

		$(config.carousel.product.selector).carousel('cycle');

        $(config.carousel.product.thumbnail_selector + config.carousel.product.index).elevateZoom(

            config.imagezoom.elevate_zoom
        );

		$(this).removeData('bs.modal'); 
	});
}