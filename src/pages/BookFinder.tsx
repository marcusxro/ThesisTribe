import axios from 'axios'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Header from '../comp/Header';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

interface authorArr {
    name: string,
    birth_year: any,
    death_year: any
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
}


interface resultType {
    authors: authorArr[];
    bookshelves: any,
    copyright: false,
    download_count: number,
    formats: BookFormats[],
    id: number,
    languages: string[],
    media_type: string,
    subjects: string[]
    title: string,
    translators: string[]
}

interface outerData {
    count: number,
    next: string,
    previous: any,
    result: resultType[]
}

const BookFinder: React.FC = () => {
    const [stringVal, setStringVal] = useState<string>("")
    const [bookData, setBookData] = useState<outerData[]>([])
    const [pushedSearch, setPushedSearch] = useState<boolean>(false)

    // <embed src={"https://www.gutenberg.org/ebooks/42149.html.images"} type="" className='h-full w-full' />

    const nav = useNavigate()

    function findBook(e: FormEvent) {
        e.preventDefault();
        setPushedSearch(true)
        nav(`/search-book/${stringVal}/${1}`)

    }



 

    return (
        <div className='h-screen w-full p-2'>
            <Header inputSee={false} bookSee={false} />
            <div className='w-full h-full flex items-center flex-col justify-center gap-5'>
                <h1 className='text-[#292929] text-3xl font-bold text-center'>
                    Your gateway to 74,000+ educational books and resources
                </h1>
                <form
                    className='flex items-center justify-center w-full'
                    onSubmit={findBook}
                    action="submit">
                    <div className='relative w-full w max-w-[700px] '>
                        <div className='positioner'>

                            {
                                pushedSearch && bookData.length === 0 ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 44 44" stroke="#000">
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
                                    :
                                    <CiSearch />
                            }
                        </div>
                        <input
                            value={stringVal}
                            onChange={(e) => { setStringVal(e.target.value) }}
                            className='w-full h-[50px] border-2 px-2 outline-none rounded-3xl bg-[#f9f9f9] pl-8 relative z-0'
                            type="text" placeholder='Search something...' />
                    </div>
                </form>
            </div>

        </div>
    )
}

export default BookFinder
