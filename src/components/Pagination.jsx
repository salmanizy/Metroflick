// src/components/Pagination.jsx  
import React from 'react';  
import { useSearchParams } from 'react-router-dom';  
  
const Pagination = ({ currentPage, totalPages, handlePageChange }) => {  
    const [searchParams, setSearchParams] = useSearchParams();  
  
    const changePage = (page) => {  
        if (page >= 1 && page <= totalPages) {  
            handlePageChange(page);  
        }  
    };  
  
    return (  
        <nav aria-label="Page navigation">  
            <ul className="pagination d-flex justify-content-center mt-4 align-items-center">  
                <li className="page-item">  
                    <a   
                        className="page-link border-0 text-white bg-black" style={{outline:"none",boxShadow: "none"}}   
                        href={`?page=${currentPage / currentPage}`}   
                        aria-label="First"   
                        onClick={(e) => {    
                            e.preventDefault();    
                            changePage(currentPage / currentPage);    
                        }}
                        disabled={currentPage === 1}  
                    >  
                        <i className="bi bi-caret-left text-white"></i>        
                    </a>  
                </li>  
  
                {currentPage > 2 && (  
                    <li className="page-item">  
                        <a className="page-link border-0 text-white bg-dark" style={{outline:"none",boxShadow: "none"}} href={`?page=${currentPage - 2}`} onClick={(e) => { e.preventDefault(); changePage(currentPage - 2); }}>  
                            {currentPage - 2}  
                        </a>  
                    </li>  
                )}  
                {currentPage > 1 && (  
                    <li className="page-item">  
                        <a className="page-link border-0 text-white bg-dark" style={{outline:"none",boxShadow: "none"}} href={`?page=${currentPage - 1}`} onClick={(e) => { e.preventDefault(); changePage(currentPage - 1); }}>  
                            {currentPage - 1}  
                        </a>  
                    </li>  
                )}  
  
                <li className="page-item active z-0">  
                    <span className="page-link border-0 fw-semibold text-white bg-secondary">{currentPage}</span>  
                </li>  
  
                {currentPage < totalPages && (  
                    <li className="page-item">  
                        <a className="page-link border-0 text-white bg-dark" style={{outline:"none",boxShadow: "none"}} href={`?page=${currentPage + 1}`} onClick={(e) => { e.preventDefault(); changePage(currentPage + 1); }}>  
                            {currentPage + 1}  
                        </a>  
                    </li>  
                )}  
                {currentPage < totalPages - 1 && (  
                    <li className="page-item">  
                        <a className="page-link border-0 text-white bg-dark" style={{outline:"none",boxShadow: "none"}} href={`?page=${currentPage + 2}`} onClick={(e) => { e.preventDefault(); changePage(currentPage + 2); }}>  
                            {currentPage + 2}  
                        </a>  
                    </li>  
                )}  
  
                <li className="page-item">  
                    <a   
                        className="page-link border-0 text-white bg-black" style={{outline:"none",boxShadow: "none"}}   
                        href={`?page=${totalPages}`}   
                        aria-label="Next"   
                        onClick={(e) => {    
                            e.preventDefault();    
                            changePage(totalPages);    
                        }}   
                        disabled={currentPage === totalPages}  
                    >  
                        <i className="bi bi-caret-right text-white"></i>        
                    </a>  
                </li>  
            </ul>  
        </nav>  
    );  
};  
  
export default Pagination; // Ensure this line is present  
