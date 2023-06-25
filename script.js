let squares = Array.from(document.getElementsByClassName('square'));
var board=solution = []
let bsize = 3
let eIndex = bsize*bsize -1;
let count = 0
let imageUrl

window.onload = () => {
    initGame()
    BCreate()
    closeNav()
    if (imageUrl){Bdraw()}
    else{imageUrl = '';Bdraw()}
}

function openNav() {
    document.getElementById("mySidepanel").style.width = "50vmin";
} 
function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
}

function encodeImageURL(url) {
    const encodedURL = btoa(url);
    return encodedURL;
}  
function decodeImageURL(encodedURL) {
    const url = atob(encodedURL);
    return url;
}
function encodePuzzleBoard(board) {
    const encodedBoard = btoa(JSON.stringify(board))
    return encodedBoard;
}
function decodePuzzleBoard(encodedBoard) {
    const board = JSON.parse(atob(encodedBoard))
    return board;
}

function saveSlot(n){
    let currState = {
        imginfo : encodeImageURL(imageUrl),
        binfo : encodePuzzleBoard(board)
    }
    slotList = JSON.parse(localStorage.getItem('slotList'))
    if (slotList == null || slotList == undefined){
        slotList = []
    }
    c = slotList.length
    if (c<n){
        for (let i=0;i<n-c;i++){
          slotList.push(null)
        }
    }
    slotList.splice(n,1,currState)
    localStorage.setItem("slotList",JSON.stringify(slotList));
    imageUrl = ''
    drawGamePanel()
    closeNav()
    bsize = 3
    v=parseInt(n)+1
    alert("Game save Successful at Slot" + v)
    document.getElementById('container').style.gridTemplateColumns = `repeat(${bsize},1fr)`
    document.getElementById('container').style.gridTemplateRows = `repeat(${bsize},1fr)`
    BReset()
    
}

function loadSlot(n){
    slotList = JSON.parse(localStorage.getItem('slotList'))
    imageUrl = decodeImageURL(slotList[n].imginfo)
    board = decodePuzzleBoard(slotList[n].binfo)
    console.log(imageUrl,board)
    slotList.splice(n,1,null)
    localStorage.setItem("slotList",JSON.stringify(slotList));
    drawGamePanel()
    closeNav()
    alert("Game load Successful")
    bsize = Math.sqrt(board.length)
    document.getElementById('container').style.gridTemplateColumns = `repeat(${bsize},1fr)`
    document.getElementById('container').style.gridTemplateRows = `repeat(${bsize},1fr)`
    Bdraw()
}

function drawGamePanel(){
    document.getElementById("sBox").innerHTML = ''
    para = document.createElement('p')
    para.innerHTML = 'Your Saved Games'
    document.getElementById('sBox').append(para)
    for (let i=0;i<5;i++){
        slot = document.createElement('div')
        slot.classList.add('slot')
        slot.id = i
        slot.innerHTML = "Slot"+(i+1).toString()
        document.getElementById('sBox').append(slot)        
    }
    arr = Array.from(document.getElementsByClassName('slot'))
    arr.forEach((e,i) => {
        if (slotList[i]!=null || slotList[i]!=undefined){
            e.classList.add('saved')
            e.addEventListener('click',()=>{
              console.log('loaded')
              loadSlot(e.id) 
            })
        }
        else{
            e.addEventListener('click',()=>{
              console.log('saved')
              saveSlot(e.id)  
            })
        }        
    });
}

function initGame() {
    slotList = JSON.parse(localStorage.getItem('slotList'))
    if (slotList == null || slotList == undefined){
        slotList = []
    }
    drawGamePanel()    
    const imageUploadInput = document.getElementById('image-upload');
    const imageUrlInput = document.getElementById('image-url');
    const size = document.getElementById('size')
    imageUploadInput.addEventListener('change', function () {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    });
    imageUrlInput.addEventListener('change', function () {
        imageUrl = this.value;
    });
    size.addEventListener('change', function () {
        bsize = parseInt(this.value);
        if (bsize>=6){
            bsize = 3
            alert('Have Board Size in the Range of 2-5')
        }
        if (bsize<=0 || bsize == undefined || isNaN(bsize)){
            bsize = 3
        }
        eIndex = bsize*bsize -1;
    });

}
function BReset() {
    eIndex = bsize*bsize - 1
    BCreate()
    if (imageUrl){Bdraw()}
    else{imageUrl = '';Bdraw()}
}

