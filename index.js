import { API_KEY } from "./config.js";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
  },
};

const moviesContent = document.querySelector(".movies");
const form = document.querySelector(".search-content");
const modalContent = document.querySelector(".modal-content");
const modal = document.getElementById("myModal");
const input = document.getElementById("movie-search");

document.body.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("movie")) {
    modal.style.display = "block";
    getDetails(e.target.parentElement.dataset.id);
  }
  if (e.target.classList.contains("close")) {
    modal.style.display = "none";
  }
});

window.addEventListener("click", (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value) {
    input.classList.add("red");
    input.setAttribute("placeholder", "Please input here!");
  } else {
    input.classList.remove("red");
    input.setAttribute("placeholder", "Search movie here...");
    searchMovie(input.value);
  }
});

const searchMovie = async (movieSearched) => {
  try {
    moviesContent.innerHTML = `<h2 style="text-align: center;">Loading...</h2>`;

    const response = await fetch(
      `https://imdb8.p.rapidapi.com/title/v2/find?title=${movieSearched}&limit=12&sortArg=moviemeter%2Casc`,
      options
    );
    const json = await response.json();
    if (json.totalMatches === 0) {
      return (moviesContent.innerHTML = `<h2 style="text-align: center;">Movie Not Found</h2>`);
    }
    return updateMoviesUI(json);
  } catch (error) {
    return (moviesContent.innerHTML = `<h2 style="text-align: center;">Error Try Again</h2>`);
  }
};

const updateMoviesUI = (movies) => {
  let content = "",
    result = "",
    id;
  for (let i = 0; i < movies.results.length; i++) {
    id = movies.results[i].id.substring(7, 16);

    content = `<div class="movie" data-id=${id}>
      <p>${movies.results[i].title}</p>`;

    if (movies.results[i].year) {
      content += `<p>${movies.results[i].year}</p>`;
    } else {
      content += `<p>N/A</p>`;
    }

    if (movies.results[i].image) {
      content += `<img src="${movies.results[i].image.url}" alt="image" width="200px" height="300px"/>
      </div>`;
    } else {
      content += `<img src="./no-image.jpg" alt="image" width="200px" height="300px"/>
      </div>`;
    }

    result += content;
  }

  return (moviesContent.innerHTML = result);
};

const getDetails = async (id) => {
  try {
    modalContent.innerHTML = "<p>Loading...</p>";
    const response = await fetch(
      `https://imdb8.p.rapidapi.com/title/get-overview-details?tconst=${id}&currentCountry=US`,
      options
    );
    const json = await response.json();
    const content = `<span class="close">&times;</span>
    <h3>${json.title.title}</h3>
    <p>${json.title.year}</p>
    <p>${json.genres.map((genre) => {
      return `<span> ${genre}</span>`;
    })}</p>
    <div class="modal-details">
    <img src="${
      json.title.image.url
    }" alt="image" width="200px" height="300px"/>
    
    <p class="desc">${json.plotSummary.text}</p>
    </div>`;
    modalContent.innerHTML = content;
  } catch (error) {
    modalContent.innerHTML = `<h3>No Data</h3>`;
  }
};
