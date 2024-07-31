import React, { FormEvent, useEffect, useState } from 'react'
import { FaSwatchbook } from "react-icons/fa6";
import { MdMenuOpen } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoIosHome } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdContact } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { MdArticle } from "react-icons/md";
import { MdLibraryBooks } from "react-icons/md";
import { MdCollectionsBookmark } from "react-icons/md";


import { authKey } from '../firebase/FirebaseKey';
import { signOut } from 'firebase/auth';
import { CiLogin } from "react-icons/ci";

import isUser from './IsUser'

interface typeOfProps {
    inputSee: boolean,
    bookSee: boolean,
    locString: string,
}


const Header: React.FC<typeOfProps> = ({ inputSee, bookSee, locString }) => {

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
    const [isChanged, setIsChanged] = useState<boolean>(false)
    const inputSearchValueForBooks = !inputVal && !isChanged ? params?.bookQuery : inputVal

    function searchBookQuery(e: FormEvent) {
        e.preventDefault()
        if (inputVal === '' && !params?.bookQuery) {
            return alert("Please search something")
        } else {
            nav(`/search-book/${inputSearchValueForBooks}/1`)
            window.scrollTo(0, 0)
        }
    }


    const inputSearchValue = !inputVal && !isChanged ? params?.query : inputVal

    function SignOutAccout() {
        signOut(authKey)
            .then(() => {

            }).catch((err) => {
                console.log(err)
            })
    }

    const [user, setUser] = isUser();


    useEffect(() => {
        console.log(user)
    }, [user])




    return (
        <header className={`custom-pos py-5 ${inputSee && 'border-b-2 border-b-[#e6e6e6]'} ${bookSee && 'border-b-2 border-b-[#e6e6e6]'}`}>
            <div className='flex gap-5 w-full max-w-[800px] items-center'>
                <div onClick={() => { nav('/') }}
                    className={`font-bold text-1xl ${bookSee && 'hidden'} ${inputSee && 'hidden'}  flex items-center gap-1 cursor-pointer md:flex`}><FaSwatchbook />ThesisTribe</div>
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
                <div className='modalEl rightShadow'>
                    <div className='h-[80px] items-center bg-[#e6e6e6] w-full p-3 flex gap-3 border-b-[2px]  border-b-gray-300'>
                        {user?.photoURL ? (
                            <div className='h-[50px] w-[50px] overflow-hidden rounded-lg'>
                                <img
                                    className='object-cover'
                                    src={user.photoURL} alt="" />
                            </div>
                        ) : (
                            <div className='bg-gray-400 h-[50px] w-[50px] overflow-hidden rounded-lg flex items-center justify-center'>
                                User
                            </div>
                        )}

                        <div className='flex flex-col '>
                            <div className='font-semibold lheight flex items-center gap-1'>
                                <FaSwatchbook className='text-[12px]' />ThesisTribe</div>
                            <div className='text-[13px] text-gray-500'>
                                {
                                    user
                                        ? (
                                            user.displayName
                                                ? (user.displayName.length > 13
                                                    ? user.displayName.slice(0, 10) + '...'
                                                    : user.displayName)
                                                : (user.email && user.email.length > 15
                                                    ? user.email.slice(0, 13) + '...'
                                                    : user.email)
                                        )
                                        : 'Free user'
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col w-full px-3 gap-1'>
                        <div className='px-2 text-[13px] text-gray-400 mt-2 mb-1'>
                            OVERVIEW
                        </div>
                        <div
                            onClick={() => { nav('/') }}
                            className={` ${locString === 'Home' && 'bg-gray-300'} text-black py-3 px-2 rounded-lgtext-lg
                             cursor-pointer flex gap-3 items-center hover:bg-gray-700 font-semibold hover:text-white 
                            text-center w-full rounded-lg`}><IoIosHome className='text-xl' /> Home</div>
                        <div
                            onClick={() => { nav('/Article') }}
                            className={` ${locString === 'Article' && 'bg-gray-300'} text-black py-3 px-2 rounded-lgtext-lg
                            cursor-pointer flex gap-3 items-center hover:bg-gray-700 font-semibold hover:text-white 
                           text-center w-full rounded-lg`}><MdArticle className='text-[15px]' /> Articles</div>
                        <div
                            onClick={() => { nav('/book-finder/') }}
                            className={` ${locString === 'Book' && 'bg-gray-300'} text-black py-3 px-2 rounded-lgtext-lg
                            cursor-pointer flex gap-3 items-center hover:bg-gray-700 font-semibold hover:text-white 
                           text-center w-full rounded-lg`}><MdLibraryBooks />Books</div>
                        {/* <div
                           className={` ${locString === 'About' && 'bg-gray-300'} text-black py-3 px-2 rounded-lgtext-lg
                           cursor-pointer flex gap-3 items-center hover:bg-gray-700 font-semibold hover:text-white 
                          text-center w-full rounded-lg`}><FaInfoCircle className='text-[15px]' /> About</div>
                        <div
                            className={` ${locString === 'Contact' && 'bg-gray-300'} text-black py-3 px-2 rounded-lgtext-lg
                            cursor-pointer flex gap-3 items-center hover:bg-gray-700 font-semibold hover:text-white 
                           text-center w-full rounded-lg`}><IoMdContact />Contact</div> */}

                        {
                            user !== null &&
                            <div className='flex flex-col'>
                                <div
                                    onClick={() => { nav('/saved-datas') }}
                                    className={` ${locString === 'Collection' && 'bg-gray-300'} text-black py-3 px-2 rounded-lgtext-lg
                            cursor-pointer flex gap-3 items-center hover:bg-gray-700 font-semibold hover:text-white 
                           text-center w-full rounded-lg`}><MdCollectionsBookmark />Collection</div>

                            </div>
                        }

                    </div>
                    {
                        user != null ?

                            <div className='w-full mt-auto border-t-[1px] pt-3 border-t-gray-300 px-3'>
                                <div
                                    onClick={() => { SignOutAccout() }}
                                    className=' text-red-800 font-semibold text-lg hover:text-white 
                                    py-3 px-2 rounded-lg cursor-pointer  hover:bg-gray-700 
                                    flex gap-3 items-center text-center'><IoIosLogOut />Log out</div>
                            </div>
                            :
                            <div className='w-full mt-auto border-t-[1px] pt-3 border-t-gray-300 px-3'>
                                <div
                                    onClick={() => { nav('/sign-in') }}
                                    className={` ${locString === 'Signin' && 'bg-gray-300'} text-black py-3 px-2 rounded-lgtext-lg
                            cursor-pointer flex gap-3 items-center hover:bg-gray-700 font-semibold hover:text-white 
                           text-center w-full rounded-lg`}><CiLogin />Sign in</div>
                            </div>
                    }
                </div>
            }
        </header>
    )
}

export default Header
