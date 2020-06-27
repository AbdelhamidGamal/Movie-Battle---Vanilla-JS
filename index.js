const state = {
  firstMovie: null,
  secMovie: null
};

async function searchAPI(term) {
  try {
    const res = await axios.get(`https://www.omdbapi.com/`, {
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
    const res = await axios.get(`https://www.omdbapi.com/`, {
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

const runComparison = () => {
  const firstBoxOfficeDiv = document.querySelector("[data-first-BoxOffice]");
  const secBoxOfficeDiv = document.querySelector("[data-sec-BoxOffice]");
  const firstMetaDiv = document.querySelector(
    ".firstMovie [data-first-metascore]"
  );
  const secMetaDiv = document.querySelector(".secMovie [data-sec-metascore]");

  const firstImdbRatingDiv = document.querySelector(
    ".firstMovie [data-first-imdbRating]"
  );
  const secImdbRatingDiv = document.querySelector(
    ".secMovie [data-sec-imdbRating]"
  );

  const firstImdbVotingDiv = document.querySelector(
    ".firstMovie [data-first-imdbVotes]"
  );
  const secImdbVotingDiv = document.querySelector(
    ".secMovie [data-sec-imdbVotes]"
  );

  if (state.firstMovie.BoxOffice > state.secMovie.BoxOffice) {
    firstBoxOfficeDiv.classList.add("winner");
  } else {
    secBoxOfficeDiv.classList.add("winner");
  }

  if (state.firstMovie.Metascore > state.secMovie.Metascore) {
    firstMetaDiv.classList.add("winner");
  } else {
    secMetaDiv.classList.add("winner");
  }

  if (state.firstMovie.imdbRating > state.secMovie.imdbRating) {
    firstImdbRatingDiv.classList.add("winner");
  } else {
    secImdbRatingDiv.classList.add("winner");
  }

  if (
    parseInt(state.firstMovie.imdbVotes.split(",").join("")) >
    parseInt(state.secMovie.imdbVotes.split(",").join(""))
  ) {
    firstImdbVotingDiv.classList.add("winner");
  } else {
    secImdbVotingDiv.classList.add("winner");
  }
};

const renderVideo = async (video, parentDiv, side) => {
  const movieData = await getMovieData(video.imdbID);

  if (side === "first") {
    state.firstMovie = movieData;
  } else {
    state.secMovie = movieData;
  }

  const {
    Poster,
    Title,
    Genre,
    Metascore,
    Plot,
    BoxOffice,
    Awards,
    imdbRating,
    imdbVotes
  } = movieData;

  parentDiv.classList.add("movie-details");
  parentDiv.classList.add(`${side}Movie`);
  parentDiv.innerHTML = `
    <div class='movie-details-top'>
      <img src="${Poster ? Poster : ""}">
      <div class='movie-details-top-info'>
          <h1>${Title}</h1>
          <h3>${Genre}</h3>
          <p class='gray'>${Plot}</p>
      </div>
    </div>
    <div class='movie-details-info'>
      <p>Awards:</p>
      <p>${Awards}</p>
    </div>
    <div data-${side}-boxOffice="${BoxOffice}" class='movie-details-info'>
      <p>Box Office:</p>
      <p>${BoxOffice}</p>
    </div>
    <div data-${side}-metascore="${Metascore}" class='movie-details-info'>
      <p>Meta Score:</p>
      <p>${Metascore}</p>
    </div>
    <div data-${side}-imdbRating="${imdbRating}" class='movie-details-info'>
      <p>Imdb Rating:</p>
      <p>${imdbRating}</p>
    </div>
    <div data-${side}-imdbVotes="${imdbVotes}" class='movie-details-info'>
      <p>imdbVotes:</p>
      <p>${imdbVotes}</p>
    </div>
  `;

  if (state.firstMovie && state.secMovie) {
    runComparison();
  }
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
