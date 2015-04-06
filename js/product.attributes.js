(function($){
	// this closure contains option-type-specific plugins for display enhancement and validation

	if (typeof String.prototype.pad == 'undefined') {
		String.PAD_TYPE_LEFT = 0;
		String.PAD_TYPE_RIGHT = 1;
		
		String.prototype.pad = function (length, string, type) {
			if (type === undefined) {
				type = String.PAD_TYPE_RIGHT;
			}

			if (this.length >= length) {
				// don't run padding code if the string is long enough already
				return String(this);
			}

			var difference = length - this.length,
				padding = '';

			// repeat the string until we have all the padding we need
			while (padding.length < difference) {
				padding += string;
			}

			// pad the original string on the correct side
			if (type == String.PAD_TYPE_RIGHT) {
				return String(this) + padding.substr(0, difference);
			}

			return padding.substr(0, difference) + String(this);
		};
	}

	if (typeof Number.prototype.pad == 'undefined') {
		Number.prototype.pad = function (length, string, type) {
			return String(this).pad(length, string, type);
		};
	}



	$(function(){

		// mark the add to cart form as being handled by jquery.validate
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
	});

	$.fn.updateProductDetails = function (options) {

		options = $.extend({
			baseImage: '',
			baseThumb: ''
		}, options);

		return this.each(function(){

			var $this = $(this),
				showAddCartButton = options.price !== undefined && options.instock && options.purchasable,
				ShowAddToCartQtyBox = (typeof ShowAddToCartQtyBox) != 'undefined' ? ShowAddToCartQtyBox : false,
				defaults = {
	                findProductAttributeId: function(el) {
	                    return el.name;
	                },
	                isInStock: function(el) {
	                    return false;
	                },
	                hide_option: function(el, inStock, options) {
	                    $(el).parents('li:first').toggle(inStock);
	                },
	                label_option: function(el, inStock, options) {
	                    $(el).closest('label').toggleClass('outStock', !inStock);
	                }
	            };

            // enable out of stock status update
            $this.productOptionViewRadioOutOfStock(options, defaults);
            $this.productOptionViewRectangleOutOfStock(options, defaults);
            $this.productOptionViewPickListSwatchOutOfStock(options, defaults);
            $this.productOptionViewProductPickListOutOfStock(options, defaults);
            $this.productOptionViewSelectOutOfStock(options);

            // hide/show the add to cart button based on price and stock
			$this.find('.AddCartButton')
				.closest('.DetailRow')
					.toggle(showAddCartButton);

            // hide/show the add to cart button on QuickView
            $this.find('.addToCart input').toggle(showAddCartButton)
                .next().toggle(showAddCartButton);


			// hide/show the cart qty box too incase it's been moved? (product.functions.js did this)
			$this.find('.ShowAddToCartQtyBox')
				.toggle(showAddCartButton && ShowAddToCartQtyBox);

			// out of stock message
			$this.find('.OutOfStockMessage')
				.toggle(!showAddCartButton);

			if (options.purchasingMessage !== undefined) {
				$this.find('.OutOfStockMessage')
					.text(options.purchasingMessage);
			}

			// hide/show stock level
			$this.find('.VariationProductInventory')
				.closest('.DetailRow')
					.toggle((options.stockMessage || options.stock) !== undefined)
					.end()
				.text(options.stockMessage || options.stock);

			// hide/show weight
			$this.find('.VariationProductWeight')
				.text(options.weight === undefined ? '' : options.weight)
				.closest('.DetailRow')
					.toggle(options.weight !== undefined);

			// hide/show sku
			$this.find('.VariationProductSKU')
				.text(options.sku === undefined ? '' : options.sku)
				.closest('.DetailRow')
					.toggle(options.sku !== undefined);

			// hide/show price - slightly more complex code due to control panel sharing
			$this.find('.VariationProductPrice').each(function(){
				var $this = $(this);

				if ($this.is('input')) {
					// if the price is an input then set its raw value
					$this.val(options.unformattedPrice === undefined ? '' : options.unformattedPrice);
					return;
				}

				// otherwise use regular hide/show formatted behaviour
				$this.html(options.price === undefined ? '' : options.price)
					.closest('.DetailRow')
						.toggle(options.price !== undefined);
			});

			// price label
			if (options.priceLabel !== undefined) {
				$this.find('.PriceRow .Label').text(options.priceLabel);
			}

			// hide/show savings
			$this.find('.YouSaveAmount')
				.text(options.saveAmount === undefined ? '' : options.saveAmount);

			$this.find('.YouSave, .RetailPrice')
				.toggle(options.saveAmount !== undefined);

			$this.find('.RetailPrice .Value')
				.html(options.saveAmount === undefined || options.rrp === undefined ? '' : options.rrp);

		});
	};

	/**
	* This plugin implements behaviours applicable to all option types which can trigger sku / rule effects (change of
	* price, weight, image, etc.)
	*/
	$.fn.productOptionRuleCondition = function (options) {
		return this.each(function(){
			$(this)
				.addClass('productAttributeRuleCondition')
				.find(':input')
				.change(function(){

					// ask the server for any updated product information based on current options - can't use
					// ajaxSubmit here because it will try to send files too so use serializeArray and put our custom
					// 'w' parameter into it

                    // we want to enable out-of-stock notification for all 3 (product detail, quickview and cart) pages
                    // and for some historical reasons they all have different html structure
                    // (eg, cart page dosn't have #productDetailsAddToCartFrom form)
                    // therefore we need to find the correct form to serialize
                    // rather than doing massive template upgrades

                    var data = null;

                    if($('#productDetailsAddToCartForm').length) {

                        data = $('#productDetailsAddToCartForm').serializeArray();
                    } else {

                        data = $('.productAttributeList:first').closest('form').serializeArray();
                    }

					data.push({
						name: 'w',
						value: 'getProductAttributeDetails'
					});

					data = $.param(data);

					$.ajax({
						url: '/remote.php',
						type: 'POST',
						dataType: 'json',
						data: data,
						success: function (response) {

							if (response.success && response.details) {

                                if($('#ProductDetails').length) {

                                    $('#ProductDetails').updateProductDetails(response.details);
                                }else {

                                    $('.productAttributeList:first').updateProductDetails(response.details);
                                }
							}
						}
					});
				});
		});
	};

	/**
	* This plugin implements behaviours applicable to all configurable option types (validation, etc.).
	*/
	$.fn.productOptionConfigurable = function (options) {

		//console.log(options);

		if(options.condition)
			this.productOptionRuleCondition(options);

		return this.each(function(){

			var target = $(this).find('.validation').eq(0); // only select the first matching target (for radios)

			if(!target.length)
				return;

			if (options.required) {
				target.rules('add', {
					required: true,
					messages: {
						required: options.validation.required
					}
				});
			}
		});
	};

	/**
	* This plugin implements a generic product options behaviour which marks a parent element of the currently selected
	* choice with a 'selectedValue' class for easy css-based highlighting.
	*/
	$.fn.productOptionSelectedValue = function (options) {

		options = $.extend({
			container: 'li'
		}, options || {});

		return this.each(function(){
			var $this = $(this);

			// when selecting an input, apply a css class to it's parent list item
            $this.delegate('input', 'click', function(event){
                var isSelected = $(this).closest(options.container).hasClass('selectedValue');
                if(isSelected) {

                    // if it's a radio option uncheck it
                    $this.find(options.container + ' .radio .checked').removeClass('checked');

                    // unselect the already selected one and
                    // trigger the change event to update out-of-stock status
                    $(this).prop('checked', false);
                    $(this).change();
                }
                else {
                    // change of selection, marked all as unselected
                    $this.find(options.container).removeClass('selectedValue');
                }
                $(this).closest(options.container).toggleClass('selectedValue');
            });

			// apply on page load too incase something is pre-selected
			$this.find(':checked')
				.closest(options.container)
					.addClass('selectedValue');
		});
	};

	/**
	* This plugin implements a generic product options behaviour which provides a small preview / zoom window for
	* swatches and images.
	*/
	$.fn.productOptionPreviewDisplay = function (options) {

		// disabled for mobile devices
		if (typeof config == 'object' && config.isMobile)
			return;

		var previewDisplay = $('.productOptionPreviewDisplay');

		if (!previewDisplay.size()) {

			previewDisplay = $('<div class="productOptionPreviewDisplay" />').appendTo('body');
		}

		$(this).delegate('.showPreview', 'mouseenter', function(){
			// put preview content into the display container
			var previewContent = $(this)
				.closest('.hasPreview')
					.find('.previewContent');

			if (!previewContent.size()) {
				return;
			}

			previewDisplay.empty();

			previewContent.children()
				.clone()
				.find('.showPreview')
					.removeClass('.showPreview')
					.end()
				.appendTo(previewDisplay);

			var offset = $(this).offset();

			// position and show the display
			previewDisplay
				.css({
					top: offset.top + $(this).outerHeight() + 'px',
					left: offset.left + $(this).outerWidth() + 'px'
				})
				.stop(true, true)
				.fadeIn();
		});

		$(this).delegate('.showPreview', 'mouseleave', function(){
			// hide the display
			previewDisplay
				.stop(true, true)
				.fadeOut();
		});

		return this;
	};

	/**
	* This plugin implements behaviours for pick-list types rendering as radio inputs.
	*/
	$.fn.productOptionViewRadio = function (options) {
		this.productOptionSelectedValue(options);
		return this;
	};

	/**
	* This plugin implements behaviours for pick-list types rendering as rectangle inputs.
	*/
	$.fn.productOptionViewRectangle = function (options) {

		this.productOptionSelectedValue(options);

		return this.each(function(){
			// deselect the radio element when clicking on rectangles as the radio element itself isn't visible
			$(this).delegate('input', 'click', function(){
				$(this).blur();
			});
		});
	};

    $.fn.productOptionViewOutOfStock = function(options, view) {

        // since out-of-stock feature is feature flagged
        // check the existence of those oos specific parameters before doing any real work
        if(typeof(options.selectedAttributeValues) == 'undefined' || typeof(options.inStockAttributeValues) == 'undefined') {
            return true;
        }

        $.each(this.find('.productAttributeRow'), function(index, row) {

            if($(row).find('.productAttributeLabel').find('.required:visible').length == 0) {
                // not mandatory option should not be part of SKU
                // and should be ignored
                return true;
            }

            $.each($(row).find('.productAttributeValue').find(view.selector), function(index, el) {
                var productAttributeId = view.findProductAttributeId(el);
                var matches = productAttributeId.match(/attribute\[(\d+)\]/);
                productAttributeId = parseInt(matches[1], 10);
                var selectedValue = options.selectedAttributeValues[productAttributeId];
                var currentValue = parseInt(el.value, 10);

                if ($.inArray(currentValue, options.inStockAttributeValues) !== -1 || view.isInStock(el)) {
                    view[options.optionOutOfStockBehavior](el, true, options);
                } else {
                    view[options.optionOutOfStockBehavior](el, false, options);
                }
          });
        });
    };

    /**
     * This plugin implements behavior for Radio View
     * to handle out-of-stock status update
     */
    $.fn.productOptionViewRadioOutOfStock = function(options, defaults) {
        this.productOptionViewOutOfStock(options, $.extend({}, defaults, {
            selector: '.productOptionViewRadio input',
            label_option: function(el, inStock, options) {
                $(el).closest('label').toggleClass('outStock', !inStock);
                $(el).closest('label').find('span.name').toggleOutStockText(options, inStock);
            }})
        );
    };

    /**
     * This plugin implements behavior for Rectangle View
     * to handle out-of-stock status update
     */
    $.fn.productOptionViewRectangleOutOfStock = function(options, defaults) {
        this.productOptionViewOutOfStock(options, $.extend({}, defaults, {
            selector: '.productOptionViewRectangle input'
            })
        );
    };

    /**
     * This plugin implements behavior for Swatch View
     * to handle out-of-stock status update
     */
    $.fn.productOptionViewPickListSwatchOutOfStock = function(options, defaults) {
        this.productOptionViewOutOfStock(options, $.extend({}, defaults, {
            selector: '.productOptionPickListSwatch input'
            })
        );
    };

    /**
     * This plugin implements behavior for Product List
     * to handle out-of-stock status update
     */
    $.fn.productOptionViewProductPickListOutOfStock = function(options, defaults) {
        this.productOptionViewOutOfStock(options, $.extend({}, defaults, {
            selector: '.productOptionViewProductPickList input, .productOptionViewProductPickListWithImage input',
            hide_option: function(el, inStock, options) {
                $(el).parents('tr:first').toggle(inStock);
            },
            label_option: function(el, inStock, options) {
                $(el).closest('label').toggleClass('outStock', !inStock);
                $(el).siblings('span').toggleOutStockText(options, inStock);
            }})
        );
    };

    /**
     * This plugin implements behavior for select/dropdown pick-list types
     * to handle out-of-stock status update
     */
    $.fn.productOptionViewSelectOutOfStock = function(options) {
        this.productOptionViewOutOfStock(options, {
            selector: 'option',
            findProductAttributeId: function(el) {
                return $(el).parents('select:first').prop('name');
            },
            isInStock: function(el) {
                // select/dropdown has a default please choose a option
                // which should always be considered in-stock option value
                return el.value === '';
            },
            hide_option: function(el, inStock, options) {
                var select = $(el).closest('select');
                if (select.is(':disabled')) {
                    // get the real select element
                    select = select.data('linkedSelectElement');
                }
                // save the currently selected value
                var val = select.val();
                $(el).toggleOption(inStock);
                // apply the previously selected value
                select.val(val);
                // ensure the label matches the selected options text
                select.siblings('span').text(select.find(':selected').text());
            },
            label_option: function(el, inStock, options) {
                $(el).toggleOutStockText(options, inStock);
            }
        });
    };

    $.fn.parseMessage = function(str) {

        var result = str;
        result = result.replace(/&lt;/g, "<");
        result = result.replace(/&gt;/g, ">");
        result = result.replace(/&quot;/g, "\"");
        result = result.replace(/&#039;/g, "'");
        result = result.replace(/&amp;/g, "&");
        return result;
    };

    $.fn.toggleOutStockText = function(options, inStock) {
        if (options.outOfStockMessage) {
            var parsedMessage = this.parseMessage(options.outOfStockMessage);
            var text = $(this).text();
            if(inStock) {
                $(this).text(text.replace(' ('+parsedMessage+')', ''));
            }
            else if(text.indexOf(parsedMessage) === -1) {
                $(this).text(text + ' ('+parsedMessage+') ');
            }
        }
    };

    /**
     * Visually hides the option from user by moving option to an invisible
     * and disabled select placeholder element.
     *
     * This approach is required rather than simply hiding the option because
     * hidden option can still be included when serializeArray() is called and
     * cause wrong value to be submitted.
     * (eg. if you have option 1, 2, 3 and 2 is hidden, when you select 3,
     * serializeArray() will use the value of 2 instead of 3)
     */
    $.fn.toggleOption = function(show) {
        var currentSelectElement = $(this).closest('select'), // the select containing this
            disabledSelectElement, // the disabled select element
            selectElement; // the real select element

        if (currentSelectElement.is(':disabled')) {
            disabledSelectElement = currentSelectElement;
            selectElement = disabledSelectElement.data('linkedSelectElement');
        } else {
            selectElement = currentSelectElement;
            disabledSelectElement = currentSelectElement.data('linkedSelectElement');
            if (!disabledSelectElement) {
                // create the disabled placeholder select element
                disabledSelectElement =
                    $('<select>')
                        .prop('disabled', true)
                        .hide()
                        .attr('name', currentSelectElement.attr('name'))
                        .addClass(currentSelectElement.attr('class'))
                        .data('linkedSelectElement', selectElement)
                        .insertAfter(selectElement);
                selectElement.data('linkedSelectElement', disabledSelectElement);
            }
        }

        // move the option to the correct select element if required
        if (currentSelectElement.is(':disabled') && show) {
            var previousIndex = this.data('index');
            if (previousIndex > 0) {
                this.insertAfter(selectElement.find('option:eq(' + (previousIndex-1) + ')'));
            } else {
                $(this).prependTo(selectElement);
            }
        } else if (!currentSelectElement.is(':disabled') && !show) {
            this.data('index', currentSelectElement.find('option').index(this));
            $(this).prependTo(disabledSelectElement);
        }
    };

	/**
	* This plugin implements behaviours for pick-list types rendering as a select input.
	*/
	$.fn.productOptionViewSelect = function (options) {
		// nothing to do
		return this;
	};

	/**
	* This plugin implements behaviours for product picklist types
	*/
	$.fn.productOptionViewProductPickList = function (options) {
		this.productOptionSelectedValue(options);
		return this;
	};

	/**
	* Checkbox required validator. The built-in required method looks up elements by name which causes the
	* validation to not work for checkbox attributes which have a hidden input component.
	*/
	$.validator.addMethod('checkboxRequired', function (value, element) {
		return this.findByName(element.name).filter(':checkbox:checked').length > 0;
	});

	/**
	* This plugin implements behaviours applicable to checkbox option types.
	*/
	$.fn.productOptionConfigurableEntryCheckbox = function (options) {
		var required = options.required;
		options.required = false;

		this.productOptionConfigurable(options);

		return this.each(function(){
			var target = $(this).find('.validation');

			if (required) {
				target.rules('add', {
					checkboxRequired: true,
					messages: {
						checkboxRequired: options.validation.required
					}
				});
			}
		});
	};

	/**
	* Validates the file type (extension)
	*/
	$.validator.addMethod('fileType', function (value, element, fileTypes) {

		if (!value) {
			return true;
		}

		var dot, extension;

		dot = value.lastIndexOf('.');

		if (dot < 0) {
			return false;
		}

		extension = value.substr(dot + 1).toLowerCase();

		if (extension == '') {
			return false;
		}

		return $.inArray(extension, fileTypes) >= 0;
	});

	/**
	* This plugin implements behaviours applicable to file-upload option types.
	*/
	$.fn.productOptionConfigurableEntryFile = function (options) {
		// if the delete existing file input is present, then this field isn't required
		if ($('#' + $(this).attr('id') + '_Delete').length) {
			options.required = false;
		}

		this.productOptionConfigurable(options);

		return this.each(function(){
			var target = $(this).find('.validation');

			if ($.isArray(options.fileTypes) && options.fileTypes.length) {
				target.rules('add', {
					fileType: options.fileTypes,
					messages: {
						fileType: options.validation.typeNotAllowed
					}
				});
			}
		});
	};

	/**
	* Checks the earliest date
	*/
	$.validator.addMethod('earliestDate', function (value, element, earliestDate) {
		if (!value) {
			return true;
		}

		var date = new Date();
		date.setISO(value);

		return date >= earliestDate;
	});

	/**
	* Checks latest date
	*/
	$.validator.addMethod('latestDate', function (value, element, latestDate) {
		if (!value) {
			return true;
		}

		var date = new Date();
		date.setISO(value);

		return date <= latestDate;
	});

	/**
	* Checks that a date falls between a range
	*/
	$.validator.addMethod('dateRange', function (value, element, param) {
		if (!value) {
			return true;
		}

		var date = new Date();
		date.setISO(value);

		return date >= param.earliestDate && date <= param.latestDate;
	});

	/**
	* This plugin implements behaviours applicable to text-entry option types.
	*/
	$.fn.productOptionConfigurableEntryDate = function (options) {
		this.productOptionConfigurable(options); // inherit base configurable behaviour

		return this.each(function(){
			var $this = $(this),
				validationTarget = $this.find('.validation'),
				yearField = $this.find('.year'),
				monthField = $this.find('.month'),
				dayField = $this.find('.day'),
				_revalidate;

			_revalidate = function () {
				validationTarget
					.filter('.valid, .error')
					.each(function(){
						$(this).valid();
					});
			};

			// whenever a date select is changed, populate the hidden-for-validation field with the date string - note
			// this is for js validation only and server validation should still be performed on individual selects for
			// when js is disabled
			$this.find('.month, .day, .year')
					.change(function(){
						// build y-m-d string for locale-neutral validation
						var year = yearField.val(),
							month = monthField.val(),
							day = dayField.val(),
							date = '';

						if (year && month && day) {
							date = year + '-' + month + '-' + day;
						}

						// populate the validation target and trigger change events
						validationTarget.val(date);
						_revalidate();
					})
					.change(); // trigger change once on plugin application to populate input

			// after the above, we can validate a date in the hidden field because we know the format is fine
			validationTarget.rules('add', {
				dateISO: true,
				messages: {
					dateISO: options.validation.invalidDate
				}
			});

			if (options.limitDate) {
				var earliestDate, latestDate;
				earliestDate = new Date(options.earliestDate * 1000);
				earliestDate.setHours(0,0,0);

				latestDate = new Date(options.latestDate * 1000)
				latestDate.setHours(23,59,59);

				if (options.limitDateOption == 'range') {
					validationTarget.rules('add', {
						dateRange: {
							earliestDate: earliestDate,
							latestDate: latestDate
						},
						messages: {
							dateRange: options.validation.range
						}
					});
				}
				else if (options.limitDateOption == 'earliest') {
					validationTarget.rules('add', {
						earliestDate: earliestDate,
						messages: {
							earliestDate: options.validation.earliestDate
						}
					});
				}
				else if (options.limitDateOption == 'latest') {
					validationTarget.rules('add', {
						latestDate: latestDate,
						messages: {
							latestDate: options.validation.latestDate
						}
					});
				}
			}

			var selectDateCallback = function(dateText, picker){
				dayField.val(picker.currentDay.pad(2, "0", String.PAD_TYPE_LEFT)).change();
				monthField.val((picker.currentMonth + 1).pad(2, "0", String.PAD_TYPE_LEFT)).change();
				yearField.val(picker.currentYear).change();
			}

			var getSelectedDate = function(){
				var year = yearField.val(),
					month = monthField.val(),
					day = dayField.val();

				if (!year || !month || !day) {
					return;
				}

				return new Date(year, month - 1, day);
			}

			// add a datepicker ui
			var picker = $this.find('.picker').datepicker({
				showOn: 'both',
				buttonImage: options.buttonImage,
				buttonImageOnly: true,
				defaultDate: new Date(),
				firstDay: 1,
				minDate: new Date(options.earliestDate * 1000),
				maxDate: new Date(options.latestDate * 1000),
				beforeShow: function (input, picker) {
					// set the caledar to the correct date
					$this.find('.picker')
						.datepicker('setDate', getSelectedDate());
				},
				onSelect: selectDateCallback
			});

			if(typeof config == 'object' && config.isMobile) {
				// hide the standard date selector and replace with a
				// mobile date selector placeholder
				$this.find('.dateselector')
					.hide()
					.after('<div class="mobile-dateselector"/>');

				// add an onClose handler to the datepicker to hide the
				// dimmer overlay
				picker.datepicker('option', 'onClose', function(){
					dimmer.hide();
				});

				// change the datepicker's onSelect handler to update the
				// mobile date selector
				var updateMobileDateSelector = function() {
					$this.find('.mobile-dateselector').html(validationTarget.val());
				}

				picker.datepicker('option', 'onSelect', function(dateText, picker){
					selectDateCallback(dateText, picker);
					updateMobileDateSelector();
				});

				// add a click handler to show the dimmer overlay with
				// the date picker centered on top
				$this.find('.mobile-dateselector').click(
					function(){
						dimmer.show(function(){
							picker.datepicker('hide');
						});

						picker.datepicker('show');

						var widget = picker.datepicker('widget');

						height = widget.height();
						width = widget.width();
						top =  ($(window).height() - height) / 2+$(window).scrollTop() + 'px';
						left = ($(window).width() - width) / 2+$(window).scrollLeft() + 'px';

						widget.css({
							'z-index': 4001,
							position: 'absolute',
							top: top,
							left: left
						});
					}
				);

				updateMobileDateSelector();
			}
		});
	};

	/**
	* This plugin implements behaviours applicable to text-entry option types.
	*/
	$.fn.productOptionConfigurableEntryText = function (options) {

		this.productOptionConfigurable(options); // inherit base configurable behaviour

		// BIG-9754 clear text field default value when entering a new value
		clearText($(this));

		return this.each(function(){
			var target = $(this).find('.validation');

			if (options.validateCharacterLength) {
				if (options.minLength && options.maxLength) {
					// use rangelength when both min and max lengths are set
					target.rules('add', {
						rangelength: [ options.minLength, options.maxLength ],
						messages: {
							rangelength: options.validation.rangeLength
						}
					});
				} else if (options.minLength) {
					target.rules('add', {
						minlength: options.minLength,
						messages: {
							minlength: options.validation.minLength
						}
					});
				} else if (options.maxLength) {
					target.rules('add', {
						maxlength: options.maxLength,
						messages: {
							maxlength: options.validation.maxLength
						}
					});
				}
			}
		});
	};

	/**
	* Number validator which is aware of locale-specific decimal and thousands tokens (but not currency)
	*/
	$.validator.addMethod('localenumber', function (value, element, param) {

		var regex, pattern;

		param = $.extend({
			decimalToken: '.',
			thousandsToken: ',',
			integerOnly: false
		}, param || {});

		if (this.optional(element)) {
			return true;
		}

		pattern = "^[-+]?(?:\\d+|\\d{1,3}(?:\\" + param.thousandsToken + "\\d{3})+)";
		if (!param.integerOnly) {
			pattern += "(?:\\" + param.decimalToken + "\\d+)?";
		}
		pattern += "$";

		regex = new RegExp(pattern);

		return regex.test(value);
	});

	/**
	* This plugin implements behaviours applicable to numbers-only text-entry option types.
	*/
	$.fn.productOptionConfigurableEntryNumbersOnlyText = function (options) {

		this.productOptionConfigurable(options);

		// BIG-9754 clear text field default value when entering a new value
		clearText($(this));

		// this does not inherit behaviour from the generic text input as lengths have a different meaning
		return this.each(function(){
			var target = $(this).find('.validation');

			if (options.integerOnly) {
				// validate an integer number
				target.rules('add', {
					localenumber: {
						decimalToken: options.decimalToken,
						thousandsToken: options.thousandsToken,
						integerOnly: true
					},
					messages: {
						localenumber: options.validation.notInteger
					}
				});
			} else {
				target.rules('add', {
					localenumber: {
						decimalToken: options.decimalToken,
						thousandsToken: options.thousandsToken
					},
					messages: {
						localenumber: options.validation.invalidNumber
					}
				});
			}

			if (options.limitInput) {
				if (options.limitInputOption == 'range') {
					target.rules('add', {
						range: [ options.lowestValue, options.highestValue ],
						messages: {
							range: options.validation.range
						}
					});
				} else if (options.limitInputOption == 'lowest') {
					target.rules('add', {
						min: options.lowestValue,
						messages: {
							min: options.validation.lowestValue
						}
					});
				} else if (options.limitInputOption == 'highest') {
					target.rules('add', {
						max: options.highestValue,
						messages: {
							max: options.validation.highestValue
						}
					});
				}
			}
		});
	};

	/**
	* Max lines validator
	*/
	$.validator.addMethod('maxlines', function (value, element, maxLines) {
		var matchedLines, matchedLinesLength;

		matchedLines = value.match(/\n/gm);

		if (matchedLines === null) {
			matchedLinesLength = 1;
		}
		else {
			matchedLinesLength = matchedLines.length + 1;
		}

		return matchedLinesLength <= maxLines;
	});

	/**
	* This plugin implements behaviours specifically for multi-line text inputs.
	*/
	$.fn.productOptionConfigurableEntryTextMultiLine = function (options) {
		this.productOptionConfigurableEntryText(options); // inherit base configurable behaviour

		// BIG-9754 clear text field default value when entering a new value
		clearText($(this));

		return this.each(function(){
			var target = $(this).find('.validation');

			if (options.validateLineLength && options.maxLines) {
				target.rules('add', {
					maxlines: options.maxLines,
					messages: {
						maxlines: options.validation.maxLines
					}
				});
			}
		});
	};

	/**
	* This plugin implements behaviours for pick-list product-based types.
	*/
	$.fn.productOptionConfigurablePickListProduct = function (options) {
		this.productOptionConfigurable(options);
		return this;
	};

	/**
	* This plugin implements behaviours for product picklist w/ image types
	*/
	$.fn.productOptionViewProductPickListWithImage = function (options) {
		this.productOptionPreviewDisplay(options);

		this.productOptionSelectedValue($.extend({}, options, {
			container: 'tr'
		}));

		return this.each(function(){
			$(this).find('input:checked')
				// scroll the picklist to the pre-selected value to make it visible
				.each(function(){
					var $this = $(this);
					$(this).closest('.scrollContainer')
						.scrollTop($(this).closest('tr').position().top);
				});
		});
	};

	/**
	* This plugin implements behaviours for pick-list swatch types.
	*/
	$.fn.productOptionConfigurablePickListSwatch = function (options) {
		this.productOptionConfigurable(options); // inherit base configurable behaviour
		this.productOptionSelectedValue(options);
		this.productOptionPreviewDisplay(options);

		return this.each(function(){
			// the radio input is hidden when js is enabled so don't try to focus it
			$(this).delegate('input', 'click', function(){
				$(this).blur();
			});
		});
	};

	/**
	* This plugin implements behaviours for pick-list set types.
	*/
	$.fn.productOptionConfigurablePickListSet = function (options) {
		this.productOptionConfigurable(options); // inherit base configurable behaviour
		// view specific behaviour will be applied by the view plugin
		return this;
	};

	/**
	 * this function is copied from init.js of some of the themes
	 * it is used to clear the text when tring to enter a new value for the text input and text area
	 * @param parentElement
	 */
	function clearText(parentElement) {

		parentElement.find('input[type=text]').not('input[readonly=readonly]').each(function() {
			var default_value = this.value;
			$(this).focus(function() {
				if(this.value == default_value) {
					this.value = '';
				}
			});
			$(this).blur(function() {
				if(this.value == '') {
					this.value = default_value;
				}
			});
		});

		parentElement.find('textarea').not('textarea[readonly=readonly]').each(function() {
			var default_value = this.value;
			$(this).focus(function() {
				if(this.value == default_value) {
					this.value = '';
				}
			});
			$(this).blur(function() {
				if(this.value == '') {
					this.value = default_value;
				}
			});
		});

	}


})(jQuery);
