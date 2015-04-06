/* Common Javascript functions for use throughout Interspire Shopping Cart */

jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
	}
})();

// Fetch the value of a cookie
function get_cookie(name) {

	name = name += "=";

	var cookie_start = document.cookie.indexOf(name);
	if(cookie_start > -1) {
		cookie_start = cookie_start+name.length;
		cookie_end = document.cookie.indexOf(';', cookie_start);
		if(cookie_end == -1) {
			cookie_end = document.cookie.length;
		}
		return unescape(document.cookie.substring(cookie_start, cookie_end));
	}
}

// Set a cookie
function set_cookie(name, value, expires)
{
	if(!expires) {
		expires = "; expires=Wed, 1 Jan 2020 00:00:00 GMT;"
		} else {
		expire = new Date();
		expire.setTime(expire.getTime()+(expires*1000));
		expires = "; expires="+expire.toGMTString();
	}
	document.cookie = name+"="+escape(value)+expires;
}

/* Javascript functions for the products page */
var num_products_to_compare = 0;
var product_option_value = "";
var CurrentProdTab = "";
function showProductImage(filename, product_id, currentImage) {
	var l = (screen.availWidth/2)-350;
	var t = (screen.availHeight/2)-300;
	var variationAdd = '';
	if(ShowVariationThumb) {
		variationAdd = '&image_rule_id=' + encodeURIComponent(ShowVariationThumb);
		CurrentProdThumbImage = null;
	}
	UrlAddOn = '';
	
	if(currentImage) {
		UrlAddOn = "&current_image="+currentImage;
		} else if(CurrentProdThumbImage) {
		UrlAddOn = "&current_image="+CurrentProdThumbImage;
	}
	var imgPopup = window.open(filename + "?product_id="+product_id+variationAdd+UrlAddOn, "imagePop", "toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=1,width=700,height=600,top="+t+",left="+l);
	imgPopup.focus();
}

function CheckQuantityLimits (form)
{
	var qty = parseInt($('#qty_').val(), 10);
	
	if (!qty) {
		// If text fields are being used for 'quantity' we need to get this value instead:
		qty = parseInt($('#text_qty_').val(), 10);
	}
	
	if (qty < productMinQty) {
		alert(lang.ProductMinQtyError);
		return false;
	}
	
	if (qty > productMaxQty) {
		alert(lang.ProductMaxQtyError);
		return false;
	}
	
	return true;
}

function CheckProductConfigurableFields(form)
{
	var requiredFields = $('.FieldRequired');
	var valid = true;
	requiredFields.each(function() {
		var namePart = this.name.replace(/^.*\[/, '');
		var fieldId = namePart.replace(/\].*$/, '');
		
		if(this.type=='checkbox' ) {
			if(!this.checked) {
				valid = false;
				alert(lang.EnterRequiredField);
				this.focus();
				return false;
			}
			} else if($.trim(this.value) == '') {
			if(this.type != 'file' || (this.type == 'file' && document.getElementById('CurrentProductFile_'+fieldId).value == '')) {
				valid = false;
				alert(lang.EnterRequiredField);
				this.focus();
				return false;
			}
		}
	});
	
	var fileFields = $(form).find("input[name^='ProductField']:file");
	fileFields.each(function() {
		if(this.value != '') {
			var namePart = this.name.replace(/^.*\[/, '');
			var fieldId = namePart.replace(/\].*$/, '');
			var fileTypes = document.getElementById('ProductFileType_'+fieldId).value;
			
			fileTypes = ','+fileTypes.replace(' ', '').toLowerCase()+','
			var ext = this.value.replace(/^.*\./, '').toLowerCase();
			
			if(fileTypes.indexOf(','+ext+',') == -1) {
				alert(lang.InvalidFileTypeJS);
				this.focus();
				this.select();
				valid = false;
			}
			
		}
	});
	
	return valid;
}

