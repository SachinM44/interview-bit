///it will recives the todoiems as the prop and the prop will come from the parent componet 

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TodoInput = ({ onAddTodo }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAddTodo(input);
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Enter todo"
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
  },
});

export default TodoInput;