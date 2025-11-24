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

    // Set document title
    useEffect(() => {
        document.title = "Metroflick | Series";
    }, []);

    // Fetch all series data in one useEffect
    useEffect(() => {
        const getAllSeries = async () => {
            try {
                setLoading(true);
                
                // Fetch all data in parallel
                const [popularData, topRatedData, nowAiringData] = await Promise.all([
                    fetchPopularSeries(),
                    fetchTopRatedSeries(),
                    fetchNowAiringSeries()
                ]);

                // Set state with shuffled data
                setPopular(popularData);
                setTopRated(topRatedData.results || topRatedData);
                setNowAiring(shuffleArray(nowAiringData.results || nowAiringData));
                
            } catch (error) {
                console.error("Error fetching series:", error);
            } finally {
                setLoading(false);
            }
        };

        getAllSeries();
    }, []);

    // Shuffle function (moved outside to avoid recreation)
    const shuffleArray = (array) => {
        const shuffled = [...array]; // Create copy to avoid mutating original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const formatFirstAirDate = (dateString) => {
        const options = { year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ID', options).replace(/,/g, '');
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container">
                <Carousel
                    title="Now Airing Series"
                    data={nowAiring}
                    formatDate={formatFirstAirDate}
                    loading={false}
                    linkPrefix="/tv"
                />
                <Carousel
                    title="Popular Series"
                    data={popular}
                    formatDate={formatFirstAirDate}
                    loading={false}
                    linkPrefix="/tv"
                />
                <Carousel
                    title="Top Rated Series"
                    data={topRated}
                    formatDate={formatFirstAirDate}
                    loading={false}
                    linkPrefix="/tv"
                />
            </div>
            <Footer className="mt-4" />
        </>
    );
};

export default SeriesList;