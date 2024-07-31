import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useLocation, useParams } from 'react-router-dom'
import Header from '../comp/Header'
import { FaArrowCircleUp } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { onAuthStateChanged, SignInMethod } from 'firebase/auth';
import { authKey, firestoreKey } from '../firebase/FirebaseKey';
import IsUser from '../comp/IsUser';
import SignInModal from '../comp/SignInModal';
import SaveModal from '../comp/SaveModal';

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    DocumentData
} from 'firebase/firestore';

import SaveBookModal from '../comp/SaveBookModal';

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

interface DataType {
    id: string;
    Uid: string;
    name: string;
    MyCollection: any;
    MyBook: ResultType[]
}


const ViewBook: React.FC = () => {
    const [user] = IsUser()
    const [isSaveBook, setIsSaveBook] = useState<boolean | null>(false)
    const params = useParams()
    const bookid = params?.bookID
    const [bookData, setBookData] = useState<OuterData | null>(null);
    const [bookArr, setBookArr] = useState<OuterData | null>(null);
    const [filteredBooks, setFilteredBooks] = useState<ResultType[] | null | undefined>([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bookQuery = queryParams.get('bookQuery');

    const [data, setData] = useState<DataType[]>([]);
    const [filteredArr, setFilteredArr] = useState<DataType[]>([]);
    const [isSaved, setIsSaved] = useState<boolean>(false);





    useEffect(() => {
        if (user) {
            console.log("there is user")
            const fetchData = async () => {
                try {
                    const querySnapshot = await getDocs(collection(firestoreKey, 'userCollectionOfSave'));
                    const dataList: DataType[] = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    })) as DataType[];
                    setData(dataList);
                    setFilteredArr(dataList.filter((itm) => itm.Uid === user?.uid));

                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            };

            fetchData();
        }
    }, [user, isSaveBook]);



    useEffect(() => {

        const headers = {
            "x-apihub-key": "K1rKPUJ4N7xguMsHd6qCqyM7k5gJNo6ytuw6vTmwFQmt44YaM6",
            "x-apihub-host": "Ebook-Metadata-API.allthingsdev.co",
            "x-apihub-endpoint": "b6b8c575-3f0d-43cd-8924-26b2cf72e37d"
        };


        axios.get(`https://Ebook-Metadata-API.proxy-production.allthingsdev.co/books/?ids=${bookid}`, { headers })
            .then((response) => {
                setBookData(response.data)
            })
            .catch((error) => {
                console.error(error)
            });
    }, [])

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

    const [pushedSearch, setPushedSearch] = useState<boolean>(false)

    useEffect(() => {
        if (!bookQuery) {
            return
        }
        setPushedSearch(true)

        const headers = {
            "x-apihub-key": "K1rKPUJ4N7xguMsHd6qCqyM7k5gJNo6ytuw6vTmwFQmt44YaM6",
            "x-apihub-host": "Ebook-Metadata-API.allthingsdev.co",
            "x-apihub-endpoint": "b6b8c575-3f0d-43cd-8924-26b2cf72e37d"
        };


        axios.get(`https://Ebook-Metadata-API.proxy-production.allthingsdev.co/books/?search=${bookQuery}&page=1`, { headers })
            .then((response) => {
                setBookArr(response.data)

                const filteredData = bookArr?.results.filter((itm) => {
                    if (bookData != null) {
                        return !bookData.results.some((existingItem) => existingItem.title === itm.title);
                    }
                    return true;
                });

                setFilteredBooks(filteredData && filteredData);

                console.log(filteredData)
                console.log(response.data)

                setPushedSearch(false)
            })
            .catch((error) => {
                console.error(error)
            });
    }, [bookQuery])




    function visitByID(stringSearch: string | number) {
        if (bookQuery) {
            // Encode the bookQuery to make it URL-safe
            const encodedBookQuery = encodeURIComponent(bookQuery);
            window.open(`/searched-book/${stringSearch}?bookQuery=${encodedBookQuery}`, '_blank');
        }
    }



    const isItemSaved = (response: any) => {
        return data?.some((userItem: any) => {
            if (userItem.Uid === user?.uid) {
                if (userItem?.MyBook) {
                    return userItem?.MyBook.some((collectionItem: any) => {
                        if (collectionItem.id === response.id) {
                            return true;
                        }
                        return false;
                    });
                }
            }
            return false;
        });
    };




    return (
        <div className='relative'>
            <Header inputSee={false} bookSee={true} />

            {user?.emailVerified && isSaveBook &&
                <div
                    onClick={() => { setIsSaveBook(false) }}
                    className='custom-pos h-[100dvh] z-[200000000] items-center flex justify-center'>

                    <div
                        className='w-full max-w-[400px] overflow-hidden rounded-lg'
                        onClick={(e) => { e.stopPropagation() }}>
                        <SaveBookModal objectItem={bookData?.results[0] as ResultType} closer={setIsSaveBook} />
                    </div>
                </div>
            }
            {
                isSaveBook && !user &&
                <div
                    onClick={() => {
                        setIsSaveBook(false)
                    }}
                    className='custom-pos h-[100dvh] z-[200000000] items-center flex justify-center'>
                    <div
                        className='max-w-[400px] w-full'
                        onClick={(e) => { e.stopPropagation() }}>
                        <SignInModal isDataSave={true} />
                    </div>
                </div>
            }
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
                    bookData != null && bookData?.results?.map((itm) => (
                        <div
                            key={itm.id}
                            className='gap-8 w-full h-full flex flex-col max-w-[1200px] mx-auto md:flex-row bg-gray-300 p-5 rounded-lg text-black'>
                            <div className='book rounded-lg w-full max-w-[200px] h-[100%] max-h-[600px] overflow-hidden md:max-w-[300px]'>
                                <img
                                    className='h-full w-full object-contain'
                                    src={itm.formats['image/jpeg']} alt="" />
                            </div>
                            <div className='flex flex-col w-full items-start'>
                                <div className='text-xl font-bold'>
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
                        {
                            user && bookData?.results.some(userItem => {
                                const isSaved = isItemSaved(userItem);
                                return isSaved;
                            }) ? (
                                <button
                                onClick={() => { setIsSaveBook(true) }}
                                className='py-1 px-2 bg-green-500 rounded-lg text-white'>
                                Saved
                            </button>
                            ) : (
                                <button
                                onClick={() => { setIsSaveBook(true) }}
                                className='py-1 px-2 bg-slate-500 rounded-lg text-white'>
                                Save Book
                            </button>
                            )
                        }
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

            <div>
                <div className='flex flex-col h-full w-full classer'>
                    {
                        filteredBooks && filteredBooks?.length === 0 && bookData != null && pushedSearch && bookData?.results && bookData?.results.length > 0 ?
                            <div className='w-full h-[50vh] flex items-center justify-center max-w-[1200px] mx-auto  flex-col gap 1'>
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
                                <div className='text-gray-500 text-[13px]'>
                                    Searching for relevant books
                                </div>
                            </div>
                            :
                            <>
                                {
                                    filteredBooks?.length === 0 && !pushedSearch ?
                                        <div className='w-full h-full p-4'>
                                            <div className='font-bold m-3 text-[#292929] w-full h-[50vh]  max-w-[1200px] mx-auto mt-3  rounded-lg px-3 flex items-center justify-center bg-gray-300'>
                                                No relevant results found
                                            </div>
                                        </div>
                                        :
                                        <>

                                            <div className='w-full  max-w-[1200px] mx-auto text-xl font-bold px-4 py-2'>
                                                You might wanna like
                                            </div>
                                            <div className='w-full h-full
                                                max-w-[1200px]
                                              text-black p-2 grid grid-cols-2 
                                                mx-auto
                                                sm:grid-cols-2  
                                                md:grid-cols-3
                                                lg:grid-cols-4 
                                                xl:grid-cols-4 gap-5'>
                                                { }

                                                {
                                                    bookArr?.results
                                                        ?.filter((itmz) => (bookData != null && !bookData.results.some(existing => existing.title === itmz.title)))
                                                        .map((book) => (
                                                            <div
                                                                onClick={() => { visitByID(book?.id) }}
                                                                className='flex flex-col h-full m-h-[500px] items-center justify-center' key={book.id}>
                                                                <div
                                                                    className='w-[90%] h-full  rounded-lg overflow-hidden flex items-center justify-center book cursor-pointer'>
                                                                    {book.formats['image/jpeg'] && <img src={book.formats['image/jpeg']} alt={`${book.title} cover`} className='w-full h-full object-contain mb-2' />}
                                                                </div>
                                                                <h2 className='text-sm mt-2 font-bold text-center w-full md:text-md'>
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
                                            </div>
                                        </>
                                }
                            </>
                    }


                </div>
            </div>
        </div>
    )
}

export default ViewBook
