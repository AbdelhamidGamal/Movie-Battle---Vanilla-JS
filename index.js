const state = {
  firstMovie: null,
  secMovie: null
};

async function searchAPI(term) {
  try {
    const res = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: "6254a287",
        s: term
      }
    });

    if (res.data.Error) return [];

    return res.data.Search;
  } catch (e) {
    console.log(e);
  }
}

async function getMovieData(movieId) {
  try {
    const res = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: "6254a287",
        i: movieId
      }
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

const autoDropDownConfig = {
  async onInput(term) {
    const movies = await searchAPI(term);
    return movies;
  },
  renderItem(video) {
    const img = video.Poster === "N/A" ? "" : video.Poster;
    return `
    <img src="${img}" />
    <b>${video.Title}</b>
    `;
  },
  inputValue(video) {
    return video.Title;
  }
};

const renderVideo = async (video, parentDiv, sort) => {
  const movieData = await getMovieData(video.imdbID);

  if (sort === "first") {
    state.firstMovie = movieData;
  } else {
    state.secMovie = movieData;
  }

  const {
    Poster,
    Title,
    Type,
    Genre,
    Language,
    Released,
    Metascore,
    Plot,
    Director,
    Writer,
    Actors,
    Country,
    BoxOffice,
    Awards,
    imdbRating,
    imdbVotes
  } = movieData;

  parentDiv.classList.add("movie-details");
  parentDiv.innerHTML = `
    <div class='movie-details-top'>
      <img src="${Poster ? Poster : ""}">
      <div class='movie-details-top-info'>
          <h1>${Title}</h1>
          <h3>${Genre}</h3>
          <p>Plot : ${Plot}</p>
      </div>
    </div>
    <div class='movie-details-info'>
      <p>Awards:</p>
      <p>${Awards}</p>
    </div>
    <div class='movie-details-info'>
      <p>Box Office:</p>
      <p>${BoxOffice}</p>
    </div>
    <div class='movie-details-info'>
      <p>Meta Score:</p>
      <p>${Metascore}</p>
    </div>
    <div class='movie-details-info'>
      <p>Imdb Rating:</p>
      <p>${imdbRating}</p>
    </div>
    <div class='movie-details-info'>
      <p>imdbVotes:</p>
      <p>${imdbVotes}</p>
    </div>
  `;
};

createAutoDropDown({
  ...autoDropDownConfig,
  parentDiv: document.querySelector("#firstMovieSearch"),
  onSelect(video) {
    renderVideo(video, document.querySelector("#firstMovieInfo"), "first");
  }
});

createAutoDropDown({
  ...autoDropDownConfig,
  parentDiv: document.querySelector("#SecoundMovieSearch"),
  onSelect(video) {
    renderVideo(video, document.querySelector("#secoundMovieInfo"), "sec");
  }
});
