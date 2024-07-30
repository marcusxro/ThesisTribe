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

import LogOutUser from '../comp/LogOutUser'
import 'react-toastify/dist/ReactToastify.css';

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
}

interface DataType {
    id: string;
    Uid: string;
    name: string;
    MyCollection: ResponseObject[];
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
            console.log('Filtered Data:', filteredData);
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


    useEffect(() => {
        console.log('Data:', data);
    }, [data]);

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



    return (
        <div className='w-full h-full p-3'>
                     <ToastContainer />

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
                                    {filteredItem.MyCollection.slice().reverse().map((z) => (
                                        <div className='cursor-pointer flex items-start flex-col bg-[#3d3d3d] text-white p-3 rounded-lg'>
                                            <div className='font-semibold'>{z.Title}</div>
                                            <div className='text-blue-300 break-words'>{z.Link}</div>
                                            <div className='text-gray-400'>Publisher: {z.Publisher}, {z.Year}</div>
                                            <div className='text-gray-400'>Updated: {z.Updated}</div>

                                            <div className='mt-3'>
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
                                                        <div
                                                            onClick={() => { setDeleteLink(z.Link) }}
                                                            className='bg-red-500 py-1 px-3 rounded-lg'>Delete</div>
                                                }
                                            </div>
                                        </div>
                                    ))}
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
                    tabination === 'Books' &&    
                      <div className='text-center h-full m-3'>
                    No data available
                    </div>
                }
            </div>
        </div>
    );
}

export default SaveDatas;
