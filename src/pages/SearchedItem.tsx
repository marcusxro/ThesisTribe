import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../comp/Header';
import { FaArrowCircleUp } from "react-icons/fa";
import CiteComp from '../comp/CiteComp';


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
                setDataObject(results);
                localStorage.setItem('savedObject', JSON.stringify(results))

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
    }, [params?.query]);

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
                setDataObject(results);
                if (results.length === 0) {
                    setNoRes(true);
                    setNextPage(false)
                } else {
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


    const [filterVal, setFilterVal] = useState<string>('')

    const [DateVal, setDateVal] = useState<string | number>('')

    const [startYear, setStartYear] = useState<number | null>(null);
    const [endYear, setEndYear] = useState<number | null>(null);
    const [noFoundOnDate, setNoFoundOnDate] = useState<boolean>(false);


    const [hearChanges, setHear] = useState<boolean>(false)



    const handleYearSelection = (year: number | string) => {
        console.log('Filtering data with:', { year }); // Debug log

        const savedItem = localStorage.getItem('savedObject');
        const savedData: DataObject[] = savedItem ? JSON.parse(savedItem) : dataObject;

        if (!savedData || savedData.length === 0) {
            console.log('No data available for filtering.');
            return;
        }

        const startYear = 2020;
        const endYear = typeof year === 'number' ? year : parseInt(year, 10);

        if (year != 'Any Time') {
            const filteredByDate = savedData.filter((itm: DataObject) => {
                const itemYear = itm.response.year;
                const updatedYear = new Date(itm.response.updated).getFullYear();

                // Check if either year falls within the range
                return (itemYear >= startYear && itemYear <= endYear) ||
                    (updatedYear >= startYear && updatedYear <= endYear);
            });
            console.log('Filtered data:', filteredByDate); // Debug log

            // Only update state if there are results
            if (filteredByDate.length > 0) {
                setDataObject(filteredByDate);
                console.log('Data object updated with filtered data.');
            } else {
                console.log('No matching data found for the selected year.');
            }
        } else {
            setDataObject(savedData);
        }


    };


    const [slcVal, setSlcVal] = useState<number>(0)

    function onchangeInput(params: number) {
        setSlcVal(params)
        handleYearSelection(params)
    }

    const [openCiteModal, setOpenCiteModal] = useState<boolean>(false)

    const [citeDetails, setCiteDetails] = useState<ResponseObject | null>(null);

    const openModalWithDetails = (prmsBool: boolean, details: ResponseObject | null) => {
        setCiteDetails(details);
        setOpenCiteModal(prmsBool);
    };
    

    return (
        <div className='h-auto'>
            <Header inputSee={true} bookSee={false} />
            {
                openCiteModal && citeDetails &&
                <CiteComp closer={setOpenCiteModal} citeDetails={citeDetails} />
            }
            <div className='mt-[80px] w-full h-[50px] border-b-[1px] border-b-[#e6e6e6] flex items-center justify-start px-3 font-semibold md:px-7'>
                <div className='w-full max-w-[800px] flex justify-between items-center gap-[80px] md:justify-start md:max-w-[100%]'>
                    <div className='hidden md:block'>
                        Articles
                    </div>
                    <div className='text-gray-400 text-[12px] text-left'>
                        {dataObject != null && dataObject.length} resuls for "{params?.query}"
                    </div>
                    <div className='flex sm:hidden'>
                        <select
                            className='outline-none'
                            value={slcVal}
                            onChange={(e) => { onchangeInput(parseInt(e.target.value)) }}
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

            </div>
            <section className='flex w-full h-auto px-4 pt-6 gap-[50px] items-start'>
                <div className='hidden border-b-[1px] border-b-[#e6e6e6 h-auto pb-2  md:block'>
                    <select
                        value={filterVal}
                        onChange={(e) => { setFilterVal(e.target.value) }}
                        className='bg-[#e6e6e6]  py-1 px-2 rounded-lg'>
                        <option value="">Filter by</option>
                        <option value="Date">Date</option>
                    </select>
                    {
                        filterVal === 'Date' &&
                        <div className='text-left pl-1 pt-2 flex flex-col gap-1'>
                            {[2024, 2023, 2022, 2021, 2020, 'Any Time'].map(year => (
                                <div
                                    key={year}
                                    onClick={() => handleYearSelection(year)}
                                    className='cursor-pointer text-[#888] text-[13px] hover:underline hover:text-blue-400'>
                                    Since {year}
                                </div>
                            ))}
                        </div>
                    }
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
                                <div className='text-blue-400 text-[14px] break-words underline-offset-2 underline'>
                                    {itm.response.doi_url}
                                </div>
                                <div className='w-full flex  gap-1 pt-2 items-center'>
                                    <span className='text-[#888] text-left text-[12px]'>
                                        publisher: {itm.response.publisher},
                                        <span className='font-semibold text-[13px] pl-1'>
                                            {itm.response.year}
                                        </span>
                                    </span>


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
                                        <div className='flex flex-wrap gap-1'>
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
                                <div
                                    onClick={(e) => { e.stopPropagation() }}
                                    className='flex gap-1 text-[13px] mt-2'>
                                    <div
                                onClick={() => { openModalWithDetails(true, itm.response) }}
                                        className='bg-gray-700 text-[13px] px-1 rounded-md text-white cursor-pointer'>
                                        Cite</div>
                                    <div className='bg-gray-700 text-[13px] px-1 rounded-md text-white cursor-pointer'>
                                        Save</div>
                                </div>
                            </div>
                        ))
                    }

                    {
                        dataObject.length != 0 &&
                        <>
                            <div className='flex gap-2'>
                                <div
                                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className='h-[30px] text-gray-700 text-3xl flex items-center justify-center hover:text-gray-950 cursor-pointer'>
                                    <FaArrowCircleUp />
                                </div>

                                {
                                    params?.page && parseFloat(params?.page) > 1 &&
                                    <div
                                        className='flex gap-2'>
                                        <div
                                            onClick={controls.goBack}

                                            className='bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5  hover:bg-gray-950'>
                                            ({params?.page && parseFloat(params?.page) - 1}) prev page
                                        </div>
                                    </div>
                                }
                                {
                                    nextPage &&

                                    <div
                                        onClick={controls.goForward}
                                        className='bg-gray-700 text-[15px] px-3 py-1 rounded-md text-white cursor-pointer mb-5 hover:bg-gray-950'>
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
