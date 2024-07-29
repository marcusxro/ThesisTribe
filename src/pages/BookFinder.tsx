import axios from 'axios'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import Header from '../comp/Header';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";


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
        <div className='h-screen w-full p-2 flex flex-col justify-between'>
            <Header inputSee={false} bookSee={false} />
            <div className='w-full min-h-[400px] h-[80vh] flex items-center flex-col justify-center gap-5 md:h-[50vh]'>
                <div>
                    <h1 className='text-[#292929] text-[3rem] font-bold text-center'>
                        BOOK-FINDER
                    </h1>
                    <h3 className='text-[#292929] text-md font-medium text-center'>
                        Your gateway to 74,000+ educational books and resources
                    </h3>
                </div>
                <form
                    className='flex items-center justify-center w-full flex-col'
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
                    <div className='text-center mt-3'>
                        Recommended: <span className='font-bold'>The Reign of Greed</span>
                    </div>
                </form>
            </div>
            <footer className='h-auto p-3 flex flex-col justify-between gap-3 xl:h-[70vh'>
                <div className='h-full w-full gap-2 grid grid-cols-2 md:flex md:justify-between'>
                    <div className='w-full h-full bg-[#292929]  rounded-lg p-5 text-white flex flex-col justify-between items-start'>
                        <div>
                            <div className='font-bold text-2xl mb-3'>Extensive Collection</div>
                            <p className='text-[12px] lg:text-[17px] md:text-[13px]'>
                                Access a comprehensive library of 74,000
                                academic books spanning various disciplines and subjects.
                                Whether you are looking for texts in science, technology,
                                humanities, social sciences, or any other field, BookFinder
                                offers an unparalleled repository of knowledge to support your research and learning needs.
                            </p>
                        </div>
                        <button className='mt-5 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn more</button>
                    </div>
                    <div className='w-full h-full bg-[#292929]  rounded-lg p-5 text-white flex flex-col justify-between items-start'>
                        <div>
                            <div className='font-bold text-2xl mb-3'>Advanced Search</div>
                            <p className='text-[12px] lg:text-[17px] md:text-[13px]'>
                                Utilize powerful and intuitive search tools to quickly locate
                                specific books, authors, or topics within our extensive database.
                                Our advanced filtering options allow you to refine your search
                                by publication date, subject, author, and more, ensuring you find
                                the most relevant resources with ease.
                            </p>
                        </div>
                        <button className='mt-5 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn more</button>

                    </div>
                    <div
                    id='legnthen'
                     className='col-span-2 w-[100%] h-full bg-[#292929]  rounded-lg p-5 text-white flex flex-col justify-between items-start'>
                        <div>
                            <div className='font-bold text-2xl mb-3'>Seamless Access</div>
                            <p className='text-[12px] lg:text-[17px] md:text-[13px]'>
                                Enjoy instant access to a wealth of information, including full texts,
                                abstracts, and detailed bibliographic records. BookFinder ensures that
                                you can efficiently retrieve and utilize academic resources, whether for
                                in-depth study, reference, or citation, supporting your academic and
                                research endeavors comprehensively.
                            </p>
                        </div>
                        <button className='mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn more</button>

                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-1'>
                    <div className='text-[#292929]'>Support the Developer</div>
                    <div className='flex gap-3'>
                        <div className='cursor-pointer text-[#292929]'><FaGithub /></div>
                        <div className='cursor-pointer text-[#292929]'><FaFacebook /></div>
                        <div className='cursor-pointer text-[#292929]'><FaTiktok /></div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default BookFinder
