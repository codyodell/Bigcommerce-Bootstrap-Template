function clearResults(){

    $("#search_results").html('');
}

function getsearchXML( search_query ){

    var response;

    $.ajax({
        url: '/search.php',
        type: 'GET',
        async: false,
        data: { 
            action: 'AjaxSearch', 
            search_query: search_query 
        },
        success: function(data, textStatus, request) {

            clearResults();

            response = $('result', data); 
        },
        error: function(req, err){ 

            console.error('Error: ' + err); 
        },
        dataType: 'xml'
    });

    if (response) return response;
};

function doSearch( search_query ){

    results = [];

    if (search_query.length){

        var response = getsearchXML( search_query );

        $(response).each( function( index, value ) {

            var current_result = $(value).text().replace('<![CDATA[', '').replace(']]', ''),
                current_result = $('<p />').append( current_result ),
                productData = {
                    image: $('.QuickSearchResultImage img', current_result).attr('src'),
                    product: $('.QuickSearchResultMeta .QuickSearchResultName a', current_result).attr('href'),
                    name: $('.QuickSearchResultMeta .QuickSearchResultName a', current_result).text(),
                    price: parseFloat( $('.QuickSearchResultMeta .Price', current_result).text().replace('$', ''), 2),
                    rating: parseInt( $('.QuickSearchResultMeta img', current_result).attr('src').match(/Rating(\d+)/)[1] )
                };

            results.push( productData )
        });

        printResults();
    }else{

        clearResults();

        results = [];
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

        var itemTemplate = $('#template-quicksearch-product').html()
            .replace(new RegExp('{{product.url}}', 'g'), value.product)
            .replace(new RegExp('{{product.name}}', 'g'), value.name)
            .replace(new RegExp('{{product.price}}', 'g'), '$' + value.price)
            .replace(new RegExp('{{product.image}}', 'g'), value.image);

        console.log( itemTemplate );

        $('#search_results').append( $(itemTemplate).html() );
    });
}

// Show the dropdown menu as long as there are characters in the text field
function checkTextField(){

    // If the value of id search_query is not empty show id search_results otherwise hide it
    if ($('#search_query').val() != ''){

        $('#form-search').removeClass('no-results').addClass('has-results');
    }else{

        $('#form-search').removeClass('has-results').addClass('no-results');
    }
}

// Hide the dropdown menu if there is a left mouse click outside of it
$(document).mouseup(function (e){

    var container = $("#search_results");

    if (!container.is(e.target) && container.has(e.target).length === 0){

        $('#form-search').removeClass('has-results').addClass('no-results');
    }
});

$(document).ready(function() {

    

    $('#form-search').css({ position: 'relative'});

    $("#search_query").keyup(function() {

        checkTextField();

        var search_query = encodeURIComponent( $(this).val().toLowerCase() );

        doSearch( search_query );
    });
});