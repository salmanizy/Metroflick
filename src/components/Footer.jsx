import React from "react";

const Footer = ({ className = "" }) => {
  return (
    <footer className={`bg-dark text-light py-4 mt-5 ${className}`}>
      <div className="text-center">
        <p className="mb-2">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>

        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
            alt="TMDB Logo"
            height="40"
            className="opacity-75 tmdb-footer-logo"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;