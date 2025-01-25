import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchNowAiringSeries, fetchPopularSeries, fetchTopRatedSeries } from '../api/tmdb';
import '../style/MovieList.css';

const SeriesList = () => {
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [nowAiring, setNowAiring] = useState([]);
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {    
      const getSeries = async () => {    
        const popularSeries = await fetchPopularSeries();    
        setPopular(popularSeries);    
        setLoading(false);    
      };    
      getSeries();    
    }, []);

    useEffect(() => {  
        document.title = "Metroflick | Series";  
    });
  
    useEffect(() => {    
        const getTopRatedSeries = async () => {    
            try {    
                const data = await fetchTopRatedSeries();
                setTopRated(data.results);
            } catch (error) {    
                console.error("Error fetching top-rated series:", error);    
            } finally {    
                setLoading(false);    
            }    
        };    
    
        getTopRatedSeries();    
    }, []);  
  
    useEffect(() => {    
        const getNowAiringSeries = async () => {    
            try {    
                const data = await fetchNowAiringSeries();
                setNowAiring(data.results);
            } catch (error) {    
                console.error("Error fetching now airing series:", error);    
            } finally {    
                setLoading(false);    
            }    
        };    
    
        getNowAiringSeries();    
    }, []);  
  
    const formatFirstAirDate = (dateString) => {    
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
        <div>
            <div className="container">  
                <h2 className="mt-4 category text-light-emphasis">Now Showing Series</h2>    
                <div className="row mt-3">    
                    {nowAiring.slice(0,8).map(series => (    
                        <div className="col-md-3 col-sm-6 col-6 mb-4" key={series.id}>
                            <Link to={`/tv/${series.id}`} className='card bg-dark'>    
                                <img   
                                    src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}  
                                    alt={series.name}    
                                    className="card-img-top"    
                                />
                                <div className="card-body bg-dark">    
                                    <h5 className="card-title text-light text-truncate text-nowrap">{series.name}</h5>    
                                    <p className='text-white-50 font-monospace text-truncate text-nowrap'>{series.first_air_date ? formatFirstAirDate(series.first_air_date) : 'First air date not available'}</p>    
                                </div>    
                            </Link>    
                        </div>    
                    ))}    
                </div>  
    
                <h2 className="mt-4 category text-light-emphasis">Popular Series</h2>    
                <div className="row mt-3">    
                {popular.slice(0,8).map(series => (    
                    <div className="col-md-3 col-sm-6 col-6 mb-4" key={series.id}>   
                        <Link to={`/tv/${series.id}`} className='card bg-dark'>    
                        <img    
                            src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}   
                            alt={series.name}  
                            className="card-img-top"    
                        />    
                        <div className="card-body bg-dark">  
                            <h5 className="card-title text-white text-truncate text-nowrap">{series.name}</h5>    
                            <p className='text-white-50 font-monospace text-truncate text-nowrap'>{series.first_air_date ? formatFirstAirDate(series.first_air_date) : 'First air date not available'}</p>  
                        </div>  
                        </Link>    
                    </div>  
                ))}    
                </div>  
    
                <h2 className="mt-4 category text-light-emphasis">Top Rated Series</h2>    
                <div className="row mt-3">    
                    {topRated.slice(0,8).map(series => (  
                        <div className="col-md-3 col-sm-6 col-6 mb-4" key={series.id}>    
                            <Link to={`/tv/${series.id}`} className='card bg-dark'>    
                                <img    
                                    src={series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}   
                                    alt={series.name}    
                                    className="card-img-top"    
                                />    
                                <div className="card-body bg-dark">    
                                    <h5 className="card-title text-white text-truncate text-nowrap">{series.name}</h5>    
                                    <p className='text-white-50 font-monospace text-truncate text-nowrap'>{series.first_air_date ? formatFirstAirDate(series.first_air_date) : 'First air date not available'}</p>    
                                </div>    
                            </Link>    
                        </div>    
                    ))}    
                </div>  
            </div>
            {/*  */}
        </div>
    )
}
export default SeriesList