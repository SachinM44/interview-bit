
interface ButtonProps {
    name: string,
    start?: () => void,
    onClick: () => void
}

const data=['banana', 'mango', 'cherry']

const Button = ({ name, onClick }: ButtonProps) => {
    return (
        <div className="flex flex-row">
            <button onClick={onClick}>{name}</button>
              {data.map((item,index)=>(
           <Text key={index}>{item}</Text>
              ))}
        </div>
    )
}

export default Button