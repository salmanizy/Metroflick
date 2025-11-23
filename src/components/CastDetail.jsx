import { useEffect, useState } from "react";    
import { Link, useParams } from "react-router-dom";    
import { fetchCastDetails, fetchCastMovies, fetchCastSeries, fetchSomeoneSocmed } from "../api/tmdb";    
import Footer from "./Footer";
const CastDetail = () => {    
    const { id } = useParams();  
    const [cast, setCast] = useState(null);  
    const [movies, setMovies] = useState([]);  
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [showFullBio, setShowFullBio] = useState(false); //setter full text
    const [socials, setSocial] = useState({});
    
    useEffect(() => {
        const getCastDetails = async () => {
            try {
                const castDetails = await fetchCastDetails(id);  
                const castMovies = await fetchCastMovies(id);  
                const castSeries = await fetchCastSeries(id);
                const castSocial = await fetchSomeoneSocmed(id);

                setCast(castDetails);
                setMovies(castMovies.cast);
                setSeries(castSeries.cast);
                setSocial(castSocial);
                setLoading(false);
            } catch (error) {    
                console.error("Error fetching cast details:", error);    
                setLoading(false);  
            }    
        };    
        getCastDetails();
        window.scrollTo(0, 0)
    }, [id]);  
  
    const formatDateOfBirth = (dateString) => {    
        if (!dateString) return "Not available";    
        const options = { day: '2-digit', month: 'short', year: 'numeric' };    
        const date = new Date(dateString);    
        const formattedDate = date.toLocaleDateString('en-GB', options).replace(/,/g, '');  
        return formattedDate;    
    };  
  
    const formatReleaseDate = (dateString) => {    
        const options = {year: 'numeric' };    
        const date = new Date(dateString);    
        return date.toLocaleDateString('en-ID', options).replace(/,/g, '');  
    };  
      
    const truncateBiography = (bio, maxLength = 700) => {    
        if (!bio) return "Biography not available.";    
        if (showFullBio || bio.length <= maxLength) return bio;  //setter full text
        return bio.slice(0, maxLength) + "...";  
    };
    
    if (loading) return (  
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>  
            <div className="spinner-border text-dark" role="status">  
                <span className="visually-hidden">Loading...</span>  
            </div>
        </div>  
    );      
    if (!cast) return <div>Cast not found</div>;  
    
    return (    
        <>
            <div className="container mt-3 mt-md-4 px-3 px-md-3">
                <div className="row g-3 g-md-4">      
                    <div className="col-12 col-md-4 col-lg-3 d-flex justify-content-center">           
                        <img 
                            loading="lazy" 
                            src={cast.profile_path ? `https://image.tmdb.org/t/p/w500${cast.profile_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'} 
                            alt={cast.name} 
                            className="img-fluid rounded-2 w-100" 
                            style={{ maxWidth: '400px', objectFit: 'cover' }}
                        />     
                    </div>      
                    <div className="col-12 col-md-8 col-lg-9 d-flex align-items-center">    
                        <div className="p-3 p-md-4 p-lg-5 rounded-2 bg-dark w-100">    
                            <h1 className="mb-2 mb-md-3 text-warning fw-semibold fs-3 fs-md-2 fs-lg-1">{cast.name}</h1>    
                            <h6 className="d-block text-white mb-2 fs-6 fs-md-5">{cast.place_of_birth || "Not available"}</h6>    
                            <h6 className="d-block text-white mb-3 fs-6 fs-md-5">Date of Birth: {formatDateOfBirth(cast.birthday)}</h6>  
                            <p className="text-white-50 mb-0 fs-6 fs-md-6" style={{ lineHeight: '1.6' }}>
                                {truncateBiography(cast.biography)}
                                {cast.biography && cast.biography.length > 700 && (
                                    <a 
                                        className="text-warning p-0 ms-2 text-decoration-none fw-semibold"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setShowFullBio(!showFullBio)}
                                    >
                                        {showFullBio ? "See Less" : "See More"}
                                    </a>
                                )}
                            </p> 
                        </div>    
                    </div>    
                </div>  
    
                <div className="mt-3">
                    <div className="d-flex flex-wrap gap-3">
                        {socials.imdb_id && (
                            <a href={`https://www.imdb.com/name/${socials.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-warning bg-dark rounded-2 p-2 fw-semibold text-decoration-none">
                                <i className="bi bi-film"></i> IMDb
                            </a>
                        )}
                        {socials.facebook_id && (
                            <a href={`https://www.facebook.com/${socials.facebook_id}`} target="_blank" rel="noopener noreferrer" className="text-warning bg-dark rounded-2 p-2 fw-semibold text-decoration-none">
                                <i className="bi bi-facebook"></i> Facebook
                            </a>
                        )}
                        {socials.instagram_id && (
                            <a href={`https://www.instagram.com/${socials.instagram_id}`} target="_blank" rel="noopener noreferrer" className="text-warning bg-dark rounded-2 p-2 fw-semibold text-decoration-none">
                                <i className="bi bi-instagram"></i> Instagram
                            </a>
                        )}
                        {socials.tiktok_id && (
                            <a href={`https://www.tiktok.com/@${socials.tiktok_id}`} target="_blank" rel="noopener noreferrer" className="text-warning bg-dark rounded-2 p-2 fw-semibold text-decoration-none">
                                <i className="bi bi-tiktok"></i> TikTok
                            </a>
                        )}
                        {socials.twitter_id && socials.twitter_id !== "" && (
                            <a href={`https://x.com/${socials.twitter_id}`} target="_blank" rel="noopener noreferrer" className="text-warning bg-dark rounded-2 p-2 fw-semibold text-decoration-none">
                                <i className="bi bi-twitter-x"></i> Twitter
                            </a>
                        )}
                        {socials.youtube_id && (
                            <a href={`https://www.youtube.com/${socials.youtube_id}`} target="_blank" rel="noopener noreferrer" className="text-warning bg-dark rounded-2 p-2 fw-semibold text-decoration-none">
                                <i className="bi bi-youtube"></i> YouTube
                            </a>
                        )}
                        {socials.wikidata_id && (
                            <a href={`https://www.wikidata.org/wiki/${socials.wikidata_id}`} target="_blank" rel="noopener noreferrer" className="text-warning bg-dark rounded-2 p-2 fw-semibold text-decoration-none">
                                <i className="bi bi-info-circle"></i> Wikidata
                            </a>
                        )}
                        {!socials.imdb_id && !socials.facebook_id && !socials.instagram_id && !socials.tiktok_id && !socials.twitter_id &&
                        !socials.youtube_id && !socials.wikidata_id}
                    </div>
                </div>
    
                <h2 className="mt-4 mt-md-5 mb-3 fs-4 fs-md-3 fs-lg-2">Movies</h2>    
                <div className="row g-2 g-md-3">    
                    {movies.map((movie, index) => (    
                        <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={`movie-${movie.id}-${index}`}>    
                            <Link to={`/movie/${movie.id}`} className="card bg-dark">  
                                <div className="bg-dark text-white">    
                                    <img
                                        loading="lazy" 
                                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}  
                                        alt={movie.title}    
                                        className="card-img-top"    
                                    />    
                                    <div className="card-body">   
                                        <h5 className="card-title text-truncate text-nowrap">{movie.title}</h5>    
                                        <p className="card-text text-truncate text-white-50 text-nowrap font-monospace">{movie.release_date ? formatReleaseDate(movie.release_date) : 'Release date not available'}</p>    
                                    </div>    
                                </div>   
                            </Link>   
                        </div>    
                    ))}    
                </div>    
    
                <h2 className="mt-4 mt-md-5 mb-3 fs-4 fs-md-3 fs-lg-2">Series</h2>  
                <div className="row g-2 g-md-3">  
                    {series.map((series, index) => (  
                        <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={`series-${series.id}-${index}`}>      
                            <Link to={`/tv/${series.id}`} className="card bg-dark">    
                                <div className="bg-dark text-white">      
                                    <img
                                        loading="lazy"    
                                        src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}    
                                        alt={series.name}  
                                        className="card-img-top"      
                                    />      
                                    <div className="card-body">     
                                        <h5 className="card-title text-truncate text-nowrap">{series.name}</h5>  
                                        <p className="card-text text-truncate text-white-50 text-nowrap font-monospace">{series.first_air_date ? formatReleaseDate(series.first_air_date) : 'Release date not available'}</p>   
                                    </div>      
                                </div>     
                            </Link>     
                        </div>      
                    ))}      
                </div>
            </div>    
            <Footer className="mt-4"/>
        </>
    );    
};    
    
export default CastDetail;    