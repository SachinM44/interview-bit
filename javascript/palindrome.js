// /// check id the string is palindrome or not 

// let userName="madadm" 

// const reversedName=userName.split('').reverse().join('');

// console.log(reversedName===userName) ///if its palindrom it wil proint true else thought false

// ////////////////next check is elements fo 2 arrays are eaual or not 


const arr1=[1,3,4,6]
const arr2=[1,3,4,6]

/// so here doing arr1==arr2 is not the good way
/// so stringy the both the array then use that 



const isEqual=(a,b)=>{
    if(a.length !== b.length) return false

    for(let i=0 ; i < a.length-1; i++){
        if(a[i]==b[i])
     return  true
    }
}

console.log(isEqual(arr1,arr2))


console.log(null==undefined)