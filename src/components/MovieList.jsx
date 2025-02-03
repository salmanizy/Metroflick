import { useEffect, useState } from 'react';  
import { fetchNowShowingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchUpcoming } from '../api/tmdb';
import Carousel from './Carousell'; // Assuming you have the Carousel component
import '../style/MovieList.css';

const MovieList = () => {  
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [nowShowing, setNowShowing] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {  
        const getMovies = async () => {  
            try {
                const popularMovies = await fetchPopularMovies();  
                setPopular(popularMovies);  
            } finally {
                setLoading(false);
            }
        };  
        getMovies();  
    }, []);

    useEffect(() => {  
        document.title = "Metroflick | Movies";
    });

    useEffect(() => {  
        const getTopRatedMovies = async () => {  
            try {  
                const data = await fetchTopRatedMovies();
                setTopRated(data.results);
            }finally {  
                setLoading(false);  
            }  
        };  
        getTopRatedMovies();  
    }, []);

    useEffect(() => {  
        const getNowShowingMovies = async () => {  
            try {  
                const data = await fetchNowShowingMovies();  
                setNowShowing(data.results);  
            }finally {  
                setLoading(false);  
            }  
        };  
        getNowShowingMovies();  
    }, []);

    useEffect(() => {  
        const getUpcoming = async () => {  
            try {  
                const data = await fetchUpcoming(); 
                setUpcoming(data.results);
            }finally {  
                setLoading(false);  
            }  
        };  
        getUpcoming();  
    }, []);

    const formatReleaseDate = (dateString) => {  
        const options = { year: 'numeric' };  
        const date = new Date(dateString);  
        return date.toLocaleDateString('en-ID', options).replace(/,/g, '');
    };

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
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
            <Carousel
                title="Now Showing Movies"
                data={shuffleArray(nowShowing)}
                formatDate={formatReleaseDate}
                loading={loading}
                linkPrefix="/movie"
            />
            <Carousel
                title="Popular Movies"
                data={popular}
                formatDate={formatReleaseDate}
                loading={loading}
                linkPrefix="/movie"
            />
            <Carousel
                title="Top Rated Movies"
                data={topRated}
                formatDate={formatReleaseDate}
                loading={loading}
                linkPrefix="/movie"
            />
            <Carousel
                title="Upcoming Movies"
                data={upcoming}
                formatDate={formatReleaseDate}
                loading={loading}
                linkPrefix="/movie"
            />
        </div>  
    );  
};  
  
export default MovieList;  
