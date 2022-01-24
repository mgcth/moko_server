import { useState, useEffect } from "react";

const useFetchGet = (url) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        const abortCont = new AbortController();

        fetch(url, { signal: abortCont.signal })
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
            }
            )

        return () => abortCont.abort;
    }, [url])

    return { data, error }
}
export { useFetchGet };