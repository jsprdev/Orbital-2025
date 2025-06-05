// THIS IS A TEMPORARY COMPONENT
// It is used to fetch the list of todos from the backend API

import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import axios from 'axios';

export default function ListOfTodo({ token }) {
    // Ensure token is provided
    useEffect(() => {
        if (!token) {
            console.error('No token provided');
            return;
        }
        fetchTodos(token);
    }, [token]);

    // Function to fetch todos from backend API
    const fetchTodos = async (token) => {
        try {
            const response = await axios.get('http://localhost:3000/api/task', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    return (
        <View>
            <Text>ListOfTodo</Text>
        </View>
    )
}