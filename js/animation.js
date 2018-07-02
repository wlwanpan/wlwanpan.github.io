window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

window.cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame;


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
        clickable : true,
        ScrollAble: false,
        data : {'logo':{'position' : [ '70px', '70px'],
                        'holder' : $("#logo-placeholder"),
                        'snapPath' : Snap("#logo").selectAll('path') },
                'cat' :{'position' : [ '10%', '18%'],
                        'holder' : $("#cat-placeholder"),
                        'snapPath' : Snap("#cat").selectAll('path')},
                'fix' :{'position' : ['50px', '50px'],
                        'holder' : $("#logo-fix-placeholder"),
                        'snapPath' : Snap("#cat").selectAll('path')},
                'chicken' : {'position' : [ '10%', '18%'],
                            'holder' : $("#cat-placeholder"),
                            'snapPath' : Snap("#chicken").selectAll('path')}
                },
        catPart : {'body' : $("#c1"), 'head' : $('#head'), 'tail' : $('#tail'), 'rleg': $('#c4')},

    }
    self.init = function () {

        self.fetusPath = self.fetus.selectAll('path');
        // transmutate Cat->Logo
        self.transition(self.morphState);

        self.scatterDuration = 700;
        self.fixationDuration = 400;

        // Only application when morphable and current state is cat.
        $('.head-animate').hover(function(e) {
            e.stopPropagation();
            if (self.morphState == 'cat' && self.morphAble) {self.transition('logo');}
            else {}

        });
        // Only applicable when morphable and current state is logo.
        self.fetus.hover(function(e) {
            e.stopPropagation();
            if (self.morphState == 'logo' && self.morphAble) {self.transition('cat')}
            else {}
        });

    }

    self.transmutate = function (toState) {

        for (var i = 0; i < 7; i++) {

            var angle = (Math.random() * (self.scatterBuffer + self.scatterBuffer) - self.scatterBuffer);
            var finalMatrix = "t 0 0 , r" + angle + "50% 50%" ;

            self.fetusPath[i].animate({transform: finalMatrix}, self.scatterDuration, mina.easeIn);

        }
        setTimeout( function () {

            if (toState == 'fix') {var morphTarget = self.data['logo']['snapPath'];}
            else {var morphTarget = self.data[toState]['snapPath'];}

            for (var i = 0; i < 7; i++) {

                self.fetusPath[i].animate({transform: "t 0, 0", d: morphTarget[i].attr('d')}, self.fixationDuration, mina.easeOut);
            }

        }, self.scatterDuration);

    }
    self.transitionSet = function (toState) {

        if (toState == 'cat') {
            // cat Adjustments
            self.logoContainer.css('bottom', '-1px').css('top', 'auto').css('left', '5%').css('z-index', 'inherit');
            self.catPart['head'].addClass('head-animate');
            self.catPart['tail'].addClass('tail-animate');
            self.catPart['body'].css('fill', '#191919').css('stroke', '#191919');
            ScrollAble = false;

        } else if (toState == 'chicken'){

            self.logoContainer.css('bottom', '-1px').css('top', 'auto').css('left', '5%').css('z-index', 'inherit');
            self.catPart['body'].css('fill', '#191919').css('stroke', '#191919');
            self.catPart['head'].removeClass('head-animate');
            self.catPart['tail'].removeClass('tail-animate');

            //self.GameOn();

        } else {

            self.catPart['head'].removeClass('head-animate');
            self.catPart['tail'].removeClass('tail-animate');

            self.catPart['body'].css('fill', '').css('stroke', '');
            self.data[toState]['holder'].append(self.logoContainer);

            if (toState == 'fix'){
                // logo fix Adjustments
                self.logoContainer.css('position', 'inherit').css('top', '0%').css('left', 'inherit');
                ScrollAble = true;

            } else if (toState == 'logo') {
                // logo Adjustments
                self.logoContainer.css('position', 'absolute').css('top', '0%').css('left', 'inherit');
                self.fetus.addClass('logo-animate');
                ScrollAble = false;

            }

        }
        self.morphAble = true;
    }
    self.transition = function (toState) {

        if (toState == 'chicken') {
            var selectedLib = self.data['cat'];
        }
        else {var selectedLib = self.data[toState];}

        if (toState == 'logo') {

        } else {

            var holder = self.data[self.morphState]['holder'];
            $('body').append(self.logoContainer);
            self.logoContainer.css('top', holder.offset().top).css('left', holder.offset().left);
            self.fetus.removeClass('logo-animate');

            if (toState == 'cat'){

            } else if (toState == 'fix'){
                self.logoContainer.css('z-index', '999');
            } else {}
        }

        if (self.morphAble && selectedLib != undefined){

            self.morphAble = false;
            self.clickable = false;
            self.transmutate(toState); // Starts Morphing Function
            self.logoContainer.velocity({ // Div transition and final setup

                width: selectedLib['position'][0],
                height: selectedLib['position'][1],
                left: selectedLib['holder'].offset().left,
                top: selectedLib['holder'].offset().top,

            }, {
                easing: 'easeInOut',
                duration: self.fixationDuration,
                delay: self.scatterDuration,
                complete: function () {
                    self.clickable = true;
                    self.morphState = toState;
                    self.transitionSet(toState);
                }
            });
        } else {}
    }
    self.init();
    return self;
}
var Project = function () {

    var self = {

        container: $('#project-content'),
        logoTransformDuration: 2000,
        nexusScrollDuration: 9000,
        desktopScrollDuration: 11000,

    }
    self.init = function () {

        // $.ajax({
        //     url: 'includes/portfolio.html',
        //     cache: false,
        //     dataType: "html",
        //     success: function(data) {
        //
        //         self.container.html(data);
        //         self.deviceAnimation($('#nexus-scr'), $('#desktop-scr'));
        //         self.webTechAnimation();
        //
        //     }
        // });
    }
    self.webTechAnimation = function () {

        var frameSnap = Snap('#logo-frame').selectAll('path');

        var counter = 1;
        // Swith order => 5 => 3 => S
        var LogoPath = ["M13.03 14.72h43.9l-.8 8.83H22.6l.8 9.04h31.94l-2.4 27.1-17.94 5-18-5-1.18-13.84 8.76-.02.62 7.04 9.76 2.66 9.78-2.66.84-11.47-10.75.06-19.34-.05-1.38-14.96z", "M11.04 14.2l47.1.05-.85 9.1-19.32 8.77 18.66.03-2.27 27.38-19.4 5.2-19.35-4.97-1.33-13.6 8.7.12.6 7.1 11.45 2.23 10.52-3.3.72-11.46-32.6.1-.75-8.97 21.32-9.4-22.35-.23z", "M17.9 14.67h35.42l1.95 14.1h-8.93l-.32-5.17H25.1l-.42 9h30.7l-2.44 27.1L35 64.76 17 59.7l-1.18-13.84h8.85l.53 7.02 9.76 2.66 9.78-2.66.84-11.47h-30.1z"];
        var FrameOutsideColor = ["#e44d26", "#0170ba", "#e6a329"];
        var FrameInsideColor = ["#f16529", "#29a9df", "#f1bf22"];

        function changeLogo() {

            if (counter > 2) {counter = 0}

            frameSnap[2].animate({d: LogoPath[counter]}, self.logoTransformDuration, mina.easeOut, function () {

                frameSnap[0].attr("fill", FrameInsideColor[counter]);
                frameSnap[1].attr("fill", FrameOutsideColor[counter]);
                counter++;

                setTimeout (function () {

                    changeLogo();

                }, self.logoTransformDuration);

            });
        }
        changeLogo();
    }
    self.deviceAnimation = function (mobile, desktop) {

        mobile.velocity({
            tween: [-45, 30],
        }, {
            loop: true,
            duration: self.nexusScrollDuration,
            easing: "easeInOut",
            progress: function (elements, complete, remaining, start, tweenValue) {

                $(this).attr('y', tweenValue);

            }
        });

        desktop.velocity({
            tween: [-1, -45],
        }, {
            loop: true,
            duration: self.desktopScrollDuration,
            progress: function (elements, complete, remaining, start, tweenValue) {

                $(this).attr('y', tweenValue);

            }
        });
    }
    self.init();
    return self;
}
$(window).on('load', function() {
    //Global
    var HeaderHeight = 50;
    var IntroContainer = $('#intro-container'), IconContainer = $("#icon-container"), Header = $("#header");
    var AboutmeH1 = $("#aboutme-container h1")
    var Toggle = false;
    var OneTimeEvent = true;

    var TriObj = TriangleMorphing();
    var fetus = $("#fetus");
    var ProjectObj = Project();

	IntroContainer.css('height', window.innerHeight-HeaderHeight);

    $('.non-draggable').on('dragstart', function(event) { event.preventDefault(); });

    // Section Intro (introduction phrases )
	$(function(){
        $(".command-typing").typed({
            strings: [
              "Welcome ^200 to my personal website.",
              "If you are a cat person, ^100",
              "Hover over the shaking 'W' ... ^500"
            ],
            typeSpeed: 35,
            loop: true,
            startDelay: 1200,
            backSpeed: 1,
            backDelay: 1200,
            showCursor: false,
            contentType: 'html',
        });
    });
    var rotateClass = $('.rotate');
    // Section About me
    // Toggle to Minimize or Maximize All Resume Brackets
    // Section About me
    // Minimize or Maximize Resume Brackets
    rotateClass.on('click', function(){
        //$(this).removeClass('selected');
        var bracket = $(this).parent().parent().find('.bracket-closing');
        var bracketp = $(this).parent().find('.closing-bracket-p');

        if ($(this).hasClass('rotate-selected')) {

            $(this).removeClass('rotate-selected');
            bracketp.css("opacity", 0);
            bracket.velocity("reverse");

        } else {

            $(this).addClass('rotate-selected');
            bracketp.css("opacity", 1);
            bracket.velocity({
                height: 0,
            }, {
                easing: "easeInOut",
                duration: 500,
            });
        }
    });
    // Swapping header black to white
    var ScrollPosn = 0;
    // Scroll function
    $(document).scroll(function() {

        //$(window).disablescroll();

        var ScrollPosn = $(this).scrollTop();
        var SectionAboutme = $("#section-aboutme").offset().top - HeaderHeight;
        var ProjectIntro = $("#project-intro");
        var buffer = window.innerHeight/2;
        // section about me
        if (ScrollPosn == 0) {

            if (TriObj.morphAble && TriObj.morphState == "fix") {TriObj.transition('logo');}


        } else if (ScrollPosn > SectionAboutme-buffer) {

            AboutmeH1.css('opacity', 1);

        } else {

            AboutmeH1.css('opacity', 0);

        }

        // Page on Section About me
        if (ScrollPosn >= SectionAboutme) {

            if (TriObj.morphState == "fix") {fetus.css('fill', '#ffffff').css('stroke', '#ffffff');}

            if (OneTimeEvent) {

                //ProjectToggle.trigger('click').trigger('click');
                OneTimeEvent = false;

            }

            TriObj.morphAble = false; // Prevent Morphing Propagation
            IconContainer.find('a').css('color', 'white');
            Header.css('background', '#191919');
            IconContainer.css('border-bottom', '2px solid white');

        } else {

            if (TriObj.morphState == "fix") {fetus.css('fill', '#000000').css('stroke', '#000000');}
            TriObj.morphAble = true; // Reset Morphing Status

            IconContainer.find('a').css('color', 'black');
            Header.css('background', '#ffffff');
            IconContainer.css('border-bottom', '2px solid black');

        }
    });
    // Section About me
    // Coloring Resume-section
    var white = {color: "#ffffff", words: [';',':', ',', 'and', '{', '}', '.', '(', ')', '..']};
    var green = {color: "#A6E22E", words: ['Skill', 'Education', 'Experience', 'Certification', 'Awards']};
    var red = {color: "#F9264C", words: ['Email', 'Python', 'Front-end', 'Computer', 'Science', '*', 'Vue2Js', 'Ruby', 'on', 'Rails', 'Js/ES6']};
    var brown = {color: "#AC6A22", words: ['-', '\'','May', 'Feb', 'Sept', 'Apr', 'June','Aug', 'Dec', '2012', '2014', '2016', '2017', '2018', 'present']};

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

        e.preventDefault();
        e.stopPropagation();

        if (TriObj.clickable) {

            var section = ($(this).attr('href'));

            if ($(document).scrollTop() == $(section).offset().top - HeaderHeight) {
                // Already on page => Signal !!
            } else {

                TriObj.clickable = false;
                var delay = 0;

                if (TriObj.morphAble && TriObj.morphState != 'fix' && section != "#intro-container") {
                    TriObj.transition('fix');
                    delay = TriObj.scatterDuration + TriObj.fixationDuration;

                } else {}

                $('html, body').velocity('scroll', {
                    duration: TriObj.scatterDuration,
                    delay: delay,
                    offset: $(section).offset().top - (HeaderHeight*2),
                    easing: 'ease-in-out',
                    complete: function () {
                        TriObj.clickable = true;
                    }
                });
            }
        } else {}//clickpropagation
    });
    $('html').show();
    // Check resizing event => adjust window height
    $(this).resize(function() {

        var HeaderHeight = 50;
        IntroContainer.css('height', window.innerHeight-HeaderHeight);

    });
});
