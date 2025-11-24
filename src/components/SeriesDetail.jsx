import { useEffect, useState } from "react";  
import { Link, useParams } from "react-router-dom";  
import { fetchSeriesDetails, fetchSeriesCredits, fetchSimilarSeries, fetchSeriesReviews, fetchSeriesVideos } from "../api/tmdb";    
import 'bootstrap-icons/font/bootstrap-icons.min.css';    
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../style/Details.css'
import Footer from "./Footer";
  
const SeriesDetail = () => {  
    const { id } = useParams();  
    const [series, setSeries] = useState(null);  
    const [loading, setLoading] = useState(true);  
    const [cast, setCast] = useState([]);  
    const [similarSeries, setSimilarSeries] = useState([]);  
    const [reviews, setReviews] = useState([]);  
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [crew, setCrew] = useState([]);
    const [soundCrew, setSoundCrew] = useState([]);
  
    useEffect(() => {  
        const getSeriesDetails = async () => {  
            try {  
                const seriesDetails = await fetchSeriesDetails(id);  
                const seriesCredits = await fetchSeriesCredits(id);  
                const similarSeriesData = await fetchSimilarSeries(id);  
                const seriesReviews = await fetchSeriesReviews(id);  
  
                setSeries(seriesDetails);  
                setCast(seriesCredits.cast);  
                setSimilarSeries(similarSeriesData.results);  
                setReviews(seriesReviews.results);  
                setLoading(false);
                
                const crewData = seriesCredits.crew.filter(member => member.job === "Author" || member.job === "Director" || member.job === "Writer" || member.job === "Producer" || member.job === "Comic Book" || member.job === "Original Series Creator");
                setCrew(mergeRoles(crewData));
                
                const soundCrewData = seriesCredits.crew.filter(member => member.job === "Music Producer" || member.job === "Original Music Composer" || member.job === "Theme Song Performance" || member.job === "Main Title Theme Composer");
                setSoundCrew(soundCrewData);

            } catch (error) {  
                console.error("Error fetching series details:", error);  
                setLoading(false);  
            }  
        };  
        getSeriesDetails();  
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
  
    const fetchTrailer = async () => {  
        const video = await fetchSeriesVideos(id);  
        const trailer = video.find(video => video.type === 'Trailer' && video.site === 'YouTube');  
        if (trailer) {  
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`);  
        }  
    }  
  
    const formatReleaseDate = (dateString) => {  
        const options = { day: '2-digit', month: 'short', year: 'numeric' };  
        const date = new Date(dateString);  
        return date.toLocaleDateString('en-UK', options).replace(/,/g, '');  
    };  
  
    useEffect(() => {  
        fetchTrailer();
    }, [id]);  
  
    useEffect(() => {  
        window.scrollTo(0, 0);  
    }, [series]);  
  
    if (loading) return (  
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>  
            <div className="spinner-border text-dark" role="status">  
                <span className="visually-hidden">Loading...</span>  
            </div>  
        </div>  
    );      

    if (!series) return <div>Series not found</div>;  
  
    return (  
        <>
            <div className="container mt-3 mt-md-4 px-3 px-md-3">  
                <div className="row g-3 g-md-4">  
                    <div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center">  
                        <img 
                            loading="lazy" 
                            src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'} 
                            alt={series.name} 
                            className="img-fluid rounded-2 w-100"
                            style={{ maxWidth: '400px', objectFit: 'cover' }}
                        />  
                    </div>  
                    <div className="col-12 col-md-8 col-lg-9 d-flex align-items-center">  
                        <div className="p-3 p-md-4 p-lg-5 rounded-2 bg-dark w-100">  
                            <h1 className="mb-2 mb-md-3 text-light fw-bolder fs-3 fs-md-2 fs-lg-1">{series.name}</h1>  
                            <h6 className="d-inline text-dark-emphasis fw-bold mb-3 fs-6 fs-md-5">{formatReleaseDate(series.first_air_date)}</h6>  
                            <p className="mb-3 mb-md-4 text-light fs-6" style={{ lineHeight: '1.6' }}>{series.overview}</p>  
                            <div className="d-flex flex-row align-items-center gap-2 gap-sm-3">  
                                <h5 className="d-inline p-2 mb-0 bg-warning rounded-3 fs-6 fs-md-5">
                                    <span><i className="bi bi-star-fill"></i></span> {series.vote_average.toFixed(1)}
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
                                <h5 className="modal-title text-white fs-6 fs-md-5" id="labelModal">{series.name}</h5>  
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>  
                            </div>  
                            <div className="modal-body p-2 p-md-3">  
                                {trailerUrl && (  
                                    <div className="ratio ratio-16x9">  
                                        <iframe  
                                            src={trailerUrl}  
                                            title={series.name}  
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
                    <h2 className="mb-3 mt-4 mt-md-5 fs-4 fs-md-3 fs-lg-2 text-light title">Cast</h2>
                    <div className="row g-2 g-md-3">
                        {cast.map((actor) => (  
                            <div className="col-4 col-sm-4 col-md-3 col-lg-2" key={actor.id}>  
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
                        <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2 text-light title">Crews</h2>
                        <div className="row g-2 g-md-3">
                            {crew.map((person) => (
                                <div className="col-4 col-sm-4 col-md-3 col-lg-2" key={person.id}>
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
                        <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2 text-light title">Sound Crew</h2>
                        <div className="row g-2 g-md-3">
                            {soundCrew.map((member) => (
                                <div className="col-4 col-sm-4 col-md-3 col-lg-2" key={member.id}>
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
                    <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2 text-light title">Similar Series</h2>  
                    {similarSeries.length > 0 ? (
                        <div className="row g-2 g-md-3">
                            {similarSeries.slice(0, 6).map((similar) => (  
                                <div className="col-4 col-sm-4 col-md-3 col-lg-2" key={similar.id}>
                                    <Link to={`/tv/${similar.id}`} className="card bg-dark text-decoration-none h-100">  
                                        <img
                                            loading="lazy"  
                                            src={similar.poster_path ? `https://image.tmdb.org/t/p/w500${similar.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}  
                                            alt={similar.name}  
                                            className="card-img-top"
                                            style={{ aspectRatio: '2/3', objectFit: 'cover' }}  
                                        />
                                        <div className="card-body p-2 p-md-3">  
                                            <p className="card-title text-white text-truncate text-nowrap mb-1 mb-md-2 fs-6 small">  
                                                {similar.name}  
                                            </p>
                                            <p className="text-white-50 font-monospace mb-0 small">  
                                                {similar.first_air_date ? new Date(similar.first_air_date).getFullYear() : 'Year not available'}  
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
                                <p className="mb-0">No similar series available.</p>
                            </div>
                        </div>
                    )}  
                </div>

                {reviews.length > 0 ? (
                    <div className="mb-4">
                        <h2 className="mb-3 fs-4 fs-md-3 fs-lg-2 text-light title">Reviews</h2>
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
  
export default SeriesDetail;