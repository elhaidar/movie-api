import { API_KEY } from "./config.js";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
  },
};

const movies = document.querySelector(".movies");
const form = document.querySelector(".search-content");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchDatas(document.getElementById("movie-search").value);
});

const fetchDatas = async (movieSearched) => {
  try {
    const response = await fetch(
      `https://imdb8.p.rapidapi.com/title/v2/find?title=${movieSearched}&limit=12&sortArg=moviemeter%2Casc`,
      options
    );
    const json = await response.json();
    let content = "",
      result = "",
      id;
    console.log(json);
    console.log(json.results.length);
    for (let i = 0; i < json.results.length; i++) {
      id = json.results[i].id.substring(7, 16);

      content = `<div class="movie" id=${id}>
        <p>${json.results[i].title}</p>`;

      if (json.results[i].year) {
        content += `<p>${json.results[i].year}</p>`;
      } else {
        content += `<p>N/A</p>`;
      }

      if (json.results[i].image) {
        content += `<img src="${json.results[i].image.url}" alt="image" width="200px" height="300px"/>
        </div>`;
      } else {
        content += `<img src="./no-image.jpg" alt="image" width="200px" height="300px"/>
        </div>`;
      }

      result += content;
    }

    movies.innerHTML = result;
  } catch (error) {
    console.log(error);
  }
};
