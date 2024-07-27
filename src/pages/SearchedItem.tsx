import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../comp/Header';

interface Author {
    name: string;
    affiliation?: string;
    family: string;
    given: string;
    sequence: string;
}

interface ResponseObject {
    best_oa_location: any;
    data_standard: number;
    doi: string;
    doi_url: string;
    first_oa_location: any;
    genre: string;
    has_repository_copy: boolean;
    is_oa: boolean;
    is_paratext: boolean;
    journal_is_in_doaj: boolean;
    journal_is_oa: boolean;
    journal_issn_l: string;
    journal_issns: string;
    journal_name: string;
    oa_locations: any[];
    oa_locations_embargoed: any[];
    oa_status: string;
    published_date: string;
    publisher: string;
    title: string;
    updated: string;
    year: number;
    z_authors: Author[];
}

interface DataObject {
    response: ResponseObject;
    score: number;
    snippet: string;
}

const SearchedItem: React.FC = () => {
    const [isChangePage, setISChangePage] = useState<boolean>(false)
    const params = useParams()
    const location = useLocation()

    const [seeInput, setSeeInput] = useState<boolean>(false)

    useEffect(() => {
        if (location?.pathname.includes('/search/')) {
            setSeeInput(true)
        } else {
            setSeeInput(false)
        }
    }, [location, seeInput])

    const [dataObject, setDataObject] = useState<DataObject[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [noRes, setNoRes] = useState<boolean>(false)

    useEffect(() => {
        if (!params?.query) {
            alert("No search value");
            return;
        }
        const baseURL = 'https://api.unpaywall.org/v2/search';
        const pageSize = 50;
        const email = 'unpaywall_01@gmail.com';

        async function fetchPage(query: string, page = 1) {
            try {
                setNoRes(false)
                const response = await axios.get(baseURL, {
                    params: {
                        query: query,
                        email: email,
                        page: params?.page && !isChangePage ? params?.page : page,
                        pageSize: pageSize
                    }
                });

                const { results, total_results } = response.data;

                const totalPages = Math.ceil(total_results / pageSize);

                console.log(totalPages)

                setDataObject(results);

                if (results.length === 0) {
                    setNoRes(true)
                }

                if (!response) {
                    alert("loading")
                }


                setTotalPages(totalPages);
                setCurrentPage(page);

            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        }
        fetchPage(params.query, currentPage);
    }, [params?.query, currentPage]);

    const nav = useNavigate()

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setNoRes(true)
    };

    const controls = {
        canGoBack: currentPage > 1,
        canGoForward: currentPage < totalPages,

        goBack: () => {
            const page = params?.page ? parseInt(params.page) : 1;
            const subtractOne = page - 1;
            if (page === 1) {
                return
            }
            nav(`/search/${params?.query}/${subtractOne}`)
            handlePageChange(currentPage - 1)
            window.scrollTo(0, 0)
            setNoRes(true)
            setISChangePage(true)
        },
        goForward: () => {
            const page = params?.page ? parseInt(params.page) : 1;
            const addedOne = page + 1;
            handlePageChange(currentPage + 1)
            window.scrollTo(0, 0)
            setNoRes(true)
            nav(`/search/${params?.query}/${addedOne}`)
            setISChangePage(true)
        }
    };
    const [arr, setArr] = useState<string[]>([])
    function pushArr(e: React.MouseEvent<HTMLDivElement, MouseEvent>, param: string) {
        e.stopPropagation()
        if (!arr.includes(param)) {
            setArr([...arr, param]);
        }
    }
    function closeAuthors(e: React.MouseEvent<HTMLDivElement, MouseEvent>, param: string) {
        e.stopPropagation()
        if (arr.includes(param)) {
            setArr(arr.filter(item => item !== param));
        }
    }
    const [nextPage, setNextPage] = useState<boolean>(true)
    useEffect(() => {
        if (!params?.query) {
            alert("No search value");
            return;
        }
        const pageStr = params?.page || '1'; 
        const page = parseInt(pageStr);
        const baseURL = 'https://api.unpaywall.org/v2/search';
        const pageSize = 50;
        const email = 'unpaywall_01@example.com';

        async function fetchPage(query: string, page: number) {
            try {
                setNoRes(false);
                const response = await axios.get(baseURL, {
                    params: {
                        query: query,
                        email: email,
                        page: page + 1,
                        pageSize: pageSize
                    }
                });
                const { results, total_results } = response.data;
                const totalPages = Math.ceil(total_results / pageSize);
                console.log(totalPages);
                setDataObject(results);
                if (results.length === 0) {
                    setNoRes(true);
                    setNextPage(false)
                } else {
                    console.log("THERES ANOTHER PAGE!")
                    setNextPage(true)
                }
                setTotalPages(totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        }
        fetchPage(params.query, page);
    }, [params?.query, params?.page, nextPage]);



    return (
        <div className='h-auto'>
            <Header inputSee={seeInput} />
            <div className='mt-[80px] w-full h-[50px] border-b-[1px] border-b-[#e6e6e6] flex items-center justify-start px-3 font-semibold md:px-7'>
                <div className='w-full max-w-[800px] flex justify-start items-center gap-[80px]'>
                    <div className='hidden md:block'>
                        Articles
                    </div>
                    <div className='text-gray-400 text-[12px]'>
                        {dataObject != null && dataObject.length} resuls for "{params?.query}"
                    </div>
                </div>

            </div>
            <section className='flex w-full h-auto px-4 pt-6 gap-[50px]'>
                <div className='hidden md:block'>
                    <select
                        className='bg-[#e6e6e6]  py-1 px-2 rounded-lg'>
                        <option value="">Filter by</option>
                        <option value="Date">Date</option>
                    </select>
                </div>
                <div className='flex flex-col gap-5 w-full justify-start items-start over'>
                    {
                        dataObject.length === 0 && noRes &&
                        <div className=''>
                            No Results, try searching other words
                        </div>
                    }
                    {
                        dataObject.length === 0 && !noRes &&
                        <div>
                            loading...
                        </div>
                    }

                    {
                        dataObject.map((itm, index) => (
                            <div
                                key={index}
                                onClick={() => { window.open(itm.response.doi_url, "_blank") }}
                                className='flex flex-col justify-start items-start border-b-[.1px] border-b-[#e6e6e6] pb-3 w-full max-w-[800px] overflow-hidden'>
                                <div className='font-semibold text-left cursor-pointer'>
                                    {itm.response.title}
                                </div>
                                <div className='text-gray-600 text-[14px]'>
                                    {itm.response.doi_url}
                                </div>
                                <div className='w-full flex  gap-1 pt-2 items-center'>
                                    <div className='text-[#888] text-left text-[12px]'>
                                        publisher: {itm.response.publisher},
                                    </div>
                                    <div className='font-medium text-[13px]'>
                                        {itm.response.year}
                                    </div>
                                </div>
                                <div className='text-[#888] text-left text-[12px]'>
                                    genre: {itm.response.genre}
                                </div>
                                <div className='text-[#888] text-left text-[12px]'>
                                    updated on: {itm.response.updated}
                                </div>
                                {
                                    itm.response.z_authors != null &&
                                    <div className='pt-3 flex gap-1 overflow-hidden'>
                                        <div className='text-gray-800 text-left text-[12px] font-semibold flex items-start justify-center'>
                                            authors:
                                        </div>
                                        <div className='grid gap-1 grid-cols-6'>
                                            {
                                                arr.includes(itm?.response?.doi_url) ?
                                                    itm.response?.z_authors?.map((authors, idx) => (
                                                        <div
                                                            key={idx}
                                                            className='bg-gray-200 text-[13px] px-1 rounded-md w-auto break-words overflow-hidden'>
                                                            {authors.family}, {authors?.given}
                                                        </div>
                                                    ))
                                                    :
                                                    itm.response?.z_authors?.slice(0, 5).map((authors, idx) => (
                                                        <div
                                                            key={idx}
                                                            className='bg-gray-200 text-[13px] px-1 rounded-md w-auto overflow-hidden items-center flex'>
                                                            {authors.family}
                                                        </div>
                                                    ))
                                            }
                                            {
                                                itm.response?.z_authors?.length > 5 &&
                                                <>
                                                    {
                                                        arr.includes(itm?.response?.doi_url) ?
                                                            <div
                                                                onClick={(e) => {
                                                                    closeAuthors(e, itm?.response?.doi_url)
                                                                }}
                                                                className='bg-gray-700 text-[13px] px-1 rounded-md text-white cursor-pointer'>
                                                                close
                                                            </div> :
                                                            <div
                                                                onClick={(e) => {
                                                                    pushArr(e, itm?.response?.doi_url)
                                                                }}
                                                                className='bg-gray-700 text-[13px] px-1 rounded-md text-white cursor-pointer'>
                                                                see all
                                                            </div>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        ))
                    }

                    {
                        dataObject.length != 0 &&
                        <>
                            <div className='flex gap-2'>
                                {
                                    params?.page && parseFloat(params?.page) > 1 &&
                                    <div
                                        className='flex gap-2'>
                                        <div
                                            onClick={controls.goBack}

                                            className='bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5'>
                                            ({params?.page && parseFloat(params?.page) - 1}) prev page
                                        </div>
                                    </div>
                                }
                                {
                                    nextPage &&

                                    <div
                                        onClick={controls.goForward}
                                        className='bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5'>
                                        next page     ({params?.page && parseFloat(params?.page) + 1})
                                    </div>
                                }
                            </div>
                        </>
                    }


                </div>

            </section>
        </div>
    )
}

export default SearchedItem
