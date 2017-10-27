var films = [];
var filmsDataAccessOject = new filmsService();

// carga inicial de datos 
filmsDataAccessOject.getFilms().then(function (res) {
    films = res.data;
    renderTable(films);
});

function addFilm(e, form) {
    e.preventDefault();

    // obtengo todos los datos del formulario
    var filmName = form.filmName.value;
    var filmYear = Number(form.filmYear.value);
    var filmGenre = form.filmGenre.value;
    var filmVoters = Number(form.filmVoters.value);
    var filmTotalVotes = Number(form.filmTotalVotes.value);

    // me fijo si la pelicula ya esta cargada
    var existingFilm = getFilm(filmName);

    // si esta cargada?
    if (existingFilm != undefined) {
        existingFilm.name = filmName;
        existingFilm.year = filmYear;
        existingFilm.genre = filmGenre;

        filmsSvc
        // si no esta cargada
    } else {
        var film = {
            name: filmName,
            year: filmYear,
            genre: filmGenre,
            voters: filmVoters,
            totalVotes: filmTotalVotes,
            raiting: getRaiting(filmVoters, filmTotalVotes)
        };

        // hago un reques para agegar la pelicula a la base de datos 
        filmsDataAccessOject.addFilm(film).then(function (res) {
            // agrego la pelicula al array
            films.push(res.data);
            // la agrego a la tabla
            addFilmToTable(res.data);
        })
        .catch(function (errResp){
            console.warm(errResp);
            alert("No se pudo agregarla pelicula.")
        })

        // limpio el formulario
        cleanAddFilmForm(form);

        
    }
}

function getRaiting(voters, totalVotes) {
    return (totalVotes / voters).toFixed(2);
}

function getFilm(filmName) {
    // return films.find(x => x.name == filmName);
    return films.find(function (film) {
        return film.name.toLowerCase() == filmName.toLowerCase();
    });
}

function cleanAddFilmForm(form) {
    form.filmName.value = "";
    form.filmYear.value = "";
    form.filmGenre.selectedIndex = 0;
    form.filmVoters.value = "";
    form.filmTotalVotes.value = "";
}

function addFilmToTable(film) {
    var tableBody = document.getElementById('filmsTableBody');
    var newFilmRow = tableBody.insertRow();
    newFilmRow.classList.add('text-center');

    var nameCell = newFilmRow.insertCell(0);
    nameCell.innerHTML = film.name;

    var yearCell = newFilmRow.insertCell(1);
    yearCell.innerHTML = film.year;

    var genreCell = newFilmRow.insertCell(2);
    genreCell.innerHTML = film.genre;

    var averageCell = newFilmRow.insertCell(3);
    averageCell.innerHTML = film.raiting;

    var deleteAction = document.createElement('span');
    deleteAction.className = "glyphicon glyphicon-remove clickable";

    deleteAction.addEventListener("click", function () {
        deleteFilm(film);
    
    });

    var editAction = document.createElement('span');
    deleteAction.className = "glyphicon glyphicon-remove clickable editIcon";

    editAction.addEventListener("click", function () {
        var form = document.getElementById("addOrEditFilmsForm");
        var legend = document.getElementById("addOrEditFilmsFormLegend");
        var filmNameInput = document.getElementById("");



    
    });

    var actionsCell = newFilmRow.insertCell(4);
    actionsCell.appendChild(deleteAction);
    actionsCell.appendChild(editAction);
}

function getRowByFilmName(filmName) {
    var tableBody = document.getElementById('filmsTableBody');

    for (var i = 0; i < tableBody.rows.length; i++) {
        var actualRow = tableBody.rows[i];
        if (actualRow.cells[0].innerText == filmName)
            return actualRow;
    }
}

