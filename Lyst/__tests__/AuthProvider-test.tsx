import React, { act } from 'react';
import { View, Text, Button } from 'react-native';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/providers/AuthProvider'

// Mock Firebase Authentication and Backend API call
    // Mocking Current User's token to return 'mock-token'
jest.mock('@/FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        currentUser: { 
            getIdToken: jest.fn().mockResolvedValue('mock-token') 
        }
    }
}));

jest.mock('firebase/auth', () => ({ 
    
    onAuthStateChanged: jest.fn((auth, callback) => {
        callback(null);
        return jest.fn();
    }),

    signInWithEmailAndPassword: jest.fn( () => 
        Promise.resolve({ 
            user: { 
                getIdToken: jest.fn().mockResolvedValue('mock-token'),
                email: 'test@gmail.com' }
        })
    ),
    
    createUserWithEmailAndPassword: jest.fn( () => 
        Promise.resolve({
            user: {
                getIdToken: jest.fn().mockResolvedValue('mock-token'),
                email: 'test@gmail.com' }   
        })
    ),

    signOut: jest.fn( () => Promise.resolve()),

}));

jest.mock('@/utils/api', () => ({ 
    getTasks: jest.fn( () => Promise.resolve([
        { id: '1', description: 'Sample Task 1'},
        { id: '2', description: 'Sample Task 2'}
    ]))
}));



// Sample Component to ensure the values are passed down. 
function TestComponent() {
    const { user, token, signIn, createUser, signOutUser } = useAuth();
    return (
        <View>
            <Text testID='user-email'>{user ? user.email : 'null'}</Text>
            <Text testID='token'>{token || 'null'}</Text>
            <Button title="Sign In" onPress={ () => signIn('test@gmail.com', 'qwerty')} />
            <Button title="Create User" onPress={ () => createUser('test@gmail.com', 'qwerty', 'qwerty')} />
            <Button title="Sign Out" onPress={ signOutUser } />
        </View>
    )
}


describe('AuthProvider', () => { 
    // Default Values
    it('default values are empty', () => {
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(getByTestId('user-email').props.children).toBe('null');
        expect(getByTestId('token').props.children).toBe('null');
    })
    
    // Sign In
    it('user-email and token is correct when signing in', async () => {
        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        await act(async () => {
            fireEvent.press(getByText('Sign In'));
        });
        await waitFor(() => {
            expect(getByTestId('user-email').props.children).toBe('test@gmail.com');
            expect(getByTestId('token').props.children).toBe('mock-token');
        });
    });

    // Create User
    it('creates user and sets user and token', async () => {
        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        await act(async () => {
            fireEvent.press(getByText('Create User'));
        });
        await waitFor(() => {
            expect(getByTestId('user-email').props.children).toBe('test@gmail.com');
            expect(getByTestId('token').props.children).toBe('mock-token');
        });
    });

    // Sign Out
    it('clears user-email and token field when signing out', async () => {
        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            fireEvent.press(getByText('Sign In'));

        });

        await waitFor( () => {
            expect(getByTestId('user-email').props.children).toBe('test@gmail.com');
            expect(getByTestId('token').props.children).toBe('mock-token');
        });

        await act(async () => {
            fireEvent.press(getByText('Sign Out'));
        });
        await waitFor( () => {
            expect(getByTestId('user-email').props.children).toBe('null');
            expect(getByTestId('token').props.children).toBe('null');
        })

    })

})