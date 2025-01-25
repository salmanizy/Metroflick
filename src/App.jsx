// src/App.jsx  
import 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Navbar from './components/Navbar';  
import MovieList from './components/MovieList';  
import MovieDetail from './components/MovieDetail';
import CastDetail from './components/CastDetail';
import ActorList from './components/ActorList';
import SeriesList from './components/SeriesList';
import SeriesDetail from './components/SeriesDetail';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  
import 'bootstrap/dist/css/bootstrap.min.css';
  
function App() {
  return (  
    <Router>  
      <Navbar />
      <Routes>  
        <Route path="/" element={<MovieList />} />
        <Route path="/tv" element={<SeriesList />}/>
        <Route path="/tv/:id" element={<SeriesDetail />}/>
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/cast/:id" element={<CastDetail />} />
        <Route path="/actors" element={<ActorList/>}/>
      </Routes>  
    </Router>  
  );  
}  
  
export default App;  
