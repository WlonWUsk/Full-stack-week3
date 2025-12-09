const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = []; // Store full list

// Render movies
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');
        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button onclick="editMoviePrompt(${movie.id}, '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
            <button onclick="deleteMovie(${movie.id})">Delete</button>
        `;
        movieListDiv.appendChild(movieElement);
    });
}


function fetchMovies() {
    fetch(API_URL)
        .then(res => res.json())
        .then(movies => {
            allMovies = movies;
            renderMovies(allMovies);
        })
        .catch(err => console.error('Error fetching movies:', err));
}

fetchMovies(); // Initial load


searchInput.addEventListener('input', function () {
    const term = searchInput.value.toLowerCase();

    const filtered = allMovies.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(term);
        const genreMatch = movie.genre.toLowerCase().includes(term);
        return titleMatch || genreMatch;
    });

    renderMovies(filtered);
});


form.addEventListener('submit', function (e) {
    e.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newMovie)
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to add movie');
        return res.json();
    })
    .then(() => {
        form.reset();
        fetchMovies();
    })
    .catch(err => console.error('Error adding movie:', err));
});


function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt("Enter new Title:", currentTitle);
    const newYear = prompt("Enter new Year:", currentYear);
    const newGenre = prompt("Enter new Genre:", currentGenre);

    if (newTitle && newYear && newGenre) {
        const updatedMovie = {
            id: id,
            title: newTitle,
            year: parseInt(newYear),
            genre: newGenre
        };
        updateMovie(id, updatedMovie);
    }
}

function updateMovie(id, data) {
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to update movie');
        return res.json();
    })
    .then(() => fetchMovies())
    .catch(err => console.error('Error updating movie:', err));
}

function deleteMovie(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error('Failed to delete movie');
            fetchMovies();
        })
        .catch(err => console.error('Error deleting movie:', err));
}
