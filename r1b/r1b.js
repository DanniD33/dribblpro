function moveLeft(){
  let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
  left -= 100;
  if (left >= 0){
    character.style.left = left + "px";
  }
}

function moveRight(){
  let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
  left += 100;
  if (left < 300){
    character.style.left = left + "px";
  }
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft"){moveLeft()};
  if (event.key === "ArrowRight"){moveRight()};

})

let block = document.getElementById("block");
let counter = 0;
block.addEventListener('animationiteration', () => {
  let random = Math.floor(Math.random() * 3);
  left = random * 100;
  block.style.left = left + "px";
  counter++;
})

setInterval(function(){
  let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));
  let blockTop = parseInt(window.getComputedStyle(block).getPropertyValue('top'));
  if (characterLeft === blockLeft && blockTop < 500 && blockTop > 300){
    block.style.animation = "none";
    alert('game over. score: '+ counter );
    counter = 0;
    block.style.animation = "";
  }
}, 1);

document.getElementById("left").addEventListener("touchstart", moveLeft);
document.getElementById("right").addEventListener("touchstart", moveRight);