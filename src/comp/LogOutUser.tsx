import React, { useEffect, useState } from 'react';
import { authKey } from '../firebase/FirebaseKey';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LogOutUser = (): [User | null, React.Dispatch<React.SetStateAction<User | null>>] => {
    const [user, setUser] = useState<User | null>(null);

    const nav = useNavigate()
    useEffect(() => {
        const unsub = onAuthStateChanged(authKey, (userCred) => {
            if (userCred?.emailVerified) {
                setUser(userCred); // Set the user or null
            } else {
                setUser(null)
                nav(-1)
            }
        });

        return () => unsub(); // Cleanup subscription on component unmount
    }, []);

    return [user, setUser];
}

export default LogOutUser;
