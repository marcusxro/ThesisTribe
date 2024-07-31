import React, { useEffect, useState } from 'react';
import Header from '../comp/Header';
import { FaInfoCircle } from "react-icons/fa";
import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

import { firestoreKey } from '../firebase/FirebaseKey';
import IsUser from '../comp/IsUser';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { authKey } from '../firebase/FirebaseKey';
import { onAuthStateChanged, User } from 'firebase/auth';
import { IoMdClose } from "react-icons/io";
import LogOutUser from '../comp/LogOutUser'
import 'react-toastify/dist/ReactToastify.css';
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
interface DataType {
    id: string;
    Uid: string;
    name: string;
    MyCollection: ResponseObject[];
    MyBook: ResultType[]
}

const SaveDatas: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [user] = IsUser(); // Ensure this returns the current user
    const [tabination, setTabination] = useState<string>("Article");
    const nav = useNavigate();



    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestoreKey, 'userCollectionOfSave'));
            const dataList: DataType[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as DataType[];

            // Filter data to only include items for the current user
            const filteredData = dataList.filter((itm) => itm.Uid === user?.uid);

            // Set the filtered data

            setData(filteredData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();  // Fetch data when user changes
        }
    }, [user]);

    useEffect(() => {
        const unsub = onAuthStateChanged(authKey, (userCred) => {
            if (!userCred) {
                nav(-1)
            }
        });

        return () => unsub(); // Cleanup subscription on component unmount
    }, []);


    const notif = () => {
        toast.success('Item successfully deleted!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

    const [deleteLink, setDeleteLink] = useState<string>('')

    const handleDelete = async (params: string) => {
        if (data && user?.uid) {
            try {
                const querySnapshot = await getDocs(collection(firestoreKey, 'userCollectionOfSave'));
                const existingUserDoc = querySnapshot.docs.find(doc => doc.data().Uid === user.uid);

                if (existingUserDoc) {
                    const userDocRef = doc(firestoreKey, 'userCollectionOfSave', existingUserDoc.id);

                    const updatedMyCollection = existingUserDoc.data().MyCollection.filter((item: ResponseObject) =>

                        item.Link !== params);

                    await updateDoc(userDocRef, {
                        MyCollection: updatedMyCollection,
                    });

                }
                fetchData()
                notif()
                setDeleteLink('')
            } catch (error) {
                console.error("Error deleting from collection: ", error);
            }
        }
    };


    const [citeObject, setCiteObject] = useState<ResponseObject | null>(null);
    const [boolRender, setBoolRender] = useState<boolean>(false);

    useEffect(() => {
        setBoolRender(citeObject !== null);
    }, [citeObject]);

    // Function to toggle boolRender
    const handleCloser = () => {
        setBoolRender(false);
    };

    // Function to open CiteComp with a new citeObject
    const openCiteComp = (newCiteObject: ResponseObject) => {
        setCiteObject(newCiteObject);
        setBoolRender(true);
    };

    const [deleteLinks, setDeleteLinks] = useState<number | null>(null)
    const [isRead, setIsRead] = useState<ResultType | null>(null)

    const handleDeletes = async (params: number) => {
        if (data && user?.uid) {
            try {
                const querySnapshot = await getDocs(collection(firestoreKey, 'userCollectionOfSave'));
                const existingUserDoc = querySnapshot.docs.find(doc => doc.data().Uid === user.uid);

                if (existingUserDoc) {
                    const userDocRef = doc(firestoreKey, 'userCollectionOfSave', existingUserDoc.id);

                    const updatedMyCollection = existingUserDoc.data().MyBook.filter((item: ResultType) =>

                        item.id !== params);

                    await updateDoc(userDocRef, {
                        MyBook: updatedMyCollection,
                    });

                }
                fetchData()
                notif()
                setDeleteLinks(null)
            } catch (error) {
                console.error("Error deleting from collection: ", error);
            }
        }
    };
    const [onLoad, setOnLoad] = useState<boolean>(true)
    const [isId, setIsID] = useState<number | null>(null)
    const [isDownload, setIsDownload] = useState<number | null>(null)

    function handleLoad() {
        setOnLoad(false)
    }
    return (
        <div className='w-full h-full p-3'>
            <ToastContainer />

            {
                citeObject != null && boolRender &&
                <div>
                    <CiteComp closer={handleCloser} citeDetails={citeObject} />
                </div>
            }

            <Header bookSee={false} inputSee={false} />
            <div className='mt-[75px] bg-[#f3f2f2] border-[1px] w-full max-w-[1200px] mx-auto rounded-lg overflow-auto h-full min-h-[88vh] max-h-[88vh]'>
                <div className='h-auto py-3 flex w-full items-center justify-between px-5'>
                    <div className='font-bold text-3xl'>My Collection</div>
                    <div>
                        <FaInfoCircle />
                    </div>
                </div>
                <div className='h-[35px] flex gap-5 px-5 items-center border-b-[1px] border-b-[#c9c7c7]'>
                    <div
                        onClick={() => setTabination("Article")}
                        className={`cursor-pointer pb-[11px] ${tabination === "Article" ? 'border-b-[3px] font-semibold border-black' : ''}`}>
                        Article
                    </div>
                    <div
                        onClick={() => setTabination("Books")}
                        className={`cursor-pointer pb-[11px] ${tabination === "Books" ? 'border-b-[3px] font-semibold border-black' : ''}`}>
                        Books
                    </div>
                </div>

                {
                    tabination === 'Article' &&
                    <div className='w-full overflow-auto'>

                        {data.length > 0 ? (
                            data.map((filteredItem) => (
                                <div key={filteredItem.id} className='grid grid-cols-1 p-5 gap-3 lg:grid-cols-3 md:grid-cols-2 overflow-auto'>

                                    <>
                                        {filteredItem?.MyCollection?.length === 0 && <div>No items</div>}
                                        {filteredItem?.MyCollection?.slice().reverse().map((z) => (
                                            <div className='cursor-pointer flex items-start flex-col bg-[#3d3d3d] text-white p-3 rounded-lg'>


                                                <div className='font-semibold'>{z.Title}</div>
                                                <div className='text-blue-300 break-words whitespace-normal break-all'>
                                                    {z.Link}</div>
                                                <div className='text-gray-400'>Publisher: {z.Publisher}, {z.Year}</div>
                                                <div className='text-gray-400'>Updated: {z.Updated}</div>

                                                <div className='mt-auto h-[50px] flex items-end'>
                                                    {
                                                        z.Link === deleteLink ?
                                                            <div className='flex gap-3'>

                                                                <div
                                                                    onClick={() => { handleDelete(z.Link) }}
                                                                    className='bg-green-500 py-1 px-3 rounded-lg'>Confirm</div>
                                                                <div
                                                                    onClick={() => { setDeleteLink('') }}
                                                                    className='bg-red-500 py-1 px-3 rounded-lg'>Cancel</div>
                                                            </div>
                                                            :
                                                            <div className='flex gap-3'>
                                                                <div
                                                                    onClick={() => { setDeleteLink(z.Link) }}
                                                                    className='bg-red-500 py-1 px-3 rounded-lg'>Delete</div>
                                                                <div
                                                                    onClick={() => { openCiteComp(z) }}
                                                                    className='bg-green-500 py-1 px-3 rounded-lg'>Cite</div>
                                                                <div
                                                                    onClick={() => { window.open(z.Link, '_blank') }}
                                                                    className='bg-blue-500 py-1 px-3 rounded-lg'>Visit</div>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                </div>
                            ))
                        ) : (
                            <div className='text-center h-full m-3'>
                                No data available
                            </div>
                        )}
                    </div>
                }
                {
                    isRead != null && isRead.id === isId &&
    
                    <div
                        onClick={() => { setIsRead(null) }}
                        className='modalPos rounded-lg overflow-hidden flex flex-col'>
                        <div
                            onClick={() => { setIsRead(null); }}
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
                            src={isRead?.formats['text/html']?.replace('http://', 'https://')}
                            onLoad={handleLoad}
                            type="" />
                    </div>
                }
                {
                    isRead != null && isRead.id === isDownload &&
                    <div
                    onClick={() => {setIsDownload(null)}}
                    className='modalPos rounded-lg overflow-hidden flex flex-col'>
                        
                        <div 
                        onClick={(e) => {e.stopPropagation()}}
                        className='bg-[#f9f9f9]  w-[400px] h-[500px] rounded-lg overflow-hidden'>
                            <div className='flex justify-between px-3 py-2 bg-[#e6e6e6]'>
                                <div className='cursor-pointer flex items-center' onClick={() => {setIsDownload(null)}}> <IoMdClose /></div>
                                <div>Download As</div>
                            </div>
                            <div className='w-full h-full flex flex-col px-3 py-2 gap-3'>
                                <div
                                className='w-full h-[50px] max-h-[50px] flex items-center justify-center rounded-lg text-black font-semibold cursor-pointer bg-green-300'
                                 onClick={() => {window.open(isRead?.formats?.['application/epub+zip'], "_blank")}}>
                                    EPUB
                                </div>
                                <div
                                className='w-full h-[50px] max-h-[50px] flex items-center justify-center rounded-lg text-black font-semibold cursor-pointer bg-blue-300'

                                 onClick={() => {window.open(isRead?.formats?.['application/octet-stream'], "_blank")}}>
                                    ZIP
                                </div>
                                <div
                                className='w-full h-[50px] max-h-[50px] flex items-center justify-center rounded-lg text-black font-semibold cursor-pointer bg-yellow-300'
                                 onClick={() => {window.open(isRead?.formats?.['application/x-mobipocket-ebook'], "_blank")}}>
                                    MOBI
                                </div>
                                <div
                                className='w-full h-[50px] max-h-[50px] flex items-center justify-center rounded-lg text-black font-semibold cursor-pointer bg-orange-300'
                                 onClick={() => {window.open(isRead?.formats?.['application/rdf+xml'], "_blank")}}>
                                    RDF
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    tabination === 'Books' &&

                    <div className='w-full overflow-auto'>
                        {data.length > 0 ? (
                            data.map((filteredItem) => (
                                <div key={filteredItem.id} className='grid grid-cols-1 p-5 gap-3 lg:grid-cols-3 md:grid-cols-2 overflow-auto'>
                                    <>
                                        {filteredItem?.MyBook?.length === 0 && <div>No items</div>}
                                        {filteredItem?.MyBook?.slice().reverse().map((z) => (
                                            <div className='cursor-pointer flex flex-col items-start gap-3  bg-[#383636] text-white p-3 rounded-lg'>
                                                <div className='flex gap-3 p-3'>
                                                    <div className='h-[250px] w-[200px] flex items-start bg-red-300 overflow-hidden rounded-lg'>
                                                        <img
                                                            className='object-cover w-full h-full'
                                                            src={z.formats['image/jpeg']} alt="" />
                                                    </div>
                                                    <div className='flex flex-col gap-2 w-[50%] break-all break-words'>
                                                        <div className='font-semibold'>
                                                            {z.title.length > 20 ? z.title.slice(0, 20) + '...' : z.title}
                                                        </div>
                                                        <div className='text-[13px] text-gray-300'>
                                                            Downloads: <span>{z.download_count}</span>
                                                        </div>
                                                        <div className='flex flex-wrap gap-2 text-[13px] text-gray-300'>
                                                            <div>Language:</div>
                                                            {
                                                                z.languages.map((x) => (
                                                                    <div>{x}</div>
                                                                ))
                                                            }
                                                        </div>
                                                        <div className='flex flex-wrap gap-2 text-[13px] text-gray-300'>
                                                            <div>Subjects</div>
                                                            {
                                                                z.subjects.slice(0, 1).map((x) => (
                                                                    <div>{x}</div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='px-3'>
                                                    {
                                                        z.id === deleteLinks ?
                                                            <div className='flex gap-3'>

                                                                <div
                                                                    onClick={() => { handleDeletes(z.id) }}
                                                                    className='bg-green-500 py-1 px-3 rounded-lg'>Confirm</div>
                                                                <div
                                                                    onClick={() => { setDeleteLinks(null) }}
                                                                    className='bg-red-500 py-1 px-3 rounded-lg'>Cancel</div>
                                                            </div>
                                                            :
                                                            <div className='flex gap-3 flex-wrap'>
                                                                <div
                                                                    onClick={() => { setDeleteLinks(z.id) }}
                                                                    className='bg-red-500 py-1 px-3 rounded-lg'>Delete</div>
                                                                <div
                                                                    onClick={() => { setIsRead(z); setIsID(z.id) }}
                                                                    className='bg-green-500 py-1 px-3 rounded-lg'>Read</div>
                                                                <div
                                                                    onClick={() => { window.open(z.formats['text/html'], '_blank') }}
                                                                    className='bg-blue-500 py-1 px-3 rounded-lg'>Visit</div>
                                                                              <div
                                                                    onClick={() => { setIsDownload(z.id); setIsRead(z) }}
                                                                    className='bg-gray-500 py-1 px-3 rounded-lg'>Download</div>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                </div>
                            ))
                        ) : (
                            <div className='text-center h-full m-3'>
                                No data available
                            </div>
                        )}

                    </div>
                }
            </div>
        </div>
    );
}

export default SaveDatas;
