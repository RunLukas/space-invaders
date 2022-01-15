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

class Enemy{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.enemy = new Image();
		this.enemy.src = "enemy.png";
	}
}

let canvas;
let ctx;
let buffer;

let player;

let bullets = [];

let numOfRows = 5;
let numOfColumns = 8;

//let enemies = new Array(5).fill(0).map(() => new Array(11).fill(0));
let enemies = Array.from(Array(numOfRows), () => new Array(numOfColumns));

let enemiesMovement = false;
let enemiesCounterX = 0;
let enemiesCounterY = 0;


let velX = 0,
	speed = 3,
	friction = 0.3,
	keys=[],
	checkKeyUp = true;

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
	//check for pressed buttons
	//"a"
	if (keys[65]){
		if(player.x>25){
			player.x -= 2;
		}
	}

	//"d"
	if (keys[68]){
		if(player.x<canvas.width-25) {
			player.x += 2;
		}
	}

	//"space"
	if (keys[32]) {
		bullets.push(new Bullet(player.x, player.y));
		updateBullets();
		keys[32] = false;
	}

	velX *= friction;
    player.x += velX;
}

function drawPlayer () {
	//draw player spaceship at current location
	buffer.drawImage(player.ship, player.x-20, player.y, 40, 20)
}

function detectCollision(i) {
    for(j = 0; j < enemies.length; j++) {
		for(let k = 0; k < enemies[j].length; k++){

            if (bullets[i].x < enemies[j][k].x + 40 &&
			bullets[i].x + 2 > enemies[j][k].x &&
            bullets[i].y < enemies[j][k].y + 20 && 
			bullets[i].y + 2 > enemies[j][k].y){
                enemies[j].splice(k, 1);
				bullets.splice(i, 1);
				return;
			}
		}
    }
}

function updateBullets () {
	//update all existing bullets
	for(let i = 0; i < bullets.length; i++){
		bullets[i].y -= 3;
		
		

		//if bullet is off-screen then remove it from array 
		if(bullets[i].y <= 0)
			bullets.splice(i, 1);
		else
			detectCollision(i);

		//if bullet hit an enemy remove both the bullet and the enemy
		
	}
}

function updateEnemies(){
	if(enemies[0][enemies[0].length-1].x+20 > canvas.width){
		enemiesMovement = true;
		for(let i = 0; i < numOfRows; i++){
			for(let j = 0; j < enemies[i].length; j++){
				if(enemies[i][j] === undefined) break;
				enemies[i][j].y += 10;
			}
		}
	}
	if(enemies[0][0].x-20 < 0){
		enemiesMovement = false;
		for(let i = 0; i < numOfRows; i++){
			for(let j = 0; j < enemies[i].length; j++){
				if(enemies[i][j] === undefined) break;
				enemies[i][j].y += 10;
			}
		}
	}
	if(enemiesMovement == false){
		for(let i = 0; i < numOfRows; i++){
			for(let j = 0; j < enemies[i].length; j++){
				if(enemies[i][j] === undefined) break;
				enemies[i][j].x += 0.20;
				
			}
		}
	}
	if(enemiesMovement == true){
		for(let i = 0; i < numOfRows; i++){
			for(let j = 0; j < enemies[i].length; j++){
				if(enemies[i][j] === undefined) break;
				enemies[i][j].x -= 0.20;
			}
		}
	}
}

let isEmpty = true;

function drawEnemies(){
	//creates new enemies
	
	if(isEmpty){
		for(let i = 0; i < numOfRows; i++){
			for(let j = 0; j < numOfColumns; j++){
				enemies[i][j] = new Enemy(43*j+30, i*35+50);
				buffer.drawImage(enemies[i][j].enemy, enemies[i][j].x-20, enemies[i][j].y, 40, 20);
				if(i == numOfRows-1 && j == numOfColumns-1) isEmpty = false;
			}
		}
	}

	//draw all still existing enemies
	for(let i = 0; i < numOfRows; i++){
		for(let j = 0; j < enemies[i].length; j++){
			buffer.drawImage(enemies[i][j].enemy, enemies[i][j].x-20, enemies[i][j].y, 40, 20);
		}
	}
	updateEnemies();
	
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

	
	updateBullets();
}

function draw () {
	drawBackground();
	drawPlayer();
	drawEnemies();	
	drawBullets();
	playerInput();
	window.requestAnimationFrame(draw);
	
}

function init () {
	document.addEventListener('keydown', function (e) {
		keys[e.keyCode] = true;
	});
	document.addEventListener('keyup', function (e) {
		keys[e.keyCode] = false;
	});
	initElements(); 
	initBackground();
	player = new Player(canvas.width/2, canvas.height-30, "ship.png");//"https://cdn.onlinewebfonts.com/svg/img_3969.png");

	//start game
	draw();
}
