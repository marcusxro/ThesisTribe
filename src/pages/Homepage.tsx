import axios from 'axios'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import Header from '../comp/Header';
import { FaGithub } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const Homepage: React.FC = () => {


    const [stringVal, setStringVal] = useState<string>('')
    const [seeInput] = useState<boolean>(false)
    const nav = useNavigate()

    function searchQuery(e: FormEvent) {
        e.preventDefault()
        if (stringVal != '') {
            nav(`/search/${stringVal}/1`)
        } else {
            alert("please type something")
        }

    }


    return (
        <div className='h-screen w-full p-3 flex flex-col justify-between'>
            <Header inputSee={seeInput} bookSee={false} locString={'Article'} />
            <form
                className='w-full min-h-[500px] h-[80vh] flex items-center flex-col justify-center gap-5 md:h-[90vh]'
                onSubmit={searchQuery}
                action="submit">
                <div>
                    <h1 className='text-[#292929] text-[2.5rem] font-bold text-center'> SCHOLAR-VAULT</h1>
                    <h3 className='text-[#292929] text-md font-medium text-center'>Your gateway to scholarly research. Discover, access, and cite academic papers with ease.</h3>
                </div>
                <div className='relative w-full w max-w-[700px] '>
                    <div className='positioner'>
                        <CiSearch />
                    </div>
                    <input
                        value={stringVal}
                        onChange={(e) => { setStringVal(e.target.value) }}
                        className='w-full h-[50px] border-2 px-2 outline-none rounded-3xl bg-[#f9f9f9] pl-8 relative z-0'
                        type="text" placeholder='Search something...' />
                </div>
                <div className='flex gap-1 text-[#888] text-[13px]'>
                    <div>Recommended:</div>
                    <div className='flex gap-1 text-black font-semibold'>
                        Advancements in Artificial Intelligence
                    </div>
                </div>
            </form>
            <footer className='h-auto p-3 flex flex-col justify-between gap-3 xl:h-[70vh]'>
                <div className='h-full w-full gap-2 grid grid-cols-2 md:flex md:justify-between'>
                    <div className='w-full h-full bg-[#292929]  rounded-lg p-5 text-white flex flex-col justify-between items-start'>
                        <div>
                            <div className='font-bold text-xl mb-3 md:text-2xl'>Comprehensive Research Database</div>
                            <p className='text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]'>
                                Access a vast repository of scholarly articles, research papers, and academic publications. AcademicNavigator offers an extensive collection of high-quality sources to support your academic pursuits and research projects.
                            </p>
                        </div>
                        <button
                            onClick={() => { alert("Page is under development") }}
                            className='mt-5 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn more</button>
                    </div>
                    <div className='w-full h-full bg-[#292929]  rounded-lg p-5 text-white flex flex-col justify-between items-start'>
                        <div>
                            <div className='font-bold text-xl mb-3 md:text-2xl'>Intuitive Search Functionality</div>
                            <p className='text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]'>
                                Utilize advanced search tools to quickly and efficiently find relevant academic content. Our powerful search engine allows you to filter results by keywords, authors, publication date, and more, ensuring you can pinpoint the information you need.
                            </p>
                        </div>
                        <button
                            onClick={() => { alert("Page is under development") }}
                            className='mt-5 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn more</button>

                    </div>
                    <div
                        id='legnthen'
                        className='col-span-2 w-[100%] h-full bg-[#292929]  rounded-lg p-5 text-white flex flex-col justify-between items-start'>
                        <div>
                            <div className='font-bold text-xl mb-3 md:text-2xl'>Citation Management</div>
                            <p className='text-[12px] text-gray-400 lg:text-[17px] md:text-[13px]'>
                                Seamlessly generate and manage citations for your research work. AcademicNavigator provides easy-to-use citation tools to help you create accurate references in various citation styles, simplifying the process of academic writing and ensuring proper attribution.
                            </p>
                        </div>
                        <button
                            onClick={() => { alert("Page is under development") }}
                            className='mt-3 bg-white text-[#292929] py-2 px-3 rounded-lg font-semibold'>Learn more</button>

                    </div>
                </div>
                <div className='flex flex-col items-center justify-center gap-1'>
                    <div className='text-[#292929]'>Support the Developer</div>
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
            </footer>
        </div>
    )
}

export default Homepage