function BCreate() {
    board = []
    for (let i = 0; i < bsize * bsize; i++) {
        let tile = {
            row: Math.floor(i / bsize),
            col: i % bsize,
            index: i
        };
        board.push(tile);
    }
    document.getElementById('container').style.gridTemplateColumns = `repeat(${bsize},1fr)`
    document.getElementById('container').style.gridTemplateRows = `repeat(${bsize},1fr)`
}

function Bshuffle() {
    let arr = [[1,0],[0,1],[-1,0],[0,-1]]
    for (let i=0;i<30;i++){
        let e= board.findIndex((tile) => { return tile.index == eIndex })
        let num = Math.floor(Math.random()*4)
                r = board[e].row
                c = board[e].col
        r += arr[num][0]
        c += arr[num][1]
        if (r>=bsize || c>=bsize || r<0 || c<0){
            i-=1
            continue
        }
        let temp= board.findIndex((tile) => { return tile.row == r && tile.col==c })
        let temp2 = board[temp].index
        board[temp].index = board[e].index
        board[e].index = temp2
    }
    Bdraw()
}

function Bdraw() {
     console.log("inside draw board")
    let gameBoard = document.getElementById("container");

    gameBoard.innerHTML = "";
    gameBoard.style.backgroundImage =`url(${imageUrl})`
    gameBoard.style.backgroundSize = '100% 100%';
    for (let i = 0; i < board.length; i++) {
        let tile = board[i];
        let tileDiv = document.createElement("div");
        tileDiv.classList.add("square");
        if (imageUrl!=''){tileDiv.classList.add("imgNum");}
        tileDiv.style.backgroundImage = `url(${imageUrl})`;
        tileDiv.innerHTML=`${tile.index+1}`
        if (tile.index == eIndex){
            tileDiv.innerHTML=''
            tileDiv.style.backgroundImage = ""
            tileDiv.classList.add('emptyTile')
        }
        tileDiv.style.backgroundPosition = `-${tile.index % bsize * 100}% -${Math.floor(tile.index / bsize) * 100}%`;
        tileDiv.style.backgroundSize = `${bsize}00% ${bsize}00%`;
        gameBoard.append(tileDiv)
        tileDiv.onclick = function () {
            let e = board.findIndex((tile) => { return tile.index == eIndex })
            if ((i % bsize == e % bsize && (Math.abs(Math.floor(i / bsize) - Math.floor(e / bsize)) == 1)) || ((Math.floor(i / bsize) == Math.floor(e / bsize)) && (Math.abs(i % bsize - e % bsize) == 1))) {
                let r = tile.index
                tile.index = board[e].index
                board[e].index = r
                Bdraw()
                count++
                isWin()
            }
        }
    }
}

function isWin() {
    let correctOrder = board.slice(0,bsize*bsize - 1).map(square => parseInt(square.index));
    if (correctOrder.every((num, index) => num === index))
        alert('Congratulations! Puzzle completed.');
}

// const encodedURL = encodeImageURL(imageURL);
// console.log(encodedURL)
// localStorage.setItem("imageURL", encodedURL);

// const encodedBoard = encodePuzzleBoard(puzzleBoard);
// console.log(encodedBoard)
// localStorage.setItem("puzzleBoard", encodedBoard);

// // Retrieve and decode from local storage
// const storedEncodedURL = localStorage.getItem("imageURL");
// const decodedURL = decodeImageURL(storedEncodedURL);

// const storedEncodedBoard = localStorage.getItem("puzzleBoard");
// const decodedBoard = decodePuzzleBoard(storedEncodedBoard);

// // Use the decoded values as needed
// console.log(decodedURL);
// console.log(decodedBoard);

class Node {
  constructor(data, level, fval,parent) {
    this.data = data;
    this.level = level;
    this.fval = fval;
    this.parent = parent
  }

  generateChild() {
    const [x, y] = this.find(this.data, '_');
    const valList = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]];
    const children = [];
    for (const i of valList) {
      const child = this.shuffle(this.data, x, y, i[0], i[1]);
      if (child !== null) {
        const childNode = new Node(child, this.level + 1, 0);
        children.push(childNode);
      }
    }
    return children;
  }

  shuffle(puz, x1, y1, x2, y2) {
    if (x2 >= 0 && x2 < puz.length && y2 >= 0 &&  y2 < puz.length){
      const tempPuz = this.copy(puz);
      const temp = tempPuz[x2][y2];
      tempPuz[x2][y2] = tempPuz[x1][y1];
      tempPuz[x1][y1] = temp;
      return tempPuz;
    } 
    else {
      return null;
    }
  }

  copy(root) {
    const temp = [];
    for (const i of root) {
      const t = [...i];
      temp.push(t);
    }
    return temp;
  }

  find(puz, x) {
    for (let i = 0; i < puz.length; i++) {
      for (let j = 0; j < puz.length; j++) {
        if (puz[i][j] === x) {
            return [i, j];
        }
    }
}
}
}

class Puzzle {
    constructor(size,start,goal) {
        this.n = size;
        this.open = [];
        this.closed = new Set();
    this.start = start
    this.goal = goal
    this.solution=[]
}
f(start, goal) {
    return this.h(start.data, goal) + start.level;
}
h(start, goal) {
    let temp = 0;
    for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
            if (start[i][j] !== goal[i][j] && start[i][j] !== '_') {
                temp += 1;
            }
        }
    }
    return temp;
}
boardToString(board) {
    return board.map(row => row.join('')).join('');
}

has(set, item) {
    for (const val of set) {
        if (val === item) {
            return true;
        }
    }
    return false;
}

process() {
    const start = this.start
    const goal = this.goal
    
    const startNode = new Node(start, 0, 0, null);
    const startString = this.boardToString(startNode.data);
    startNode.fval = this.f(startNode, goal);
    this.open.push(startNode);
    this.closed.add(startString);
    while (true) {
        console.log("Finding Best possible route....")
        const cur = this.open[0];
        if (this.h(cur.data, goal) === 0) {
            break;
        }
      for (const child of cur.generateChild()) {
        const boardString = this.boardToString(child.data);
        if (!this.has(this.closed, boardString)) {
            child.fval = this.f(child, goal);
            child.parent = cur;
            this.open.push(child);
            this.closed.add(boardString);
        }
    }
    const curString = this.boardToString(cur.data);
    this.closed.add(curString);
    this.open.shift();
      this.open.sort((a, b) => a.fval - b.fval);
    }
    
    console.log('Steps in the shortest route:');
    let currentNode = this.open[0];
    const steps = [];
    while (currentNode !== null) {
        steps.push(currentNode.data);
        currentNode = currentNode.parent;
    }
    return steps   
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function solveIt(){
    curr = []
    temp = []
    for (let i=0;i<board.length;i++){
        temp.push((board[i].index==eIndex)?"_":board[i].index + 1)
        if(temp.length==bsize){
            curr.push([...temp])
            temp = []
        }
        
    }
    goal = []
    temp1 = []
    for (let i=0;i<board.length;i++){
        temp1.push(i+1)
        if(temp1.length==bsize){
            goal.push([...temp1])
            temp1 = []
        }

    }
    solution = solve(curr,goal)
    
    if (solution){
        for(let i=solution.length-1;i>=0;i--){
            indexArr = []
            temp= [...solution[i]]
            for(let j=0;j<bsize;j++){
                for(let k=0;k<bsize;k++){
                    if (temp[j][k]=='_'){temp[j][k]=eIndex+1}
                    indexArr.push(temp[j][k] - 1)
                }
            }
            for(let m=0;m<board.length;m++){
                board[m].index = indexArr[m] 
            }
            
            Bdraw()
            await delay(500)
        }
    }
}

function solve(curr,goal){
    const puz = new Puzzle(bsize,curr,goal);
    return puz.process();
}

