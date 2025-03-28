import {act, useEffect, useState} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchMovies, searchActors, searchSeries, searchCrews } from '../api/tmdb';

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('');
  const [movies, setMovies] = useState([])
  const [actors, setActors] = useState([])
  const [serieses, setSerieses] = useState([])
  const [crews, setCrews] = useState([])

  useEffect(() => {
    if(keyword){
      Promise.all([searchMovies(keyword), searchActors(keyword), searchSeries(keyword), searchCrews(keyword)])
        .then(([movieResult, actorResult, seriesResult, crewResult]) => {
          setMovies(movieResult);
          setActors(actorResult);
          setSerieses(seriesResult);
          setCrews(crewResult)
        })
        .catch(error => console.error('Error fetching search results', error))
    }
  }, [keyword])

  return (
    <div className="results-page container">
      <p className='my-3 fs-5'>Search Results for: "<span className='fst-italic fw-bold'>{keyword}</span>"</p>
      <section className='bg-white p-2 mb-3 rounded'>
        <h5 className='d-block'>Movies</h5>
        <div className='row g-3'>
          {movies.length > 0 ? (
            movies.map(movie => (
              <div key={movie.id} className='col-12 col-md-2 d-flex justify-content-center align-self-center'>
                <Link to={`/movie/${movie.id}`} className="card bg-dark card-sm">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                    alt={movie.title}
                    className="card-img-top"
                  />
                  <div className="card-body bg-dark">
                    <p className="card-title text-light text-truncate text-nowrap">{movie.title}</p>
                    <p className='text-white-50 font-monospace text-truncate text-nowrap'>{movie.release_date || 'Release not found'}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No movies found</p>
          )}
        </div>
      </section>

      <section className='bg-white p-2 mb-3 rounded'>
        <h5>TV Series</h5>
        <div className='row g-3'>
          {serieses.length > 0 ? (
            serieses.map(series => (
              <div key={series.id} className='col-12 col-md-2 d-flex justify-content-center align-self-center'>
                <Link to={`/tv/${series.id}`} className="card bg-dark">
                <img
                  src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                  alt={series.name}
                />
                <div className="card-body bg-dark">
                  <p className="card-title text-light text-truncate text-nowrap">{series.name}</p>
                  <p className='text-white-50 font-monospace text-truncate text-nowrap'>{series.first_air_date || 'Release not found'}</p>
                </div>
              </Link>
              </div>
            ))
          ) : (
            <p>No TV series found</p>
          )}
        </div>
      </section>

      <section className='bg-white p-2 mb-3 rounded'>
        <h5>Actors</h5>
        <div className='row g-3'>
          {actors.length > 0 ? (
            actors
            .filter(actor => actor.known_for_department === 'Acting')
            .map(actor => (
              <div key={actor.id} className='col-12 col-md-2 d-flex justify-content-center align-self-center'>
                <Link to={`/cast/${actor.id}`} className="card bg-dark">
                  <img
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                    alt={actor.name}
                    />
                  <div className="card-body bg-dark">
                    <p className="card-title text-light text-truncate text-nowrap">{actor.name}</p>
                    <p className='text-white-50 font-monospace text-truncate text-nowrap'>{actor.known_for && actor.known_for.length > 0 ? actor.known_for[0].title : 'Known for: Not available'}</p>
                  </div>
                </Link>
              </div>
            )
          )
        ) : (
            <p>No actors found</p>
          )}
        </div>
      </section>
      
      <section className='bg-white p-2 mb-3 rounded'>
        <h5>Crew</h5>
        <div className='row g-3'>
          {crews.length > 0 ? (
            crews
            .filter(actor => actor.known_for_department !== 'Acting')
            .map(crew => (
              <div key={crew.id} className='col-12 col-md-2 d-flex justify-content-center align-self-center'>
                <Link to={`/crew/${crew.id}`} className="card bg-dark">
                  <img
                    src={crew.profile_path ? `https://image.tmdb.org/t/p/w500${crew.profile_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                    alt={crew.name}
                  />
                  <div className="card-body bg-dark">
                    <p className="card-title text-light text-truncate text-nowrap">{crew.name}</p>
                    <p className='text-white-50 font-monospace text-truncate text-nowrap'>{crew.known_for_department}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No crews found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResultsPage;