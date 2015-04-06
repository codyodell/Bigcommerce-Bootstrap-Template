var QuickView2 = {
	
	DATA_PRODUCT: 'data-product',
	
	/**
	 * Default options
	 * @enum {string}
	 */
	options: {
		buttonText: 'Quick View',
		buttonColor: '#f7f7f7',
		gradientColor: '#dcdbdb',
		textColor: '#000000'
	},
	
	/**
	 * Set the options for the QuickView2
	 * 
	 * @param {Object.<string, string>} opt
	 */
	setOptions: function(opt) {
		for (var key in opt) {
			QuickView2.options[key] = opt[key];
		}
	},

	/**
	 * Initialize the container
	 * 
	 * @param {string|Element|jQuery} container
	 */
	init: function(container) {
		
		container = $(container);
		var pid = container.attr(QuickView2.DATA_PRODUCT);
		var btn = QuickView2.createButton(pid);
		var img = container.find('img:first');
		
		/* 
		 * Inject button.
		 * We need to attach to body since different templates
		 * has different layout and we can't position the buttons
		 * consistently. 
		 */
		btn.hide().appendTo(container).click(function(e) {
			
			e.preventDefault();
			e.stopPropagation();
			// action!
			QuickView2.clickAction($(this));
			return false;
			
		});

		// show button
		container.mouseenter(function(e) {
			btn.show(0, function() {
				QuickView2.center(img, $(this));	
			});
		});
		
		// hide button
		container.mouseleave(function(e) {
			btn.hide();
		});
		
	},
	
	/**
	 * Actions to invoke when the quick view button is clicked
	 * 
	 * @param {jQuery} btn
	 */
	clickAction: function(btn) {

		var pid = btn.attr(QuickView2.DATA_PRODUCT);
		 
		var endpoint = config.ShopPath + '/remote.php?w=getproductquickview';
		endpoint = endpoint.replace(/^http[s]{0,1}:\/\/[^\/]*\/?/, '/');
		
		$.get(endpoint, { pid: pid }, function(resp) {
			if (resp.success && resp.content) {
                                $('.ProductInfo .modalClose').trigger("click");
				// this magic line will make the share buttons work all the time
				window.addthis = null;
				//QuickView2.showQuickView2(resp.content);
                                if($(btn).parents(".item").hasClass('item-new-product'))
                                {
                                    var n=300, v = $(btn).siblings("a").children("img"),u=null,ProductImage={width:300,height:420}, ProductInfo={width:258,height:505, "margin-left" : "20px", "padding" : "20px"};
                                    $(btn).parents(".ProductImage").css({height:"auto", width:"auto"});
                                    $(btn).parents(".item").css({height:"auto", width:"auto"});
                                    v.animate(ProductImage,n, function(){
                                        
                                    });
                                    $(btn).parents(".ProductImage").siblings('.ProductInfo').append(resp.content);
                                    $(btn).parents(".ProductImage").siblings('.ProductInfo').animate(ProductInfo,n, function(){
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').css({height:"auto"});
                                        $(".home-products").masonry('reload');
                                    });
                                    $('.ProductInfo .modalClose').bind('click', function() {
                                        ProductImage={width:145,height:168};
                                        ProductInfo={width:127,height:152};
                                        v.animate(ProductImage,n, function(){
                                            $(btn).parents(".ProductImage").css({height:"", width:""});
                                            $(btn).parents(".item").css({height:"", width:""});
                                        });
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').animate(ProductInfo,n, function(){
                                            $(btn).parents(".ProductImage").siblings('.ProductInfo').css({"margin-left" : "", "padding" : ""});
                                            $(".home-products").masonry('reload');
                                        });
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').find("#QuickViewContent").remove();
                                        $(btn).parents(".item").removeClass("quickview-state");
                                     });
                                     $(btn).parents(".item").addClass("quickview-state");
                                    $('#QuickViewContent').parent().find('.ProductPrice').first().hide();

                                     setInterval(function() {
                                        $(".home-products").masonry('reload');
                                     }, 400);
                                } else if ($(btn).parents(".item").prop("tagName") == 'LI')  {

									var n=300;
									v = $(btn).siblings("a").children("img"),u=null;
                                    $(btn).parents(".ProductImage").css({height:"auto", width:"auto"});
                                    $(btn).parents(".item").css({height:"auto", width:"auto"});
                                    v.animate(ProductImage,n, function(){
                                        
                                    });
                                    $(btn).parents(".ProductImage").siblings('.ProductInfo').append(resp.content);
                                    $(btn).parents(".ProductImage").siblings('.ProductInfo').animate(ProductInfo,n, function(){
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').css({height:"auto"});
                                        $(".home-products").masonry('reload');
                                    });
                                    $('.ProductInfo .modalClose').bind('click', function() {
                                       //ProductImage={width:300,height:356};
                                       //ProductInfo={width:258,height:152};
                                        v.animate(ProductImage,n, function(){
                                            $(btn).parents(".ProductImage").css({height:"", width:""});
                                            $(btn).parents(".item").css({height:"", width:""});
                                        });
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').animate(ProductInfo,n, function(){
                                            $(btn).parents(".ProductImage").siblings('.ProductInfo').css({"margin-left" : "", "padding" : ""});
                                            $(".home-products").masonry('reload');
                                        });
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').find("#QuickViewContent").remove();
                                        $(btn).parents(".item").removeClass("quickview-state");
                                     });
                                     $(btn).parents(".item").addClass("quickview-state");
                                    
                                     
                                   
									
									
									
									
                                    $(".custom-quickview").html("");
                                    $(btn).parents("li").nextAll(".custom-quickview").eq(0).html(resp.content);
                                    var div = $(btn).parents("li").nextAll(".custom-quickview").eq(0);
                                    if($("ul.ProductList").find(".custom-quickview").is(':visible')){
                                       // $(".custom-quickview").slideUp("slow",function(){
                                            $(btn).parents("li").nextAll(".custom-quickview").eq(0).slideDown("slow");
                                            
                                            $('.custom-quickview .modalClose').bind('click', function() {
                                               $(this).parents(".custom-quickview").slideUp("slow");
                                            });
                                           
                                        //});
                                    }
                                    else{
                                        $(btn).parents("li").nextAll(".custom-quickview").eq(0).slideDown("slow");
                                        $('html, body').animate({ scrollTop: div.offset().top }, 'slow');
                                        $('.custom-quickview .modalClose').bind('click', function() {
                                           	$(this).parents(".custom-quickview").slideUp("slow", function() {
											  	$('html, body').animate({ scrollTop: $('.item.quickview-state').offset().top }, 300);
												$('.item.quickview-state').removeClass('quickview-state'); 
											});
										   
                                        });
                                      
                                    }
									
									
								} else{
									var n=300, v = $(btn).siblings("a").children("img"),u=null,ProductImage={width:300,height:420}, ProductInfo={width:258,height:505, "margin-left" : "20px", "padding" : "20px"};
                                    $(btn).parents(".ProductImage").css({height:"auto", width:"auto"});
                                    $(btn).parents(".item").css({height:"auto", width:"auto"});
                                    v.animate(ProductImage,n, function(){
                                        
                                    });
                                    $(btn).parents(".ProductImage").siblings('.ProductInfo').append(resp.content);
                                    $(btn).parents(".ProductImage").siblings('.ProductInfo').animate(ProductInfo,n, function(){
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').css({height:"auto"});
                                        $(".home-products").masonry('reload');
                                    });
                                    $('.ProductInfo .modalClose').bind('click', function() {
                                        ProductImage={width:300,height:356};
                                        ProductInfo={width:258,height:152};
                                        v.animate(ProductImage,n, function(){
                                            $(btn).parents(".ProductImage").css({height:"", width:""});
                                            $(btn).parents(".item").css({height:"", width:""});
                                        });
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').animate(ProductInfo,n, function(){
                                            $(btn).parents(".ProductImage").siblings('.ProductInfo').css({"margin-left" : "", "padding" : ""});
                                            $(".home-products").masonry('reload');
                                        });
                                        $(btn).parents(".ProductImage").siblings('.ProductInfo').find("#QuickViewContent").remove();
                                        $(btn).parents(".item").removeClass("quickview-state");
                                     });
                                     $(btn).parents(".item").addClass("quickview-state");
                                     $('#QuickViewContent').parent().find('.ProductPrice').first().hide();
                                    
                                     
                                     setInterval(function() {
                                        $(".home-products").masonry('reload');
                                     }, 400);
									
									
									
									
                                    $(".custom-quickview").html("");
                                    $(btn).parents("li").nextAll(".custom-quickview").eq(0).html(resp.content);
                                    var div = $(btn).parents("li").nextAll(".custom-quickview").eq(0);
                                    if($("ul.ProductList").find(".custom-quickview").is(':visible')){
                                       // $(".custom-quickview").slideUp("slow",function(){
                                            $(btn).parents("li").nextAll(".custom-quickview").eq(0).slideDown("slow");
                                            $('html, body').animate({ scrollTop: div.offset().top }, 'slow');
                                            $('.custom-quickview .modalClose').bind('click', function() {
                                               $(this).parents(".custom-quickview").slideUp("slow");
                                            });
                                           
                                        //});
                                    }
                                    else{
										/*
										alert(div.text());
                                        $(btn).parents("li").nextAll(".custom-quickview").eq(0).slideDown("slow");
                                        $('html, body').animate({ scrollTop: div.offset().top }, 'slow');
                                        $('.custom-quickview .modalClose').bind('click', function() {
                                           $(this).parents(".custom-quickview").slideUp("slow");
                                        });
                                      */
                                    }
                                    
                                }
                                $(btn).parents(".ProductImage").addClass('ProductThumbImage');
                                $('.ProductInfo .modalClose').bind('click', function() {
                                    $(btn).parents(".ProductImage").removeClass('ProductThumbImage');
                                    $('.ProductPrice').show();
                                });
            }
		});
		
	},
	
	/**
	 * Show the quickview modal popup
	 * 
	 * @param {Object} contentData
	 */
	showQuickView2: function(contentData) {
		
		var options = {
			//top: '1%', // remove this after screenshot
			data: contentData,
			onOpen: function() {
				
				$('#ModalContainer').addClass('QuickView2Modal');
				$('#ModalContainer').show();
				QuickView2.displayRating();
				QuickView2.resizeImage();
				
			}
		};
		
		$.iModal.close();
		$.iModal(options);
		
	},
	
	/**
	 * Properly construct the ratings with the correct number of stars
	 */
	displayRating: function() {
		
		var container = $('#QuickView2TopNavRating');
		var rating = parseInt(container.attr('data-rating'));
		var star = container.find('img.starRating:first').detach();
		var starGrey = container.find('img.starRatingGrey:first').detach();
		
		// clone up as much as possible
		for (var i = 0; i < 5; i++) {
			container.append(i < rating ? star.clone() : starGrey.clone());
		}
		star.remove();
		starGrey.remove();
		
	},
	
	/**
	 * Resize the image to fit the container
	 */
	resizeImage: function() {
		
		var container = $('#QuickView2Image');
		var img = container.find('img:first');
		
		// scale this baby up when loaded
		img.load(function() {
			
			var max = {
				width: container.innerWidth(),
				height: container. innerHeight()
			};
			var dim = {
				width: img.width(),
				height: img.height()
			};
			
			var containerRatio = max.width / max.height;
			var imgRatio = dim.width / dim.height;
			var scale = (imgRatio > containerRatio ? (max.width/dim.width) : (max.height/dim.height));
			
			img.css({
				width: (dim.width * scale),
				height: (dim.height * scale)
			});
			
		});
		
	},
	
	/**
	 * Attach the form validator for checkout
	 */
	attachFormValidator: function() {
		
		$('#productDetailsAddToCartForm').validate({
			onsubmit: false,
			ignoreTitle: true,
			showErrors: function (errorMap, errorList) {
				// nothing
			},
			invalidHandler: function (form, validator) {
				if (!validator.size()) {
					return;
				}

				alert(validator.errorList[0].message);
			}
		});
		
	},
	
	
	/**
	 * Centers an element in respect to the given container
	 * 
	 * @param {jQuery} container
	 * @param {jQuery} el
	 */
	center: function(container, el) {
	    var top = container.position().top + (container.outerHeight() - el.outerHeight()) / 2;
	    var left = container.position().left + (container.outerWidth() - el.outerWidth()) / 2;
	    el.css({margin:0, top: (top > 0 ? top : 0)+'px', left: (left > 0 ? left : 0)+'px'});
	},
	
	/**
	 * Create a button with the given pid
	 * 
	 * @param {number} pid
	 */
	createButton: function(pid) {
		
		var opt = QuickView2.options;
		var style = 'background: '+opt.buttonColor+';'
			+ 'filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\''+opt.buttonColor+'\', endColorstr=\''+opt.gradientColor+'\');'
			+ 'background: -webkit-gradient(linear, left top, left bottom, from('+opt.buttonColor+'), to('+opt.gradientColor+'));'
			+ 'background: -moz-linear-gradient(top, '+opt.buttonColor+', '+opt.gradientColor+');'
			+ 'color: '+opt.textColor+';'
		var btn = $('<div></div>');
		btn.text(opt.buttonText);
		btn.addClass('QuickViewBtn');
		btn.attr('style', style);
		btn.attr(QuickView2.DATA_PRODUCT, pid);
		
		return btn;
		
	}
	
};

/**
 * Quickview plugin
 * 
 * @param {Object.<string, *>} options
 * @return {jQuery}
 */
jQuery.fn.quickview2 = function(options) {
	
	QuickView2.setOptions(options);
	return this.each(function() {
		QuickView2.init($(this));	
	});
	
};


