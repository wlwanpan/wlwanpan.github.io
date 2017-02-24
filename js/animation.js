
var TriangleMorphing = function() {

    var self = {
            
        fetus : Snap("#fetus"),
        fetusPath : null,
        logoContainer : $("#logo-container"),
        scatterDuration : 0, // Time duration of scatter animation
        scatterBuffer : 90, // Degree [range(0, 360)] of rotation on (x, y, z) axes
        fixationDuration : 0, // Time duration of merging animation
        morphState : 'logo',
        morphAble : true,
        data : {'logo': { 'position' : [ '70px', '70px'], 'holder' : $("#logo-placeholder") }, 
                'cat' : { 'position' : [ '10%', '18%'], 'holder' : $("#cat-placeholder") },
                'fix' : { 'position' : ['50px', '50px'], 'holder' : $("#logo-fix-placeholder") }
                },

    }
    self.init = function () {

        self.fetusPath = self.fetus.selectAll('path');
        // transmutate Cat->Logo
        self.transition('logo');

        self.scatterDuration = 800;
        self.fixationDuration = 500;
        // Only application when morphable and current state is cat.
        $('.head-animate').click(function() {

            if (self.morphState == 'cat' && self.morphAble) {self.transition('logo');}
            else {}

        });
        // Only applicable when morphable and current state is logo.
        $('.morphable').click(function() {

            if (self.morphState == 'logo' && self.morphAble) {self.transition('cat')} 
            else {}
        });
        // Can be applied anytime
        self.data['fix']['holder'].click(function () {
            
            self.transition('fix');

        });
    }

    self.transmutate = function (toState) {
        
        for (var i = 0; i < 7; i++) {

            var angle = (Math.random() * (self.scatterBuffer + self.scatterBuffer) - self.scatterBuffer);
            var finalMatrix = "t 0 0, r" + angle + "0% 0%" ;
    
            self.fetusPath[i].animate({transform: finalMatrix}, self.scatterDuration, mina.easeIn);
        }
        setTimeout( function () {

            if (toState == 'fix') {var morphTarget = Snap("#logo").selectAll('path');}
            else {var morphTarget = Snap("#"+toState).selectAll('path');}

            for (var i = 0; i < 7; i++) {

                self.fetusPath[i].animate({transform: "t 0, 0", d: morphTarget[i].attr('d')}, self.fixationDuration, mina.easeOut);
            }

        }, self.scatterDuration);
 
    }
    self.transitionSet = function () {

        if (self.morphState == 'logo') {
            // logo Adjustments
            self.data[self.morphState]['holder'].append(self.logoContainer);
            self.logoContainer.css('top', '0%').css('left', 'inherit');

            $('#head').removeClass('head-animate');
            $('#tail').removeClass('tail-animate');
            self.fetus.addClass('logo-animate');

        } else if (self.morphState == 'cat') {
            // cat Adjustments
            self.logoContainer.css('bottom', '-1px').css('top', 'auto').css('left', '5%');
            $('#head').addClass('head-animate');
            $('#tail').addClass('tail-animate');

        } else if (self.morphState == 'fix'){
            
            self.logoContainer.css('position', 'fixed').css('top', '0%').css('left', '5%');    
            $('#head').removeClass('head-animate');
            $('#tail').removeClass('tail-animate');

        } else {
            
        }
    }
    self.transition = function (toState) {

        var selectedLib = self.data[toState];

        if (toState == 'logo') {


        } else {

            var holder = self.data[self.morphState]['holder'];
            $('body').append(self.logoContainer);
            self.logoContainer.css('top', holder.offset().top).css('left', holder.offset().left);
            self.fetus.removeClass('logo-animate');

            if (toState == 'cat'){


            } else if (toState == 'fix'){
                
                self.logoContainer.css('z-index', '9999');

            }

        } 

        if (selectedLib == undefined) {return}
        else {
            self.transmutate(toState);
            self.logoContainer.velocity({
              
                width: selectedLib['position'][0],
                height: selectedLib['position'][1],
                left: selectedLib['holder'].offset().left,
                top: selectedLib['holder'].offset().top,

            }, {
                easing: 'easeInOut',
                duration: self.fixationDuration,
                delay: self.scatterDuration,
                complete: function () {
                    self.morphState = toState;
                    self.transitionSet();
                }
            });
            //self.transmutate(toState);
        }
    }
    self.init();
    return self;
}
$(window).on('load', function() {

    var HeaderHeight = 50;
    var TriObj = TriangleMorphing();
    var fetus = $("#fetus");

	$('#intro-container').css('height', window.innerHeight-HeaderHeight);

	//$('.tlt').textillate({
    //    initialDelay: 0,
    //    in: {effect: 'bounceInDown'}
	//});

    //introduction phrases 
	$(function(){
        $(".command-typing").typed({
            strings: ["Welcome ^200 to my personal website.", "I like to ^300 animate stuff ^200 on the web.", "If you like cat, ", 
            "Click on the 'W' ..."],
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

            if (TriObj.morphState == "fix") {fetus.css('fill', '#ffffff').css('stroke', '#ffffff');}

            //TriObj.transition('fix');
            TriObj.morphAble = false;
            $("#icon-container a").css('color', 'white');
            $("#header").css('background', '#191919');
            $("#icon-container").css('border-bottom', '2px solid white');

        } else {

            if (TriObj.morphState == "fix") {fetus.css('fill', '#000000').css('stroke', '#000000');}
            TriObj.morphAble = true;

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