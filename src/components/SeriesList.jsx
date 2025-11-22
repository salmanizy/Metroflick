import { useEffect, useState } from 'react';
import { fetchNowAiringSeries, fetchPopularSeries, fetchTopRatedSeries } from '../api/tmdb';
import Carousel from './Carousell';
import '../style/MovieList.css';
import Footer from './Footer';

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

    const formatFirstAirDate = (dateString) => {
        const options = { year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ID', options).replace(/,/g, '');
    };

    return (
        <>
            <Carousel
                title="Now Showing Series"
                data={shuffleArray(nowAiring)}
                formatDate={formatFirstAirDate}
                loading={loading}
                linkPrefix="/tv"
            />
            <Carousel
                title="Popular Series"
                data={shuffleArray(popular)}
                formatDate={formatFirstAirDate}
                loading={loading}
                linkPrefix="/tv"
            />
            <Carousel
                title="Top Rated Series"
                data={shuffleArray(topRated)}
                formatDate={formatFirstAirDate}
                loading={loading}
                linkPrefix="/tv"
            />
            <Footer className="mt-4" />
        </>
    );
};

export default SeriesList;
