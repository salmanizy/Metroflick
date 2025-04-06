import { useEffect, useRef, useState } from 'react';      
import { useNavigate, Link } from 'react-router-dom';      
import { searchActors, searchMovies, searchSeries } from '../api/tmdb';  
import '../style/Navbar.css';      

const Navbar = () => {
  const [query, setQuery] = useState('');      
  const [results, setResults] = useState({ movies: [], actors: [], serieses: [] });
  const navigate = useNavigate();  
  const resultsRef = useRef(null); // Referensi untuk hasil autocomplete      
  const inputRef = useRef(null);
      
  // Function to handle input change and fetch results
  const handleInputChange = async (e) => {      
    const value = e.target.value;      
    setQuery(value);

    if (value) {    
      const [movieResults, actorResults, seriesResults] = await Promise.all([
        searchMovies(value),
        searchActors(value),
        searchSeries(value)
      ]);
      setResults({ movies: movieResults, actors: actorResults, serieses: seriesResults });
    } else {    
      setResults({ movies: [], actors: [], serieses: [] });    
    }    
  };

  // Function to handle Enter key press
  const handleSearch = async () => {
    if (query.trim()) {
      navigate(`/results?=${encodeURIComponent(query)}`);
    }
  };

  const handleSubmit = (e) => {
    setResults({ movies: [], actors: [], serieses: [] });
    e.preventDefault()
    handleSearch()  
  }

  const handleResultClick = (id, type) => {    
    if (type === 'actor') {
        navigate(`/cast/${id}`);
    } else if (type === 'series') {
        navigate(`/tv/${id}`);
    } else {
        navigate(`/movie/${id}`);
    }
  };
    
  const formatReleaseDate = (dateString) => {
    const options = { year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ID', options).replace(/,/g, '');
  };  
      
  // Menutup autocomplete saat mengklik di luar
  useEffect(() => {    
    const handleClickOutside = (e) => {    
      if (    
        resultsRef.current &&     
        !resultsRef.current.contains(e.target) &&     
        inputRef.current &&     
        !inputRef.current.contains(e.target)    
      ) {
        setResults({ movies: [], actors: [], serieses: [] });    
      }    
    };    
    
    document.addEventListener('mousedown', handleClickOutside);    
    return () => {    
      document.removeEventListener('mousedown', handleClickOutside);    
    };    
  }, []);     
      
  useEffect(() => {      
    const handleKeyDown = (e) => {      
      if (e.key === '/') {      
        e.preventDefault(); 
        inputRef.current.focus();
      }      
    };
      
    document.addEventListener('keydown', handleKeyDown);      
    return () => {      
      document.removeEventListener('keydown', handleKeyDown);      
    };      
  }, []);      
      
  return (      
    <nav className="navbar navbar-expand-lg">      
      <div className="container">      
        <Link className="navbar-brand fs-3 fw-bold" to="/"><h2>metroflick</h2></Link>      
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">      
          <span className="navbar-toggler-icon"></span>      
        </button>      
        <div className="collapse navbar-collapse" id="navbarSupportedContent">      
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">  
            <Link className="nav-link text-light-emphasis" to="/">Movie</Link>  
            <Link className="nav-link text-light-emphasis" to="/tv">Series</Link>  
            <Link className="nav-link text-light-emphasis" to="/actors">Actor</Link>  
          </ul>
          <form className="d-flex position-relative" onSubmit={handleSubmit}>      
            <input      
              type="text"      
              value={query}  
              onChange={handleInputChange}
              placeholder="Press [/] to search"      
              className="form-control d-flex ps-3"
              ref={inputRef}
            />
  
            {results && (results.movies.length > 0 || results.actors.length > 0 || results.serieses.length > 0) && (      
              <div className="autocomplete-results position-absolute rounded" ref={resultsRef}>  
                {results.movies.map(movie => (      
                  <Link      
                    key={movie.id}      
                    to={`/movie/${movie.id}`}  
                    className="autocomplete-item d-flex align-items-start p-2 text-decoration-none"  
                    onClick={() => handleResultClick(movie.id, 'movie')}  
                  >      
                    <img
                      loading="lazy"
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}      
                      alt={movie.title}      
                      className="me-2"      
                      style={{ width: '25%', height: 'auto' }}      
                    />      
                    <div className='d-flex flex-column align-self-center text-white'>      
                      <p className='ps-2 fw-semibold'>{movie.title}</p>      
                      <p className='ps-2'>{movie.release_date ? formatReleaseDate(movie.release_date) : 'Release date not available'}</p>      
                    </div>      
                  </Link>      
                ))}      
                  
                {results.actors.map(actor => ( 
                  <Link      
                    key={actor.id}      
                    to={`/cast/${actor.id}`}  
                    className="autocomplete-item d-flex align-items-start p-2 text-decoration-none"  
                    onClick={() => handleResultClick(actor.id, 'actor')}
                  >      
                    <img      
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}      
                      alt={actor.name}      
                      className="me-2"      
                      style={{ width: '25%', height: 'auto' }}      
                    />      
                    <div className='d-flex flex-column align-self-center text-white'>      
                      <p className='ps-2 fw-semibold'>{actor.name}</p>  
                      <p className='ps-2'>{actor.known_for && actor.known_for.length > 0 ? actor.known_for[0].title : 'Known for: Not available'}</p>      
                    </div>      
                  </Link>  
                ))}  
  
                {results.serieses.map(series => (    
                  <Link    
                    key={series.id}    
                    to={`/tv/${series.id}`}
                    className="autocomplete-item d-flex align-items-start p-2 text-decoration-none"    
                    onClick={() => handleResultClick(series.id, 'series')}    
                  >    
                    <img
                      src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                      alt={series.name}
                      className="me-2"
                      style={{ width: '25%', height: 'auto' }}    
                    />
                    <div className='d-flex flex-column align-self-center text-white'>    
                      <p className='ps-2 fw-semibold'>{series.name}</p>
                      <p className='ps-2'>{series.first_air_date ? formatReleaseDate(series.first_air_date) : 'Release date not available'}</p>    
                    </div>
                  </Link>    
                ))}    
              </div>      
            )}  
          </form>      
        </div>      
      </div>      
    </nav>      
  );      
};      
      
export default Navbar;
