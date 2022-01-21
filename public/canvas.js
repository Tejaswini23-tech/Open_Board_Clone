let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoRedoTracker = []; //Data
let track = 0; // Represent which action from tracker array

let mouseDown = false;

// API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // send data to server
    socket.emit("beginPath", data);
})
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawStroke", data);
    }
})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})
eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})


socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})
socket.on("drawStroke", (data) => {
    drawStroke(data);
})
socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})
/*let  canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// pecil color change , pencil width and eraser width chnge , 
//toggling of eraser white to color back

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let penColor = "red";
let eraserColor = "white";

let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

// downloading image
let download = document.querySelector(".download");

// undo and redo functionality
let undoRedoTracker = []; // data of srray the graphics which we are making
let track = 0;// Represent which action from tracker array

let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
// Api
let tool = canvas.getContext("2d"); // that we are using to api

tool.strokeStyle =  penColor;
tool.lineWidth = penWidth;

/***********  concept canvas how graphics we are making

tool.beginPath();
tool.moveTo(0 , 0); //start Point from diagonal

tool.lineTo(100 , 150); //end point 
tool.stroke();// fill color (fill graphic)

tool.strokeStyle = "blue";
tool.lineWidth = "8";
tool.lineTo(200 , 250); //end point 
tool.stroke();// fill color (fill graphic)

 mousedown --> start new path , mouse move -> path fill(graphics)r

let mouseDown = false;
// here sending data of graphics of mouse down and move to server so that
// it can show all these data to all computer connected with server
// socket emit()--> doing data to server work

canvas.addEventListener("mousedown" , (e) =>{
      mouseDown = true;
    beginPath({
        x : e.clientX ,
        y : e.clientY 
})
// socket emit()--> doing data to server work
// mycomputer to server data transfered

})
canvas.addEventListener("mousemove" , (e) =>{

    if(mouseDown) drawStroke ({
       x : e.clientX ,
       y : e.clientY ,
       color: eraserFlag ? eraserColor : penColor, //toogle
       width: eraserFlag ? eraserWidth : penWidth

    })
    // socket emit()--> doing data to server work
})


canvas.addEventListener("mouseup" , (e) =>{

    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
  /*  let url = canvas.toDataURL();// whatever on page will come into url
    undoRedoTracker.push(url); // filling data into array
    track = undoRedoTracker.length - 1;
    // the last written line or graphics
})
// on eraser
undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(data);
  //  socket.emit("redoUndo", data);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
  //  socket.emit("redoUndo", data);
  undoRedoCanvas(data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}
/*
undo.addEventListener("click" , (e) =>{
    if(track > 0) track--;// going tp prevois stage
    let trackObj = {
        trackValue : track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);

})

redo.addEventListener("click" , (e) =>{
    if( track < undoRedoTracker.length - 1) track++;// going forawrd to 

    let trackObj = {
        trackValue : track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
})

function undoRedoCanvas() {
    // intialisizing again track and undoredotracker array
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];// the data that pushed in mouse up function getting that that prevoius data
   let img = new Image();
   img.src = url; // setting prevous data on src 
   img.onload = (e) => { // loading that image
       tool.drawImage(img , 0 , 0 , canvas.width , canvas.height);
   }

 
}


function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
   tool.strokeStyle = strokeObj.color;
   tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

// loop on for each loop for changing the color of the pen pecil container pe loop

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click"  , (e) =>{ //traversing on each element

        let color = colorElem.classList[0]; // color get input 
        penColor = color;// setting global varaible  
        tool.strokeStyle = penColor;
    })
});

// on changing the length of input  size or width of pen 
pencilWidthElem.addEventListener("change" , (e) =>{
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;

})
// on changing the length of input  size or width of eraser 
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})
// toggle on eraser element on clicking we were toggling in tool.js file
// so here if it is true them we setted the by default color of eraser width

eraser.addEventListener("click", (e) => {
    if (eraserFlag) { // true -> erase 
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else { // false -> stop back to prevoius color of pen
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click" , (e) =>{
    let url = canvas.toDataURL(); // this canvas function is converting graphics 
    // intto data url 
    // download steps
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg"; // name set
    a.click();
})
 
/* computer 2 received data same work for undo redo
socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
})*/






























