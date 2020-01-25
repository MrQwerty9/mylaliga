let base_url ="https://api.football-data.org/v2/";
const token = '5bc97521e19d46ea8cfddc40cfbdfde7';

let competitionUrl = `${base_url}competitions/2014/`;
let teamUrl = `${base_url}teams/`;
// let logoUrl ='https://upload.wikimedia.org/wikipedia/de/a/aa/Fc_barcelona.svg';
let dataTeams = '';
let logoAwayTeam = '';


// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

const fetchApi = function(url) {    
  return fetch(url, {
    headers: {
      'X-Auth-Token': token
    }
  });
};

// Blok kode untuk melakukan request data json
function getStandings(standing) {
  if ("caches" in window) {
    caches.match(standing).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          showStanding(data);
        });
      }
    });
  }

  fetchApi(standing)
  .then(status)
  .then(json)
  .then(function(data) {
    showStanding(data);
  })
  .catch(error);
}

function getTeams(teams){
  console.log('getTeams');
  if ("caches" in window) {
    caches.match(teams).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          dataTeams = data;
        });
      }
    });
  }

  fetchApi(teams)
  .then(status)
  .then(json)
  .then(function(response) {
    // response.json().then(function(data) {

      dataTeams = response;
    // });

    console.log('aaxhm'+dataTeams.count);
  })
  .catch(error);
  
}

function getMatches(matches) {
  getTeams(competitionUrl+'teams');
  return new Promise(function(resolve, reject) {    
    if ("caches" in window) {
      caches.match(matches).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            showMatches(data);
            

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchApi(matches)
    .then(status)
    .then(json)
    .then(function(data) {
      showMatches(data);
    })
    .catch(error);
  });

}

function getTeam(team) {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    if ("caches" in window) {
      caches.match(team).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            showTeam(data);
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetchApi(team)
    .then(status)
    .then(json)
    .then(function(data) {
      showTeam(data);
    })
    .catch(error);
  });
}

function getTeamLogo(id) {
  var logoUrl = '';
  dataTeams.teams.forEach(function(team) {
    if (team.id == id) {
      logoUrl = team.crestUrl;
    }
  });
  return logoUrl;
}

function getTeamName(id) {
  var teamName = '';
  dataTeams.teams.forEach(function(team) {
    if (team.id == id) {
      teamName = team.shortName;
    }
  });
  return teamName;
}

function getSavedTeams() {
  getAll().then(function(teams) {
    console.log(teams);
    // Menyusun komponen card artikel secara dinamis
    var teamsHTML = "";
    teams.forEach(function(team) {
      teamsHTML += `
      <div class="card">
      <a href="./team.html?id=${team.id}&saved=true">
      <div class="card-image waves-effect waves-block waves-light">
      <img src="${team.crestUrl}" width="150" class="responsive-img center"/>
      </div>
      </a>
      <div class="card-content">
      <span class="card-title truncate">${team.name}</span>
      </div>
      </div>
      `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("teams").innerHTML = teamsHTML;
  });
}

function getSavedTeamById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(idParam).then(function(data) {
    console.log(data);
    teamHTML = '';
    var teamHTML = '';

    teamHTML += `
    <img src=${data.crestUrl.replace(/^http:\/\//i, 'https://')} align="center" width="100" class="responsive-img center"><br>
    <h5>${data.name}</h5>
    <br>
    <br> `;

    teamHTML += `<table class="responsive-table highlight" witeamsh=500>
    <thead class="indigo lighten-4">
    <tr>
    <td>Name</td>
    <td>Position</td>
    <td>Nationality</td>
    </tr>
    </thead>
    <tbody>`;

    data.squad.forEach(function(teams) {
      teamHTML += `
      <tr>
      <td>${teams.name}</td>
      <td>${teams.position}</td>
      <td>${teams.nationality}</td>
      </tr>
      `;
    });

    teamHTML += `</tbody></table>`;

    document.getElementById("teamUrl").innerHTML = teamHTML;
  });
}

function showStanding(data) {
  var teamsHTML = "";
  data.standings[0].table.forEach(function(teams) {
    teamsHTML += `
    <td>${teams.position}</td>
    <td><img src=${teams.team.crestUrl.replace(/^http:\/\//i, 'https://')} align="center" width="50" height="50" class="responsive-img center">
    <a href="team.html?id=${teams.team.id}">${teams.team.name}</a></td>
    <td>${teams.playedGames}</td>
    <td>${teams.won}</td>
    <td>${teams.draw}</td>
    <td>${teams.lost}</td>
    <td><b>${teams.points}</b></td></tr>
    `;
  });
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("standings").innerHTML = teamsHTML;
}

function showMatches(data) {
  var matchHTML = "";
  var dayHtml = "";
  var day = 0;
  var trHtml = "";
  var i = 1;
  data.matches.forEach(function(match) {
    var time = new Date(match.utcDate).toString();
    
    if (day < match.matchday) {
      i = 1;
      day = match.matchday;
      dayHtml = `
      </tbody>
      <thead>
      <tr>
      <th>Match Day ${day}</th>
      </tr>
      </thead>
      <tbody>`;
    } else {
      dayHtml = ``;
    }

    if (i%2 == 0) {
      trHtml = `
      </tr><tr>`
    }else {
      trHtml = `<td class="divide"></td>`;
    }

    matchHTML += `

    ${dayHtml}
    
    
    <td class="match-left"><img src=${getTeamLogo(match.homeTeam.id)} class="img-match">
    <a href="team.html?id=${match.homeTeam.id}">${getTeamName(match.homeTeam.id)}</a></td>
    <td class="match-score">${match.score.fullTime.homeTeam}</td>
    <td width="90">
    ${time.slice(8, 10)} 
    ${time.slice(4, 7)} 
    ${time.slice(13, 15)}
    ${time.slice(16, 21)}
    </td>
    <td class="match-score">${match.score.fullTime.awayTeam}</td>
    <td class="match-right"><a href="team.html?id=${match.awayTeam.id}">${getTeamName(match.awayTeam.id)}</a>
    <img src=${getTeamLogo(match.awayTeam.id)} align="center" class="img-match"></td>${trHtml}
    `;
    i++;
  });
  // Sisipkan komponen card ke dalam elemen dengan id #content
  document.getElementById("matches").innerHTML = matchHTML;
}

function showTeam(data) {
  var teamHTML = '';

  teamHTML += `
  <img src=${data.crestUrl.replace(/^http:\/\//i, 'https://')} align="center" width="100" class="responsive-img center"><br>
  <h5>${data.name}</h5>
  <br>
  <br> `;

  teamHTML += `<table class="responsive-table highlight" witeamsh=500>
  <thead class="indigo lighten-4">
  <tr>
  <td>Name</td>
  <td>Position</td>
  <td>Nationality</td>
  </tr>
  </thead>
  <tbody>`;

  data.squad.forEach(function(teams) {
    teamHTML += `
    <tr>
    <td>${teams.name}</td>
    <td>${teams.position}</td>
    <td>${teams.nationality}</td>
    </tr>
    `;
  });

  teamHTML += `</tbody></table>`;

  document.getElementById("teamDetail").innerHTML = teamHTML;
}
