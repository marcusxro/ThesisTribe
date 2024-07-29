import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useParams } from 'react-router-dom'
import Header from '../comp/Header'

import { FaDownload } from "react-icons/fa";

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

const ViewBook: React.FC = () => {
    const params = useParams()
    const bookid = params?.bookID
    const [bookData, setBookData] = useState<OuterData | null>(null);


    useEffect(() => {

        const headers = {
            "x-apihub-key": "K1rKPUJ4N7xguMsHd6qCqyM7k5gJNo6ytuw6vTmwFQmt44YaM6",
            "x-apihub-host": "Ebook-Metadata-API.allthingsdev.co",
            "x-apihub-endpoint": "b6b8c575-3f0d-43cd-8924-26b2cf72e37d"
        };


        axios.get(`https://Ebook-Metadata-API.proxy-production.allthingsdev.co/books/?ids=${bookid}`, { headers })
            .then((response) => {
                console.log(response.data)
                setBookData(response.data)
            })
            .catch((error) => {
                console.error(error)
            });
    }, [])
    let embedLink;
    useEffect(() => {
        console.log(bookData?.results[0]?.formats['text/html'])
    }, [bookData])

    const [seeAll, setSeeAll] = useState<boolean>(false)
    const [isRead, setIsRead] = useState<boolean>(false)

    const [onLoad, setOnLoad] = useState<boolean>(true)
    const [errorOnLoad, setErrorOnLoad] = useState<boolean>(false)

    function handleLoad() {
        setOnLoad(false)
    }

    function handleError() {
        setErrorOnLoad(true)
    }

    
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = bookData?.results[0]?.formats['text/html'];
    const proxiedUrl = `${proxyUrl}${targetUrl}`;


    return (
        <div className='relative'>
            <Header inputSee={false} bookSee={true} />

            <div className='mt-[100px] w-full h-full px-5'>
                {
                    bookData === null &&
                    <div className='w-full h-[89vh] flex items-center justify-center'>
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
                }

                {
                  bookData != null &&  bookData?.results?.map((itm) => (
                        <div
                            key={itm.id}
                            className='gap-8 w-full h-full flex flex-col max-w-[1200px] mx-auto md:flex-row bg-gray-300 p-5 rounded-lg text-black'>
                            <div className='book rounded-lg w-full max-w-[200px] h-[100%] max-h-[600px] overflow-hidden md:max-w-[300px]'>
                                <img
                                    className='h-full w-full object-contain'
                                    src={itm.formats['image/jpeg']} alt="" />
                            </div>
                            <div className='flex flex-col w-full items-start'>
                                <div className='text-3xl font-bold'>
                                    {itm.title}
                                </div>


                                <div className='pt-2'>
                                    <div className='flex flex-wrap w-full max-w-[500px]  gap-1'>
                                        {
                                            seeAll ?
                                                <>
                                                    {
                                                        itm.subjects && itm.subjects.map((z) => (
                                                            <div
                                                                key={z}
                                                                className='text-[12px] bg-[#292929] py-1 px-2 text-white rounded-lg'>
                                                                {z}
                                                            </div>
                                                        ))
                                                    }
                                                </>
                                                :
                                                <>
                                                    {
                                                        itm.subjects && itm.subjects.slice(0, 5).map((z) => (
                                                            <div
                                                                key={z}
                                                                className='text-[12px] bg-[#292929] py-1 px-2 text-white rounded-lg'>
                                                                {z}
                                                            </div>
                                                        ))
                                                    }
                                                </>
                                        }
                                        {
                                            itm.subjects.length > 5 &&
                                            <div
                                                onClick={() => { setSeeAll(prevs => !prevs) }}
                                                className='text-[12px] bg-gray-700 cursor-pointer py-1 px-2 text-white rounded-lg'>
                                                {
                                                    seeAll ? "Close" : 'See All'
                                                }
                                            </div>
                                        }
                                    </div>


                                    <div className='flex gap-2 flex-wrap  mt-5'>
                                        <div>
                                            Download as:
                                        </div>
                                        <div
                                            onClick={() => {
                                                window.open(itm.formats?.['application/epub+zip'])
                                            }}
                                            className='cursor-pointer'>
                                            <span className='bg-gray-400 py-1 px-2 rounded-lg text-white'>EPUB</span>
                                        </div>
                                        <div
                                            onClick={() => {
                                                window.open(itm.formats?.['application/octet-stream'])
                                            }}
                                            className='cursor-pointer'>
                                            <span className='bg-gray-400 py-1 px-2 rounded-lg text-white'>ZIP</span>
                                        </div>
                                        <div
                                            onClick={() => {
                                                window.open(itm.formats?.['application/x-mobipocket-ebook'])
                                            }}
                                            className='cursor-pointer'>
                                            <span className='bg-gray-400 py-1 px-2 rounded-lg text-white'>MOBI</span>
                                        </div>
                                    </div>

                                </div>
                                {
                                    itm.authors &&
                                    <div className='mt-3 flex gap-2'>
                                        <div className='font-semibold'>
                                            {itm.authors.length > 1 ? 'Authors:' : 'Author:'}
                                        </div>
                                        <div className='flex flex-wrap gap-2'>
                                            {
                                                itm.authors && itm.authors.map((x) => (
                                                    <div key={x.name}>
                                                        {x.name}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                }
                                <div className='flex w-full gap-3 items-center mt-auto justify-between pt-3'>
                                    <div className='flex items-center gap-1'>
                                        Copyright: <span className='flex items-center bg-[#292929] py-[1px] px-2 text-white rounded-lg gap-1'>
                                            {itm?.copyright ? "True" : "False"}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        Downloads:
                                        <span className='flex items-center bg-[#292929] py-[1px] px-2 text-white rounded-lg gap-1'>
                                            <FaDownload className='pb-[1px]' />{itm?.download_count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                }

            </div>
            {
                bookData &&
                <div className='p-5'>
                    <div className='w-full max-w-[1200px] mx-auto  flex  gap-3 md:px-0'>
                        <button
                            onClick={() => { setIsRead(prevs => !prevs) }}
                            className='py-1 px-2 bg-slate-500 rounded-lg text-white'>
                            Read Book
                        </button>
                        <button className='py-1 px-2 bg-slate-500 rounded-lg text-white'>
                            Save Book
                        </button>
                    </div>
                </div>
            }
            {
                isRead &&
                <div
                    onClick={() => { setIsRead(false) }}
                    className='modalPos rounded-lg overflow-hidden flex flex-col'>
                    <div
                        onClick={() => { setIsRead(false); }}
                        className='absolute cursor-pointer top-1 left-1 bg-[#292929] w-[30px] h-[30px] rounded-full text-white flex items-center justify-center'>
                        X
                    </div>
                    {
                        onLoad &&
                        <div className='w-full h-full flex items-center justify-center'>
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
                    }
                    <embed
                        onClick={(e) => { e.stopPropagation() }}
                        className='bg-[#e6e6e6] w-full h-full z-10 text-white'
                        src={bookData?.results[0]?.formats['text/html']?.replace('http://', 'https://')}
                        onLoad={handleLoad}
                        onError={handleError}
                        type="" />
                </div>
            }
        </div>
    )
}

export default ViewBook
