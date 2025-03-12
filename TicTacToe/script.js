const boxes= document.querySelectorAll(".box");
const gameinfo= document.querySelector(".game-info");
const newGameBtn= document.querySelector(".newgame");
let currPlayer;
let gameGrid;
const winningPositions=[
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
];
//initializating the game
function init(){
    currPlayer="X";
    gameGrid=["","","","","","","","",""];
    newGameBtn.classList.remove("active");
    //UI pe change krna hai 
    boxes.forEach((box,index)=>{
        boxes[index].innerText= "";
        boxes[index].style.pointerEvents="all";
        boxes[index].classList.remove("win");
    })
  
    gameinfo.innerText=`Current Player - ${currPlayer}`;
}
init();

//swapping the turns
function swapTurn(){
    if(currPlayer=="X"){
        currPlayer="O";
    }
    else{
        currPlayer="X";
    }
    //UI update
    gameinfo.innerText= `Current Player - ${currPlayer}`;
}

function checkGameOver(){
    let answer="";
    winningPositions.forEach((positions)=>{
        if((gameGrid[positions[0]]!=="" || gameGrid[positions[1]]!=="" || gameGrid[positions[2]]!=="")
        && (gameGrid[positions[0]] === gameGrid[positions[1]] && gameGrid[positions[1]] === gameGrid[positions[2]])){

            if(gameGrid[positions[0]]==="X"){
                answer="X";

            }
            else{
                answer="O";
            }
            //disable pointer events to end the game else it will continue
            boxes.forEach((box)=>{
                box.style.pointerEvents="none";
            })
            boxes[positions[0]].classList.add("win");
            boxes[positions[1]].classList.add("win");
            boxes[positions[2]].classList.add("win");
    }
    if(answer!==""){
        gameinfo.innerText= `Winner Player - ${answer}`;
        newGameBtn.classList.add("active");
        return ;// because if we dont return then the game will still continue
    }

    //if there is a tie => check all the boxes are non empty and return
    let count=0;
    boxes.forEach((box)=>{
        
        if(box.innerText!=""){
           count++;
        }
    })
    if(count==9) {
        gameinfo.innerText= `Game Tied!`;
        newGameBtn.classList.add("active");
    }


    })

}
//function to handle after clicking on the box
function handleClick(index){
    if(gameGrid[index]===""){
        //updating on the UI
        boxes[index].innerText= currPlayer;
        //updating in the array/grid
        gameGrid[index]=currPlayer;
        boxes[index].style.pointerEvents="none";
        //swap krna hai turn ko
        swapTurn();
        //check if anyone has won or not
        checkGameOver();
    }
}
//adding event listener on each box
//iterating through the box and adding on each box 
boxes.forEach((box,index)=>{
    box.addEventListener("click",()=>{
        handleClick(index);
    })


});
//if we click the new game button it initializes the game
newGameBtn.addEventListener("click",init);
