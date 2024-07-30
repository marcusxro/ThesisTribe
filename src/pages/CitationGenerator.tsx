import React, { useEffect, useState } from 'react'
import { firestoreKey } from '../firebase/FirebaseKey'
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    DocumentData
} from 'firebase/firestore';

interface DataType {
    id: string;
    name: string;
    age: number;
}

const CitationGenerator: React.FC = () => {

    const [data, setData] = useState<DataType[]>([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | string>('');

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(firestoreKey, 'save'));
        const dataList: DataType[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as DataType[];
        setData(dataList);
    };

    const handleAdd = async () => {
        await addDoc(collection(firestoreKey, 'save'), { name, age: Number(age) });
        fetchData();
    };

    const handleUpdate = async (id: string) => {
        const userDoc = doc(firestoreKey, 'save', id);
        await updateDoc(userDoc, { name, age: Number(age) });
        fetchData();
    };

    const handleDelete = async (id: string) => {
        const userDoc = doc(firestoreKey, 'save', id);
        await deleteDoc(userDoc);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);




    return (
        <div>
            <h1>CRUD with Firebase Firestore</h1>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <button onClick={handleAdd}>Add</button>
            </div>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        {item.name} - {item.age}
                        <button onClick={() => handleUpdate(item.id)}>Update</button>
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CitationGenerator
