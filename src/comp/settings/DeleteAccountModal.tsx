import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { authKey } from '../../firebase/FirebaseKey';
import { deleteUser } from "firebase/auth";
import IsUser from '../IsUser';


import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion, deleteDoc } from 'firebase/firestore';



import { firestoreKey } from '../../firebase/FirebaseKey';
import LoadingSvg from '../LoadingSvg';
import { useNavigate } from 'react-router-dom';



interface closerType {
    closer: React.Dispatch<React.SetStateAction<boolean>>
}



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


const DeleteAccountModal: React.FC<closerType> = ({ closer }) => {
    const [user, setUser] = IsUser();


    const [data, setData] = useState<DataType[]>([]);

    const [isCompeleteDelete, setIsComplete] = useState<boolean>(false)

    const nav = useNavigate()

    const DeleteUserFunc = async () => {
        setIsComplete(true)
        try {
            const querySnapshot = await getDocs(collection(firestoreKey, 'userCollectionOfSave'));
            const existingUserDoc = querySnapshot.docs.find(doc => doc.data().Uid === user?.uid);

            if (existingUserDoc) {
                await deleteDoc(existingUserDoc.ref);
                setIsComplete(false)
                if (user) {

                    deleteUser(user)
                        .then(() => {
                            console.log("USER DELETED")
                            nav('/sign-in')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



    const [password, setPassword] = useState<string>("")

    const confirmPass = localStorage.getItem('userPassword')

    useEffect(() => {
        console.log(localStorage)
    }, [confirmPass])

    const [email, setEmail] = useState('')


    function confirmDeleteByLogIn() {
        if (user?.providerData[0].providerId === 'google.com') {
            if(email === user?.email) {
                DeleteUserFunc()
            }
        }

        if (user?.providerData[0].providerId === 'password') {
            if (user === null) {
                return
            }

            if (confirmPass === password) {
                DeleteUserFunc()
            } else {
                console.log("passwords are not the same")
            }

        }
    }



    return (
        <div
            className='w-full h-full max-w-[500px] max-h-[500px] bg-[#f9f9f9] rounded-lg overflow-hidden'
            onClick={(e) => { e.stopPropagation() }}>
            <div className='h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3'>
                <div onClick={() => closer(false)} className='cursor-pointer'>
                    <IoMdClose />
                </div>
                <div className='text-lg font-semibold'>Delete Account</div>
            </div>
            <div className='p-3'>
                <div className='text-lg font-semibold text-red-700'>Confirmation</div>
                {
                    user?.providerData[0].providerId === 'google.com' &&
                    <>
                        <div className='text-[#888]'>
                            To Delete your Account kindly type your email.
                        </div>
                        <div className='text-[#888] mt-2'>
                            Note: once you deleted your account there's no way to retrieve it, This is permanent.
                        </div>

                        <div className='flex flex-col gap-3 mt-5'>
                            <input
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                className='h-[50px] border-[#888] border-[1px] outline-none rounded-lg px-2'
                                type="text" placeholder='E-mail' />
                            <button
                                onClick={() => { confirmDeleteByLogIn() }}
                                className={` ${user?.email === email && 'bg-red-700 cursor-pointer'} flex items-center justify-center gap-2 bg-red-300 cursor-not-allowed text-white px-3 py-2 rounded-md`}>

                                {
                                    isCompeleteDelete &&
                                    <LoadingSvg />
                                }     Delete Account
                            </button>
                        </div>

                    </>
                }

                {
                    user?.providerData[0].providerId === 'password' &&
                    <>
                        <div className='text-[#888]'>
                            To Delete your Account kindly make sure to confirm your password.
                        </div>
                        <div className='text-[#888] mt-2'>
                            Note: once you deleted your account there's no way to retrieve it, This is permanent.
                        </div>

                        <div className='flex flex-col gap-3 mt-5'>
                            <input
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                className='h-[50px] border-[#888] border-[1px] outline-none rounded-lg px-2'
                                type="password" placeholder='Password' />
                            <button
                                onClick={() => { confirmDeleteByLogIn() }}
                                className={` ${confirmPass === password && 'bg-red-700 cursor-pointer'} flex items-center justify-center gap-2 bg-red-300 cursor-not-allowed text-white px-3 py-2 rounded-md`}>

                                {
                                    isCompeleteDelete &&
                                    <LoadingSvg />
                                }     Delete Account
                            </button>
                        </div>
                    </>
                }

            </div>
        </div>
    )
}

export default DeleteAccountModal
