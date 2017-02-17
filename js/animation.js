
$(window).on('load', function() {

    var HeaderHeight = 50;
	
	$('#intro-container').css('height', window.innerHeight-HeaderHeight);

	$('.tlt').textillate({
		in: {effect: 'bounceInDown'}
	});
    //introduction phrases 
	$(function(){
        $(".command-typing").typed({
            strings: ["Welcome ^200 to my personal website.","I like to ^500 animate stuff ^200 on the web.", "And YES, ^200 this is how slow I usually type.", "I am still working on the website ...", " Thanks for dropping by."],
            typeSpeed: 50,
            startDelay: 2000,
            backSpeed: 10 ,
            backDelay: 2000,
            showCursor: false,
            contentType: 'html',
        });
    });

    document.addEventListener('keydown', function(event) {

        //event.preventDefault()
        //right pressed
        if(event.keyCode == 39) {
            //$('#lego-right-arm').addClass('lego-move');
            //$('#lego-left-arm').addClass('lego-move');
        }
        else {
            //$('#lego-right-arm').removeClass('lego-move');
        }

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
        // section about me
        if (ScrollPosn > SectionAboutme/2) {
        	$(".section-wrapper h1").css('opacity', 1);
        } else {
        	$(".section-wrapper h1").css('opacity', 0);
        }

        if (ScrollPosn >= SectionAboutme && ScrollPosn < SectionProject) {
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

                if (white["words"].includes(word)) {
                    var color = white["color"];
                    console.log(color);
                    if (word == 'and' || word == '..') {ColorizedPhrase += " " + word.fontcolor(color) + " ";}
                    else if (word == '{' || word == '(') {ColorizedPhrase += " " + word.fontcolor(color);}
                    else {ColorizedPhrase += word.fontcolor(color) + " ";}
                }

                else if (brown["words"].includes(word)) {ColorizedPhrase += word.fontcolor(brown["color"]);}

                else if (green["words"].includes(word)) {ColorizedPhrase += " " + word.fontcolor(green["color"]);} 

                else if (red["words"].includes(word)) {ColorizedPhrase += " " + word.fontcolor(red["color"]);}

                else {ColorizedPhrase += " " + word.fontcolor("#5CD9EF");}

            }

            $(this).html(ColorizedPhrase);

        });
    });
    // Scroll to Sections according to href tag.
    $('a[href*="#"]:not([href="#"])').click(function(e) {
        
        var section = ($(this).attr('href'));

        e.preventDefault();
        e.stopPropagation();

        if (!($(document).scrollTop() == $(section).offset().top - HeaderHeight)) {

            $('html, body').velocity('scroll', {
                duration: 800,
                offset: $(section).offset().top - (HeaderHeight*2),
                easing: 'ease-in-out'
            });
        }

    });

});