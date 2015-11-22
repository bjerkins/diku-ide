// put scripts for assignment 1 here

var image = new Image();
image.src = '/images/image_01.jpg';

image.onload = function()
{
	document.getElementById("assignment_one").appendChild(image);
}