function check_add_to_cart(form, required) {
	var valid = true;
	var qtyInputs = $(form).find('input.qtyInput');
	qtyInputs.each(function() {
		if(isNaN($(this).val()) || $(this).val() <= 0) {
			alert(lang.InvalidQuantity);
			this.focus();
			this.select();
			valid = false;
			return false;
		}
	});
	if(valid == false) {
		return false;
	}
	
	if(!CheckProductConfigurableFields(form)) {
		return false;
	}
	
	// validate the attributes
	var attributesValidated = $('#productDetailsAddToCartForm')
	.validate()
	.form();
	
	if (!attributesValidated) {
		return false;
	}
	
	if (!CheckQuantityLimits(form)) {
		return false;
	}
	
	if(required && !$(form).find('.CartVariationId').val()) {
		alert(lang.OptionMessage);
		var select = $(form).find('select').get(0);
		if(select) {
			select.focus();
		}
		var radio = $(form).find('input[type=radio]').get(0);
		if(radio) {
			radio.focus();
		}
		return false;
	}
	
	if (!CheckEventDate()) {
		return false;
	}
	
	// if we're using the fastcart, pop that up now
	if (config.FastCart) {
		return fastCartAction();
	}
	
	return true;
}

function compareProducts(compare_path) {
	var pids = "";
	
	if($('form').find('input[name=compare_product_ids]:checked').size() >= 2) {
		var cpids = document.getElementsByName('compare_product_ids');
		
		for(i = 0; i < cpids.length; i++) {
			if(cpids[i].checked)
			pids = pids + cpids[i].value + "/";
		}
		
		pids = pids.replace(/\/$/, "");
		document.location.href = compare_path + pids;
		return false;
	}
	
	alert(lang.CompareSelectMessage);
	return false;
}

function product_comparison_box_changed(state) {
	// Increment num_products_to_compare - needs to be > 0 to submit the product comparison form
	
	
	if(state)
	num_products_to_compare++;
	else
	if (num_products_to_compare != 0)
	num_products_to_compare--;
}

function remove_product_from_comparison(id) {
	if(num_compare_items > 2) {
		for(i = 1; i < 11; i++) {
			document.getElementById("compare_"+i+"_"+id).style.display = "none";
		}
		
		num_compare_items--;
	}
	else {
		alert(lang.CompareTwoProducts);
	}
}

(function($){
	$.fn.captchaPlaceholder = function () {
		$(this).each(function(){
			var $$ = $(this);
			
			if (!$$.parent().is(':visible')) {
				// don't do anything if this placeholder isn't visible
				return;
			}
			
			var img = $$.find('.captchaImage');
			if (img.length) {
				// don't do anything if an image is already in the dom
				return;
			}
			
			var rand = Math.round(500 + Math.random() * 7500);
			img = $('<img class="captchaImage" src="' + config.ShopPath + '/captcha.php?' + rand + '" />');
			$$.append(img);
		});
		
		return this;
	};
})(jQuery);

function show_product_review_form() {
	document.getElementById("rating_box").style.display = "";
	if(typeof(HideProductTabs) != 'undefined' && HideProductTabs == 0) {
		CurrentProdTab = 'ProductReviews_Tab';
		} else {
		document.location.href = "#write_review";
	}
	
	$('.captchaPlaceholder').captchaPlaceholder();
}

function jump_to_product_reviews() {
	if(typeof(HideProductTabs) != 'undefined' && HideProductTabs == 0) {
		CurrentProdTab = 'ProductReviews_Tab';
		} else {
		document.location.href = "#reviews";
	}
}

function g(id) {
	return document.getElementById(id);
}

function check_product_review_form() {
	var revrating = g("revrating");
	var revtitle = g("revtitle");
	var revtext = g("revtext");
	var revfromname = g("revfromname");
	var captcha = g("captcha");
	var email = g("email");
	
	if(jQuery && jQuery(email).is(":visible") && email.value == "") {
		alert(lang.ReviewNoEmail);
		email.focus();
		return false;
	}
	
	if(revrating.selectedIndex == 0) {
		alert(lang.ReviewNoRating);
		revrating.focus();
		return false;
	}
	
	if(revtitle.value == "") {
		alert(lang.ReviewNoTitle);
		revtitle.focus();
		return false;
	}
	
	if(revtext.value == "") {
		alert(lang.ReviewNoText);
		revtext.focus();
		return false;
	}
	
	if(jQuery && jQuery(email).is(":visible") && email.value == "") {
		alert(lang.ReviewNoEmail);
		email.focus();
		return false;
	}
	
	if(captcha.value == "" && HideReviewCaptcha != "none") {
		alert(lang.ReviewNoCaptcha);
		captcha.focus();
		return false;
	}
	
	return true;
}

function check_small_search_form() {
	var search_query = g("search_query");
	
	if(search_query.value == "") {
		alert(lang.EmptySmallSearch);
		search_query.focus();
		return false;
	}
	
	return true;
}

