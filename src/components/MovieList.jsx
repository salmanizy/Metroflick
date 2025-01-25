// src/components/MovieList.jsx  
import { useEffect, useState } from 'react';  
import { fetchNowShowingMovies, fetchPopularMovies, fetchTopRatedMovies } from '../api/tmdb';  
import { Link } from 'react-router-dom';
import '../style/MovieList.css';

  
const MovieList = () => {  
    const [popular, setPopular] = useState([]);
    const [topRated, settopRated] = useState([]);
    const [nowShowing, setNowShowing] = useState([]);

    const [loading, setLoading] = useState(true);  

    useEffect(() => {  
      const getMovies = async () => {  
        const popularMovies = await fetchPopularMovies();  
        setPopular(popularMovies);  
        setLoading(false);  
      };  
      getMovies();  
    }, []);

    useEffect(() => {  
        document.title = "Metroflick | Movies";
    });

    useEffect(() => {  
        const getTopRatedMovies = async () => {  
            try {  
                const data = await fetchTopRatedMovies(); // Mengambil data menggunakan fungsi yang diimpor  
                settopRated(data.results); // Mengatur state dengan hasil yang diterima  
            } catch (error) {  
                console.error("Error fetching top-rated movies:", error);  
            } finally {  
                setLoading(false);  
            }  
        };  
  
        getTopRatedMovies();  
    }, []);

    useEffect(() => {  
        const getNowShowingMovies = async () => {  
            try {  
                const data = await fetchNowShowingMovies(); // Mengambil data menggunakan fungsi yang diimpor  
                setNowShowing(data.results); // Mengatur state dengan hasil yang diterima  
            } catch (error) {  
                console.error("Error fetching now showing movies:", error);  
            } finally {  
                setLoading(false);  
            }  
        };  
  
        getNowShowingMovies();  
    }, []);

    const formatReleaseDate = (dateString) => {  
        const options = {year: 'numeric' };  
        const date = new Date(dateString);  
        return date.toLocaleDateString('en-ID', options).replace(/,/g, '');
    };

    if (loading) return (  
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>  
            <div className="spinner-border text-dark" role="status">  
                <span className="visually-hidden">Loading...</span>  
            </div>  
        </div>  
    );      
    
    return (
        
        <div className="container">

            <h2 className="mt-4 category text-light-emphasis">Now Showing Movies</h2>  
            <div className="row mt-3">  
                {nowShowing.slice(0,8).map(movie => (  
                    <div className="col-md-3 col-sm-6 col-6 mb-4" key={movie.id}>  
                        <Link to={`/movie/${movie.id}`} className='card bg-dark'>  
                            <img 
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas`'}
                                alt={movie.title}  
                                className="card-img-top"  
                            />  
                            <div className="card-body bg-dark">  
                                <h5 className="card-title text-light text-truncate text-nowrap">{movie.title}</h5>  
                                <p className='text-white-50 font-monospace text-truncate text-nowrap'>{movie.release_date ? formatReleaseDate(movie.release_date) : 'Release date not available'}</p>  
                            </div>  
                        </Link>  
                    </div>  
                ))}  
            </div>

            <h2 className="mt-4 category text-light-emphasis">Popular Movie</h2>  
            <div className="row mt-3">  
                {popular.slice(0,8).map(movie => (  
                    <div className="col-md-3 col-sm-6 col-6 mb-4" key={movie.id}> 
                        <Link to={`/movie/${movie.id}`} className='card bg-dark'>  
                        <img  
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas`'} 
                            alt={movie.title}
                            className="card-img-top"  
                        />  
                        <div className="card-body bg-dark">
                            <h5 className="card-title text-white text-truncate text-nowrap">{movie.title}</h5>  
                            <p className='text-white-50 font-monospace text-truncate text-nowrap'>{movie.release_date ? formatReleaseDate(movie.release_date) : 'Release date not available'}</p>
                        </div>
                        </Link>  
                    </div>
                ))}  
            </div>

            <h2 className="mt-4 category text-light-emphasis">Top Rated Movies</h2>  
            <div className="row mt-3">  
                {topRated.slice(0,8).map(movie => (
                    <div className="col-md-3 col-sm-6 col-6 mb-4" key={movie.id}>  
                        <Link to={`/movie/${movie.id}`} className='card bg-dark'>  
                            <img  
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas`'} 
                                alt={movie.title}  
                                className="card-img-top"  
                            />  
                            <div className="card-body bg-dark">  
                                <h5 className="card-title text-white text-truncate text-nowrap">{movie.title}</h5>  
                                <p className='text-white-50 font-monospace text-truncate text-nowrap'>{movie.release_date ? formatReleaseDate(movie.release_date) : 'Release date not available'}</p>  
                            </div>  
                        </Link>  
                    </div>  
                ))}  
            </div>
        </div>  
    );  
};  
  
export default MovieList;  
