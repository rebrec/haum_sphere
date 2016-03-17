function Light(x, y, r, g, b, rad, canvas){
	this.getStrRGBColor = function(){
		return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
	};
	this.debug = function(){
		console.log('Debug Light X:' + this.x + 'Y:' + this.y + 'StrColor:' + this.getStrRGBColor() + 'Rad:' + this.rad);
	};
	this.draw = function(){
		var ctx = this.canvas.getContext('2d');
		ctx.fillStyle = this.gradient;
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	this.x = x;
	this.y = y;
	this.r = r;
	this.g = g;
	this.b = b;
	this.rad = rad;
	this.canvas = canvas;
	var ctx = canvas.getContext('2d');
	this.gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.rad);
	this.gradient.addColorStop(0, this.getStrRGBColor());
	this.gradient.addColorStop(1, 'rgba(255,255,255,0)');
}

function Sphere(x, y, r, g, b, rad, canvas){
	this.getStrRGBColor = function(){
		return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
	};
	this.debug = function(){
		console.log('Debug Sphere X:' + this.x + 'Y:' + this.y + 'StrColor:' + this.getStrRGBColor() + 'Rad:' + this.rad);
	};
	this.x = x;
	this.y = y;
	this.r = r;
	this.g = g;
	this.b = b;
	this.ip = prompt('IP','x.x.x.x');
	this.port = prompt('Port','80');;
	this.rad = rad;
	//this.canvas = canvas;
	var ctx = canvas.getContext('2d');
	this.gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.rad);
	this.gradient.addColorStop(0, this.getStrRGBColor());
	this.gradient.addColorStop(1, 'rgba(255,255,255,0)');
}

function RandomDataGenerator(canvas){
	var radMin = 250;
	var radMax = 280;
	this.rad = Math.random() * (radMax - radMin) + radMin;
	this.x = Math.abs(Math.random() * canvas.width - this.rad);
	this.y = Math.abs(Math.random() * canvas.height - this.rad);
	this.r = Math.floor(Math.random() * 255);
	this.g = Math.floor(Math.random() * 255);
	this.b = Math.floor(Math.random() * 255);
}

// get the canvas element using the DOM
var canvas = document.getElementById('mycanvas');
//make sure we don't execute when canvas isn't supported

if (canvas.getContext) {
	// Create gradients
	var lights=[];
	for (var i = 0; i <= 4; i++) { // Generating 4 Lights
		var r = new RandomDataGenerator(canvas);
		var tmpLight = new Light(r.x, r.y, r.r, r.g, r.b, r.rad, canvas);
		tmpLight.debug();
		lights.push(tmpLight);
	}
	// draw shapes
	$('#mycanvas').css('background-color','black');
	for (var i = 0; i < lights.length; i++) {
		lights[i].draw();
	}
	var r = new RandomDataGenerator(canvas);
	var s = new Sphere(r.x, r.y, r.r, r.g, r.b, r.rad, canvas);
}


function findPos(obj) {
 var curleft = 0,
	 curtop = 0;
 if (obj.offsetParent) {
	 do {
		 curleft += obj.offsetLeft;
		 curtop += obj.offsetTop;
	 } while (obj = obj.offsetParent);
	 return {
		 x: curleft,
		 y: curtop
	 };
 }
 return undefined;
}

function rgbToHex(r, g, b) {
 if (r > 255 || g > 255 || b > 255)
	 throw "Invalid color component";
 return ((r << 16) | (g << 8) | b)
	 .toString(16);
}
// set up some squares
$('#mycanvas').mousemove(function (e) {
	var pos = findPos(this);
	var x = e.pageX - pos.x;
	var y = e.pageY - pos.y;
	var coord = "x=" + x + ", y=" + y;
	var c = this.getContext('2d');
	var p = c.getImageData(x, y, 1, 1).data;
	var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	$('#status').html(coord + "<br>" + hex);
	$('#result').css('background-color', hex)
});