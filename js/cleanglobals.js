$().ready( function(){
	
	$(".icon-twitter .symbol").text('twitterbird');
	$(".icon-facebook .symbol").text('facebook');
	$(".icon-googleplus .symbol").text('googleplus');
	$(".icon-youtube .symbol").text('youtube');
	$(".icon-pinterest .symbol").text('pinterest');
	
	$(".carousel").each( function(){
		
		var nSlides = $(".carousel-inner li", this).length,
			sliderID = $(this).attr('id'),
			bIndicators = $(this).attr('data-indicators');
		
		$(".carousel-inner li:first-child", this).addClass('active');
		
		if(bIndicators !== false){
			
			for( var j = 0; j < nSlides; j++){
				
				var classActive = (!j)?' class="active"':'';
				
				$(".carousel-indicators", this).append( '<li data-target="' + sliderID + '" data-slide-to="' + j + '"' + classActive + '></li>' );
			}
		}
	});
	
	$("#breadcrumbs ul").addClass('breadcrumb'); // Still need this for products page
	
	$('.sf-menu').removeClass('sf-menu');
	$('.sf-vertical').removeClass('sf-vertical');
	
	// $(".ProductList").addClass('row-eq-height');
	
	//$("#pages-menu-container ul.sf-menu").attr('class', 'nav navbar-nav collapse in');
	
	// $(".Message").each( function(){
		
	// 	//If message doesn't have a second class make it default to info message
	// 	if($(this).attr('class') == 'Message'){
		
	// 		$(this).attr('class', 'alert alert-info');
	// 	}
	// });
	
	//$(".Message").addClass('alert').removeClass('Message');
	$(".SuccessMessage").addClass('alert alert-success').removeClass('SuccessMessage').removeClass('Message');
	$(".ErrorMessage").addClass('alert alert-danger').removeClass('ErrorMessage').removeClass('Message');
	$(".InfoMessage").addClass('alert alert-info').removeClass('InfoMessage').removeClass('Message');
	
	if($("#PurchaseGiftCertificate").length){
	
		$("#GiftCertificateThemeList br").remove();
	}
	
	$("#collapseByCategory .panel-body ul").addClass('list-unstyled');
	
	$(".breadcrumb ul, .breadcrumb ol, #ProductBreadcrumb ul").addClass('breadcrumb');
	$(".breadcrumb ul li:last-child, .breadcrumb ol li:last-child").addClass('active');
	
	$("#BlogRecentPosts ul li").each( function(){
	
		$(this).addClass('list-group-item');
	});
	
	$("#ModalButtonRow btn-secondary").addClass('btn');
	$("#ModalButtonRow input[type=submit]").attr('class', 'btn btn-primary');
	
	$("form dl").each( function(){
		
		$(this).find("dt").each( function(){
		
			$(this).addClass('control-label');
			$(this).next().find("input, textarea, select").addClass('form-control').removeAttr('size');
		});
	});
	
	$("dd input[type=text], dd select, .quantityInput, .CartCode input[type=text]").addClass('form-control');
	
	$("input[type=submit]").addClass('btn btn-primary');
	
	$(".FormFieldLabel").parents("dt").addClass('control-label');
	
	$("#subcategory-list li").each( function(){
	
		$(this).addClass('list-group-item');
	});
	
	if($(".pagination li:first-child").not('.sr-only').text() == ''){
	
		$(".pagination li:first-child").addClass('disabled').html( $('<a href="#">&laquo; Prev</a>') );
	}
	
	$(".pagination li.ActivePage").addClass('active').wrapInner('<a href="#" />');
	
	$("#SimilarProductsByCustomerViews h3").html( '<span>' + $("#SimilarProductsByCustomerViews h3").text() + '</span>' );
	
	$("#ProductReviews .btn-secondary").removeClass('btn-secondary').addClass('btn btn-primary');
	
	if( !$(".page-category h1.title").text().length ){
	
	$(".page-category h1.title").text('Shop');
	}
	// Make categories page 1 column if nothing is in the sidebar
	
	// if(!$(".page-category aside.col-md-3").text().trim().length){
	
	// 	$(".page-category aside.col-md-3").remove();
	
	// 	$("main.col-md-9").removeClass('col-md-9').addClass('col-md-12');
	// }
	

	$('.productOptionPickListSwatch').each( function(){

		$('ul', this).attr({
			'data-toggle': 'buttons',
			'class': 'btn-group list-inline'
		});

		$('ul li label .swatchColour', this).addClass('btn');
	});

	$('#content-newsletter p a').addClass('btn btn-primary');
	
	});		