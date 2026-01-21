


const outFN=()=>{
    let counter=0
    return ()=>{
        counter=counter+3;
        return counter
    }
}

const result=outFN();
console.log(result())
console.log(result())
console.log(result())