let inputBuffer = {};
let canvas = null;
let context = null;
var lastUpdate;

const COORD_SIZE = 900;

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
    this.isReady = true;
};
imgFloor.src = 'floor.jpg';

//generate every cell for the maze
let size = 15;
let maze = [];
for (let row = 0; row < size; row++) {
    maze.push([]);
    for (let col = 0; col < size; col++) {
        maze[row].push({
            x: col, y: row, visited: false, endCell: false, edges: {
                n: null,
                s: null,
                w: null,
                e: null
            }
        });
    }
}

//create maze
let wall = 0
wallList = []
maze[size-1][size-1].endCell = true
maze[0][0].visited = true

//add all walls to the list
wallList.push({neighbor: maze[1][0], from: "up"})
wallList.push({neighbor: maze[0][1], from: "left"})

//while there are still walls in the list
while(wallList.length != 0){
    //pick randomly from the wall list
    let pick = Math.floor(Math.random() * wallList.length )

    //if the other cell has not already been visited
    let partner = wallList[pick].neighbor    
    if(!partner.visited){
        let fromX = partner.x
        let fromY = partner.y
        
        //add each neighbor to each others list
        switch(wallList[pick].from){
            case "up":
                fromY--
                maze[fromY][fromX].edges.s = partner
                maze[partner.y][partner.x].edges.n = maze[fromY][fromX]
                break;
            case "down":
                fromY++
                maze[fromY][fromX].edges.n = partner
                maze[partner.y][partner.x].edges.s = maze[fromY][fromX]
                break;
            case "left":
                fromX--
                maze[fromY][fromX].edges.e = partner
                maze[partner.y][partner.x].edges.w = maze[fromY][fromX]
                break;
            case "right":
                fromX++
                maze[fromY][fromX].edges.w = partner
                maze[partner.y][partner.x].edges.e = maze[fromY][fromX]
                break;
            default:
                console.log("something went wrong")
        }
        partner.visited = true
        
        //add neighboring walls to wallList
        if(partner.y == 0){
            if(!wallList.some(item => item.neighbor == maze[partner.y+1][partner.x])){
                wallList.push({neighbor: maze[partner.y+1][partner.x], from:"up"})
            }
        } else if(partner.y == size-1){
            if(!wallList.some(item => item.neighbor == maze[partner.y-1][partner.x])){
                wallList.push({neighbor: maze[partner.y-1][partner.x], from:"down"})
            }
        } else {
            if(!wallList.some(item => item.neighbor == maze[partner.y-1][partner.x])){
                wallList.push({neighbor: maze[partner.y-1][partner.x], from:"down"})
            }
            if(!wallList.some(item => item.neighbor == maze[partner.y+1][partner.x])){
                wallList.push({neighbor:  maze[partner.y+1][partner.x], from:"up"})
            }
        }

        if(partner.x == 0){
            if(!wallList.some(item => item.neighbor == maze[partner.y][partner.x+1])){
                wallList.push({neighbor: maze[partner.y][partner.x+1], from:"left"})
            }
        } else if(partner.x == size-1){
            if(!wallList.some(item => item.neighbor == maze[partner.y][partner.x-1])){
                wallList.push({neighbor: maze[partner.y][partner.x-1], from:"right"})
            }
        } else {
            if(!wallList.some(item => item.neighbor == maze[partner.y][partner.x-1])){
                wallList.push({neighbor: maze[partner.y][partner.x-1], from:"right"})
            }
            if(!wallList.some(item => item.neighbor == maze[partner.y][partner.x+1])){
                wallList.push({neighbor: maze[partner.y][partner.x+1], from:"left"})
            }
        }
        // console.log(wallList)
    }
    //remove wall from the list
    wallList.splice(pick, 1)
}



//generate maze by creating walls by setting neighbor to null (do it for both neighbors)
function drawCell(cell) {
    if (imgFloor.isReady) {
        context.drawImage(imgFloor,
        cell.x * (COORD_SIZE / size), cell.y * (COORD_SIZE / size),
        COORD_SIZE / size + 0.5, COORD_SIZE / size + 0.5);
    }

    if (cell.edges.n === null) {
        context.moveTo(cell.x * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
        context.lineTo((cell.x + 1) * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
    }

    if (cell.edges.s === null) {
        context.moveTo(cell.x * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
        context.lineTo((cell.x + 1) * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
    }

    if (cell.edges.e === null) {
        context.moveTo((cell.x + 1) * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
        context.lineTo((cell.x + 1) * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
    }

    if (cell.edges.w === null) {
        context.moveTo(cell.x * (COORD_SIZE / size), cell.y * (COORD_SIZE / size));
        context.lineTo(cell.x * (COORD_SIZE / size), (cell.y + 1) * (COORD_SIZE / size));
    }

    // Can do all the moveTo and lineTo commands and then render them all with a single .stroke() call.
    context.stroke();
}

function renderCharacter(character) {
    if (character.image.isReady) {
        context.drawImage(character.image,
        character.location.x * (COORD_SIZE / size), character.location.y * (COORD_SIZE / size), .45*character.image.width/size, .5*character.image.height/size);
    }
}

//handle movement input
function moveCharacter(key, character) {
    if (key === 'ArrowDown') {
        if (character.location.edges.s) {
            character.location = character.location.edges.s;
        }
    }
    if (key == 'ArrowUp') {
        if (character.location.edges.n) {
            character.location = character.location.edges.n;
        }
    }
    if (key == 'ArrowRight') {
        if (character.location.edges.e) {
            character.location = character.location.edges.e;
        }
    }
    if (key == 'ArrowLeft') {
        if (character.location.edges.w) {
            character.location = character.location.edges.w;
        }
    }

    //if character gets to the end cell they win
    if(character.location.endCell){
        console.log("You won!")
    }
}

function renderMaze() {
    // Render the cells first
    context.beginPath();
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            drawCell(maze[row][col]);
        }
    }
    context.closePath();
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 6;
    context.stroke();

    // Draw a black border around the whole maze
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(COORD_SIZE - 1, 0);
    context.lineTo(COORD_SIZE - 1, COORD_SIZE - 1);
    context.lineTo(0, COORD_SIZE - 1);
    context.closePath();
    context.strokeStyle = 'rgb(255, 255, 0)';
    context.stroke();
}

//
// Immediately invoked anonymous function
//
let myCharacter = function(imageSource, location) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;
    return {
        location: location,
        image: image
    };
}('character.png', maze[0][0]);

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderMaze();
    renderCharacter(myCharacter);
}

function processInput() {
    for (input in inputBuffer) {
        moveCharacter(inputBuffer[input], myCharacter);
    }
    inputBuffer = {};
}

function update(elapsedTime){

}

function gameLoop() {
    var current = performance.now()
    update(current-lastUpdate)
    processInput();
    render();
    requestAnimationFrame(gameLoop);
}

function initialize() {
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');

    window.addEventListener('keydown', function(event) {
        inputBuffer[event.key] = event.key;
    });

    requestAnimationFrame(gameLoop);
}