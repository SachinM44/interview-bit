//// call is when ever u passign the 

function cook( arg2, arg3){
    console.log(`hello ${this.ar1}, and ${arg2}, and ${arg3}`)
}

const info={ar1:'laura'};

cook.call(info, 'dhd', 'dhhdh')