function setCurrency(currencyId)
{
	var gotoURL = location.href;
	
	if (location.search !== ''){

		if (gotoURL.search(/[&|\?]setCurrencyId=[0-9]+/) > -1)
			gotoURL = gotoURL.replace(/([&|\?]setCurrencyId=)[0-9]+/, '$1' + currencyId);
		else
			gotoURL = gotoURL + '&setCurrencyId=' + currencyId;

	}else{

		gotoURL = gotoURL + '?setCurrencyId=' + currencyId;
	}

	location.href = gotoURL;
}


// Dummy sel_panel function for when design mode isn't enabled
function sel_panel(id) {}

function inline_add_to_cart(filename, product_id, quantity, returnTo) {

	var quantity = (typeof(quantity) == 'undefined')?'1':quantity,
		html     = '<form action="' + filename + '/cart.php" method="post" id="inlineCartAdd">';

	if(typeof(returnTo) != 'undefined' && returnTo == true) {

		var returnLocation = window.location;

		html += '<input type="hidden" name="returnUrl" value="'+escape(returnLocation)+'" />';
	}

	html += '<input type="hidden" name="action" value="add" />' +
			'<input type="hidden" name="qty" value="'+quantity+'" />' + 
			'<input type="hidden" name="product_id" value="'+product_id+'" />' +
			'</form>';

	$('body').append(html);
	$('#inlineCartAdd').submit();
}

function ShowPopupHelp(content, url, decodeHtmlEntities) {

	var popupWindow = open('', 'view','height=450,width=550');
	
	if(decodeHtmlEntities) {
		content = HtmlEntityDecode(content);
	}
	if (window.focus) {
		popupWindow.focus();
	}
	
	var doc = popupWindow.document;
	doc.write(content);
	doc.close();
	
	return false;
}

function HtmlEntityDecode(str) {

	try {

		var tarea=document.createElement('textarea');
		tarea.innerHTML = str; return tarea.value;
		tarea.parentNode.removeChild(tarea);

	} catch(e) {
		//for IE add <div id="htmlconverter" style="display:none;"></div> to the page
		document.getElementById("htmlconverter").innerHTML = '<textarea id="innerConverter">' + str + '</textarea>';
		var content = document.getElementById("innerConverter").value;
		document.getElementById("htmlconverter").innerHTML = "";
		return content;
	}
}

/**
	* A javascript equivalent of server-side getLang method with replacements support. The specified language entry must be
	* present in the lang object. Returns a blank string if it is not.
	*
	* Usage:
	* getLang('ProductMinQtyError', { qty: 10, product: 'Test Product' }); // pass the name of the language entry
	*
	* @param string name
	* @param object replacements
	* @return string
*/
function getLang (name, replacements)
{
	if (!config.lang[name])
		return '';
	
	var string = config.lang[name];

	if (typeof replacements != 'object')
		return string;
	
	$.each(replacements, function(needle, haystack){

		string = string.replace(':' + needle, haystack);
	});
	
	return string;
}


var loadedImages = {};


function fastCartAction(event) {

	var url = '',
		modalOptions;
	
	// Supplied URL
	if (typeof(event) == 'string') {

		var url = event;
		
		// Make sure a valid URL was supplied
		if (!url || url.indexOf('cart.php') == -1)
			return false;
		
		// strip protocol from url to fix cross protocol ajax access denied problem
		url = url.replace(/^http[s]{0,1}:\/\/[^\/]*\/?/, '/');
		url += '&fastcart=1';



		$.ajax({
			url: url,
			dataType: 'json',
			success: function(data)	{
				if (data.success) {

					console.log(data.imodal);

					$('#general-modal .modal-content').html( data.imodal );

					$('#general-modal').modal();

				}else 
				if (data.redirect) {
					window.location.href = data.redirect;
				}
			}
		});

	}else { // 'Add' button on product details page

		$('#productDetailsAddToCartForm').ajaxSubmit({
			data: {
				fastcart: 1,
				ajaxsubmit: 1
			},
			type: 'post',
			iframe: true,
			dataType: 'json',
			success: function(data)	{
				if (data.success) {
					modalOptions = {
						data: data
					};
					_showFastCart(modalOptions);
				}
				else if (data.redirect) {
					window.location.href = data.redirect;
				}
			}
		});
	}
	
	return false;
}

