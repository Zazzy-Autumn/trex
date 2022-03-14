var trex, trex_running, edges, trex_dies;
var groundImage, ground, invisible_ground;
var obstacle, obstacle_1, obstacle_2, obstacle_3, obstacle_4, obstacle_5, obstacle_6;
var cloud, cloud_sprite;
var game_state = "play";
var cloud_group, cactu_group;
var gameover_sprite, gameover_image;
var restart_sprite, restart_image;
var sound_die, sound_jump, sound_score;
var score = 0

function preload(){
  trex_dies = loadImage("trex_collided.png");
  cloud = loadImage("cloud.png");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  obstacle_1 = loadImage("obstacle1.png");
  obstacle_2 = loadImage("obstacle2.png");
  obstacle_3 = loadImage("obstacle3.png");
  obstacle_4 = loadImage("obstacle4.png");
  obstacle_5 = loadImage("obstacle5.png");
  obstacle_6 = loadImage("obstacle6.png");
  gameover_sprite = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");

  sound_die = loadSound("die.mp3");
  sound_jump = loadSound("jump.mp3");
  sound_score = loadSound("checkpoint.mp3");

}
function setup(){
    createCanvas(windowWidth,windowHeight);
    ground = createSprite(width/2, height-15, width, 25);
    ground.addImage("chão",groundImage);
    invisible_ground = createSprite(width/2, height-10, width, 15);
    invisible_ground.visible = false;
    trex = createSprite(50, height-50, 20, 50);
    trex.addAnimation("running", trex_running);
    trex.addImage("trex", trex_dies);
    edges = createEdgeSprites();
    trex.debug = false;
    trex.setCollider("circle", 0, 0, 40);
    //trex.setCollider("rectangle", 0, 0, 90, 100, 0);
    trex.scale = 0.5;
    trex.x = 50;
    cloud_group = new Group();
    cactu_group = new Group();
    restart_sprite = createSprite(width/2, height/2+25);
    restart_sprite.addImage("restart.png", restart_image);
    restart_sprite.scale = 0.4;
    restart_sprite.visible = false;
    gameover_image = createSprite(width/2, height/2);
    gameover_image.addImage(gameover_sprite);
    gameover_image.visible = false;
}
function draw(){
  background("white");
  textFont("Arial");
  text("score: " + score,  width-100, 20);

  trex.collide(invisible_ground);
  drawSprites();
  if (game_state === "play") {
    score = score + Math.round(getFrameRate()/60);
    cloud_spawn();
    obstacle_creator();
  if(touches.lemgth > 0 ||keyDown("space")&&trex.y>140){
    trex.velocityY = -10;
    sound_jump.play();
    touches = []
  }
    trex.velocityY = trex.velocityY + 0.5;
    ground.velocityX = -4.5;
  if(ground.x < 0){
    ground.x = ground.width/2;
  }
  if(trex.isTouching(cactu_group)){
  game_state = "game_over";
  sound_die.play();
  }
 } else if(game_state === "game_over"){
    trex.velocityY = 0;
    ground.velocityX = 0;
    cactu_group.setVelocityXEach(0);
    cloud_group.setVelocityXEach(0);
    trex.changeAnimation("trex", trex_dies);
    cactu_group.setLifetimeEach(-1);
    cloud_group.setLifetimeEach(-1);
    gameover_image.visible = true;
    restart_sprite.visible = true;
   if (touches.lemgth > 0 ||mousePressedOver(restart_sprite)){
    restart();
    touches = []
  }
 }
}
function obstacle_creator(){
  if(frameCount%60===0){
  obstacle = createSprite(width, height-15);
  obstacle.velocityX = -4.5;
  obstacle.scale = 0.7;
  obstacle.lifetime = 550;
cactu_group.add(obstacle);
  var aleatorio = Math.round(random(1, 6));
  switch(aleatorio){
case 1:obstacle.addImage(obstacle_1);
break;
case 2:obstacle.addImage(obstacle_2);
break;
case 3:obstacle.addImage(obstacle_3);
break;
case 4:obstacle.addImage(obstacle_4);
break;
case 5:obstacle.addImage(obstacle_5);
break;
case 6:obstacle.addImage(obstacle_6);
break;
    }
  }
}
function cloud_spawn(){
if(frameCount%60===0){

cloud_sprite = createSprite(width, 30);
cloud_sprite.addImage("cloud", cloud);
cloud_sprite.velocityX = -4;
cloud_sprite.y = Math.round(random(0, 100));
cloud_sprite.lifetime = 550;
cloud_group.add(cloud_sprite);
cloud_sprite.depth = trex.depth;
trex.depth++;
  }
}
function restart(){
  game_state = "play"
  trex.changeAnimation("running", trex_running);
  cloud_group.destroyEach();
  cactu_group.destroyEach();
  score = 0;
  restart_sprite.visible = false;
  gameover_image.visible = false;

}