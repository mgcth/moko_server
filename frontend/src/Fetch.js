import { useState, useEffect } from "react";

function FetchSimple(url, type, header) {
    return fetch(url, {
        headers: header,
        method: type
    })
        .then(response => response.json())
        .then(data => data)
}

function Fetch(url, message, setData, setError) {
    const abortCont = new AbortController()
    message["signal"] = abortCont.signal

    fetch(url, message)
        .then(res => {
            if (!res.ok) {
                throw Error("Could not fetch data.")
            }
            return res.json()
        })
        .then(res => {
            setData(res);
            setError(null);
        })
        .catch(err => {
            if (err.name === "AbortError") {
                console.log("Aborted fetch.")
            } else {
                console.error(err);
                setError(err.message);
            }
        })

    return abortCont
}

function useFetchGet(url, type, header) {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const message = {
        method: type,
        headers: header
    }

    useEffect(() => {
        const abortCont = Fetch(url, message, setData, setError)

        return () => abortCont.abort;
    }, [url])

    return { data, error }
}

export { useFetchGet, Fetch, FetchSimple };