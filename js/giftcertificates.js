function ToggleCertificateAmount() {

	if($('#CustomAmountVisible label').css('display') != "none" && $('#AmountSelectVisible label').css('display') != "none") {
		if($('#custom_amount').prop('checked') == true) {
			$('#SelectAmount').hide();
			$('#CustomAmount').show();
		}
		else {
			$('#SelectAmount').show();
			$('#CustomAmount').hide();
		}
	}
}

function CheckGiftCertificateForm() {

	if($('#to_name').val() == "") {
		alert('%%LNG_EnterValidCertificateToName%%');
		$('#to_name').focus();
		$('#to_name').select();
		return false;
	}

	if($('#to_email').val() == "" || $('#to_email').val().indexOf('.') == -1 || $('#to_email').val().indexOf('@') == -1) {
		alert('%%LNG_EnterValidCertificateToEmail%%');
		$('#to_email').focus();
		$('#to_email').select();
		return false;
	}

	if($('#from_name').val() == "") {
		alert('%%LNG_EnterValidCertificateFromName%%');
		$('#from_name').focus();
		$('#from_name').select();
		return false;
	}

	if($('#from_email').val() == "" || $('#from_email').val().indexOf('.') == -1 || $('#from_email').val().indexOf('@') == -1) {
		alert('%%LNG_EnterValidCertificateFromEmail%%');
		$('#from_email').focus();
		$('#from_email').select();
		return false;
	}

	if($('#message').val().length > 200) {
		alert('%%LNG_GiftCertificateMessageTooLong%%');
		$('#message').focus();
		$('#message').select();
		return false;
	}

	if($('#CustomAmountVisible').css('display') == "none") {
		if($('#selected_amount').val() == '') {
			alert('%%LNG_SelectValidGiftCertificateAmount%%');
			$('#selected_amount').focus();
			return false;
		}
	}
	else if($('#AmountSelectVisible').css('display') == "none") {
		if(isNaN($('#certificate_amount').val()) || $('#certificate_amount').val() == 0) {
			alert('%%LNG_EnterValidGiftCertificateAmount%%');
			$('#certificate_amount').focus();
			$('#certificate_amount').select();
			return false;
		}
		else if('%%GLOBAL_GiftCertificateMinimum%%' != 0 && %%GLOBAL_GiftCertificateMinimum%% > $('#certificate_amount').val()) {
			alert('%%LNG_EnterGiftCertificateValueBetween%%');
			$('#certificate_amount').focus();
			$('#certificate_amount').select();
			return false;
		}
		else if('%%GLOBAL_GiftCertificateMaximum%%' != 0 && parseFloat($('#certificate_amount').val()) > %%GLOBAL_GiftCertificateMaximum%%) {
			alert('%%LNG_EnterGiftCertificateValueBetween%%');
			$('#certificate_amount').focus();
			$('#certificate_amount').select();
			return false;
		}
	}
	else {
		alert('%%LNG_SelectValidGiftCertificateAmount%%');
		$('#selected_amount').focus();
		return false;
	}

	if($("#expiryInfo").css('display') != "none" && $('#agree').prop('checked') != true) {
		alert('%%LNG_PleaseAgreeGiftCertificateTerms%%');
		$('#agree').focus();
		$('#agree').select();
		return false;
	}

	if($('#agree2').prop('checked') != true) {
		alert('%%LNG_PleaseAgreeGiftCertificateTerms%%');
		$('#agree2').focus();
		$('#agree2').select();
		return false;
	}


	if($('#themeSelect').css('display') != "none" && !$('.themeCheck:checked').length) {
		alert('%%LNG_SelectValidGiftCertificateTheme%%');
		return false;
	}

	return true;
}

function UpdateMessageRemaining(event) {

	var remaining = 200 - $('#message').val().length;
	if(remaining >= 0) {
		$('#remaining').html(remaining);
	}
	else {
		$('#remaining').html('0');
		if(typeof(event) != "undefined") {
			if(event.keyCode != 8) {
				event.preventDefault();
				return false;
			}
		}
	}
}

function PreviewGiftCertificate() {

	if(CheckGiftCertificateForm() == false) {
		return false;
	}
	
	if ($(window).width() < 767 ) {
		var url = '%%GLOBAL_ShopPath%%/giftcertificates.php?action=preview&'+$('#frmGiftCertificate').serialize();	
		window.open(url, 'Preview Gift Certificate', 'window settings');
	} else {
		$.iModal({
			type: 'iframe',
			url: '%%GLOBAL_ShopPath%%/giftcertificates.php?action=preview&'+$('#frmGiftCertificate').serialize(),
			width: 900,
			height: 400,
			closeTxt: true,
			title: '%%GLOBAL_GiftCertificatePreviewModalTitle%%',
			onClose : function() {
				$.iModal.close();
			}
		});
	}
}

$(document).ready(function() {

	ToggleCertificateAmount();

	$('#message').keyup(function(e) {

		return UpdateMessageRemaining(e);
	});

	UpdateMessageRemaining();
});