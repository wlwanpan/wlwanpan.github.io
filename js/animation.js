var morphState = 'cat';

var TriangleMorphing = function() {

    var catPath = Snap("#c1-c7").selectAll('path');
    var logoPath = Snap("#l1-l7").selectAll('path');

    var scatterDuration = 1000; // Time duration of scatter animation
    var scatterBuffer = 90; // Degree [range(0, 360)] of rotation on (x, y, z) axes
    var fixationDuration = 700; // Time duration of merging animation

    $('.head-animate').click(function() {

        if (morphState != 'logo') {
            var logoContainer = $("#logo-container");
            var svgContainer = $("#logo-svg-box")[0];
           
            logoContainer.css('min-height', '50px').css('min-width', '50px');
            logoContainer.css('z-index', '9999');
            
            // First Scatter Animation
            scatter(scatterDuration);

            logoContainer.velocity({
                width: '10%',
                left: "5%",
            }, {
                duration: scatterDuration,
            });
            // Second Queue Morph+fix Logo
            setTimeout(function() {
                transmutate();
                logoContainer.velocity({
                    top: "0px",
                    height: '50px',
                    width: '50px',
                }, {
                    duration: fixationDuration,
                    easing: "easeInQuad",
                    complete: function () {
                        $("#head").removeClass('head-animate');
                        $("#tail").removeClass('tail-animate');
                        $(this).css('position', 'fixed');
                        morphState = 'logo';
                    }
                });
            }, scatterDuration);
        } else {console.log("already logo");}
    });
    var scatter = function (float) {

        for (var i = 0; i < 7; i++) {

            var angle = (Math.random() * (scatterBuffer + scatterBuffer) - scatterBuffer);
            var finalMatrix = "t 0 -20, r" + angle + "0% 0%" ;
            catPath[i].animate({transform: finalMatrix}, float, mina.easeIn);
        }
    }
    var transmutate = function () {
        
        for (var i = 0; i < 7; i++) {
            catPath[i].animate({transform: "t 0, 0", d: logoPath[i].attr("d")}, fixationDuration, mina.easeOut);
        }
    }
}
$(window).on('load', function() {

    var HeaderHeight = 50;
    var Morphable = $('#c1-c7 path');

	$('#intro-container').css('height', window.innerHeight-HeaderHeight);

    TriangleMorphing(); // Call logo transformation

	$('.tlt').textillate({
        initialDelay: 0,
        in: {effect: 'bounceInDown'}
	});
    //introduction phrases 
	$(function(){
        $(".command-typing").typed({
            strings: ["Welcome ^200 to my personal website.", "I like to ^300 animate stuff ^200 on the web.", "Being touched on its head scares him"],
            typeSpeed: 35,
            loop: true,
            startDelay: 1700,
            backSpeed: 1,
            backDelay: 2000,
            showCursor: false,
            contentType: 'html',
        });
    });

    // Toggle to Minimize or Maximize All Resume Brackets
    $('#bracket-toggle-button').on('click', function(){
        // toggle off => display
        if ($(this).hasClass('fa-toggle-on')) {

            $(this).removeClass('fa-toggle-on');
            $(this).addClass('fa-toggle-off');

            $('.rotate').each(function() {
                if ($(this).hasClass('rotate-selected')) {$(this).trigger('click');}
            });

        } else {

            $(this).removeClass('fa-toggle-off');
            $(this).addClass('fa-toggle-on');

            $('.rotate').each(function() {
                if (!$(this).hasClass('rotate-selected')) {$(this).trigger('click');}
            });

        }
    });
    // Minimize or Maximize Resume Brackets
    $('.rotate').on('click', function(){
        //$(this).removeClass('selected');
        var bracket = $(this).parent().parent().find('.bracket-closing');
        var bracketp = $(this).parent().find('.closing-bracket-p');

        if ($(this).hasClass('rotate-selected')) {

            $(this).removeClass('rotate-selected');
            bracket.removeClass('bracket-selected');
            bracketp.css("opacity", 0);

        } else {

            $(this).addClass('rotate-selected');
            bracket.addClass('bracket-selected');
            bracketp.css("opacity", 1);
        }
    });
    // Swapping header black to white
    var ScrollPosn = 0;

    $(document).scroll(function() { 

        var ScrollPosn = $(this).scrollTop();
        var SectionAboutme = $("#section-aboutme").offset().top - HeaderHeight;
        var SectionProject = $("#section-project").offset().top - HeaderHeight;
        var buffer = window.innerHeight/2;
        // section about me
        if (ScrollPosn > SectionAboutme-buffer) {$("#aboutme-container h1").css('opacity', 1);} 
        else {$("#aboutme-container h1").css('opacity', 0);}
        if (ScrollPosn > SectionProject-buffer) {$("#section-project h1").css('opacity', 1);}
        else {$("#section-project h1").css('opacity', 0);}

        if (ScrollPosn >= SectionAboutme && ScrollPosn < SectionProject) {

            if (morphState == "logo") {Morphable.css('fill', '#ffffff').css('stroke', '#ffffff');}
            $("#icon-container a").css('color', 'white');
            $("#header").css('background', '#191919');
            $("#icon-container").css('border-bottom', '2px solid white');

        } else {

            if (morphState == "logo") {Morphable.css('fill', '#000000').css('stroke', '#000000');}
            $("#icon-container a").css('color', 'black');
            $("#header").css('background', '#ffffff');
            $("#icon-container").css('border-bottom', '2px solid black');

        }
    });
    // Coloring Resume-section
    var white = {color: "#ffffff", words: [';',':', ',', 'and', '{', '}', '.', '(', ')', '..']};
    var green = {color: "#A6E22E", words: ['Skill', 'Education', 'Experience', 'Certification', 'Awards']};
    var red = {color: "#F9264C", words: ['Python', 'Front-end', 'Computer', 'Science', '*']};
    var brown = {color: "#AC6A22", words: ['-', '\'','May', 'Feb', 'Sept', 'Apr', 'Aug', 'Dec', '2012', '2014', '2016']};

    $('.bracket-wrapper').each(function() {

        $(this).find("p").each(function() {

            var Phrase = $(this).html().split(" ");
            var PhraseLength = Phrase.length;
            var ColorizedPhrase = "";

            for (var i=0; i < PhraseLength; i++) {
                
                var word = Phrase[i];

                if (word == '_') {ColorizedPhrase += " ";}
                else if (white["words"].includes(word)) {ColorizedPhrase += word.fontcolor(white["color"]);}
                else if (brown["words"].includes(word)) {ColorizedPhrase += word.fontcolor(brown["color"]);}
                else if (green["words"].includes(word)) {ColorizedPhrase += word.fontcolor(green["color"]);} 
                else if (red["words"].includes(word)) {ColorizedPhrase += word.fontcolor(red["color"]);}
                else {ColorizedPhrase += word.fontcolor("#5CD9EF");}

            }

            $(this).html(ColorizedPhrase);

        });
    });
    // Scroll to Sections according to href tag.
    $('a[href*="#"]:not([href="#"])').click(function(e) {
        
        var section = ($(this).attr('href'));

        e.preventDefault();
        e.stopPropagation();

        if ($(document).scrollTop() == $(section).offset().top - HeaderHeight) {
            //$(this).css('color', '#cc0000');
        } else {
            $('html, body').velocity('scroll', {
                duration: 800,
                offset: $(section).offset().top - (HeaderHeight*2),
                easing: 'ease-in-out'
            });
        }
    });
});
$(window).resize(function() {

    var HeaderHeight = 50;
    $('#intro-container').css('height', window.innerHeight-HeaderHeight);

});