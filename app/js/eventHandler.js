document.getElementById("logoutButton").addEventListener("click", logout);
document.getElementById("randomizeButton").addEventListener("click", getRandomPalette);
document.getElementById("saveButton").addEventListener("click", saveGrid);
document.getElementById("clearButton").addEventListener("click", clearGrid);

// window onload
window.onload = function () {
  createGrid();
  createColourPicker();
  fetchGrids();
};