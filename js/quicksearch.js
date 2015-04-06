function clearResults(){

    $("#search_results").html('');
}

function getsearchXML( search_query ){

    var response;

    $.ajax({
        url: '/search.php',
        type: 'GET',
        data: { 
            action: 'AjaxSearch', 
            search_query: search_query 
        },
        success: function(data, textStatus, request) {

            response = $('result', data); 

            if (response) return parseResults(response);
        },
        error: function(req, err){ 

            console.error('Error: ' + err); 
        },
        dataType: 'xml'
    });
};

function doSearch( search_query ){

    results = [];

    if (search_query.length){

        getsearchXML( search_query );
    }else{

        $('#form-search').removeClass('has-results').addClass('no-results');
    }
}

function parseResults(response){

    clearResults();

    if($(response).length){

        $('#form-search').removeClass('no-results').addClass('has-results');

        $(response).each( function( index, value ) {

            var current_result         = $('<p />').append( $(value).text().replace('<![CDATA[', '').replace(']]', '') ),
                current_product_image  = $('.QuickSearchResultImage img', current_result).attr('src'),
                current_product_rating = 0,
                current_product_price  = 0;

            if( !$('.QuickSearchResultImage img', current_result).length ){

                current_product_image = config.defaultThumbnail;
            }

            if($('.QuickSearchResultMeta img.RatingIMG', current_result).length){

                var ratingImageSource = $('.QuickSearchResultMeta img.RatingIMG', current_result).attr('src');

                if(ratingImageSource){

                    current_product_rating = ratingImageSource.match(/Rating(\d+)/)[1];
                }
            }

            if( $('.QuickSearchResultMeta .Price', current_result).length ){

                current_product_price = parseFloat( $('.QuickSearchResultMeta .Price', current_result).text().replace('$', ''), 2);
            }

            var productData = {
                    image: current_product_image,
                    title: $('.QuickSearchResultMeta .QuickSearchResultName a', current_result).attr('href'),
                    name: $('.QuickSearchResultMeta .QuickSearchResultName a', current_result).text(),
                    price: current_product_price,
                    rating: parseInt( current_product_rating )
                };

            results.push( productData )
        });

        printResults();
    }
}

function printResults(){

    clearResults();

    if(!results.length){

        $("#search_results").html( 

            $('<li />').attr('class', 'list-group-item no-results-item text-center').append( 
                $('<a />')
                    .attr('href', '#')
                    .text('No Results Found') 
                )
        );

        return;
    }

    $.each(results, function(index, value) {

        var current_product_price = (value.price > 0)?'$' + value.price:'',
            itemTemplate = $('#template-quicksearch-product').html()
            .replace(new RegExp('{{product.url}}', 'g'), value.title)
            .replace(new RegExp('{{product.name}}', 'g'), value.name)
            .replace(new RegExp('{{product.image}}', 'g'), value.image)
            .replace(new RegExp('{{product.price}}', 'g'), current_product_price);

        $('#search_results').append( $(itemTemplate).html() );
    });
}

$(document).mouseup(function (e){

    var container = $("#search_results");

    if (!container.is(e.target) && container.has(e.target).length === 0){

        $('#form-search').removeClass('has-results').addClass('no-results');
    }
});

$(document).ready(function() {

    $("#search_query").keyup(function() {

        var search_query = encodeURIComponent( $(this).val().toLowerCase() );

        doSearch( search_query );
    });
});