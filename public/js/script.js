/* global $ */

$(function() {
    

    if (document.querySelector('.alert')) {
        
        $('.alert').css('transform', 'translateY(0)');
        $('nav').css('transform', 'translateY(50px)');
        
        $('.alert').on('click', function() {
            $(this).css('transform', 'translateY(-60px)');
            $('nav').css('transform', 'translateY(0)');
        });
    }
});
