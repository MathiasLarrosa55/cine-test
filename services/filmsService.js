
class filmsDAO {

    getFilms(){
        return axios.get('http://localhost:3000/films');
    }

    addFilm(film){
        return axios.post('http://localhost:3000/films', film);
    }

    updateFilm(film){
        return axios.put('http://localhost:3000/films/' + film.id, film);
    }

    deleteFilm(film){
        return axios.delete('http://localhost:3000/films/' + film.id);
    }
}

