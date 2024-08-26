import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import Header from '../Header';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { FaAffiliatetheme } from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { MdOutlineRoundaboutLeft } from "react-icons/md";
import IsUser from '../IsUser';
import userIMG from '../../images/userIMG.png'
import { authKey } from '../../firebase/FirebaseKey';
import { updatePassword } from "firebase/auth";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify';
import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

import 'react-toastify/dist/ReactToastify.css';
import DeleteAccountModal from './DeleteAccountModal';


import { firestoreKey } from '../../firebase/FirebaseKey';

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
    Link: string;
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
    Publisher: string;
    Title: string;
    Updated: string;
    Year: number;
    z_authors: Author[];
    title: string;
    publisher: string;
    year: number;
    Authors?: Author[];
    updated: string
}



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
    type: string
}
interface MyComputationArrContent {
    docID: string | number;
    resultItem: string;
    type: string;
}


interface DataType {
    id: string;
    Uid: string;
    name: string;
    MyCollection: ResponseObject[];
    MyBook: ResultType[];
    MyComputationArr: MyComputationArrContent[];
}


const Settings: React.FC = () => {
    const [user, setUser] = IsUser();

    const nav = useNavigate()

    const [tabination, setTabination] = useState<string>(`Account`)

    useEffect(() => {
        if(user) {
            setTabination('Account')
        } else {
            setTabination('Theme')
        }
    }, [user])

    useEffect(() => {
        console.log(user?.metadata.creationTime)
    }, [user])

    const [currentPass, setCurrentPass] = useState<string>("");
    const [newPass, setnewPass] = useState<string>("");
    const [isConfirm, setisConfirm] = useState<string>("");


    const errorModal = (textStag: string) => {
        toast.error(`${textStag}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    }

    const PasswordChangeSuccess = (textStag: string) => {
        toast.success(`${textStag}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    }


    function changeThePassOfUser() {
        if (newPass != isConfirm) {
            return errorModal("Please make sure the passwords are the same")
        }
        if (newPass === '' || isConfirm === '' || currentPass === '') {
            return errorModal("Please make sure the inputs are not empty")
        }
        if (user === null || !currentPass) {
            return errorModal("There's some error encountered")
        }
        const email: any = user?.email;
        const password = currentPass

        signInWithEmailAndPassword(authKey, email, password)
            .then((res) => {
                if (res?.user) {
                    console.log("user is present")
                    if (password === newPass) {
                        alert("same password detected")
                    } else {
                        updatePassword(res?.user, newPass)
                            .then(() => {
                                setnewPass('')
                                setCurrentPass('')
                                setisConfirm('')
                                PasswordChangeSuccess('Password Successfully Changed!')
                            }).catch((err) => {
                                console.log(err)
                                errorModal("There's some error changing your password")
                            })
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                errorModal("Wrong Password (current password)")
            })
    }

    const [deleteAccount, setDeleteAccount] = useState<boolean>(false)

    return (
        <div className='mt-[80px] px-6'>
            <ToastContainer />
            {
                deleteAccount &&
                <div
                onClick={() => {setDeleteAccount(false)}}
                 className='modalPos'>
                    <DeleteAccountModal closer={setDeleteAccount} />
                </div>
            }
            <Header locString='Settings' bookSee={false} inputSee={false} />
            <section className='flex w-full h-[90dvh] bg-gray-200 rounded-xl overflow-hidden buttonBlur'>
                <div className='h-full w-full max-w-[400px] bg-gray-300'>

                    <div className='border-b-gray-400 border-b-[2px] flex'>
                        <div
                            onClick={() => { nav(-1) }}
                            className={`flex gap-3 items-center p-3 cursor-pointer`}>
                            <div className='bg-gray-400 p-1 rounded-md'>
                                <IoIosArrowBack />
                            </div>
                            Settings
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 px-3'>
                        <div className='text-gray-400 px-2 mt-3'>GENERAL</div>
                        {
                            user != null &&
                            <div
                                onClick={() => { setTabination('Account') }}
                                className={`${tabination === 'Account' && 'bg-slate-500 text-white buttonBlur'}  rounded-lg flex gap-3 items-center p-3 cursor-pointer hover:bg-slate-400 hover:text-black`}>
                                <div className='bg-gray-400 p-1 rounded-md '>
                                    <MdAccountCircle />
                                </div>
                                Account
                            </div>
                        }
                        <div
                            onClick={() => { setTabination('Theme') }}
                            className={`${tabination === 'Theme' && 'bg-slate-500 text-white buttonBlur'} rounded-lg flex gap-3 items-center p-3 cursor-pointer hover:bg-slate-400 hover:text-black`}>

                            <div className='bg-gray-400 p-1 rounded-md'>
                                <FaAffiliatetheme />
                            </div>
                            Theme
                        </div>
                        <div
                            onClick={() => { setTabination('Help Center') }}
                            className={`${tabination === 'Help Center' && 'bg-slate-500 text-white buttonBlur'} rounded-lg flex gap-3 items-center p-3 cursor-pointer hover:bg-slate-400 hover:text-black`}>

                            <div className='bg-gray-400 p-1 rounded-md'>
                                <FaHandsHelping />
                            </div>
                            Help Center
                        </div>
                        <div
                            onClick={() => { setTabination('About') }}
                            className={`${tabination === 'About' && 'bg-slate-500 text-white buttonBlur'} rounded-lg flex gap-3 items-center p-3 cursor-pointer hover:bg-slate-400 hover:text-black`}>

                            <div className='bg-gray-400 p-1 rounded-md'>
                                <MdOutlineRoundaboutLeft />
                            </div>
                            About
                        </div>
                    </div>
                </div>

                {
                    tabination === 'Account' && user != null &&

                    <div className='w-full h-full p-3 flex flex-col overflow-auto'>
                        <div className='flex flex-col bg-gray-300 p-3 rounded-lg'>
                            <h2 className='font-semibold'>Account</h2>
                            <p>This is where you can manage your account.</p>
                        </div>

                        <div className='mt-5'>

                            <div className='flex gap-3'>
                                <div className='w-[100px] h-[100px] rounded-lg buttonBlur object-cover overflow-hidden'>
                                    {
                                        user?.photoURL ?
                                            <img className='w-full h-full' src={user.photoURL} alt="" />
                                            :

                                            <img className='w-full h-full' src={userIMG} alt="" />
                                    }
                                </div>
                                <div>
                                    <div className='font-medium'>{user.email}</div>
                                    <div>{user.displayName}</div>
                                    <div>{user.uid}</div>
                                </div>
                            </div>

                            <div className='mt-5  rounded-lg flex flex-col items-start justify-start w-full'>
                                <div className='font-semibold bg-gray-300 w-full p-3 rounded-md'>
                                    INFORMATION
                                </div>
                                <div className='mt-3 flex flex-col gap-3 items-start justify-start lg:grid lg:grid-cols-2'>
                                    <div className='flex flex-col gap-1 w-full justify-start items-start'>
                                        <span className='font-medium'>E-mail</span>
                                        <div className='text-[#888]'>{user?.email}</div>

                                    </div>
                                    <div className='flex flex-col gap-1 items-start w-full'>
                                        <span className='font-medium'>Display Name</span>
                                        <div className='text-[#888]'>{user?.displayName ?? 'No Display Name'}</div>
                                    </div>
                                    <div className='flex flex-col gap-1 items-start w-full'>
                                        <span className='font-medium'>Creation Time</span>
                                        <div className='text-[#888]'>{user?.metadata.creationTime ?? 'No Creation Time'}</div>
                                    </div>
                                    <div className='flex flex-col gap-1 items-start w-full'>
                                        <span className='font-medium'>Provider</span>
                                        <div className='text-[#888]'>{user?.providerData[0].providerId ?? 'No Provider'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-5  rounded-lg flex flex-col items-start justify-start w-full'>
                                <div className='font-semibold bg-gray-300 w-full p-3 rounded-md'>
                                    PASSWORD
                                </div>
                                {
                                     user?.providerData[0].providerId === 'google.com' &&
                                     <div className='my-2 text-red-700'>
                                        *not allowed to change password because of provider ({user?.providerData[0].providerId})
                                        </div>
                                }
                                {
                                     user?.providerData[0].providerId === 'password' &&
                                <>
                                <div className='mt-3 flex flex-col gap-2 items-start justify-start lg:grid lg:grid-cols-2'>
                                    <div className='flex flex-col gap-1 w-full justify-start items-start'>
                                        <span>Current Password</span>
                                        <input
                                            className='p-2 rounded-lg outline-none border-[1px] border-gray-800'
                                            type="password"
                                            value={currentPass}
                                            onChange={(e) => { setCurrentPass(e.target.value) }}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 items-start w-full'>
                                        <span>New Password</span>
                                        <input
                                            className='p-2 rounded-lg outline-none border-[1px] border-gray-800'
                                            type="password"
                                            value={newPass}
                                            onChange={(e) => { setnewPass(e.target.value) }}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 items-start w-full'>
                                        <span>Confirm New Password</span>
                                        <input
                                            className='p-2 rounded-lg outline-none border-[1px] border-gray-800'
                                            type="password"
                                            value={isConfirm}
                                            onChange={(e) => { setisConfirm(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                <div className='my-3'>
                                    <button
                                        onClick={() => { changeThePassOfUser() }}
                                        className={`
                                        ${newPass === isConfirm && newPass != '' && isConfirm != '' && currentPass != '' && 'bg-gray-800 cursor-pointer'}
                                    bg-gray-500
                                    cursor-not-allowed
                                     text-white px-3 py-2 rounded-md`}>Change Password</button>
                                </div>
                                </>
                                }
                                
                            </div>
                            <div className='mt-5  rounded-lg flex flex-col items-start justify-start w-full'>
                                <div className='font-semibold bg-gray-300 w-full p-3 rounded-md'>
                                    DELETE ACCOUNT
                                </div>

                                <div className='my-3'>
                                    <button
                                        onClick={() => { setDeleteAccount(prevClicks => !prevClicks) }}
                                        className={` bg-gray-800 cursor-pointer text-white px-3 py-2 rounded-md`}>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </section>
        </div>
    )
}

export default Settings
