


const arr1='sachin'
const arr2='kumar'

const alterNate=(a,b)=>{
    let temp=''
    let maxLenth=Math.max(a.length,b.length)
    for(let i=0; i<maxLenth; i++){
      if(a[i]) temp += a[i]
      if(b[i]) temp +=b[i]
    }
return temp
    
}

console.log(JSON.stringify(alterNate(arr1,arr2)))