function _showFastCart(modalOptions) {


	modalOptions = $.extend({
		closeTxt: true,
		onShow: function() {
			$("#fastCartSuggestive a[href*='cart.php?action=add']").unbind('click');
			
			var itemTxt = $('#fastCartNumItemsTxt').html();
			if (itemTxt) {
				// update the view cart item count on top menu
				$('.CartLink span').html('(' + itemTxt + ')');
			}
			//setProductListHeights(null, '.fastCartContent');
			//$('.fastCartContent .ProductList:not(.List) li').width(ThumbImageWidth);
		},
		onClose: function() {
			if (window.location.href.match(config.ShopPath + '/cart.php')) {
				// reload if we are on the cart page
				$('#ModalContainer').remove();
				window.location = window.location.href
				} else {
				$('#ModalContainer').remove();
			}
		}
	}, modalOptions);



	$.iModal.close();
	$.iModal(modalOptions);
}

/**
	* Adds a script tag to the DOM that forces a hit to tracksearchclick. Should be called by a mousedown event as calling it by a click event can sometimes be cancelled by the browser navigating away from the page.
*/
function isc_TrackSearchClick (searchId) {

	if (!searchId)
		return;
	
	$('#SearchTracker').remove();
	
	var trackurl   = 'search.php?action=tracksearchclick&searchid=' + encodeURIComponent(searchId) + '&random=' + Math.random(),
		script     = document.createElement('script');

		script.src = trackurl,
		script.id  = "SearchTracker";
	
	window.document.body.appendChild(script);
}


function hideLoadingIndicator(){

	$('#loading').css({top:'-400px'});

	//$('body').addClass('loaded');
}

function showLoadingIndicator(){

	$('#loading').css({top: '0px'});

	//$('body').removeClass('loaded');
}

/**
	* Add a method to the Date object prototype to set the full
	* year using an ISO 8601 format string.
	*
	* Usage:
	* var d = new Date();
	* d.setISO('1980-01-08');
*/
if (typeof Date.prototype.setISO == 'undefined') {

	Date.prototype.setISO = function (isoFmt) {

		var dtparts = isoFmt.split('-');

		this.setFullYear(dtparts[0], dtparts[1] - 1, dtparts[2]);
	};
}

/**
	* This disables the process payment button. It's here because otherwise it'd require a template
	* change to about 20 files.
*/
$('form[action$="process_payment"]').on('submit', function(ev){

	if (ev.isDefaultPrevented())
		return;
	
	var submitFunc = this.onsubmit,
		self = this,
		disabler = function () {

			$('input[type="submit"]', self)
				.val("Processing Your Order...")
				.attr('disabled', 'disabled');
		};

	if(submitFunc && submitFunc() == false){
		ev.preventDefault();
		return;
	}
	
	if ($.browser.opera) {
		// for opera, just submit straight away. opera doesn't process the timeout (ie. js/events) after navigation.
		disabler();
	} else {
		// IE flavours need a timeout to allow submit button disabling.
		setTimeout(disabler, 1);
	}
});

// TODO: rewirte this
$('#OrderConfirmationForm').on('submit', function(ev){

	if (ev.isDefaultPrevented()) {
		return;
	}

	var submitFunc = this.onsubmit,
		self = this,
		disabler = function () {
			$('#bottom_payment_button', self)
				.attr('disabled', 'disabled');
		};

	if(submitFunc && submitFunc() == false){
		ev.preventDefault();
		return;
	}
	
	if ($.browser.opera) {
		// for opera, just submit straight away. opera doesn't process the timeout (ie. js/events) after navigation.
		disabler();
	} else {
		// IE flavours need a timeout to allow submit button disabling.
		setTimeout(disabler, 1);
	}
});

