import { View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import GeneratePlanButton from './GeneratePlanButton';

export default function GeneratePlan() {

    const handlePress = () => {
        router.push('/(plans)/route-selection');
    }

    return (
        <View>
            <GeneratePlanButton handlePress={handlePress} />
        </View>
    )
}