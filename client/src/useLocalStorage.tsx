import { useState, useEffect } from 'react'

const getLocalStorage = (key:any, initialValue:any) => {
    const storedValue = JSON.parse(localStorage.getItem(key) || '{}');
    if (storedValue) return storedValue
    return initialValue
}

export default function useLocalStorage(key:any, initialValue:any) {
    const [value, setValue] = useState(() => {
        return getLocalStorage(key, initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}