function htmlspecialchars_decode (string, quote_style) {
	// http://kevin.vanzonneveld.net
	// +   original by: Mirek Slugen
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfixed by: Mateusz "loonquawl" Zalega
	// +      input by: ReverseSyntax
	// +      input by: Slawomir Kaniecki
	// +      input by: Scott Cariss
	// +      input by: Francois
	// +   bugfixed by: Onno Marsman
	// +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
	// +      input by: Ratheous
	// +      input by: Mailfaker (http://www.weedem.fr/)
	// +      reimplemented by: Brett Zamir (http://brett-zamir.me)
	// +    bugfixed by: Brett Zamir (http://brett-zamir.me)
	// *     example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES');
	// *     returns 1: '<p>this -> &quot;</p>'
	// *     example 2: htmlspecialchars_decode("&amp;quot;");
	// *     returns 2: '&quot;'
	var optTemp     = 0,
		i           = 0,
		noquotes    = (quote_style === 0)?true:false,
		string      = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
		quote_style = typeof quote_style !== 'undefined' ? quote_style : 2;
		OPTS        = {
			'ENT_NOQUOTES': 0,
			'ENT_HTML_QUOTE_SINGLE': 1,
			'ENT_HTML_QUOTE_DOUBLE': 2,
			'ENT_COMPAT': 2,
			'ENT_QUOTES': 3,
			'ENT_IGNORE': 4
		};

	if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags

		quote_style = [].concat(quote_style);

		for (i = 0; i < quote_style.length; i++) {
			// Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
			if (OPTS[quote_style[i]] === 0) {

				noquotes = true;

			} else if (OPTS[quote_style[i]]) {

				optTemp = optTemp | OPTS[quote_style[i]];
			}
		}
		quote_style = optTemp;
	}
	if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
		string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
		// string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
	}
	if (!noquotes) {
		string = string.replace(/&quot;/g, '"');
	}
	// Put this in last place to avoid escape being double-decoded
	string = string.replace(/&amp;/g, '&');
	
	return string;
}

/**
	* Converts price in string format back to numeric value
	* eg. '$99.99 AUD' -> 99.99
	* @param string price -- price in the string format with possible currency
	* indicators and separators
*/
function convertPriceStringToNumber(price){

	return Number(price.replace(/[^0-9\.]+/g,""));
}

/**
	* Parses a csv string of ids (eg, 1,2,3) into a array containing numeric
	* value of each id
	* @param ids
	* @param delimeter
*/
function parseCsvIdsToNumericArray(ids,delimeter){

	return ids.split(delimeter).map(Number);
}


function createCookie(name,value,days){

	var expires = '';

	if (days) {

		var date = new Date();

		date.setDate(date.getDate() + days);
		expires = "; expires=" + date.toGMTString();
	}

	document.cookie = name + "=" + value + expires+"; path=/";
}

function acceptCookieUsage(){

	if (config.ShowCookieWarning && document.cookie.indexOf('ACCEPT_COOKIE_USAGE') == -1) {

		$.ajax({

			url: config.ShopPath + '/remote.php?w=getCookieNotification',
			type: 'GET',
			dataType: 'JSON',
			success: function(response){

				if(response.html != ''){

					$('body').prepend(response.html);
				}
			}
		});
	}
}

/**
	* Changes social sharing tabs and content within sharing widget
	* @param {String} serviceId The ID of the sharing service to be used.
	* @param {Number} productId The ID of the product to be shared.
*/
function switchSocialSharingTabs(serviceId, productId) {

	$('.sharingTab').removeClass('active');
	$('.' + serviceId).addClass('active');
	
	updateShareButton(serviceId, productId);
	updateSocialSharingPanel(productId);
}

/**
	* Get the currently active social sharing tab.
	* @return {String} The ID of the currently active social sharing service.
*/
function activeSocialSharingServiceId(){

	return $('.sharingTab.active').attr('id').replace('tab', '');
}

/**
	* Update the share button to share the given product on the given service.
	* @param {String} serviceId The service on which to share the given product.
	* @param {Number} productId The ID of the product to share.
*/
function updateShareButton(serviceId, productId) {

	$('.js-share-button').attr('href', sharingData[productId][serviceId]['sharingLink']);
}

/**
	* Preload images and build the social sharing panel.
	* @param {Number} shareProductId
*/
function initSocialSharingPanel(shareProductId){

	var productCount = objectLength(sharingData),
		loadedProductCount = 0;

	$.each(sharingData, function(productId, services) {

		var serviceCount = objectLength(services),
			loadedServiceCount = 0;

		$.each(services, function(serviceId, productSharingDetails) {

			loadedServiceCount++;

			productSharingDetails['imageElement'] = $("<img/>")
				.attr("src", productSharingDetails['image'])
				.attr("alt", "");

			if (loadedServiceCount == serviceCount) {

				loadedProductCount++;

				if (loadedProductCount == productCount) {

					switchSocialSharingTabs(activeSocialSharingServiceId(), shareProductId);
				}
			}
		});
	});
}

/**
	* Calculate the number of owned properties of an object.
	* @param object
	* @return {Number}
*/
function objectLength(object){

	if (typeof object != "object")
		return 0;

	var count = 0;

	for (i in object) {

		if (object.hasOwnProperty(i)) {

			count++;
		}
	}

	return count;
}

