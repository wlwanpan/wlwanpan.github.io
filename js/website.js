var createLine = function(x1, y1, x2, y2, color='black', w=2, branch=false) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var className = branch ? 'line branch' : 'line';
	svg.setAttribute('class', className);
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

	var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    aLine.setAttribute('x1', x1);
    aLine.setAttribute('y1', y1);
    aLine.setAttribute('x2', x2);
    aLine.setAttribute('y2', y2);
    aLine.setAttribute('stroke', color);
    aLine.setAttribute('stroke-width', w);
    svg.appendChild(aLine);

    return svg;
}	

// used for drawing lines from circle to circle
var drawLinesBetweenCircles = function(className, circleRadius, parentId) {
	var positions = [];
	var parentPos = $('#' + parentId).position();
	var parentLeft = parentPos.left;
	var parentTop = parentPos.top;

	$(className).each(function(index) {
		var pos = $(this).position();

		positions.push({x: pos.left + circleRadius - parentLeft, y:pos.top + circleRadius - parentTop});
	});

	// draw lines
	if (positions.length > 1) {
		for (var i = 0; i < positions.length-1; i++) {
			var svg = createLine(positions[i].x, positions[i].y, positions[i+1].x, positions[i+1].y, 'black', 5);
			// add at the beginning of div
		    var nav = document.getElementById(parentId);
		    nav.insertBefore(svg, nav.firstChild);
		}
	}
}

var drawMenuElementBranches = function(className, circleRadius, parentId='nav') {
	var positions = [];
	var parentPos = $('#' + parentId).position();
	var parentLeft = parentPos.left;
	var parentTop = parentPos.top;

	$(className).each(function(index) {
		var pos = $(this).position();

		positions.push({x: pos.left + circleRadius - parentLeft, y:pos.top + circleRadius - parentTop});
	});

	// draw lines
	if (positions.length > 1) {
		for (var i = 0; i < positions.length-1; i++) {
			// branch line
			if ((i+1) % 2 === 0) {
				var svg = createLine(positions[i].x, positions[i].y, positions[i].x + circleRadius + branchLength, positions[i].y, 'black', 5);
				// add at the beginning of div
			    var nav = document.getElementById(parentId);
			    nav.insertBefore(svg, nav.firstChild);
			}
		}
	}
}

var createOppositeNode = function(r, width, height, right) {
	var div = document.createElement('div');
	div.className = 'circle-wrapper';
	div.setAttribute('style', 'height: ' + height + 'px');

	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var className = right ? 'circle-opposite right' : 'circle-opposite';
	svg.setAttribute('class', className);
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute('width', width);
	svg.setAttribute('height', height);

	var aCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    aCircle.setAttribute('cx', r);
    aCircle.setAttribute('cy', r);
    aCircle.setAttribute('r', r);
    aCircle.setAttribute('fill', 'black');
    svg.appendChild(aCircle);
    div.appendChild(svg);

    var oppositeNav = document.getElementById('opposite-nav');
    oppositeNav.appendChild(div);
}

var recurseAnimation = function(i, j, numCircles, timer) {
	console.log("recurse");
	if (i >= 0) {
		$(".circle-opposite:eq(" + i + ")").animate({
			opacity: 1
		}, timer);
	}
	if (j < numCircles) {
		$(".circle-opposite:eq(" + j + ")").animate({
			opacity: 1
		}, timer);
	}
	setTimeout(function() {
		if (i - 1 >= 0 || j < numCircles) recurseAnimation(i-1, j+1, numCircles, timer);
	}, timer);
}

var loadContent = function(fileName) {
	if(!animationInProgress) {
		$.ajax({
		    url: fileName,
		    cache: false,
		    dataType: "html",
		    success: function(data) {
		        $("#content-text").html(data);
		    }
		});
	}
}

var circleRadius = 15;
var branchLength = 20;
var menuPositionPadding = 10;
var animationTimer = 100;
var animationInProgress = false;

