// useDebounce.ts  (the fixed hook above)

// SearchComponent.tsx
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";

interface Result {
    id: number;
    title: string;
}

export default function SearchComponent() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const fetchResults = async (searchTerm: string) => {
    //     if (!searchTerm.trim()) {
    //         setResults([]);
    //         return;
    //     }
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const res = await fetch(
    //             `https://jsonplaceholder.typicode.com/posts?title_like=${searchTerm}`
    //         );
    //         if (!res.ok) throw new Error("Failed to fetch");
    //         const data: Result[] = await res.json();
    //         setResults(data.slice(0, 8)); // limit to 8 results
    //     } catch (err) {
    //         setError("Something went wrong. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchResults = (serchTerm: string) => {
        if (!serchTerm.trim()) {
            setResults([])
            return;
        }
        setLoading(true);
        setError(null);

        try {

            fetch(`https://jsonplaceholder.typicode.com/posts?title_like=${serchTerm}`)
                .then(res => res.json())
                .then((data) => {
                    setQuery(data)
                })


        } catch (err) {
            console.log(err)
        }


    }



    const debouncedSearch = useDebounce({
        delay: 5000,
        fn: fetchResults
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('somthing went wrong ')
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    return (
        <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
            <h2>🔍 Debounced Search</h2>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search posts..."
                style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
            />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {results.map((r) => (
                    <li key={r.id}>{r.title}</li>
                ))}
            </ul>
        </div>
    );
}
