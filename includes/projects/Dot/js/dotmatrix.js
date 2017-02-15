

var Matrix = function(screen) {
	
	var self = {

		ctx : screen,
		PlaygroundLimitX: screen.getBoundingClientRect().width,
		PlaygroundLimitY: screen.getBoundingClientRect().height,
		ChildCount : 30,
		MaxBond : 4,
		RadiusBuffer : [3, 6], // Dot Radius
		VxyBuffer : [-10, 11],
		LineDb : new Array(),
		BondDb : new Array(),
		LineBuffer : 250,

	}
	self.easeInOutQuad = function (t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t }

	self.getRandom = function (min, max) { return Math.floor(Math.random() * (max - min)) + min;}
		
	self.init = function() {

		self.loadDot();
		window.requestAnimationFrame(self.animate);

		$(window).resize(function () {
	
			self.PlaygroundLimitX = self.ctx.getBoundingClientRect().width;
			self.PlaygroundLimitY = self.ctx.getBoundingClientRect().height;

		});
	}
	self.CreateDot = function(x, y, z, id) {

		var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	    circle.setAttribute('id', id);		
	    circle.setAttribute('cx', x);
	    circle.setAttribute('cy', y);
	    circle.setAttribute('opacity', z);
	    //circle.setAttribute('filter', "url(#blur)");

	    circle.setAttribute('vx', self.getRandom(self.VxyBuffer[0], self.VxyBuffer[1])/10);
	   	circle.setAttribute('vy', self.getRandom(self.VxyBuffer[0], self.VxyBuffer[1])/10);

	    circle.setAttribute('r', self.getRandom(self.RadiusBuffer[0], self.RadiusBuffer[1]));
	    circle.setAttribute('class', 'dot');
	    circle.setAttribute('fill', 'black');

	    self.BondDb[id] = 0;
	    return circle;

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

	    self.ctx.appendChild(line);

	    return line;	
	}
	self.AnimateLine = function () {
		
		var dictlength = Object.keys(self.LineDb).length;

		for (var i in self.LineDb) {

			var arr = self.LineDb[i];
			var line = arr[0];
			var obj1 = arr[1];
			var obj2 = arr[2];
			
			line.setAttribute("x1", obj1.attr("cx"));
			line.setAttribute("y1", obj1.attr("cy"));
			line.setAttribute("x2", obj2.attr("cx"));
			line.setAttribute("y2", obj2.attr("cy"));

		}

	}
	self.loadDot = function () {

		var height = self.ctx.style.height;
		var width = self.ctx.style.width;
		
		for (var i = 0; i < self.ChildCount; i++) {

			var x = self.getRandom(0, self.PlaygroundLimitX);
			var y = self.getRandom(0, self.PlaygroundLimitY);
			var z = 1;

			var dot = self.CreateDot(x, y, z, 'Dot' + i);

			self.ctx.appendChild(dot);

		}
	}
	self.LinearMotion = function (e) {
		
		var cx = parseFloat(e.attr("cx"));
		var cy = parseFloat(e.attr("cy"));
		var cz = parseFloat(e.attr("opacity"));
		var cr = parseInt(e.attr("r"));
		
		var vx = parseFloat(e.attr("vx"));
		var vy = parseFloat(e.attr("vy"));
		var vz = parseFloat(e.attr("vz"));

		// Apply Ease In Out effect
		//if (vx < 0) {vx = -1 * self.easeInOutQuad(-1*vx);}
		//else {vx = self.easeInOutQuad(vx);}

		//if (vy < 0) {vy = -1 * self.easeInOutQuad(-1*vy);}
		//else {vy = self.easeInOutQuad(vy);}
		// Check Boundary on X-axis
		if (cx + cr > self.PlaygroundLimitX) {
			var fcx = self.PlaygroundLimitX - cr;
			vx *= -1;
		} else if (cx - cr < 0) {
			var fcx = cr;
			vx *= -1;
		} else { var fcx = cx + vx; }
		// Check Boundary on Y-axis
		if (cy + cr > self.PlaygroundLimitY) {
			var fcy = self.PlaygroundLimitY - cr;
			vy *= -1;
		} else if (cy - cr < 0) {
			var fcy = cr;
			vy *= -1;
		} else { var fcy = cy + vy; }

		e.attr("vx", vx);
		e.attr("vy", vy);
		e.attr("cx", fcx);
		e.attr("cy", fcy);
		
	}
	self.MotionNegate = function (e) {
		e.attr("vx", parseFloat(e.attr("vx"))*-1);
		e.attr("vy", parseFloat(e.attr("vy"))*-1);
	}
	self.VMotionChanger = function(e) {
		e.attr("vx", self.getRandom(self.VxyBuffer[0], self.VxyBuffer[1])/10);
		e.attr("vy", self.getRandom(self.VxyBuffer[0], self.VxyBuffer[1])/10);
	}
	self.animate = function () {

		for (var i = 0; i < self.ChildCount; i++) {

			var u = $("#Dot" + i);
			var ui = u.attr("id");
			var ux = parseFloat(u.attr("cx"));
			var uy = parseFloat(u.attr("cy"));
			var ur = parseInt(u.attr("r"));

			for (var j = 0; j < self.ChildCount; j++) {

				var d = $("#Dot" + j);

				if (u.attr("id") != d.attr("id")) {

					var dx = parseFloat(d.attr("cx"));
					var dy = parseFloat(d.attr("cy"));
					var di = d.attr("id");
					var dr = parseInt(d.attr("r"));

					var distance = ((dx - ux) * (dx - ux)) + ((dy - uy) * (dy - uy));

					// Check Collision and apply Bounce 
					if (distance < ((ur + dr) * (ur + dr))) {
						self.MotionNegate(d);
					}
					// Create Bond if in buffer range
					if (distance < self.LineBuffer * self.LineBuffer) {
						
						if (Object.keys(self.LineDb).length == 0 || (!((i+":"+j) in self.LineDb) && !((j+":"+i) in self.LineDb))) {
						 
						 	if (self.BondDb[ui] < self.MaxBond && self.BondDb[di] < self.MaxBond) {

						 		var w = Math.min(ur, dr)/2;

								var line = self.CreateLine(ux, uy, dx, dy, w,i+":"+j);
								self.LineDb[i+":"+j] = [line, u, d];
								self.BondDb["Dot"+i] += 1;
								self.BondDb["Dot"+j] += 1;
							}
						}

					} else {
						
						if ((i+":"+j) in self.LineDb) {

							var arr = self.LineDb[i+":"+j];
							var l = arr[0];
							self.ctx.removeChild(l);
							delete self.LineDb[i+":"+j];
							self.BondDb["Dot"+i] -= 1;
							self.BondDb["Dot"+j] -= 1;

						} else if ((j+":"+i) in self.LineDb) {
							
							var arr = self.LineDb[j+":"+i];
							var l = arr[0];
							self.ctx.removeChild(l);
							delete self.LineDb[j+":"+i];
							self.BondDb["Dot"+i] -= 1;
							self.BondDb["Dot"+j] -= 1;

						}
					}
				}
			}
			if (u.attr("vx") == 0 || u.attr("vy") == 0) {self.VMotionChanger(u);}

			self.AnimateLine();
			self.LinearMotion(u);
		}

		window.requestAnimationFrame(self.animate);		
		
	}
	self.init();
	return self;
}
$(window).on('load', function() {
	var M = Matrix(document.getElementById('dot-playground'));
});