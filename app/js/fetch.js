let fetchedGrids = {};

function fetchGrids() {
  let request = new XMLHttpRequest();
  request.open("GET", "/getGrids", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();

  request.onload = function () {
    if (request.status == 200) {
      fetchedGrids = JSON.parse(request.response);
      displayFetchedGrids();
    } else {
      alert("Error fetching grids!");
    }
  };
}

function displayFetchedGrids () {
  let gridList = document.getElementById("gridList");
  gridList.innerHTML = "";
  // show in a list of buttons
  for (let i = 0; i < fetchedGrids.length; i++) {
    let gridName = fetchedGrids[i].gridname;
    let author = fetchedGrids[i].userid;
    let gridButton = document.createElement("button");
    gridButton.innerHTML = gridName + " by " + author;
    gridButton.id = i;
    gridButton.addEventListener("click", gridNameClicked);
    gridList.appendChild(gridButton);
  }

}

function gridNameClicked(e) {
  let gridId = e.target.id;
  let gridJSON = fetchedGrids[gridId].gridjson;
  grid = JSON.parse(gridJSON);
  updateGrid();
}

fetchGrids();