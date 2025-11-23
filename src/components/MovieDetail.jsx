import { useEffect, useState } from "react";        
import { Link, useParams } from "react-router-dom";        
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies, fetchMovieReviews, fetchMovieVideos } from "../api/tmdb";  
import 'bootstrap-icons/font/bootstrap-icons.min.css';  
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  
import '../style/Details.css'
import Footer from "./Footer";

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
        fetchTrailer(); 
    }, [id]);  

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
        <>
            <div className="container mt-3 mt-md-4 px-3 px-md-3">        
                <div className="row g-3 g-md-4">
                    <div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center">         
                        <img 
                            loading="lazy" 
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'} 
                            alt={movie.title} 
                            className="img-fluid rounded-2 w-100" 
                            style={{ maxWidth: '400px', objectFit: 'cover' }}
                        />   
                    </div>    
                    <div className="col-12 col-md-8 col-lg-9 d-flex align-items-center">  
                        <div className="p-3 p-md-4 p-lg-5 rounded-2 bg-dark w-100">  
                            <h1 className="mb-2 mb-md-3 text-light fw-bolder fs-3 fs-md-2 fs-lg-1">{movie.title}</h1>  
                            <h6 className="d-inline text-dark-emphasis fw-bold mb-3 fs-6 fs-md-5">{formatReleaseDate(movie.release_date)}</h6>  
                            <p className="mb-3 mb-md-4 text-light fs-6" style={{ lineHeight: '1.6' }}>{movie.overview}</p>  
                            <div className="d-flex flex-row align-items-center gap-2 gap-sm-3">
                                <h5 className="d-inline p-2 mb-0 bg-warning rounded-3 fs-6 fs-md-5">
                                    <span><i className="bi bi-star-fill"></i></span> {movie.vote_average.toFixed(1)}
                                </h5>  
                                <button type="button" className="btn btn-light btn-sm btn-md-md" data-bs-toggle="modal" data-bs-target="#trailerModal">
                                    <i className="bi bi-play-circle me-1"></i> Watch Trailer
                                </button>  
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
    

                <div className="mb-4 mb-md-5">      
                    <h2 className="mb-3 mt-4 mt-md-5 fs-4 fs-md-3 fs-lg-2">Cast</h2>
                    <div className="row g-2 g-md-3">
                        {cast.map((actor) => (        
                            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={actor.id}>      
                                <Link to={`/cast/${actor.id}`} className="card bg-dark text-decoration-none h-100">      
                                    <img
                                        loading="lazy"
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}       
                                        alt={actor.name}      
                                        className="card-img-top"
                                        style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                                    />      
                                    <div className="card-body p-2 p-md-3">      
                                        <p className="card-title text-light fw-semibold text-truncate text-nowrap mb-1 mb-md-2 fs-6 small">      
                                            {actor.name}      
                                        </p>      
                                        <p className="card-title text-white-50 text-truncate text-nowrap font-monospace mb-0 small">      
                                            {actor.character}      
                                        </p>      
                                    </div>      
                                </Link>      
                            </div>      
                        ))}
                    </div>
                </div> 
                
                {crew.length > 0 && (
                    <div className="mb-4 mb-md-5">
                        <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2">Crews</h2>
                        <div className="row g-2 g-md-3">
                            {crew.map(person => (
                                <div key={person.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                                    <Link to={`/crew/${person.id}`} className="card bg-dark text-decoration-none h-100">
                                        <img
                                            loading="lazy"
                                            src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}
                                            alt={person.name}
                                            className="card-img-top"
                                            style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-2 p-md-3">
                                            <p className="card-title text-light fw-semibold text-truncate text-nowrap mb-1 mb-md-2 fs-6 small">
                                                {person.name}
                                            </p>
                                            <p className="card-title text-white-50 text-truncate text-nowrap font-monospace mb-0 small">
                                                {person.job}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {soundCrew.length > 0 && (
                    <div className="mb-4 mb-md-5">
                        <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2">Sound Crew</h2>
                        <div className="row g-2 g-md-3">
                            {soundCrew.map((member) => (
                                <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={member.id}>
                                    <Link to={`/crew/${member.id}`} className="card bg-dark text-decoration-none h-100">
                                        <img
                                            loading="lazy"
                                            src={member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}       
                                            alt={member.name}      
                                            className="card-img-top"
                                            style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                                        />
                                        <div className="card-body p-2 p-md-3">
                                            <p className="card-title text-light fw-semibold text-truncate text-nowrap mb-1 mb-md-2 fs-6 small">      
                                                {member.name}      
                                            </p>      
                                            <p className="card-title text-white-50 text-truncate text-nowrap font-monospace mb-0 small">      
                                                {member.job}      
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4 mb-md-5">
                    <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2">Similar Movies</h2>
                    {similarMovies.length > 0 ? (
                        <div className="row g-2 g-md-3">
                            {similarMovies.slice(0, 6).map((similar) => (  
                                <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={similar.id}>  
                                    <Link to={`/movie/${similar.id}`} className="card bg-dark text-decoration-none h-100">  
                                        <img
                                            loading="lazy"
                                            src={similar.poster_path ? `https://image.tmdb.org/t/p/w500${similar.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}  
                                            alt={similar.title}  
                                            className="card-img-top"
                                            style={{ aspectRatio: '2/3', objectFit: 'cover' }}  
                                        />
                                        <div className="card-body p-2 p-md-3">  
                                            <p className="card-title text-white mb-1 mb-md-2 fs-6 small">  
                                                {similar.title}
                                            </p>
                                            <p className="text-white-50 font-monospace mb-0 small">  
                                                {similar.release_date ? new Date(similar.release_date).getFullYear() : 'Year not available'}  
                                            </p> 
                                        </div>
                                    </Link>  
                                </div>  
                            ))}
                        </div>  
                    ) : (  
                        <div className="d-flex justify-content-center">
                            <div className="alert alert-warning d-flex align-items-center fs-6 fs-md-5 fw-bold" role="alert">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                <p className="mb-0">No similar movies available.</p>
                            </div>
                        </div>
                    )}  
                </div>
            
                {reviews.length > 0 ? (
                    <div className="mb-4">
                        <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2">Reviews</h2>
                        {reviews.map((review) => (
                            <div className="mb-3" key={review.id}>
                                <div className="card text-bg-dark">
                                    <div className="card-body p-3 p-md-4">
                                        <div className="fw-bold fs-6 fs-md-5 text-warning mb-2">@ {review.author}</div>
                                        <p className="card-text fs-6 mb-0" style={{textAlign:"justify", lineHeight: '1.6'}}>{review.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="d-flex justify-content-center mb-4">
                        <div className="alert alert-warning d-flex align-items-center fs-6 fs-md-5 fw-bold" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            <p className="mb-0">No Review!</p>
                        </div>
                    </div>
                )}
            </div>
            <Footer className="mt-4" />
        </>
    );        
};        
        
export default MovieDetail;        
