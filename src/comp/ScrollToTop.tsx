import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop:React.FC = () => {
    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [location]);


    return (
        <></>
    )

}

export default ScrollToTop
