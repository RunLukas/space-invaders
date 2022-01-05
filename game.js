class Player {
	constructor(x, y, imageSource){
		this.x = x;
		this.y = y;
		this.ship = new Image();
		this.ship.src = imageSource;
	}
}

class Bullet{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

let canvas;
let ctx;
let buffer;

let player;

let bullets = [];

function initBackground(){
	//set backround color of canvas to gray
	ctx.fillStyle = 'silver';
}

function initElements(){
	//create canvas element
	canvas = document.createElement("canvas");

	//set canvas size
	canvas.width = 500;
	canvas.height = 500;

	//get context of canvas
	ctx = canvas.getContext("2d");
	buffer = canvas.getContext("2d");

	//append canvas to body
	document.body.appendChild(canvas)
}

function drawBackground () {
	//decorate your background
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function playerInput (e) {
	console.log(e.keyCode);

	//check for pressed buttons
	//"a"
	if (e.keyCode == "65") 
		player.x -= 5;

	//"d"
	else if (e.keyCode == "68") 
		player.x += 5;

	//"space"
	else if (e.keyCode == "32") {
		bullets.push(new Bullet(player.x, player.y));
		updateBullets();
	}
}

function drawPlayer () {
	//draw player spaceship at current location
	buffer.drawImage(player.ship, player.x-20, player.y, 40, 20)
}

function updateBullets () {
	//update all existing bullets
	for(let i = 0; i < bullets.length; i++){
		bullets[i].y -= 3;
		
		//if bullet is off-screen then remove it from array 
		if(bullets[i].y <= 0)
			bullets.splice(i, 1);

		//if bullet hit an enemy remove both the bullet and the enemy
		//detectCollision();
	}
}

function drawBullets () {
	//skips function if no bullets exist
	if(bullets.length == 0)
		return;

	//draw all still existing bullets
	for(let i = 0; i < bullets.length; i++){
		buffer.beginPath();
		buffer.arc(bullets[i].x, bullets[i].y, 2, 0, 2*Math.PI);
		buffer.stroke();
	}

	//update enemy
	updateBullets();
}

function draw () {
	drawBackground();
	drawPlayer();	
	drawBullets();
	//drawEnemies();
	window.requestAnimationFrame(draw);
}

function init () {
	document.addEventListener('keydown', playerInput);
	initElements(); 
	initBackground();
	player = new Player(canvas.width/2, canvas.height-30, "ship.png");//"https://cdn.onlinewebfonts.com/svg/img_3969.png");

	//start game
	draw();
}
