import React, { useContext, useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import URL from './URL';

// INTERFACES //
interface ContextProps {
    jwt: string;
    setJwt(jwt: string):void;
    isSidebarOpen: Boolean;
    toggleSidebar: React.MouseEventHandler;

    classicHS:string;
    setClassicHS(classicHS: string):void;
}

// CONTEXT //
const AppContext = React.createContext<ContextProps>(null!);
export function useGlobalContext() {
    return useContext(AppContext)
}

// APP PROVIDER //
export function AppProvider({children} : any) {

    // JWT Token Control //
    // ================  //
    const [jwt, setJwt] = useLocalStorage("jwt","");

    useEffect(() => {
        const checkStatus = async() => {
            try {
                const response = await fetch(URL+"/api/auth/allowed", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwt,
                    }                
                });                
                if(response.status!==200) setJwt("");
            } catch(err) {
                setJwt("");
                console.log(err);
            }            
        }
        checkStatus();
    }, [jwt, setJwt]);

    // Navbar / Sidebar  //
    // ================  //
    const [ isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    // High Score Tracker //
    // ================== //
    const [classicHS, setClassicHS] = useLocalStorage("classicHS","0");
    useEffect(() => {
        const fetchClassicHS = async() => {
            try {
                const response = await fetch(URL+"/api/score/getHighScore", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwt,
                    }                
                });
                const jsonResponse = await response.json();   
                if(response.status === 200) setClassicHS(String(jsonResponse.data));
            } catch(err) {
            }
            if(localStorage.getItem("classicHS") === '{}') {
                setClassicHS("0");
            }  
        }
        fetchClassicHS();   
        // eslint-disable-next-line react-hooks/exhaustive-deps     
    }, [jwt])

    useEffect(() => {
        const postClassicHS = async() => {
            try {  
                await fetch(URL+"/api/score/setHighScore/"+classicHS, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwt,
                    }                
                });
            } catch(err) {
                console.error(err);
            }
        }
        postClassicHS();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jwt, classicHS])

    // RETURN //
    return (
        <AppContext.Provider value={{
            jwt,
            setJwt,
            isSidebarOpen,
            toggleSidebar,
            classicHS,
            setClassicHS
        }}> { children } </AppContext.Provider>
    )
}

