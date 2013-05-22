(function (){
    var span;
    Template(window, ' - Template.js', 'active_tpl', function (documentURL) {
        var section, currentSpan, countdown, timer;
        if (documentURL.url.match(/page2\.html$/)) {
            section = document.body.getElementsByTagName('section')[0];
            currentSpan = section.getElementsByTagName('span')[0];
            if (currentSpan !== span) {
                span = currentSpan;
                countdown = section.getAttribute('data-tpl-expire') / 1000;
                timer = setInterval(function () {
                    countdown -= 1;
                    if (countdown > 0) {
                        span.innerHTML = 'Expire : ' + countdown + ' seconds';
                    } else {
                        span.innerHTML = 'Expired';
                        clearInterval(timer);
                    }
                }, 1000);
            }
        }
    });
}());