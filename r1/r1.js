let character = document.getElementById("character");
let block = document.getElementById("block");
let owl = document.getElementById("owl");
let counter=0;
function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);

    if (character.style.backgroundImage === 'url("./r1assets/aubsStationary.png")') {
        character.style.backgroundImage = 'url("./r1assets/aubsjumpright.png")';
        // character.style.backgroundImage = "";
    } 
    else {
        character.style.backgroundImage = 'url("./r1assets/aubsStationary.png")';
    }


}
let checkDead = setInterval(function() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    // let kickLeft = parseInt(window.getComputedStyle(kick).getPropertyValue("left"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(blockLeft<60 && blockLeft>-20 && characterTop>=250){
        block.style.animation = "none";
        //when you lose, trigger kungu kenny
        alert("Game Over. score: "+Math.floor(counter/100));
        // kick.style.animation = "kick 1s ease-in-out linear";
        counter=0;
        block.style.animation = "block 1s infinite linear";
    }else{
        counter++;
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
        if (document.getElementById("scoreSpan").innerHTML > 20){
            block.style.display = "none";
            owl.style.backgroundImage = 'url("./r1assets/owl.png")';     
            // owl.style.display = 'block';
            owl.style.animation = "owl 2s 2 linear";
                window.location.href = "/advance";
                // window.location.href = "http://localhost:5000/final";
                // window.location.href = "http://localhost:8080/final";
            //    window.location.href = "https://8eeb-2601-c1-c100-710-61b7-792d-5597-a3ad.ngrok-free.app" + "/final";
            }
    }
}, 10);
