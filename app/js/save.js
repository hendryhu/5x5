function saveGrid() {
  let gridName = document.getElementById("gridName").value;
  let gridJSON = JSON.stringify(grid);

  let body = {
    gridname: gridName,
    gridjson: gridJSON,
  };

  let request = new XMLHttpRequest();
  request.open("POST", "/save", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(body));
  request.onload = function () {
    if (request.status == 200) {
      fetchGrids();
      clearGrid();
    } else {
      alert("Error saving grid!");
    }
  };
}