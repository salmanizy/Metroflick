// src/components/ActorList.jsx    
import { useEffect, useState } from 'react';    
import { fetchPopularActors } from '../api/tmdb';    
import { Link, useSearchParams } from 'react-router-dom';    
import Pagination from './Pagination';
import '../style/MovieList.css'; 
import Footer from './Footer';
  
const ActorList = () => {    
    const [popularActors, setPopularActors] = useState([]);    
    const [loading, setLoading] = useState(true);    
    const [searchParams, setSearchParams] = useSearchParams();    
    const [totalPages, setTotalPages] = useState(0);  
    const currentPage = parseInt(searchParams.get('page')) || 1;
  
    useEffect(() => {    
        const getActors = async () => {    
            try {    
                const data = await fetchPopularActors(currentPage);    
                setPopularActors(data.results);
                setTotalPages(500);
            } catch (error) {
                console.error("Error fetching popular actors:", error);
            } finally {
                setLoading(false);
            }    
        };    
        getActors();
    }, [currentPage]);
    
    useEffect(() => {  
        document.title = "Metroflick | Actor List";
    });
    
    if (loading) return (  
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>  
            <div className="spinner-border text-dark" role="status">  
                <span className="visually-hidden">Loading...</span>  
            </div>  
        </div>  
    );      
    
    const handlePageChange = (page) => {    
        setSearchParams({ page });    
    };  
    
    return (
        <>
            <div className="container">    
                <div className='row'>
                    <h2 className="col-sm-6 col-12 mt-4 category text-light-emphasis d-flex justify-content-md-start justify-content-center">Popular Actors</h2>
                    <div className="col-sm-6 col-12 d-flex justify-content-md-end justify-content-center">
                        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/> 
                    </div>
                </div> 
                <div className="row g-2 g-md-3">    
                    {popularActors.map(actor => (    
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3" key={actor.id}>    
                            <Link to={`/cast/${actor.id}`} className='card bg-dark'>    
                                <img
                                    loading="lazy"
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}    
                                    alt={actor.name}    
                                    className="card-img-top"    
                                />    
                                <div className="card-body bg-dark">    
                                    <h5 className="card-title text-white text-truncate text-nowrap">{actor.name}</h5>    
                                    <p className='text-white-50 text-truncate text-nowrap'>    
                                        {actor.known_for && actor.known_for.length > 0     
                                            ? actor.known_for.slice(0, 2).map(item => (    
                                                <span key={item.id} className='font-monospace'>    
                                                    <Link    
                                                        to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}    
                                                        className="text-white-50 hover-effect text-decoration-none"    
                                                    >    
                                                        {item.title || item.name}    
                                                    </Link>    
                                                    {item.id !== (actor.known_for?.[actor.known_for?.length - 2]?.id ?? null) && ', '}
                                                </span>  
                                            ))   
                                            : 'Known for: Not available'  
                                        }    
                                    </p>  
                                </div>    
                            </Link>    
                        </div>    
                    ))}    
                </div>    
                <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>
            </div>
            <Footer className="mt-4"/>
        </>
    );    
};    
    
export default ActorList;    