/**
	* Updates sharing panel with new product details.
	* Used when multiple products exist (eg orders) to swap the product to be shared
	* @param productId
*/
function updateSocialSharingPanel(productId) {
	shareProductId = productId;
	var activeTab = activeSocialSharingServiceId();
	$('#tabcontent .photo').empty().append(sharingData[productId][activeTab]['imageElement']);
	$('#shareDescription').text(sharingData[productId][activeTab]['description']);
	updateShareButton(activeTab, productId);
	$('#shareText').text(sharingData[productId][activeTab]['shareText']);
	
	updateSharingDataChoices(productId);
	
	$.iModal.close();
}

function updateSharingDataChoices(productId) {
	$('#SharingDataChoices #productlist').empty();
	$.each(sharingData, function(index, value) {
		if (index != productId) {
			var productAnchor = $("<a/>").attr("href", "javascript:updateSocialSharingPanel("+index+")");
			productAnchor.append(value[activeSocialSharingServiceId()]['imageElement']);
			var productListItem = $("<li/>").append(productAnchor);
			$('#SharingDataChoices #productlist').append(productListItem);
		}
	});
}

/**
	* View modal overlay of product image choices
*/
// function showProductChoices() {

// 	$.iModal({
// 		type: 'inline',
// 		inline: '#ChooseAnotherProduct',
// 		width: 620,
// 		height: 200,
// 		title: getLang('ChooseAnotherProduct')
// 	});
	
// 	updateSharingDataChoices(shareProductId);
	
// 	var productCount = objectLength(sharingData),
// 		sharingDataWrapper = $("#SharingDataWrapper"),
// 		sharingDataChoices = $("#SharingDataChoices");

// 	if (productCount < 6) {

// 		sharingDataWrapper.addClass('no-scroll');
// 	} else {

// 		sharingDataChoices.jCarouselLite({
// 			btnNext: ".next",
// 			btnPrev: ".prev",
// 			visible: 4,
// 			scroll: 2,
// 			circular: false,
// 			speed: 200
// 		});
// 	}	
// }

function triggerStorefrontEvent(name, data, complete) {

	var payload = {
		name: name,
		data: data
	};
	
	$.ajax(config.ShopPath + '/remote.php?w=event', {

		data: JSON.stringify(payload),
		contentType: "application/json",
		type: "POST",
		dataType: "json",
		accepts: {
			json: 'application/json'
		},
		complete: complete
	});
}

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
		
		
		
		if(!!$(this).attr('data-rating')){
			
			var nRating = $(this).attr('data-rating');
		}else
		if($('img', this).length){
			
			var nRating = $(this).find('img').attr('src').match(/Rating(\d+)/)[1];
			
			$('img', this).remove();
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

$.fn.formatProductColorSwatches = function(){

	$(this).each( function(){

		$('ul', this).attr({
			'data-toggle': 'buttons',
			'class': 'btn-group'
		});

		$('ul > li', this).each( function(){

			var bgColor = $('.swatchColour', this).css('backgroundColor');

			$('.swatchColour', this).remove();

			$(this).addClass('btn').css('backgroundColor', bgColor);

			$('input', this).attr('autocomplete', 'off');

			$(this).append( $('<span />').addClass('glyphicon glyphicon-ok') );

			// var channels = bgColor.match(/\d+/g), 
			//     inverted_channels = channels.map(function(ch) {
			//         return 255 - ch;
			//     }), 
			//     inverted = 'rgb(' + inverted_channels.join(', ') + ')';


			$('.glyphicon', this).css('color', '#fff');

		});

		$('ul > li input:checked', this).parents('li').trigger('click');
	});
}

$.fn.formatProductOptions = function(){

	$(this).each( function(){

		$('ul', this).attr({
			'data-toggle': 'buttons',
			'class': 'btn-group'
		});

		$('ul > li', this).each( function(){

			$(this).addClass('btn btn-info').append( $('<span />').addClass('glyphicon glyphicon-ok') );
		});

		$('ul > li input:checked', this).parents('li').trigger('click');
	});
}


$.fn.chunkList = function(){
	
	var per_slide = 4;
	
	for(var i = 0; i < this.length; i += per_slide){
		
		var current = (i == per_slide)?' active':'';
		
		this.slice(i, (i + per_slide)).wrapAll('<li class="item' + current + '"><ul class="ProductList"></ul></li>');
	}
	
	return this;
}

$.fn.draggable = function(){

	return this;
}
