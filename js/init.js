$(document).ready(function() {

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

	$.fn.highlightActiveNavItems = function(){

		$(this).each( function(){

			var relativeLink = $('a', this).attr('href').replace(window.location.protocol + '//' + window.location.host, '');

			if(relativeLink == window.location.pathname)
				$(this).addClass('active');

		});
	}

	$.fn.formatRating = function(){

		$(this).each( function(){

			$('img', this).remove();

			if($(this).removeClass('CompareCenter CompareRating').attr('class') == ''){

				var nRating = $(this).find('img').attr('src').match(/Rating(\d+)/)[1];
			}else{
				
				var nRating = this.className.match(/Rating(\d+)/)[1];
			}

			for( var i = 0; i < 5; i++ ){

				var greyClass = (i >= nRating)?'glyphicon-disabled ':'';

				$(this).append( $('<i class="' + greyClass + 'glyphicon glyphicon-star"></i>') );
			}
		});
	}

	$('.ProductDetailsGrid').hideIfChildrenInvisible();
	$('.OutOfStockMessage').hideIfEmpty();
	$('ul.nav li').highlightActiveNavItems();
	$('.Rating, .CompareRating').formatRating();

});

