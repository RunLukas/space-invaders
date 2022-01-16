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

let keybindLeft = 65;
let keybindRight = 68;
let keybindShoot = 32;

//let enemies = new Array(5).fill(0).map(() => new Array(11).fill(0));
let enemies = Array.from(Array(numOfRows), () => new Array(numOfColumns));

let enemiesMovement = false;
let enemiesCounterX = 0;
let enemiesCounterY = 0;

let delay=400;
let lastClick=0;

let levelCounter = 1;
let score = 0;
let highScore = 0;
let stopGame = false;

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

let keyBindCounter = 0;

function waitingKeyPress(){
	return new Promise((resolve) => {
		document.addEventListener("keydown", onKeyHandler);
		function onKeyHandler(e){
			if(keyBindCounter == 0) {keybindLeft = e.keyCode; keyBindCounter++;}
			else if(keyBindCounter == 1) {keybindRight = e.keyCode; keyBindCounter++;}
			else if(keyBindCounter == 2) {keybindShoot = e.keyCode; keyBindCounter = 0;}
			document.removeEventListener('keydown', onKeyHandler);
			resolve();
		}
	});
}

async function changeKeybinds(){
	document.getElementById("keybinds").disabled = true;
	document.getElementById("leftText").style.color = "red";
	await waitingKeyPress();
	console.log(keybindLeft);
	document.getElementById("left").innerText =  String.fromCharCode(keybindLeft);
	document.getElementById("leftText").style.color = "black";

	document.getElementById("rightText").style.color = "red";
	await waitingKeyPress();
	console.log(keybindRight);
	document.getElementById("right").innerText = String.fromCharCode(keybindRight);
	document.getElementById("rightText").style.color = "black";

	document.getElementById("shootText").style.color = "red";
	await waitingKeyPress();
	console.log(keybindShoot);
	document.getElementById("shoot").innerText = String.fromCharCode(keybindShoot);
	document.getElementById("shootText").style.color = "black";
	document.getElementById("keybinds").disabled = false;
}

function playerInput () {
	//check for pressed buttons
	//left
	if (keys[keybindLeft]){
		if(player.x>25){
			player.x -= 2;
		}
	}

	//right
	if (keys[keybindRight]){
		if(player.x<canvas.width-25) {
			player.x += 2;
		}
	}

	//shoot
	if (keys[keybindShoot]) {
		if(lastClick<=(Date.now()-delay))
        {
            lastClick=Date.now();
            bullets.push(new Bullet(player.x, player.y));
            updateBullets();
        }
		keys[keybindShoot] = false;
	}
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
				score++;
				document.getElementById("score").innerText =  score;
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
				enemies[i][j].x += 0.70*levelCounter/2;
				
			}
		}
	}
	if(enemiesMovement == true){
		for(let i = 0; i < numOfRows; i++){
			for(let j = 0; j < enemies[i].length; j++){
				if(enemies[i][j] === undefined) break;
				enemies[i][j].x -= 0.70*levelCounter/2;
			}
		}
	}
	for(let i = 0; i < numOfRows; i++){
		for(let j = 0; j < enemies[i].length; j++){
			if(enemies[i][j] === undefined) break;
			if(enemies[i][j].y > canvas.height-40) stopGame = true;
		}
	}
}

let isEmpty = true;
let numOfEmptyRows = 0;

function drawEnemies(){
	//creates new enemies
	for(let i = 0; i < numOfRows; i++){
		if(enemies[i].length == 0){
			numOfEmptyRows++;
			if(numOfEmptyRows == numOfRows){
				isEmpty = true;
				levelCounter++;
				document.getElementById("level").innerText =  levelCounter;
			}
		}
	}
	numOfEmptyRows = 0;
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
	drawBullets();
	drawEnemies();
	playerInput();
	document.getElementById("startGame").disabled = true;

	if(stopGame == true) {
		document.getElementById("lostText").hidden = false;
		if(localStorage.getItem('highScoreKey') < score){
			localStorage.setItem('highScoreKey', score);
			document.getElementById("highScore").innerText = score;
		}
		
		return;
	}

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

	drawBackground();
	drawPlayer();
	drawEnemies();

	document.getElementById("left").innerText =  String.fromCharCode(keybindLeft);
	document.getElementById("right").innerText = String.fromCharCode(keybindRight);

	document.getElementById("level").innerText =  levelCounter;
	document.getElementById("score").innerText =  score;
	document.getElementById("highScore").innerText =  localStorage.getItem('highScoreKey');
}