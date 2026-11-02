
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView, View, Text, TextInput,
  Button, FlatList, Alert,
} from 'react-native';

const API = 'https://jsonplaceholder.typicode.com/users';

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);

  // GET: Retrieve users from the API
  const getUsers = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch users');
    }
  };

  // POST: Create a new user
  const addUser = async () => {
    if (!name || !email) {
      Alert.alert('Validation', 'Enter name and email');
      return;
    }

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email}),
      });

      if (!response.ok) throw new Error('POST failed');

      const data = await response.json();
      setUsers([data, ...users]);
      setName('');
      setEmail('');
      Alert.alert('Success', 'User added');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // PUT: Replace the selected user's data
  const updateUser = async () => {
    if (editId === null) {
      Alert.alert('Select a user first');
      return;
    }

    try {
      const response = await fetch(`${API}/${editId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email}),
      });

      if (!response.ok) throw new Error('PUT failed');

      const data = await response.json();
      setUsers(users.map(user =>
        user.id === editId ? {...user, ...data} : user
      ));
      Alert.alert('Success', 'User updated using PUT');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // PATCH: Update only the name field of the selected user
  const patchUser = async () => {
    if (editId === null || !name) {
      Alert.alert('Select a user and enter a name');
      return;
    }

    try {
      const response = await fetch(`${API}/${editId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name}),
      });

      if (!response.ok) throw new Error('PATCH failed');

      const data = await response.json();
      setUsers(users.map(user =>
        user.id === editId ? {...user, ...data} : user
      ));
      Alert.alert('Success', 'Name updated using PATCH');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // DELETE: Remove a user by ID
  const deleteUser = async id => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('DELETE failed');

      setUsers(users.filter(user => user.id !== id));
      Alert.alert('Success', 'User deleted');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // UI helper: Select a user and fill the input fields
  const selectUser = user => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  // UI: Display inputs, buttons, and users
  return (
    <SafeAreaView style={{flex: 1, padding: 15}}>
      <Text style={{fontSize: 22, fontWeight: 'bold'}}>
        REST API CRUD Demo
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{borderWidth: 1, padding: 8, marginTop: 8}}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{borderWidth: 1, padding: 8, marginTop: 8}}
      />

      <Button title="POST - Add User" onPress={addUser} />
      <Button title="PUT - Update User" onPress={updateUser} />
      <Button title="PATCH - Update Name" onPress={patchUser} />
      <Button title="GET - Refresh Users" onPress={getUsers} />

      <Text style={{marginTop: 10, fontWeight: 'bold'}}>
        Users (tap Select to edit)
      </Text>

      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <View style={{borderWidth: 1, padding: 8, marginTop: 8}}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>

            <Button
              title="Select"
              onPress={() => selectUser(item)}
            />

            <Button
              title="DELETE - Remove User"
              onPress={() => deleteUser(item.id)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
