import { asyncWrapProviders } from "async_hooks";
import { useEffect, useState, useTransition } from "react"


export const useFetch = (url: string) => {
    const [loading, setLoading] = useState(true);
    const [data, setDate] = useState();

    useEffect(() => {

        const fetchAPi = async () => {
            const data = await fetch(url);
            const respose = await data.json()
            setDate(respose)
            setLoading(false)

        }

        fetchAPi()
    }, [url])
}