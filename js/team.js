document.addEventListener("DOMContentLoaded", function() {
  var urlParams = new URLSearchParams(window.location.search);
  var isFromSaved = urlParams.get("saved");
  var idParam = urlParams.get("id");
  var btnSave = document.getElementById("save");
  var btnDelete = document.getElementById("delete");
  if (isFromSaved) {
    // Hide fab jika dimuat dari indexed db
    btnSave.style.display = 'none';

    // ambil artikel lalu tampilkan
    getSavedTeamById();
  } else {
    btnDelete.style.display = 'none';
    var item = getTeam(teamUrl+idParam);
  }
  btnSave.onclick = function() {
    
    item.then(function(team) {
      console.log("Tombol FAB di klik."+item);
      saveForLater(team);
    });
  };

  btnDelete.onclick = function() {
    console.log("Tombol FAB di klik.");
    
    deleteById(idParam);
    
  };
});