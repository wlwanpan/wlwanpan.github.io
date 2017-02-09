
var CircleAnimation = function () {

	var self = {

		menuposn : [],
		menu : ['#home', '#resume', '#projects', '#contact'],
		htmlsize: [120, window.innerHeight, 80, 500],
		left_ctx : document.getElementById("left-ctx"),
		right_ctx : document.getElementById("right-ctx"),
		radius : 15,
		x_margin : 35,
		y_margin : 40,
		Lx : 15,
		Rx : 75,
		OngoingAnimation : null,

	}
	self.LoadCircle = function () {

		for (var i = 0; i < 9; i++) {

			var y = (i * self.y_margin) + 20;
			var Lx = 15;
			var Rx = 75;

			if (i % 2 == 1) {
				Lx += self.x_margin;
				Rx -= self.x_margin;
				self.menuposn.push(y);
			}
			var cL = self.CreateCircle(Lx, y, self.radius, 'L'+i);
			var cR = self.CreateCircle(Rx, y, self.radius, 'R'+i);

			self.left_ctx.appendChild(cL);
			self.right_ctx.appendChild(cR);
		}
	}
	self.CreateBranch = function (q, i) {

		var sx = $(q + i).attr('cx');
		var sy = $(q + i).attr('cy');

		var ex = $(q + (i+1)).attr('cx');
		var ey = $(q + (i+1)).attr('cy');

		var l = self.CreateLine(sx-2, sy-2, ex, ey, 6, q.substring(1) +"L"+i);

		if (q == "#L") {self.left_ctx.appendChild(l);} 
		else if (q == "#R") {self.right_ctx.appendChild(l);}
	}
	self.LoadBranch = function () {
		
		for (var i = 0; i < 8; i++) {
			self.CreateBranch("#L", i);
			self.CreateBranch("#R", i);
				
		}
	}
	self.CreateLine = function(sx, sy, ex, ey, w, id){
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	    line.setAttribute('x1', sx);
	    line.setAttribute('y1', sy);
	    line.setAttribute('x2', ex);
	    line.setAttribute('y2', ey);
	    line.setAttribute('class', 'line');
	    line.setAttribute('id', id);
	    line.setAttribute('stroke', 'black');
	    line.setAttribute('stroke-width', w);
	    return line;	
	}
	self.CreateCircle = function(x, y, r, id) {
		
		var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	    circle.setAttribute('cx', x);
	    circle.setAttribute('cy', y);
	    circle.setAttribute('r', r);
	    circle.setAttribute('class', 'circle');
	    circle.setAttribute('id', id);
	    circle.setAttribute('fill', 'black');
	    return circle;

	}
	self.recurseAnimation = function(i, j, timer) {

		if (i >= 0) {

			$("#L" + i).velocity({opacity: 1}, {
				duration : timer, 
				complete : function () {
					$("#LL" + i).velocity({opacity: 1}, 0);
				}
			});

			$("#R" + i).velocity({opacity: 1}, {
				duration : timer, 
				complete : function () {
					$("#RL" + i).velocity({opacity: 1}, 0);
				}
			});

		}
		if (j < 9) {

			$("#L" + j).velocity({opacity: 1}, {
				duration : timer, 
				complete : function () {
					$("#LL" + (j-1)).velocity({opacity: 1}, 0);
				}
			});

			$("#R" + j).velocity({opacity: 1}, {
				duration : timer, 
				complete : function () {
					$("#RL" + (j-1)).velocity({opacity: 1}, 0);
				}
			});

		}

		setTimeout(function() {
			if (i - 1 >= 0 || j < 9) {
				self.OngoingAnimation = window.requestAnimationFrame(function () {self.recurseAnimation(i-1, j+1, timer);});
			};
		}, timer);

	}
	self.AnimationWrapper = function(index) {

		timer = 85;

		$("#L" + index).velocity({opacity: 1}, timer);
		$("#R" + index).velocity({opacity: 1}, timer);

		setTimeout(function () {
			self.OngoingAnimation = window.requestAnimationFrame(function () {self.recurseAnimation(index-1, index+1, timer);});
		}, timer);
		self.OngoingAnimation = null;
		return false;
	}
	self.LoadCircle();
	self.LoadBranch();
	return self;
}

var loadContent = function(click, CircleObj) {

	$(':button').prop('disabled', true);
	$('.circle').css('opacity', 0);
	$('.line').css('opacity', 0);
	$("#content").empty();

	// Local Var
	var ContentHeight = CircleObj.htmlsize[click];
	var CurrentSelectObj = $( ".selected" )[0] || null;
	var MenuSelect = CircleObj.menu[click];
	var file = ('includes/' + MenuSelect.substring(1) + '.html');

	var AnimationBufferDelay = 900;
	var circles = [1, 3, 5, 7];

	// Render Menu Animation
	CircleObj.AnimationWrapper(circles[click]);
	$("#content").css('height', ContentHeight);

	// Load Content
	$.ajax({
	    url: file,
	    cache: false,
	    dataType: "html",
	    success: function(data) {
	        $("#content").html(data);
	    }
	});
	 // Animate Content
	$('#content').velocity({
		translateY: "-50%",
		scaleY: [1, 0]
	}, {
		duration : 900, 
		complete : function () {
			//insert bounce
		}
	});

	if (CurrentSelectObj) {$(CurrentSelectObj).removeClass('selected');}
	$(MenuSelect).addClass('selected');

	setTimeout(function () {
		$(':button').prop('disabled', false);
	}, AnimationBufferDelay);

}
$("#home").css('top', 50);
$(window).on('load', function() {

	var CircleAnimationObj = new CircleAnimation();
	var OnloadPosn = [[42, 113], [89, 113], [134, 113], [178, 113]]

	$( ".menu-element" ).each(function(index, element) {
  		//console.log(index);
  		$(this).velocity({
			translateY: OnloadPosn[index]
		}, {
			duration : 1000, 
			complete : function () {
				
		}});
	});



	$('.btn-1').show();
	$('#main-background-container').css('height', window.innerHeight);
	$('#container').css('height', window.innerHeight);

	$('#home').click(function(event) {loadContent(0, CircleAnimationObj);});
	$('#resume').click(function(event) {loadContent(1, CircleAnimationObj);});
	$('#projects').click(function(event) {loadContent(2, CircleAnimationObj);});
	$('#contact').click(function(event) {loadContent(3, CircleAnimationObj);});

	$("#home").trigger('click');
});

$(window).resize(function () {
	
	$('#main-background-container').css('min-height', window.innerHeight);
	$('#container').css('min-height', window.innerHeight);
	//$('#content').css('height', window.innerHeight);

});