import { useEffect, useState } from "react";        
import { Link, useParams } from "react-router-dom";        
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies, fetchMovieReviews, fetchMovieVideos } from "../api/tmdb";  
import 'bootstrap-icons/font/bootstrap-icons.min.css';  
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  
import '../style/Details.css'

const MovieDetail = () => {        
    const { id } = useParams();        
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cast, setCast] = useState([]);        
    const [similarMovies, setSimilarMovies] = useState([]);        
    const [reviews, setReviews] = useState([]);  
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [crew, setCrew] = useState([])
    const [soundCrew, setSoundCrew] = useState([]);  
        
    useEffect(() => {        
        const getMovieDetails = async () => {        
            try {        
                const movieDetails = await fetchMovieDetails(id);        
                const movieCredits = await fetchMovieCredits(id);        
                const similarMoviesData = await fetchSimilarMovies(id);        
                const movieReviews = await fetchMovieReviews(id);     
        
                setMovie(movieDetails);        
                setCast(movieCredits.cast);        
                setSimilarMovies(similarMoviesData.results);        
                setReviews(movieReviews.results);        
                setLoading(false);
                
                const crewData = movieCredits.crew.filter(member => member.job === "Director" || member.job === "Writer" || member.job === "Producer" || member.job === "Comic Book");
                setCrew(mergeRoles(crewData));

                const soundCrewData = movieCredits.crew.filter(member => member.job === "Music Producer" || member.job === "Original Music Composer");
                setSoundCrew(soundCrewData);

            } catch (error) {        
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }        
        };        
        getMovieDetails();        
    }, [id]);  
  
    const mergeRoles = (crewList) => {
        const crewMap = new Map();
    
        crewList.forEach(({ id, name, job, profile_path }) => {
            if (crewMap.has(id)) {
                crewMap.get(id).job += `, ${job}`;
            } else {
                crewMap.set(id, { id, name, job, profile_path });
            }
        });
    
        return Array.from(crewMap.values());
    };
    

    const fetchTrailer = async() => {  
        const video = await fetchMovieVideos(id);  
        const trailer = video.find(video => video.type === 'Trailer' && video.site === 'YouTube');    
        if (trailer) {    
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`);    
        }  
    }  
  
    const formatReleaseDate = (dateString) => {    
        const options = {day: '2-digit', month: 'short', year: 'numeric' };   
        const date = new Date(dateString);    
        return date.toLocaleDateString('en-UK', options).replace(/,/g, '');  
    };  
  
    useEffect(() => {    
        fetchTrailer(); // Ambil trailer saat komponen dimuat    
    }, [id]);  
        
    // Scroll to top on load      
    useEffect(() => {      
        window.scrollTo(0, 0);      
    }, [movie]);

    if (loading) return (  
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>  
            <div className="spinner-border text-dark" role="status">  
                <span className="visually-hidden">Loading...</span>  
            </div>  
        </div>  
    );
    
    if (!movie) return <div>Movie not found</div>;        
        
    return (        
        <div className="container mt-4">        
            <div className="row">
                <div className="col-12 col-md-6 d-flex justify-content-center align-self-center">         
                    <img loading="lazy" src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas`'} alt={movie.title} className={`img-fluid rounded-2 ${window.innerWidth < 768 ? 'small-image' : ''}`} />   
                </div>    
                <div className="col-12 col-md-6 d-flex justify-content-center align-self-center">  
                    <div className="p-5 rounded-2 bg-dark">  
                        <h1 className="mb-3 text-light fw-bolder">{movie.title}</h1>  
                        <h5 className="d-inline text-dark-emphasis fw-bold">{formatReleaseDate(movie.release_date)}</h5>  
                        <p className="mb-4 mt-3 text-light">{movie.overview}</p>  
                        <div className="d-flex align-items-center">
                            <h5 className="d-inline p-2 mt-1 mb-1 me-3 bg-warning rounded-3"><span><i className="bi bi-star-fill d-inline"></i></span>{movie.vote_average.toFixed(1)}</h5>  
                            <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#trailerModal">Watch Trailer</button>  
                        </div>  
                    </div>  
                </div>  
            </div>
  
            <div className="modal fade" id="trailerModal" tabIndex="-1" aria-labelledby="labelModal" aria-hidden="true">  
                <div className="modal-dialog modal-dialog-centered modal-xl">  
                    <div className="modal-content bg-dark">  
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-white" id="labelModal">{movie.title}</h1>  
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>  
                        </div>  
                        <div className="modal-body">  
                            {trailerUrl && (    
                                <div className="mt-4">    
                                    <iframe     
                                        width="100%"  
                                        height="500px"     
                                        src={trailerUrl}     
                                        title={movie.title}   
                                        allow="autoplay; encrypted-media"  
                                        allowFullScreen
                                    />    
                                </div>    
                            )}   
                        </div>  
                    </div>  
                </div>  
            </div>  
  

            <div className="row mb-5">      
                <h2 className="mb-3 mt-5">Cast</h2>
                {cast.map((actor) => (        
                    <div className="col-lg-2 col-4 py-2" key={actor.id}>      
                        <Link to={`/cast/${actor.id}`} className="card bg-dark">      
                            <img
                                loading="lazy"
                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas`'}       
                                alt={actor.name}      
                                className="card-img-top"
                            />      
                            <div className="card-body">      
                                <p className="card-title text-light fw-semibold text-truncate text-nowrap">      
                                    {actor.name}      
                                </p>      
                                <p className="card-title text-white-50 text-truncate text-nowrap font-monospace">      
                                    {actor.character}      
                                </p>      
                            </div>      
                        </Link>      
                    </div>      
                ))}
            </div> 
            
            {crew.length > 0 && (
                <div className="mb-5 row">
                    <h2>Crews</h2>
                    {crew
                        .map(person => (
                            <div key={person.id} className="col-lg-2 col-4 py-2">
                                <Link to={`/crew/${person.id}`} className="card bg-dark">
                                    <img
                                        loading="lazy"
                                        src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                                        alt={person.name}
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <p className="card-title text-light fw-semibold text-truncate text-nowrap">
                                            {person.name}
                                        </p>
                                        <p className="card-title text-white-50 text-truncate text-nowrap font-monospace">
                                            {person.job}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            )}

            {soundCrew.length > 0 && (
                <div className="mb-5 row">
                    <h2>Sound Crew</h2>
                    {soundCrew.map((member) => (
                        <div className="col-lg-2 col-4 py-2" key={member.id}>
                            <Link to={`/crew/${member.id}`} className="card bg-dark">
                                <img
                                    loading="lazy"
                                    src={member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas`'}       
                                    alt={member.name}      
                                    className="card-img-top"
                                />
                                <div className="card-body">
                                    <p className="card-title text-light fw-semibold text-truncate text-nowrap">      
                                        {member.name}      
                                    </p>      
                                    <p className="card-title text-white-50 text-truncate text-nowrap font-monospace">      
                                        {member.job}      
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <div className="row mb-5">
                <h2 className="mb-3">Similar Movies</h2>
                {similarMovies.length > 0 ? (
                    similarMovies.slice(0, 6).map((similar) => (  
                        <div className="col-lg-2 col-4 py-2 mb-4" key={similar.id}>  
                            <Link to={`/movie/${similar.id}`} className="card bg-dark">  
                                <img
                                    loading="lazy"
                                    src={similar.poster_path ? `https://image.tmdb.org/t/p/w500${similar.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}  
                                    alt={similar.name}  
                                    className="card-img-top"  
                                />
                                <div className="card-body">  
                                    <p className="card-title text-white text-truncate text-nowrap">  
                                        {similar.title}
                                    </p>
                                    <p className="text-white-50 font-monospace">  
                                        {similar.release_date ? new Date(similar.release_date).getFullYear() : 'Year not available'}  
                                    </p> 
                                </div>
                            </Link>  
                        </div>  
                    ))  
                ) : (  
                    <div className="d-flex justify-content-center">
                        <div className="alert alert-warning d-flex justify-content-between fs-4 fw-bold" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            <p>No similar movies available.</p>
                        </div>
                    </div>
                )}  
            </div>
        
            {reviews.length > 0 ? (
                <div>
                <h2>Reviews</h2>
                {reviews.map((review) => (
                    <div className="mb-3" key={review.id}>
                    <div className="card text-bg-dark">
                        <div className="card-body m-3">
                        <div className="fw-bold fs-4 text-warning mb-2">@ {review.author}</div>
                        <p className="card-text" style={{textAlign:"justify"}}>{review.content}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="d-flex justify-content-center">
                    <div className="alert alert-warning d-flex justify-content-between fs-4 fw-bold" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <p>No Review!</p>
                    </div>
                </div>
            )}
        </div>
    );        
};        
        
export default MovieDetail;        
