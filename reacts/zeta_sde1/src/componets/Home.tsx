import { useNavigate } from "react-router-dom"

export const Home = () => {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate('/counter')
    }
    return (
        <div style={{
            display: "flex",
            flexDirection:'column',
            gap:'10',
            padding:'33',
            justifyContent: 'center',
            alignContent: 'center',
    
        }}>
            <p>hello from Home page</p>
            <button onClick={handleNavigate} style={{ color: 'blue' }}>Link</button>
        </div>
    )
}