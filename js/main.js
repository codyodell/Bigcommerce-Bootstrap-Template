$().ready(function() {

	$('.ProductDetailsGrid').hideIfChildrenInvisible();
	$('.OutOfStockMessage').hideIfEmpty();
	$('ul.nav li').highlightActiveLinks();
	$('.product-rating, .Rating, .CompareRating').formatRating();


	/* --- Header --- */

	/* 
	 * If menu item has text in parenthesis put it in an em tag so we can style a subtitle 
	*/
	$('#PagesMenu > li a, h1').each( function(){

		var textInParenthesis = $(this).text().match(/\(([^)]+)\)/);

		if(textInParenthesis){

			$(this)
				.text( $(this).text().replace(textInParenthesis[0], '') )
				.append( $('<em />').text( textInParenthesis[1] ) );

		}
	});

	/* Product Lists */

	$('li.QuickView .photo').each( function(){

		$(this).append( 
			$('<a />').attr({
				'href': '#',
				'class': 'btn-overlay btn-quickview'
			}).html('<span class="btn btn-info"><i class="glyphicon glyphicon-eye-open"></i> Open in Quickview</span>')
		);
	});

	$(document).on('click', '.btn-quickview', function(e){

		e.preventDefault();
		
		var nProductID   = $(this).parents('li').attr('data-product') || 0,
			quickViewURL = '/remote.php?w=getproductquickview&pid=' + nProductID;

		$.getJSON( quickViewURL ).success(function(data) {

		   $('#general-modal .modal-content').html(data.content);
		   $('#general-modal').modal('show');
		});
	});

	/* --- Product Page -- */

	if( $("#carousel-thumbnails li.thumbnail").length == 1 ){

		$("#carousel-thumbnails").hide();
		$("#product-image-carousel .pagination").hide();
	}

	if( $('#product-attribute-weight dd').text() == '' ){

		$('#product-attribute-weight').hide();
	}

	if( !$('#product-attributes dd').text().replace('unit(s)', '').replace('unit(s)', '').trim().length ){

		$('#product-attributes').hide();
	}

	/* 
	 * Superfish is ooooooold and we don't need it 
	*/
    $(".sf-menu").removeClass('sf-menu');

    /* 
     * Add margin under header if no breadcrumbs (Need to fix) 
    */
    /*if(!$("#breadcrumbs").length){

    	$("#header").css('marginBottom', '35px');
    }*/


	/* --- Homepage --- */

	$('#top-products-slide-show').carousel({

		interval: 4000
	});

	$("#top-products-slide-show .carousel-inner > li").chunkList();
	
	/*
	 * Pause button
	 */

	$(document).on('click', '.btn-pause', function(){
		
		if($(this).hasClass('active')){

			$('i', this).removeClass('glyphicon-pause').addClass('glyphicon-play');
			$('#top-products-slide-show').carousel('pause');
		}else{

			$('i', this).removeClass('glyphicon-play').addClass('glyphicon-pause');
			$('#top-products-slide-show').carousel('cycle');
		}
	});

	/* 
	 * Accordion Icons 
	*/

	$("#accordion2").on('show.bs.collapse', function(e){
        
        $(e.target).prev('.panel-heading').find('.caret-right').removeClass("caret-right").addClass("caret-down");
    });

	$("#accordion2").on('hide.bs.collapse', function(e){
        
        $(e.target).prev('.panel-heading').find('.caret-down').removeClass("caret-down").addClass("caret-right");
    });

	/* Cart page */

	$('.CartThumb').each( function(){

		$('a', this).addClass('thumbnail pull-left');
		$('img', this).addClass('media-object');
	})
});

/* --- Functions --- */

$.fn.hideIfEmpty = function(){

	if(!$(this).text().trim().length)
		$(this).hide();

	return this;
}

$.fn.hideIfChildrenInvisible = function(){

	if(!$('> *:visible', this).length)
		$(this).hide();

	return this;
}

$.fn.highlightActiveLinks = function(){

	$(this).each( function(){

		var relativeLink = $('a', this).attr('href').replace(window.location.protocol + '//' + window.location.host, '');

		if(relativeLink == window.location.pathname)
			$(this).addClass('active');

	});

	return this;
}

$.fn.formatRating = function(){

	$(this).each( function(){

		$('img', this).remove();

		if($(this).attr('data-rating').length){

			var nRating = $(this).attr('data-rating');
		}else
		if($(this).removeClass('CompareCenter CompareRating').attr('class') == ''){

			var nRating = $(this).find('img').attr('src').match(/Rating(\d+)/)[1];
		}else{
			
			var nRating = this.className.match(/Rating(\d+)/)[1];
		}

		for( var i = 0; i < 5; i++ ){

			var classDisabled = (i >= nRating)?'glyphicon-disabled ':'';

			$(this).append( $('<i class="' + classDisabled + 'glyphicon glyphicon-star"></i>') );
		}
	});

	return this;
}

$.fn.chunkList = function(){

	var per_slide = 4;
	
	for(var i = 0; i < this.length; i += per_slide){

		this.slice(i, (i + per_slide)).wrapAll('<li class="item"><ul class="ProductList"></ul></li>');
	}

	return this;
}