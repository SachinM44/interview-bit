// waiter 

function cook(ing, ing2, in3){
    console.log(`${this.name} is having the ${ing} ${ing2} ${in3}`)
}
const adam={name: "adam"}
cook.call(adam, 'rice', 'plat', 'chiken')
// what the thing here is that by using the call ican pass the argument to the function 
// basically it call the parameters one by one 
//////////////////////////////////////
// / in the applay it set to array but not the list as mentioned above 
cook.call(adam, ['rice', 'plat', 'chiken'])
////////////

///
/// call - runs the function immidiatly ,  passing each argument separetly 
// applay-where the apply do that same but it pass the argument in an array format 
// bind- creates a new function with present this and argument which u can call later 
