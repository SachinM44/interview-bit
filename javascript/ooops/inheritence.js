///so // encapsulation 
// abstraction 
// polymorphism 
// unheritence


/// so in object propgrmiing we connedece those functions into 
//single object and in that aboject , we cal those fn as methodes and those varible as properties 
/////so lest 
// so th eencapsutlation mean is protecting some varible by not exposing it //


// const age=18;
// const name=23
// const height=29

// function Person(age,name,height ){
//     return (age+name+height)
// }
////so here u wont able to access the varible since those thigns are treated as loca varible in the function scope and they are null or undifinned there, so all u need to either explicity metion or u need to remove those param 

// console.log(Person())
/////how to solve above thing in oooops

// let age=33;
// let name=23
// let height=29

// let emplayee={
//     /// and these are local to there only , not anywhere 
//     salary:33,
//     age:'1',
//   getWiegith: function(){
//     return this.age+this.salary
//   }
// }

// ////so once u delcared u have to accces that with ur object name only 

// console.log(emplayee.getWiegith())

///no the real encapsulation comes in ( so its just hidding somthign with not exposing to anything )

class Emplayee{
    #salary;
///and this is the varible delcared as called constructors
    constructor(name, salary){
        this.name=name
        this.#salary=this.#salary
    };
    ////so this function is called as the methodes
    getSalary(){
       return this.#salary
    }

    setSalary(amount){
        if(amount>0){
            this.#salary=amount
        }
    }
    
}

const p  = new Emplayee('sachin', 4884);
console.log(p.name)
console.log(p.getSalary(344))
console.log(p.setSalary())
 