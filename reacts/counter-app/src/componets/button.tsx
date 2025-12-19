
interface ButtonProps {
    name: string,
    start?: () => void,
    onClick: () => void
}

const Button = ({ name, onClick }: ButtonProps) => {
    return (
        <div className="flex flex-row">
            <button onClick={onClick}>{name}</button>

        </div>
    )
}

export default Button