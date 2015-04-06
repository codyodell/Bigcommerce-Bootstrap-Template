$().ready(function() {

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

		console.log(nProductID);

		$.getJSON( quickViewURL ).success(function(data) {

			console.log( data );

		   $('#general-modal .modal-content').html(data.content);
		   $('#general-modal').modal('show');
		});
	});

	/* Homepage Accordion Icons */

	$("#accordion2").on('show.bs.collapse', function(e){
        
        $(e.target).prev('.panel-heading').find('.caret-right').removeClass("caret-right").addClass("caret-down");
    });

	$("#accordion2").on('hide.bs.collapse', function(e){
        
        $(e.target).prev('.panel-heading').find('.caret-down').removeClass("caret-down").addClass("caret-right");
    });

	/* Superfish is ooooooold and we don't need it */
    $(".sf-menu").removeClass('sf-menu');

    /* Add margin under header if no breadcrumbs (Need to fix) */
    if(!$("#breadcrumbs").length){

    	$("#header").css('marginBottom', '35px');
    }

	var itemTxt   = $('.cartCount strong').text(),
		totalCost = $('.cartCost strong').text();

	if(totalCost.length != 0) {

		$('.CartLink span').html(itemTxt + ' Items / ' + totalCost);
	}

	$('#top-products-slide-show').carousel({

		interval: 4000
	});
	
	$(document).on('click', '.btn-pause', function(){
		
		if($(this).hasClass('active')){

			$('i', this).removeClass('glyphicon-pause').addClass('glyphicon-play');
			$('#top-products-slide-show').carousel('pause');
		}else{

			$('i', this).removeClass('glyphicon-play').addClass('glyphicon-pause');
			$('#top-products-slide-show').carousel('cycle');
		}
	});
	
	var divs = $("#top-products-slide-show .carousel-inner > li"),
		per_slide = 4;
	
	for(var i = 0; i < divs.length; (i += per_slide)){

		divs.slice(i, (i + per_slide)).wrapAll('<li class="item"><ul class="ProductList"></ul></li>');
	}
});

function ToggleShippingEstimation2(){
	
	var $container = $(".EstimateShipping");

	$('.EstimatedShippingMethods').hide();
	
	if ($container.is(':hidden')){// Show - slide down.

		$('.EstimateShippingLink').hide();

		$container.slideDown(300);

		$('.EstimateShipping select:eq(0)').focus();
		
		if($('#shippingZoneState').is(':hidden')){

			$('#uniform-shippingZoneState').hide();
		}
		
	}else{// hide - slide up.
		
		$container.slideUp(300, function() {

			$('.EstimateShippingLink').show();
		});
	}
};

