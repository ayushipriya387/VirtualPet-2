//Create variables here
var database;
var dogImage,happyDog;
var foods,foodStock;
var dog;
var milk;
var foodObj;
var feed,addFood;
var lastFed;
var feedTime;

function preload()
{
	//load images here
  dogImage = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");

}

function setup() {
	createCanvas(1000,400);
     database = firebase.database();
     foodObj = new Food();
     dog = createSprite(800,200,150,150);
     dog.addImage(dogImage);
     dog.scale = 0.12;
     foodStock = database.ref('Food');
     foodStock.on("value",readStock);
     textSize(20);
     feed = createButton("Feed The Dog");
     feed.position(700,95);
     feed.mousePressed(feedDog);
     addFood = createButton("Add Food");
     addFood.position(800,95);
     addFood.mousePressed(addFoods); 
}


function draw() {  
  background("red");
  foodObj.display();
  feedTime = database.ref('feedTime');
  feedTime.on("value",function(data){
    lastFed = data.val();

  })
    fill(255,255,254);
    stroke("black");
    if(lastFed >= 12) {
      text("Last Feed:" +lastFed%12 + "PM",350,30);
    } else if(lastFed == 0) {
      text("Last Feed: 12AM",350,50);
    } else {
      text("Last Feed:" +lastFed+ "AM",350,30);
    }
    drawSprites();
  //add styles here

}

function readStock(data) {
   foods = data.val();
   foodObj.updateFoodStock(foods);
}

function writeStock(x) {
  if(x<=0) {
    x = 0;
  } else {
    x = x-1;
  } 
  database.ref('/').update({
    Food : x
  })

}

function addFoods() {
  foods++;
  database.ref('/').update({
    Food : foods
  })

}

function feedDog() {
  dog.addImage(happyDog);
  if(foodObj.getFoodStock()<=0) {
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }  else {
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    feedTime : hour()
  })

}