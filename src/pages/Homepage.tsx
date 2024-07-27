import axios from 'axios'
import React, { FormEvent, useState } from 'react'
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
        <div className='bg-white h-auto flex p-5 flex-col'>
            <Header inputSee={seeInput} />
            <form
                className='w-[100%] h-[50vh] flex flex-col gap-5 self-center items-center justify-center border-b-[2px] border-b-[#e6e6e6]'
                onSubmit={searchQuery}
                action="submit">
                <h1 className='text-[#292929] text-3xl font-bold'>Search the Knowledge Base</h1>
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
                <div className='flex gap-1 text-[#888]'>
                    <div>Recommended:</div>
                    <div className='flex gap-1 text-black font-semibold'>
                        <div className='cursor-pointer'>Math,</div>
                        <div className='cursor-pointer'>Science,</div>
                        <div className='cursor-pointer'>Programming</div>
                    </div>
                </div>
            </form>
            <div className='h-[40vh] w-full grid grid-cols-3  place-items-center text-sm lg:text-lg md:text-md'>
                <div className='flex flex-col items-center w-full max-w-[280px] justify-center'>
                    <div className='text-left w-full font-bold pb-2 text-2xl'>Math</div>
                    <div className='text-left w-full pl-2 pb-2 font-bold'>Discrete</div>
                    <div className='text-left text-gray-500'>
                        <div>
                            Calculus
                        </div>
                        <div>
                            Algebra
                        </div>
                        <div>
                            Geometry
                        </div>
                        <div>
                            Statistics and Probability
                        </div>
                        <div>
                            Number Theory
                        </div>
                        <div>
                            Differential Equations
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-center w-full max-w-[280px]'>
                    <div className='text-left w-full font-bold pb-2 text-2xl'>Math</div>
                    <div className='text-left w-full pl-2 pb-2 font-bold'>Discrete</div>
                    <div className='text-left text-gray-500'>
                        <div>
                            Calculus
                        </div>
                        <div>
                            Algebra
                        </div>
                        <div>
                            Geometry
                        </div>
                        <div>
                            Statistics and Probability
                        </div>
                        <div>
                            Number Theory
                        </div>
                        <div>
                            Differential Equations
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-center w-full max-w-[280px]'>
                    <div className='text-left w-full font-bold pb-2 text-2xl'>Math</div>
                    <div className='text-left w-full pl-2 pb-2 font-bold'>Discrete</div>
                    <div className='text-left text-gray-500'>
                        <div>
                            Calculus
                        </div>
                        <div>
                            Algebra
                        </div>
                        <div>
                            Geometry
                        </div>
                        <div>
                            Statistics and Probability
                        </div>
                        <div>
                            Number Theory
                        </div>
                        <div>
                            Differential Equations
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-1'>
                <div className='text-[#292929]'>  Support the Developer</div>
                <div className='flex gap-3'>
                    <div className='cursor-pointer text-[#292929]'><FaGithub /></div>
                    <div className='cursor-pointer text-[#292929]'><FaFacebook /></div>
                    <div className='cursor-pointer text-[#292929]'><FaTiktok /></div>
                </div>
            </div>
        </div>
    )
}

export default Homepage
