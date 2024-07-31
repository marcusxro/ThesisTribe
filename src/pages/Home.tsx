import React, { useRef } from 'react'
import Header from '../comp/Header'
import { useNavigate } from 'react-router-dom'
import { MdArrowOutward } from "react-icons/md";
import Spline from '@splinetool/react-spline';
import articleVid from '../vids/Articlevid.mp4'
import { MdArticle } from "react-icons/md";
import { MdLibraryBooks } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Home = () => {
    const nav = useNavigate()
    const scrollToRef = useRef<HTMLDivElement | null>(null);
    const infoRef = useRef<HTMLDivElement | null>(null);


    const scrollToElement = () => {
        if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className=''>
            <Header bookSee={false} inputSee={false} locString={'Home'} />


            <div className='h-auto w-full px-4 mx-auto relative'>

                <div className='h-[80dvh] flex flex-col items-center justify-center md:h-[100vh]'>
                    <div className='absolute w-full h-full goLow'>
                        <Spline scene="https://prod.spline.design/CJ7b0OdSMJGeC6AB/scene.splinecode" />
                    </div>
                    <div className='xText flex flex-col relative z-20'>
                        <div className='txt flex'>
                            <div>FIND KNOWLEDGE.</div>
                        </div>
                        <div className='txt flex h-full items-center justify-center gap-3'>
                            <div className='imgT'></div>
                            <div>
                                READ MORE.
                            </div>
                        </div>

                    </div>
                    <div className='mt-5 relative z-20'>
                        <p className='w-full max-w-[100%] mx-auto text-center text-gray-600 sm:max-w-[60%]'>
                            Access a rich collection of scholarly articles and curated books. Our platform simplifies discovering and expanding your knowledge with essential research and literary resources.
                        </p>
                    </div>
                    <div className='mt-5 flex gap-3 relative z-20'>
                        <button
                            onClick={() => { scrollToElement() }}
                            className='bg-[#292929] py-2 px-5 rounded-lg font-sans text-white  hover:bg-gray-800'>
                            Try it now!
                        </button>
                        <button
                            onClick={() => { nav('/sign-up') }}
                            className='bg-[#292929] py-2 px-5 rounded-lg font-sans text-white flex items-center gap-2  hover:bg-gray-800' >
                            Join us <MdArrowOutward />
                        </button>
                    </div>
                </div>


            </div>
            <div className='h-auto p-4'>
                <div className='w-full max-w-[1200px] mx-auto pt-[50px] h-full'>
                    <div 
                    ref={infoRef}
                    className='text-center font-bold text-3xl text-gray-800'>WHAT WE CAN DO TOGETHER</div>
                    <div className='text-center font-bold text-sm text-gray-400'>Here's the list of our capabilities</div>

                    <div className='w-full  h-full mt-5 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-5'>

                        <div className='w-auto h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col gap-3'>
                            <div className='font-bold text-2xl'>Comprehensive Article Search</div>
                            <p className='text-gray-500'>Access an extensive database of scholarly articles across various disciplines, making research easy and efficient.</p>
                        </div>
                        <div className='w-auto h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col gap-3'>
                            <div className='font-bold text-2xl'>Curated Book Library</div>
                            <p className='text-gray-500'>Browse and discover a wide range of curated books, tailored to enhance your reading experience.</p>
                        </div>
                        <div className='w-auto h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col gap-3'>
                            <div className='font-bold text-2xl'>Advanced Filtering Options</div>
                            <p className='text-gray-500'>Utilize powerful filters to narrow down search results and find precisely what you need with ease.</p>
                        </div>
                        <div className='w-auto h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col gap-3'>
                            <div className='font-bold text-2xl'>Save and Manage Favorites</div>
                            <p className='text-gray-500'>Save articles and books to your personal library for quick access and future reference.</p>
                        </div>
                        <div className='w-auto h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col gap-3'>
                            <div className='font-bold text-2xl'>Personalized Recommendations</div>
                            <p className='text-gray-500'>Receive tailored recommendations based on your search history and saved items to discover new and relevant content.</p>
                        </div>
                        <div className='w-auto h-full bg-[#292929] rounded-lg p-5 text-white flex flex-col gap-3'>
                            <div className='font-bold text-2xl'>Seamless Data Integration</div>
                            <p className='text-gray-500'>Store and manage your saved research and reading materials in a centralized database for easy retrieval and organization.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-auto p-4 mt-[50px]'>
                <div className='w-full max-w-[1200px] mx-auto pt-[50px] h-full'>
                    <div className='text-center font-bold text-3xl text-gray-800'>Searching articles has never been easier.</div>
                    <div className='text-center font-bold text-sm text-gray-400'>Effortlessly discover the essential articles you need for your research, all in one place!</div>
                    <div className='h-full w-full overflow-hidden mt-5 rounded-lg border-[1px] border-[#bdbcbc]'>
                        <video className='w-full h-full' src={articleVid} autoPlay muted loop></video>
                    </div>
                </div>
            </div>
            <div className='h-auto p-4 mt-[50px] mb-[50px]'>
                <div
                    ref={scrollToRef}
                    className='w-full max-w-[1200px] mx-auto pt-[50px] h-full flex flex-col items-center'>
                    <div className='text-center font-bold text-3xl text-gray-800'>Use ThesisTribe now!</div>
                    <div className='text-center w-[70%] mx-auto font-medium text-lg text-gray-600 mt-2'>
                        Enhance your research experience with powerful tools for finding, organizing, and managing academic materials. Start using ThesisTribe today to streamline your research process and improve your productivity.
                    </div>

                    <div className='h-[230px] w-full mt-5 flex gap-4'>
                        <div
                            onClick={() => { nav('/article') }}
                            className='cursor-pointer w-full  hover:bg-gray-800 gap-3 h-full font-semibold bg-[#1e3a97] rounded-lg flex items-center justify-center text-white text-sm p-3 text-center'>
                            <MdArticle /> ARTICLE FINDER
                        </div>
                        <div
                            onClick={() => { nav('/book-finder') }}
                            className='w-full cursor-pointer hover:bg-gray-800  gap-3 h-full font-semibold bg-[#292929] rounded-lg flex items-center justify-center text-white text-sm p-3 text-center'>
                            <MdLibraryBooks />  BOOK FINDER
                        </div>
                    </div>
                </div>
            </div>

            <div className='h-auto p-4 mb-[50px]'>
                <div className='w-full max-w-[1200px] mx-auto pt-[50px] h-full flex flex-col items-center'>
                    <div className='text-center font-bold text-3xl text-gray-800'>Want to be part of the development?</div>
                    <div className='text-center w-[70%] mx-auto font-medium text-lg text-gray-600 mt-2'>
                        Help us enhance our website by contributing your ideas and skills. Your input will improve our features, fix issues, and make the platform more user-friendly for everyone
                    </div>
                    <div
                        onClick={() => { window.location.href = "mailto:marcussalopaso1@gmail.com?subject=Hello&body=Let's work?"; }}
                        className='mt-4 py-2 px-5 bg-[#292929] hover:bg-gray-700  rounded-lg text-white flex gap-3 items-center cursor-pointer'>
                        Message the Dev <MdArrowOutward />
                    </div>
                </div>
            </div>

            <div className='h-auto p-4 mb-[50px]'>
                <div className='w-full max-w-[1200px] mx-auto pt-[50px] h-full flex border-t-[1px] border-t-[#888] items-center justify-between'>
                    <div>©2024-ThesisTribe</div>
                    <div className='flex gap-3'>
                        <div
                            onClick={() => { window.open('https://github.com/marcusxro', '_blank') }}
                            className='cursor-pointer text-[#292929]'><FaGithub /></div>
                        <div
                            onClick={() => { window.open('https://www.facebook.com/marcuss09', '_blank') }}
                            className='cursor-pointer text-[#292929]'><FaFacebook /></div>
                        <div
                            onClick={() => { window.open('https://www.tiktok.com/@marcuxro', '_blank') }}
                            className='cursor-pointer text-[#292929]'><FaTiktok /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
