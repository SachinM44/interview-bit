//// so this will recives the on toggle and the ondelete and the todo with it will loop it with todo item id 

import { Pressable, View } from "react-native"



const TodoItem=({todo, onTogle, onDelete})=>{
    return(

        <View style={{flexDirection:'row', alignItems:'center', borderColor:'red', }}>
/////first wee need the checklist that will cover the condtional redering 
    <Pressable onPress={()=>ontoggle(todo.id)} style={{completed:textDecorationLine:'line-graph', color:'red'}}>
        {todo.com}
    </Pressable>
        </View>

    )

}