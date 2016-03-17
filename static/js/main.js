
//JavaScript HTML5 Canvas example by Dan Gries, rectangleworld.com.
//The basic setup here, including the debugging code and window load listener, is copied from 'HTML5 Canvas' by Fulton & Fulton.
//Checking for browser compatibility is accomplished with the Modernizr JavaScript library.
//The latest version of the library is available at www.modernizr.com.

//The code below establishes a way to send debug messages to the browser JavaScript Console,
//but in such a way as to ignore errors when the browser doesn't support the JavaScript Console.
//To log a messages to the console within this code, insert into the code:
//Debugger.log("my message");
window.addEventListener("load", windowLoadHandler, false);
var Debugger = function() { };
Debugger.log = function(message) {
	try {
		console.log(message);
	}
	catch (exception) {
		return;
	}
}

function windowLoadHandler() {
	canvasApp();
}

function canvasSupport() {
	return Modernizr.canvas;
}

function canvasApp() {
	if (!canvasSupport()) {
		return;
	}

	var theCanvas = document.getElementById("canvasOne");
	var context = theCanvas.getContext("2d");

	init();

	var shapes;
	var dragIndex;
	var dragging;
	var mouseX;
	var mouseY;
	var dragHoldX;
	var dragHoldY;

	function init() {
		shapes = [];

		makeShapes();

		drawScreen();

		theCanvas.addEventListener("mousedown", mouseDownListener, false);
	}

	function makeShapes() {
		var i;
		var tempX;
		var tempY;
		var tempRad;
		var tempR;
		var tempG;
		var tempB;
		var tempColor;
		var spheres=config['spheres'];
		for (var i=0; i<spheres.length; i++)
		{
			tempRad=30;
			addShape(spheres[i].x, spheres[i].y)
		}
	}

	function addShape(x, y){
		var newShape=createSphere(x, y);
		shapes.push(newShape);
		//config.spheres.push(newShape);
	}
	function createSphere(x, y) {
		tempRad=30; // static size
		tempR = Math.floor(Math.random()*255);
		tempG = Math.floor(Math.random()*255);
		tempB = Math.floor(Math.random()*255);
		tempColor = "rgb(" + tempR + "," + tempG + "," + tempB +")";
		tempShape = {x:x, y:y, rad:tempRad, color:tempColor};
		return tempShape;
	}

	function mouseDownListener(evt) {
		var i;
		//We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
		//only the topmost one will be dragged.
		var highestIndex = -1;

		//getting mouse position correctly, being mindful of resizing that may have occured in the browser:
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

		//find which shape was clicked
		for (i=0; i < shapes.length; i++) {
			if	(hitTest(shapes[i], mouseX, mouseY)) {
				dragging = true;
				if (i > highestIndex) {
					//We will pay attention to the point on the object where the mouse is "holding" the object:
					dragHoldX = mouseX - shapes[i].x;
					dragHoldY = mouseY - shapes[i].y;
					highestIndex = i;
					dragIndex = i;
				}
			}
		}
		if (!dragging) {
			console.log("nothing selected, creating new object(" + mouseX + ", " + mouseY + ")");
			addShape(mouseX, mouseY);
			drawScreen();
		}
		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
		}
		theCanvas.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);

		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	}

	function mouseUpListener(evt) {
		theCanvas.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if (dragging) {
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
		}
	}

	function mouseMoveListener(evt) {
		var posX;
		var posY;
		var shapeRad = shapes[dragIndex].rad;
		var minX = shapeRad;
		var maxX = theCanvas.width - shapeRad;
		var minY = shapeRad;
		var maxY = theCanvas.height - shapeRad;
		//getting mouse position correctly
		var bRect = theCanvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

		//clamp x and y positions to prevent object from dragging outside of canvas
		posX = mouseX - dragHoldX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

		shapes[dragIndex].x = posX;
		shapes[dragIndex].y = posY;

		drawScreen();
	}

	function hitTest(shape,mx,my) {

		var dx;
		var dy;
		dx = mx - shape.x;
		dy = my - shape.y;

		//a "hit" will be registered if the distance away from the center is less than the radius of the circular object
		return (dx*dx + dy*dy < shape.rad*shape.rad);
	}

	function drawShapes() {
		var i;
		for (i=0; i < shapes.length; i++) {
			context.fillStyle = shapes[i].color;
			context.beginPath();
			context.arc(shapes[i].x, shapes[i].y, shapes[i].rad, 0, 2*Math.PI, false);
			context.closePath();
			context.fill();
		}
	}

	function drawScreen() {
		//bg
		context.fillStyle = "#000000";
		context.fillRect(0,0,theCanvas.width,theCanvas.height);

		drawShapes();
	}

}
