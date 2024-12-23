import { useCallback, useEffect, useState } from "react"

const useFetchState = (url, args, method = "POST") => {
    const [lastUrl, setLastUrl] = useState(null)
    const [lastArgs, setLastArgs] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    
    const onError = useCallback((error) => {
        setError(error)
        setLoading(false)
        setLoaded(false)
        setData(null)
    }, [])

    const onSuccess = useCallback((data) => {
        setError(null)
        setLoading(false)
        setData(data)
        setLoaded(true)
    }, [])

    const callReset = useCallback(() => {
        setLoading(false)
        setLoaded(false)
        setError(null)
        setData(null)
    }, [])

    const callFetch = useCallback (() => {
        callReset()
        if (!url) return
        setLoading(true)
        fetch(url, args)
        // .then(res=>method === "GET" ? res : res.json())
        .then(res=>res.json())
        .then(onSuccess)
        .catch(onError)
    }, [url, args, method, onError, onSuccess, callReset])

    useEffect(() => {
        console.log("useEffect", url, args)
        if (url !== lastUrl || args !== lastArgs) {
            callFetch()
            setLastUrl(url)
            setLastArgs(args)
        }
    }, [url, args, lastUrl, lastArgs, callFetch])

    return {
        loading,
        loaded,
        error,
        data,
        reset: callReset, fetch: callFetch,
    }
}

export default useFetchState