function filterFilms(e, filterForm) {
    e.preventDefault();

    var filteredFilms = [];
    var filterName = filterForm.nameFilter.value;
    var filterYear = filterForm.yearFilter.value;
    var filterGenre = filterForm.genreFilter.value;
    var filterRaiting = filterForm.raitingFilter.value;

    films.forEach(function (film) {
        if (filterName != "" && film.name.indexOf(filterName) == -1)
            return;

        if (filterYear != "" && film.year < Number(filterYear))
            return;

        if (filterGenre != "nofilter" && film.genre != filterGenre)
            return;

        if (filterRaiting != "" && film.raiting < Number(filterRaiting))
            return;

        filteredFilms.push(film);
    });

    renderTable(filteredFilms);
}

function renderTable(films) {

    // limpio el body de la tabla
    var tableBody = document.getElementById('filmsTableBody');
    tableBody.innerHTML = "";

    // agrego el array de films a la tabla
    films.forEach(function (film) {
        addFilmToTable(film);
    });
}

function cleanFiltersAndReRender() {
    var filterForm = document.getElementById('filterFilmsForm');

    filterForm.nameFilter.value = "";
    filterForm.yearFilter.value = "";
    filterForm.genreFilter.selectedIndex = 0;
    filterForm.raitingFilter.value = "";

    renderTable(films);
}

function deleteFilm(film) {
    
    // hago el request para elminar la pelocial de mi backend
    
    filmsDataAccessOject.deleteFilm(film)
        // si el resuqes se ejecuta de forma correcta:
        .then(function (res) {

            var addedFilm = res.data;
            
            films.push(addedFilm);

            // limpio el formulario
            cleanAddFilmForm(form);
            
            // la agrego a la tabla
            addFilmToTable(film);
            //vuelvo a dibujar la tabla en la vista
            renderTable(films);
        }) 
        // si el resuqes se ejecuta con errores
        .catch(function (errResp) {
            console.warn(errResp);

            // esta funcion se ejecuta cuando el resuqes retorna un error
            alert("Error al eliminar pelicula.");
        });
    
}

function orderByName() {
    var iconElement = document.getElementById('orderByNameIcon');
    if (iconElement.classList.contains('glyphicon-sort-by-alphabet-alt')) {
        films.sort(function (a, b) {
            var nameA = a.name.toLowerCase();
            var nameB = b.name.toLowerCase();

            if (nameA < nameB) return -1;

            if (nameA > nameB) return 1;
            return 0;
        });
        // cambiar el icono por el odrenamiento descendiente//
        iconElement.classList.remove('glyphicon-sort-by-alphabet-alt');
        iconElement.classList.add('glyphicon-sort-by-alphabet');
    }else if (iconelement.classList.contains('glyphicon-sort-by-alphabet')) {
        // ordena alfabeticamente de forma decendiente //
        films.sort(function (a, b) {
            var nameA = a.name.toLowerCase();
            var nameB = b.name.toLowerCase();

            if (nameA > nameB) return -1;

            if (nameA < nameB) return 1;
            return 0;
        });
        // TODO: tengo que ordenar alfabeticamente de forma decendente  //

        // cambio el icono por el odrenamiento acendente//
        iconElement.classList.remove('glyphicon-sort-by-alphabet');
        iconElement.classList.add('glyphicon-sort-by-alphabet-alt');;
    }
    
    renderTable(films);
}

function orderByYear() {
    var iconElement = document.getElementById('oderByYearIcon');
    if (iconElement.classList.contains('glyphicon-sort-by-order-alt')) {
        films.sort(function (a, b) {
            var yearA = a.year.toLowerCase();
            var yearB = b.year.toLowerCase();

            if (yearA < yearB) return -1;

            if (yearA > yearB) return 1;
            return 0;
        });
        iconElement.classList.remove('glyphicon-sort-by-order-alt');
        iconElement.classList.add('glyphicon-sort-by-order');
    }else if (iconelement.classList.contains('glyphicon-sort-by-order')) {
        films.sort(function (a, b) {
            var yearA = a.year.toLowerCase();
            var yearB = b.year.toLowerCase();

            if (yearA > yearB) return -1;

            if (yearA < yearB) return 1;
            return 0;
        });
        iconElement.classList.remove('glyphicon-sort-by-order');
        iconElement.classList.add('glyphicon-sort-by-order-alt');
    }
}