$(window).on('load', function() {
	var navPos = $('#nav').position();
	var navLeft = navPos.left;
	var navTop = navPos.top;

	// set size of circles
	$('circle').each(function() {
		$(this).attr('r', circleRadius);
		$(this).attr('cx', circleRadius);
		$(this).attr('cy', circleRadius);
	});

	// set height of wrapper
	$('.circle-wrapper').each(function(index) {
		$(this).css('height', circleRadius * 2);

		// create its opposite node
		var right = (index % 2) === 0;
		createOppositeNode(circleRadius, circleRadius * 2, circleRadius * 2, right);
	});

	// set width and height of circles 
	$('.circle').each(function() {
		$(this).attr('width', circleRadius * 2);
		$(this).attr('height', circleRadius * 2);
	});

	// drawing lines
	drawLinesBetweenCircles('.circle', circleRadius, 'nav');
	drawLinesBetweenCircles('.circle-opposite', circleRadius, 'opposite-nav');
	drawMenuElementBranches('.circle', circleRadius);

	// add className to content lines
	$('#opposite-nav').find('.line').each(function() {
		$(this).addClass('content-line');
	})

	// set opacity to 0
	$(".selected-branch").css('opacity', 0);
	$('.circle-opposite').css('opacity', 0);
	$('.content-line').css('opacity', 0);

	var firstMenuCirclePos = $(".circle:eq(1)").position();
	var firstMenuButton = $(".menu-element:eq(0)");
	var menuLeft = firstMenuCirclePos.left + (2 * circleRadius) + branchLength + menuPositionPadding;

	// change position of list elements (anchors)
	$('.menu-link').each(function() {
		$(this).css({'left': menuLeft, 'top': $(this).position().top - (firstMenuButton.outerHeight() / 2) + circleRadius});
	});

	// set height of line containers 
	$('.line').each(function() {
		$(this).attr('height', $('#nav').height());
	});

	// load content dynamically
	$('#home').click(function() {
		loadContent('includes/home.html');
	});
	$('#resume').click(function() {
		loadContent('includes/resume.html');
	});
	$('#projects').click(function() {
		loadContent('includes/projects.html');
	});
	$('#contact').click(function() {
		loadContent('includes/contact.html');
	});

	$('.menu-link').click(function() {
		var circleAnimationTimer = 800;
		var lineAnimationTimer = 500;
		var timerBuffer = 300;
		var totalAnimationTime = circleAnimationTimer + lineAnimationTimer + timerBuffer;

		if (!animationInProgress) {

			// set flag to true
			animationInProgress = true;

			// change style of selected menu
			$('.menu-link').removeClass('selected');
			$(this).addClass('selected');

			var pos = $(this).position();
			var menuWidth = $(this).outerWidth();
			var menuHeight = $(this).outerHeight();
			var index = ($('.menu-link').index(this) * 2) + 1;
			var numCircles = $('.circle-opposite').length;
			var correspondingCircle = $(".circle-opposite:eq(" + index + ")").position();

			// remove old branch and add new branch from element to content
			$(".branch").remove();
			var svg = createLine(pos.left - navLeft + menuWidth + menuPositionPadding, 
					   pos.top - navTop + menuHeight / 2,
					   correspondingCircle.left - navLeft + circleRadius,
					   pos.top - navTop + menuHeight / 2,
					   'black', 5, true);
			svg.style.opacity = 0;
			$('#nav').prepend(svg);

			$(".selected-branch").css('opacity', 0);

			// set opacity of circles to 0
			$('.circle-opposite').css('opacity', 0);
			$('.content-line').css('opacity', 0);

			$(".circle-opposite:eq(" + index + ")").animate(
			{ opacity: 1}, 100, function() {
				recurseAnimation(index-1, index+1, numCircles, 100);
			});

			setTimeout(function() {
				$(".content-line").animate({
					opacity: 1
				}, lineAnimationTimer);
				$(".branch").animate({
					opacity: 1
				}, lineAnimationTimer);
			}, circleAnimationTimer);

			// set flag to false so that new animation can begin
			setTimeout(function() {
				animationInProgress = false;
			}, totalAnimationTime);

			$('#content').filter(":not(:animated)").animate({
			    height: 20
			}, 100, function(){
			    $('#content').animate({
			    	height: $('#content').get(0).scrollHeight
			    }, circleAnimationTimer + lineAnimationTimer);
			});
		}
	});

	$("#home").trigger('click');
});


$(window).resize(function() {

	// change position of list elements on window resize
	var pos = $('.right').first().position();
	$('.menu-link').each(function() {
		$(this).css({'left': pos.left + (2 * circleRadius) + branchLength + menuPositionPadding});
	});

	// recreate branch from list element to content
});



