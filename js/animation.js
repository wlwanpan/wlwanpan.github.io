
var setup = function() {

    var cat = Snap("#c1-c7");
    var logo = Snap("#l1-l7");

    var catPath = cat.selectAll('path');
    var logoPath = logo.selectAll('path');
    var scatterDuration = 800;
    var fixationDuration = 700;

    $('.to-logo').click(function() {

        console.log("d d," * 3);

        var logoContainer = $("#logo-container");
        var svgContainer = $("#logo-svg-box")[0];

        logoContainer.css('min-height', '50px');
        logoContainer.css('min-width', '50px');
        logoContainer.css('z-index', '9999');
        
        // First Scatter Animation
        scatter(svgContainer);
        logoContainer.velocity({
            width: '35%', 
            height: '35%',
        }, {
            easing: "easeIn",
            duration: scatterDuration,
        });
        // Second Queue Morph+fix Logo
        setTimeout(function() {
            transmutate(svgContainer);
            logoContainer.velocity({
                top: "0px",
                left: "5.5%",
                height: '50px',
                width: '50px',
            }, {
                duration: fixationDuration,
                easing: "easeInQuad",
                complete: function () {
                    svgContainer.setAttribute('viewBox', "0 0 77.7 77");
                    $("#head").removeClass('head-animate');
                    $(this).css('position', 'fixed');
                }
            });
        }, scatterDuration);
    });
    var scatter = function (box) {
        box.setAttribute('viewBox', "0 0 100 100");
        for (var i = 0; i < 7; i++) {
            var angle = (Math.random() * (90 + 90) - 90);
            catPath[i].animate({transform: "t 0 0, r" + angle + "50% 50%," + angle + "50% 50%, 0" }, 
                                scatterDuration, mina.easeInOut);
        }
    }
    var transmutate = function (box) {
        
        for (var i = 0; i < 7; i++) {
            catPath[i].animate({transform: "t 0, 0", d: logoPath[i].attr("d")}, fixationDuration, mina.easeIn);
        }
    }
}
$(window).on('load', function() {

    var HeaderHeight = 50;
	
	$('#intro-container').css('height', window.innerHeight-HeaderHeight);

    setup();

	$('.tlt').textillate({
        initialDelay: 0,
        in: {effect: 'bounceInDown'}
	});
    //introduction phrases 
	$(function(){
        $(".command-typing").typed({
            strings: ["Welcome ^200 to my personal website.", "I like to ^500 animate stuff ^200 on the web.", "And if you don't like the cat :(", " Hit its head ..."],
            typeSpeed: 40,
            startDelay: 1200,
            backSpeed: 5 ,
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

            //$('#logo-svg-box g').css('fill', '#ffffff !important;');
            $("#icon-container a").css('color', 'white');
            $("#header").css('background', '#191919');
            $("#icon-container").css('border-bottom', '2px solid white');

        } else {
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