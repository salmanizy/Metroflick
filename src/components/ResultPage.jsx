import 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('result'); // Get the search keyword from the URL
  const { movies = [], actors = [], serieses = [] } = location.state || {};

  return (
    <div className="results-page">
      <h2>Search Results for: {keyword}</h2>

      <section>
        <h3>Movies</h3>
        {movies.length > 0 ? (
          movies.map(movie => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="result-item">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                alt={movie.title}
              />
              <div>
                <p>{movie.title}</p>
                <p>{movie.release_date}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </section>

      <section>
        <h3>TV Series</h3>
        {serieses.length > 0 ? (
          serieses.map(series => (
            <Link key={series.id} to={`/tv/${series.id}`} className="result-item">
              <img
                src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                alt={series.name}
              />
              <div>
                <p>{series.name}</p>
                <p>{series.first_air_date}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No TV series found</p>
        )}
      </section>

      <section>
        <h3>Actors</h3>
        {actors.length > 0 ? (
          actors.map(actor => (
            <Link key={actor.id} to={`/cast/${actor.id}`} className="result-item">
              <img
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                alt={actor.name}
              />
              <div>
                <p>{actor.name}</p>
                <p>{actor.known_for && actor.known_for.length > 0 ? actor.known_for[0].title : 'Known for: Not available'}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No actors found</p>
        )}
      </section>
    </div>
  );
};

export default ResultsPage;