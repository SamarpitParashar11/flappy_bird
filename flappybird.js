let board;
let boardwidth=360;
let boardheight=640;
let context;

let highscore= localStorage.getItem("highscore") || 0;



//bird
let birdwidth=34;//width to height rTIO = 408/228
let birdheight=24;
let birdx=boardwidth/8;
let birdy=boardheight/2;
let bird={
    x: birdx,
    y: birdy,
    width: birdwidth,
    height: birdheight
}
//pipe

let pipeArray=[];
let pipewidth=64;
let pipeheight=512;
let pipeX=boardwidth   ;
let pipeY=0;

let topPipeImg;
let bottomPipeImg;


//physics

let velocityX=-2;
let velocityY=0;
let gravity =0.4;
let gameover=false;
let score=0;


window.onload=function(){
    board=document.getElementById("board");
    board.width=boardwidth;
    board.height=boardheight;
    context=board.getContext("2d");// used for drawing on the board




    birdimg=new Image();
    birdimg.src="flappybird0.png";
    birdimg.onload=function(){
        context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);
}
    topPipeImg=new Image();
    topPipeImg.src="toppipe.png";


    bottomPipeImg=new Image();
    bottomPipeImg.src="bottompipe.png";


    requestAnimationFrame(update);

    setInterval(placepipe,1500);

    document.addEventListener("keydown",moveBird);
}


function update(){

    requestAnimationFrame(update);
    drawscore();

    if (gameover){
        drawGameOver();
        return;
    }

    context.clearRect(0,0,board.width,board.height);
    

    //bird
    velocityY+=gravity;
    bird.y=Math.max(bird.y+velocityY,0);
    // bird.y+=velocityY;
    context.drawImage(birdimg,bird.x,bird.y,bird.width,bird.height);


    if (bird.y>board.height){
        gameover=true;
    }

    if (gameover){
        highscore=Math.max(highscore,score);
        localStorage.setItem("highscore",highscore);
        return;
    }

    for (let i=0;i<pipeArray.length;i++){
        let pipe=pipeArray[i];
        pipe.x+=velocityX;
        
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);        
        
        if (!pipe.passed && pipe.x + pipe.width < bird.x){
            score+=0.5;
            pipe.passed=true;
        }
        
        
        if( detectCollision(bird,pipe)){
            gameover=true;
    }
}

while (pipeArray.length > 0 && pipeArray[0].x < -pipewidth){
    pipeArray.shift();
}}

function drawscore(){
context.fillStyle="green";
context.font="30px Arial";
context.shadowColor="black";
context.shadowblur=4;

context.fillText("Score : " + score,10,35);
context.fillText("High Score : " + highscore,10,65);
}

function placepipe(){

if (gameover){
    return;
}

    let randompipeY=pipeY - pipeheight/4 - Math.random()*(pipeheight/2);


    let toppipe={
        img:topPipeImg,
        x:pipeX,
        y:randompipeY,  
        width:pipewidth,
        height:pipeheight,
        passed:false
    }
    pipeArray.push(toppipe);

    let bottompipe={
        img:bottomPipeImg,
        x:pipeX,
        y:randompipeY + pipeheight + boardheight/4,
        width:pipewidth,
        height:pipeheight,
        passed:false
    }
    pipeArray.push(bottompipe);

    }
function moveBird(e){

    if (gameover){
        resetGame();
        return;
    }
    if (e.code=="Space" || e.code=="ArrowUp"|| e.code=="KeyW"){
        velocityY=-6;
    }   
}
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
} 
function drawGameOver() {
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "white";
    context.textAlign = "center";

    context.font = "42px Arial";
    context.fillText("GAME OVER", board.width / 2, board.height / 2 - 40);

    context.font = "22px Arial";
    context.fillText("Score: " + score, board.width / 2, board.height / 2);
    context.fillText("High Score: " + highScore, board.width / 2, board.height / 2 + 30);

    context.fillText("Press any key to retry", board.width / 2, board.height / 2 + 80);

    context.textAlign = "left"; // reset
}

function resetGame(){
    bird.y=birdy;
    velocityY=0;
    pipeArray=[];
    score=0;
    gameover=false;
}