const arr=[3,44,20,23,45,]

const sorted=arr.sort((a,b)=> a-b);
console.log(sorted)
console.log(sorted[sorted.length-2])

const str='hellow word';

let result=''
for(let i=str.length-1; i>=0; --i){
    result +=str[i] 
}

console.log(result)