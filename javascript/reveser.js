    //function to reveser the string 

    let userName='i am sachin' 


    const reverse=()=>{

        let temp=''
        for(let i=userName.length-1; i>=0; i--){
         temp +=userName[i]
        }
        return temp
    }

console.log(reverse())


// but by js inbuilt function 

 const newStr= userName.split("").reverse().join("")
 console.log(newStr)