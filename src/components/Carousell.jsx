import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { Pagination, Navigation } from 'swiper/modules';
import '../style/Carousell.css';

const Carousel = ({ title, data, formatDate, loading, linkPrefix }) => {
    const swiperRef = useRef(null);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div className="carousel-section mt-3">
            <div>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h2 className="category-title text-light m-0">{title}</h2>
                    <div className="carousel-controls d-none d-md-flex">
                        <button 
                            className='btn-carousel prev' 
                            onClick={() => swiperRef.current?.slidePrev()}
                            aria-label="Previous slide"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button 
                            className='btn-carousel next' 
                            onClick={() => swiperRef.current?.slideNext()}
                            aria-label="Next slide"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="position-relative carousel-wrapper">
                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    slidesPerView={3}
                    spaceBetween={8}
                    grabCursor={true}
                    loop={data.length > 6} // Only enable loop if enough items
                    loopAdditionalSlides={2}
                    modules={[Pagination, Navigation]}
                    breakpoints={{
                        320: { 
                            slidesPerView: 3.5, 
                            spaceBetween: 8,
                        },
                        576: { 
                            slidesPerView: 3.5, 
                            spaceBetween: 10,
                        },
                        768: { 
                            slidesPerView: 4.5, 
                            spaceBetween: 12,
                        },
                        992: { 
                            slidesPerView: 5.5, 
                            spaceBetween: 14,
                        },
                        1200: { 
                            slidesPerView: 6.5, 
                            spaceBetween: 16,
                        },
                    }}
                    className="netflix-swiper"
                >
                    {data.map(item => (
                        <SwiperSlide key={item.id}>
                            <Link to={`${linkPrefix}/${item.id}`} className='movie-card-link'>
                                <div className='movie-card'>
                                    <div className='movie-poster'>
                                        <img
                                            loading="lazy"
                                            src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750/242424/454545?text=No+Image'}
                                            alt={item.title || item.name}
                                            className="poster-img"
                                        />
                                        <div className="poster-overlay">
                                            <div className="overlay-content">
                                                <h6 className="movie-title-overlay">{item.title || item.name}</h6>
                                                <span className="movie-year">
                                                    {item.release_date || item.first_air_date ? formatDate(item.release_date || item.first_air_date) : 'TBA'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Carousel;