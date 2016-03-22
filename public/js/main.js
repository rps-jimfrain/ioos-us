$(function() {
    headerScroll = function () {
    	var scroll = $(this).scrollTop();
        if (scroll > 50) {
        	$('header > div > a').css('visibility', 'hidden');
        	$('header').css('position', 'fixed');
        	if ($('body').width() > 768) {
            	$('header').css('top', '-50px');
            	$('#grid-container').css('margin-top', '200px');
        	}
        } else {
        	$('header > div > a').css('visibility', 'visible');
            $('header').css({'position':'static','top':'0'});
            if ($('body').width() > 768)
            	$('#grid-container').css('margin-top', '40px');
        }
    }
	$(document).scroll(headerScroll);
	window.onresize = function (e) {
		if ($('body').width() > 768 && $('hdeader').css('top') === undefined)
			headerScroll();
	}
    $('[data-toggle="tooltip"]').tooltip();
});