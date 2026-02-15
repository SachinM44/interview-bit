//// so this will recives the on toggle and the ondelete and the todo with it will loop it with todo item id 

import { Pressable, View } from "react-native"



const TodoItem=({todo, onTogle, onDelete})=>{
    return(

        <View style={{flexDirection:'row', alignItems:'center', borderColor:'red', }}>
    <Pressable onPress={()=>ontoggle(todo.id)} style={{
        textDecorationLine: todo.completed? 'line-through' : 'none',
          color:'red'}}>
        {todo.text}
    </Pressable>
       
    <Pressable onPress={()=>onDelete(todo.id)} >
        <Text style={{color: 'red'}}>delete</Text>
    </Pressable>

        </View>

    )

}

export default TodoItem