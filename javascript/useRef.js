import { useRef } from 'react';


///useRef will be be creates mutable referance that persisnta acroess thre renders and doent cause the rerenders , so it returns the ovjectwith the .current properrtly , and we can modify that using that .current property


const TextInput = () => {
    const inputRef = useRef(null);
    const counterRef = useRef(0);

    const isFoucused = () => {
        inputRef.current.foucus() /// so this going to be the current ref that accesd the current dom elemt


        const incrementCOunter = () => {
            counterRef.current += 1;
        }
    }

    return (
        <div>
            <input type="text" onClick={isFoucused} />
            <div onClick={incrementCOunter}>
                click me

            </div>
        </div>
    )


}