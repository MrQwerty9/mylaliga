var dbPromised = idb.open("football-sh9", 1, function(upgradeDb) {
	var teamsObjectStore = upgradeDb.createObjectStore("teams", {
		keyPath: "id"
	});
	teamsObjectStore.createIndex("team", "team", { unique: false });
});

function saveForLater(article) {
	console.log('savee');
	dbPromised
	.then(function(db) {
		var tx = db.transaction("teams", "readwrite");
		var store = tx.objectStore("teams");
		console.log(article);
		store.add(article);
		return tx.complete;
	})
	.then(function() {
		console.log("Team berhasil di simpan.");
	});
}

function getAll() {
	return new Promise(function(resolve, reject) {
		dbPromised
		.then(function(db) {
			var tx = db.transaction("teams", "readonly");
			var store = tx.objectStore("teams");
			console.log('saveeed'+store.getAll());
			return store.getAll();
		})
		.then(function(teams) {
			resolve(teams);
		});
	});
}

function getById(id) {
	return new Promise(function(resolve, reject) {
		dbPromised
		.then(function(db) {
			var tx = db.transaction("teams", "readonly");
			var store = tx.objectStore("teams");
			console.log(id+store.getAll());
			return store.get(parseInt(id));
		})
		.then(function(team) {
			resolve(team);
		});
	});
}

function deleteById(id) {
	return new Promise(function(resolve, reject) {
		dbPromised
		.then(function(db) {
			var tx = db.transaction('teams', 'readwrite');
			var store = tx.objectStore('teams');
			store.delete(parseInt(id));
			return tx.complete;
		}).then(function() {
			console.log('Item deleted');
		});
	});
}