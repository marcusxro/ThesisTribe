import React, { FormEvent, useEffect, useState } from 'react'
import { FaSwatchbook } from "react-icons/fa6";
import { MdMenuOpen } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoIosHome } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdContact } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useParams } from 'react-router-dom';
interface typeOfProps {
    inputSee: boolean,
    bookSee: boolean
}

const Header: React.FC<typeOfProps> = ({ inputSee, bookSee }) => {

    const [isClicked, setIsClicked] = useState<boolean>(false)
    const [inputVal, setInputVal] = useState<string>('')
    const params = useParams()
    const nav = useNavigate()

    function searchQuery(e: FormEvent) {
        e.preventDefault()
        if (inputVal === '' && !params?.query) {
            return alert("Please search something")
        } else {
            nav(`/search/${!inputVal ? params?.query : inputVal}/1`)
            window.scrollTo(0, 0)
        }
    }

    function searchBookQuery(e: FormEvent) {
        e.preventDefault()
        if (inputVal === '' && !params?.query) {
            return alert("Please search something")
        } else {
            nav(`/search-book/${!inputVal ? params?.bookQuery : inputVal}/1`)
            window.scrollTo(0, 0)
        }
    }

    const [isChanged, setIsChanged] = useState<boolean>(false)
    const inputSearchValue = !inputVal && !isChanged ? params?.query : inputVal
    const inputSearchValueForBooks = !inputVal && !isChanged ? params?.bookQuery : inputVal

    return (
        <header className={`custom-pos py-5 ${inputSee && 'border-b-2 border-b-[#e6e6e6]'} ${bookSee && 'border-b-2 border-b-[#e6e6e6]'}`}>
            <div className='flex gap-5 w-full max-w-[800px] items-center'>
                <div onClick={() => { nav('/') }}
                    className={`font-bold text-1xl ${bookSee &&  'hidden'} ${inputSee  &&  'hidden'}  flex items-center gap-1 cursor-pointer md:flex`}><FaSwatchbook />ThesisTribe</div>
                {
                    inputSee &&
                    <form
                        onSubmit={searchQuery}
                        action='submit'
                        className='w-full relative'>
                        <div className='positioner'>
                            <CiSearch />
                        </div>
                        <input
                            value={inputSearchValue}
                            onChange={(e) => { setInputVal(e.target.value); setIsChanged(true) }}
                            placeholder="Let's learn something new..."
                            className='w-full h-[35px] border-2 px-2 outline-none rounded-3xl bg-[#f9f9f9] pl-8 relative'
                            type="text" />
                    </form>
                }
                    {
                    bookSee &&
                    <form
                        onSubmit={searchBookQuery}
                        action='submit'
                        className='w-full relative'>
                        <div className='positioner'>
                            <CiSearch />
                        </div>
                        <input
                            value={inputSearchValueForBooks}
                            onChange={(e) => { setInputVal(e.target.value); setIsChanged(true) }}
                            placeholder="Let's find something new..."
                            className='w-full h-[35px] border-2 px-2 outline-none rounded-3xl bg-[#f9f9f9] pl-8 relative'
                            type="text" />
                    </form>
                }
            </div>
            <div
                onClick={() => { setIsClicked(prevs => !prevs) }}
                className={`hover:bg-gray-700 bg-[#292929] text-white py-1 px-7 z-[10000] rounded-3xl cursor-pointer flex gap-1 items-center ${isClicked && 'bg-red-700'} relative`}>
                {
                    isClicked ?
                        <><IoMdClose /> Close</> :
                        <><MdMenuOpen /> Menu</>
                }
            </div>
            {
                isClicked &&
                <div
                    onClick={() => { setIsClicked(prevs => !prevs) }}
                    className='seeTrough flex items-end justify-end text-right pr-5 pb-2 leading-[15px] font-bold'>
                    <span>
                        Developed &  <br />
                        Designed by  <br />
                        Marcus
                    </span>
                </div>
            }
            {
                isClicked &&
                <div className='modalEl'>
                    <div
                        onClick={() => { nav('/') }}
                        className='bg-[#292929] text-white py-1 px-5
                     rounded-3xl cursor-pointer flex gap-1 items-center hover:bg-gray-700 
                      text-center'><IoIosHome /> Home</div>
                    <div
                        className='bg-[#292929] text-white py-1
                     px-5 rounded-3xl cursor-pointer flex gap-1  hover:bg-gray-700 
                     items-center text-center'><FaInfoCircle /> About</div>
                    <div
                        className='bg-[#292929] text-white
                     py-1 px-5 rounded-3xl cursor-pointer  hover:bg-gray-700 
                     flex gap-1 items-center text-center'><IoMdContact />Contact</div>
                     <div
                       onClick={() => { nav('/book-finder/') }}
                        className='bg-[#292929] text-white
                     py-1 px-5 rounded-3xl cursor-pointer  hover:bg-gray-700 
                     flex gap-1 items-center text-center'><IoMdContact />Books</div>
                </div>
            }
        </header>
    )
}

export default Header
