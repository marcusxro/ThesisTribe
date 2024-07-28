import axios from 'axios'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Header from '../comp/Header';
import { CiSearch } from "react-icons/ci";
import { useNavigate, useParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll';
import { FaDownload } from "react-icons/fa";
import { FaArrowCircleUp } from "react-icons/fa";

interface AuthorArr {
    name: string;
    birth_year: number | null;
    death_year: number | null;
}

interface BookFormats {
    epub: string;
    zip: string;
    rdf: string;
    mobi: string;
    coverImage: string;
    html: string;
    htmlISO: string;
    plainTextISO: string;
    plainTextASCII: string;
    'application/epub+zip': string;
    'application/octet-stream': string;
    'application/rdf+xml': string;
    'application/x-mobipocket-ebook': string;
    'image/jpeg': string;
    'text/html': string;
    'text/plain; charset=us-ascii': string;
}

interface ResultType {
    authors: AuthorArr[];
    bookshelves: string[];
    copyright: boolean;
    download_count: number;
    formats: BookFormats;
    id: number;
    languages: string[];
    media_type: string;
    subjects: string[];
    title: string;
    translators: string[];
}

interface OuterData {
    count: number;
    next: string | null;
    previous: string | null;
    results: ResultType[];
}


const SearchedBook = () => {
    const params = useParams()
    const bookQuery = params?.bookQuery;
    const bookPage = params?.page

    const [stringVal, setStringVal] = useState<string>("")
    const [bookData, setBookData] = useState<OuterData | null>(null);
    const [pushedSearch, setPushedSearch] = useState<boolean>(false)
    const [nextBtn, setNext] = useState<string | null>(null)
    const [prev, setPrev] = useState<string | null>(null)
    const [postCount, setPostCOunt] = useState<number | null>(null)

    useEffect(() => {
        if (!bookQuery || !bookPage) {
            return
        }
        setPushedSearch(true)

        const headers = {
            "x-apihub-key": "K1rKPUJ4N7xguMsHd6qCqyM7k5gJNo6ytuw6vTmwFQmt44YaM6",
            "x-apihub-host": "Ebook-Metadata-API.allthingsdev.co",
            "x-apihub-endpoint": "b6b8c575-3f0d-43cd-8924-26b2cf72e37d"
        };

        console.log('bookpage:', bookPage)

        axios.get(`https://Ebook-Metadata-API.proxy-production.allthingsdev.co/books/?search=${bookQuery}&page=${bookPage}`, { headers })
            .then((response) => {
                setBookData(response.data)
                setPushedSearch(false)
                setPostCOunt(response.data.count)

                setNext(response.data.next ? 'response' : null)
                setPrev(response.data.previous ? 'response' : null)

                console.log(response.data.previous)


            })
            .catch((error) => {
                console.error(error)
            });

    }, [params?.bookQuery, nextBtn, prev])

    const [bestSearch, setBestSearch] = useState<ResultType[]>([]);

    useEffect(() => {
        if (bookData) {
            const filterBooks = bookData.results.filter((itm) =>
                itm.title.toLowerCase().includes(bookQuery?.toLowerCase() || "")
            );
            setBestSearch(filterBooks.slice(0, 20))
        }
    }, [bookData, bookQuery]);


    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [AutoScroll({ startDelay: 0, stopOnInteraction: false, speed: 1 })]
    );

    const nav = useNavigate()


    function nextFunc() {
        if (params) {
            const addedPage = bookPage && parseInt(bookPage) + 1
            nav(`/search-book/${params?.bookQuery}/${addedPage}`)
            window.location.reload()
            window.scrollTo(0,0)
        }
    }
    function prevFunc() {
        if (params) {
            if(bookPage && parseInt(bookPage) === 0){
                return
            }
            const addedPage = bookPage && parseInt(bookPage) - 1
            nav(`/search-book/${params?.bookQuery}/${addedPage}`)
            window.location.reload()


            window.scrollTo(0,0)
        }
    }

    return (

        <div className='w-full h-auto'>
            <Header inputSee={false} bookSee={true} />
            <div className='w-full h-full'>
                <div className='w-full max-w-[800px] font-semibold px-8 mb-1 border-b-[1px] border-b-[#e6e6e6]  py-3 mt-[80px] flex justify-between items-center gap-[80px] md:justify-start md:max-w-[100%]'>

                    <div className='hidden md:block'>
                        Books
                    </div>
                    <div className='text-gray-400 text-[12px] text-left'>


                        {pushedSearch ? 
                        <div>
                            Searching results for {params?.bookQuery}
                        </div> :
                        <div>
                                                    {!pushedSearch && postCount} resuls for "{params?.bookQuery}"
                        </div>
                    }
                    </div>
                    <div className='flex sm:hidden'>
                        <select
                            className='outline-none'
                        // value={slcVal}
                        // onChange={(e) => {onchangeInput(parseInt(e.target.value))}}
                        >
                            <option value="">YEAR</option>
                            <option
                                value="2024">Any Time</option>
                            <option
                                value="2024">2024</option>
                            <option
                                value="2023">2023</option>
                            <option
                                value="2022">2022</option>
                            <option
                                value="2021">2021</option>
                            <option
                                value="2020">2020</option>
                        </select>
                    </div>
                </div>


                {
                    pushedSearch ?
                        <div className='h-[100vh] w-full flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 44 44" stroke="#000">
                                <g fill="none" fill-rule="evenodd" stroke-width="2">
                                    <circle cx="22" cy="22" r="1">
                                        <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
                                        <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="22" cy="22" r="1">
                                        <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
                                        <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            </svg>
                        </div>
                        :
                        <div className='flex flex-col h-full w-full classer'>
                            <div className='w-full  max-w-[1200px] mx-auto text-xl font-bold px-4 py-2'>
                                For You
                            </div>

                            <div className="embla z-0 relative less" ref={emblaRef}>
                                <div className="embla__container">
                                    {
                                        bestSearch?.slice(0, 10).map((itm) => (
                                            <div className="embla__slide flex gap-3 justify-around bg-red-400 " key={itm.id}>
                                                <div className='rounded-xl overflow-hidden h-[100%] w-auto font-bold book'>
                                                    <img src={itm.formats['image/jpeg']} alt={`${itm.title} cover`} className='w-full h-full object-contain mb-2' />
                                                </div>
                                                <div className='h-[100%] flex flex-col justify-between'>
                                                    <div className='text-white font-bold w-[200px] h-auto flex items-start justify-start'>
                                                        {
                                                            itm.title
                                                        }
                                                    </div>
                                                    <div className='flex flex-col text-white'>

                                                        <div className='text-white flex gap-1 justify-between'>
                                                            Downloads:
                                                            <span className='gap-1 flex items-center justify-center bg-gray-700 text-white py-[1px] px-2 rounded-full'>
                                                                <span className='pb-[1px] text-[12px] flex items-center justify-center'><FaDownload /></span>
                                                                {itm.download_count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>
                            </div>

                            <div className='w-full  max-w-[1200px] mx-auto text-xl font-bold px-4 py-2'>
                                Browse
                            </div>
                            <div className='w-full h-full
                                max-w-[1200px]
                                text-black p-2 grid grid-cols-2 
                                mx-auto
                                sm:grid-cols-2  
                                md:grid-cols-3 
                                lg:grid-cols-4 
                                xl:grid-cols-4 gap-5'>
                                {
                                    bookData?.results.map((book) => (
                                        <div className='flex flex-col  p-4 h-[auto] items-center justify-center' key={book.id}>
                                            <div
                                                className='w-[90%] h-full  rounded-lg overflow-hidden flex items-center justify-center book cursor-pointer'>
                                                {book.formats['image/jpeg'] && <img src={book.formats['image/jpeg']} alt={`${book.title} cover`} className='w-full h-full object-contain mb-2' />}
                                            </div>
                                            <h2 className='text-lg font-bold text-center w-full'>
                                                {
                                                    book.title.length > 30 ?
                                                        book.title.slice(0, 30) + '...' :
                                                        book.title
                                                }
                                            </h2>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className='flex gap-2 w-full  max-w-[1200px]  mx-auto py-4 px-5'>
                                <div
                                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className='h-[30px] text-gray-700 text-3xl flex items-center justify-center hover:text-gray-950 cursor-pointer'>
                                    <FaArrowCircleUp />
                                </div>

                                {
                                    prev &&
                                    <div
                                        className='flex gap-2'>
                                        <div
                                             onClick={()=>{prevFunc()}}

                                            className='bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5  hover:bg-gray-950'>
                                            ({bookPage && parseFloat(bookPage) - 1}) prev page
                                        </div>
                                    </div>
                                }
                                {
                                    nextBtn &&
                                    <div
                                        onClick={()=>{nextFunc()}}
                                        className='bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5 hover:bg-gray-950'>
                                        next page     ({bookPage && parseFloat(bookPage) + 1})
                                    </div>
                                }
                            </div>
                        </div>
                }
            </div>

        </div>
    )
}

export default SearchedBook