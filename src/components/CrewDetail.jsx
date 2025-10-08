import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCrewDetails, fetchCrewMovies, fetchCrewSeries } from "../api/tmdb";

const CrewDetail = () => {
    const { id } = useParams();
    const [crew, setCrew] = useState(null);
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFullBio, setShowFullBio] = useState(false); //setter full text


    useEffect(() => {
        const getCrewDetails = async () => {
            try {
                const crewDetails = await fetchCrewDetails(id);
                const crewMovies = await fetchCrewMovies(id);
                const crewSeries = await fetchCrewSeries(id);
                setCrew(crewDetails);
                setMovies(mergeRoles(crewMovies.crew));
                setSeries(mergeRoles(crewSeries.crew));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching crew details:", error);
                setLoading(false);
            }
        };
        getCrewDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const formatDateOfBirth = (dateString) => {    
        if (!dateString) return "Not available";    
        const options = { day: '2-digit', month: 'short', year: 'numeric' };    
        const date = new Date(dateString);    
        const formattedDate = date.toLocaleDateString('en-GB', options).replace(/,/g, '');  
        return formattedDate;    
    };

    const truncateBiography = (bio, maxLength = 700) => {    
        if (!bio) return "Biography not available.";    
        if (showFullBio || bio.length <= maxLength) return bio;  //setter full text
        return bio.slice(0, maxLength) + "...";  
    };

    // Fungsi untuk menggabungkan role jika ada lebih dari satu di film/seri yang sama
    const mergeRoles = (crewList) => {
        const merged = crewList.reduce((acc, crewMember) => {
            const existing = acc.find(item => item.id === crewMember.id);
            if (existing) {
                existing.job = `${existing.job}, ${crewMember.job}`;
            } else {
                acc.push({ ...crewMember });
            }
            return acc;
        }, []);
        return merged;
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!crew) return <div>Crew not found</div>;

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12 col-md-6 d-flex justify-content-center align-self-center">
                    <img loading="lazy" src={crew.profile_path ? `https://image.tmdb.org/t/p/w500${crew.profile_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'} alt={crew.name} className="img-fluid rounded-2" />
                </div>
                <div className="col-12 col-md-6 d-flex justify-content-center align-self-center">
                    <div className="p-5 rounded-2 bg-dark">
                        <h1 className="mb-3 text-warning fw-semibold">{crew.name}</h1>
                        <h5 className="d-block text-white-50">{crew.place_of_birth}</h5>  
                        <h5 className="d-block text-white">Date of Birth: {formatDateOfBirth(crew.birthday)}</h5>  
                        <p className="text-white-50">
                            {truncateBiography(crew.biography)}
                            {crew.biography && crew.biography.length > 700 && ( //setter full text
                                <a 
                                    className="text-warning p-0 ms-3"
                                    onClick={() => setShowFullBio(!showFullBio)}
                                >
                                    {showFullBio ? "See Less" : "See More"}
                                </a>
                            )}
                        </p> 
                    </div>
                </div>
            </div>

            {movies.length > 0 && (
                <div className="row mt-3">
                <h2 className="mt-5">Movies</h2>
                    {movies.map((movie) => (
                        <div className="col-md-2 mb-4" key={`movie-${movie.id}`}>
                            <Link to={`/movie/${movie.id}`} className="card bg-dark">
                                <img loading="lazy" src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'} alt={movie.title} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title text-truncate text-white text-nowrap">{movie.title}</h5>
                                    <p className="card-text text-truncate text-white-50 text-nowrap font-monospace">{movie.job}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {series.length > 0 && (
                <div className="row mt-3">
                    <h2 className="mt-5">Series</h2>
                    {series.map((show) => (
                        <div className="col-md-2 mb-4" key={`series-${show.id}`}>
                            <Link to={`/tv/${show.id}`} className="card bg-dark">
                                <img loading="lazy" src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'} alt={show.name} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title text-truncate text-white text-nowrap">{show.name}</h5>
                                    <p className="card-text text-truncate text-white-50 text-nowrap font-monospace">{show.job}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CrewDetail;
