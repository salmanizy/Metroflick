import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { Pagination, Navigation } from 'swiper/modules';

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
        <div className="container">
            <div className='d-flex justify-content-between'>
            <h2 className="mt-4 category text-light-emphasis align-self-center">{title}</h2>

            <div className="carousel-controls align-self-center mt-4">
                <button className='fs-3 border border-0 bg-transparent' onClick={() => swiperRef.current?.slidePrev()}>
                    <i class="bi bi-arrow-left-square-fill"></i>
                </button>
                <button className='fs-3 pe-0 border border-0 bg-transparent' onClick={() => swiperRef.current?.slideNext()}>
                    <i class="bi bi-arrow-right-square-fill"></i>
                </button>
            </div>
            </div>

            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={1}
                spaceBetween={10}
                grabCursor={true}
                loop={true}
                modules={[Pagination, Navigation]}
                breakpoints={{
                    '@0.00': { slidesPerView: 1, spaceBetween: 20 },
                    '@0.75': { slidesPerView: 2, spaceBetween: 20 },
                    '@1.00': { slidesPerView: 3, spaceBetween: 20 },
                    '@1.50': { slidesPerView: 4.5, spaceBetween: 20 },
                }}
                className="mySwiper"
            >
                {data.map(item => (
                    <SwiperSlide key={item.id}>
                        <Link to={`${linkPrefix}/${item.id}`} className='card bg-dark'>
                            <div className='imgCanvas'>
                                <img
                                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://fakeimg.pl/500x750/242424/454545?text=No+Image&font=bebas'}
                                    alt={item.title || item.name}
                                    className="card-img-top"
                                />
                            </div>
                            <div className="card-body bg-dark">
                                <h5 className="card-title text-light text-truncate text-nowrap">{item.title || item.name}</h5>
                                <p className='text-white-50 font-monospace text-truncate text-nowrap'>
                                    {item.release_date || item.first_air_date ? formatDate(item.release_date || item.first_air_date) : 'Release date not available'}
                                </p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Carousel;
