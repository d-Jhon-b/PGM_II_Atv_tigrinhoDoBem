import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tela1 from '../screens/tela1'
import Tela2 from '../screens/tela2'
import Tela3 from '../screens/tela3'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tela1" component={Tela1} />
      <Stack.Screen name="Tela2" component={Tela2} />
      <Stack.Screen
        name="Tela3"
        component={Tela3}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}