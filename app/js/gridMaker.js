const size = 5;

let grid = [];
let colourPicker = [];

let currentlySelectedCell = null;
let currentlySelectedColour = null;

const gridContainer = document.getElementById("myGrid");
const colourPickerContainer = document.getElementById("palette");

function createGrid() {
  let firstTime = true;
  if (localStorage.getItem("grid") !== null) {
    grid = JSON.parse(localStorage.getItem("grid"));
    firstTime = false;
  }
  for (let i = 0; i < size; i++) {
    if (firstTime) grid[i] = [];
    for (let j = 0; j < size; j++) {
      let cell = document.createElement("div");
      cell.id = i + "_" + j;
      cell.className = "gridSquare";
      cell.addEventListener("click", cellClicked);
      gridContainer.appendChild(cell);
      if (firstTime) grid[i][j] = [255, 255, 255]; // default colour is white 
    }
  }
  updateGrid();
}

function createColourPicker() {
  let firstTime = true;
  if (localStorage.getItem("colourPicker")) {
    colourPicker = JSON.parse(localStorage.getItem("colourPicker"));
    firstTime = false;
  }
  for (let i = 0; i < size; i++) {
    let colour = document.createElement("div");
    colour.id = i;
    colour.className = "colourBox";
    colour.addEventListener("click", colourClicked);
    colourPickerContainer.appendChild(colour);
    if (firstTime) colourPicker[i] = [255, 255, 255]; // default colour is white
  }
  updatePalette();
}

function cellClicked(e) {
  // get rid of selected class from all cells
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let cell = gridContainer.children[i * size + j];
      cell.classList.remove("selected");
    }
  }

  let cell = e.target;
  let cellRow = cell.id.split("_")[0];
  let cellCol = cell.id.split("_")[1];
  currentlySelectedCell = { row: cellRow, col: cellCol };
  e.target.classList.add("selected");
}

function colourClicked(e) {
  if (currentlySelectedCell == null) {
    return;
  }

  // get rid of selected class from all colours
  for (let i = 0; i < size; i++) {
    let colour = colourPickerContainer.children[i];
    colour.classList.remove("selected");
  }

  let colour = e.target;
  let colourId = colour.id;
  currentlySelectedColour = colourPicker[colourId];
  e.target.classList.add("selected");

  grid[currentlySelectedCell.row][currentlySelectedCell.col] =
    currentlySelectedColour;
  localStorage.setItem("grid", JSON.stringify(grid));
  updateGrid();
}

function getRandomPalette() {
  let request = new XMLHttpRequest();
  request.open("GET", "/colour", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.onload = function () {
    if (request.status == 200) {
      let palette = JSON.parse(request.response);
      colourPicker = palette.result;
      updatePalette();
    } else {
      alert("Error getting colour palette!");
    }
  };
}

function updatePalette() {
  for (let i = 0; i < size; i++) {
    let colour = colourPickerContainer.children[i];
    colour.style.backgroundColor =
      "rgb(" +
      colourPicker[i][0] +
      "," +
      colourPicker[i][1] +
      "," +
      colourPicker[i][2] +
      ")";
  }
  localStorage.setItem("colourPicker", JSON.stringify(colourPicker));
}

function updateGrid() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let cell = gridContainer.children[i * size + j];
      cell.style.backgroundColor =
        "rgb(" +
        grid[i][j][0] +
        "," +
        grid[i][j][1] +
        "," +
        grid[i][j][2] +
        ")";
    }
  }
}

function clearGrid() {
  grid = [];
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = [255, 255, 255];
    }
  }
  localStorage.removeItem("grid");
  updateGrid();
}
