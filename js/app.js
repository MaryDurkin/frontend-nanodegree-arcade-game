// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    this.speed = speed;
    this.x = x; //the initial x,y position of the enemy
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
};


Enemy.prototype.update = function(dt) {

    //ensure the enemies move at at constant speed from left to right

    this.x += this.speed*dt;
     if (this.x >= 505) {
        this.x = -100;
    }
};


Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

var Player = function() {
    this.x = 200; //the initial x,y position of the player
    this.y = 332;
    // this variable is used to trigger the game end scenario
    this.bugCollision = false;
    this.sprite = 'images/Mary.png';
    // The following variables are used control the player score and level
    this.level = 1;
    this.score =0;
    this.levelUp = false;
};

Player.prototype.update = function(dt){

    // Check if the player has collided with any of the enemy bugs
    for (var i =0; i < allEnemies.length; i++) {
        if ((allEnemies[i].y === this.y) && (Math.abs(allEnemies[i].x - this.x) <=70)){
            this.bugCollision = true;
            break;
        }
    }

    //make sure player stays on the canvas
    if (this.x >= 404) {
        this.x = 404;
    }
    else if (this.x <= 0) {
        this.x = 0;
    }
    if (this.y >= 415) {
        this.y = 415;
    }
    // when player reaches the pool, increase level and score
    // and set player back to initial x, y position
    else if (this.y <=0) {
        this.levelUp = true;
        this.level += 1;
        this.score +=1;
        this.y = 332;
    }


    //if no bug collision check for collision with a gem
    //if so add to the score and set gemGrabbed variable to true
    if (this.bugCollision === false) {
        if ((gem.y === this.y) && (Math.abs(gem.x - this.x) <=70) && (gemGrabbed === false)){
            this.score += gem.bonus;
            gemGrabbed = true;

        }
    }
    //Update the player score display
    ctx.font = "30px Arial";
    ctx.clearRect(202, 0, 100, 50);
    ctx.fillText(this.score, 202, 35);
    ctx.clearRect(404, 0, 404, 50);
    ctx.fillText(this.level, 404, 35);
};


//After collision with a bug, the player slowly ascends to heaven
Player.prototype.ascend = function(dt){
    // sprite image is changed to an angel
    this.sprite = 'images/Mary-Angel.png';
    this.y -= 40*dt;
    // keep the player-angel on the canvas
    if (this.y <= 0) {
        this.y = 0;

    }

};

Player.prototype.render = function(){

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

Player.prototype.handleInput = function(key){
    //controls movement during regular play - player hops one sqaure at a time
    if (this.bugCollision === false){
        switch(key) {
            case 'left':
                this.x -= 101;
                break;
            case 'right':
                this.x += 101;
                break;
            case 'up':
                this.y -= 83;
                break;
            case 'down':
                this.y += 83;
                break;
        }

    }
    // after a bug collision the space key will restart the game
    else if (key === 'space') {
        reStart();
    }


};

// define a gem class
var Gem = function(x,y,gemImage,bonus){
    this.x = x;
    this.y = y;
    this.sprite = gemImage;
    this.bonus = bonus;

};

Gem.prototype.render = function(){

    if (gemGrabbed === false) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Gem.prototype.update = function(){
    if ((gemGrabbed === true) && (player.levelUp === true)){
        //randomly choose a gem and position to replace the one on the board
        var randomGem = Math.floor((Math.random() * 5));
        var randomPosition = Math.floor((Math.random() * 15));
        this.x = gemPosition[randomPosition][0];
        this.y = gemPosition[randomPosition][1];
        this.bonus = gemArray[randomGem][1];
        this.sprite = gemArray[randomGem][0];
        gemGrabbed = false;
    }

};

// Instantiate the player, gem and enemies.

var player = new Player();

var allEnemies = [];

//These y positions will be used again when adding enemies for higher levels.
var yStartPos1 = 83;
var yStartPos2 = 166;
var yStartPos3 = 249;

// will be used as a baseline speed for the enemies
var initialSpeed = 40;

//used when determining whether to reset and render gem
var gemGrabbed = false;


//the initial x positions space the bugs in the intitial phase of the game

allEnemies.push(new Enemy(1,yStartPos1,(initialSpeed+10)));
allEnemies.push(new Enemy(-220,yStartPos2,(initialSpeed+20)));
allEnemies.push(new Enemy(-330,yStartPos3,initialSpeed));

//gems will be selected and placed randomly on the stone blocks.
//These arrays contains the x y locations of the 15 stone blocks and the other gem properties
var gemPosition = [[1,83],[1,166],[1,249],[101,83],[101,166],[101,249],[202,83],[202,166],[202,249],
                    [303,83],[303,166],[303,249],[404,83],[404,166],[404,249],[505,83],[505,166],[505,249]];

var gemArray = [['images/gem-blue.png',5],['images/gem-green.png',5],['images/gem-orange.png',5],['images/Heart.png',10],['images/Key.png',20]];

//initial gem - start with blue, in the middle of the canvas

var gem = new Gem(gemPosition[7][0],gemPosition[7][1],gemArray[0][0],gemArray[0][1]);

// This function resets the player, gem and enemies
// after the game is restarted.
var reStart = function() {

        player.x = 202;
        player.y = 332;
        player.level = 1;
        player.score = 0;
        player.bugCollision = false;
        player.sprite = 'images/Mary.png';
        // resets total number of enemies to 3
        for (var i=allEnemies.length; i>3; i-=1) {
                allEnemies.pop();
            }

        gem.x = gemPosition[7][0];
        gem.y = gemPosition[7][1];
        gem.sprite = gemArray[0][0];
        gem.bonus = gemArray[0][1];
        gem.render();

        gemGrabbed = false;

};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


