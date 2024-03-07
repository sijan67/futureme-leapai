//source: https://javascript.plainenglish.io/bottom-tab-navigation-like-instagram-using-react-native-expo-96dec9279eaa

import React, { useState } from 'react';
import Dashboard from '../screens/DashboardPage/DashboardPage';
import Map from '../screens/ProfilePage/ProfilePage';
import WelcomeScreen from '../screens/WelcomePage/WelcomePage';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NavigationContainer } from '@react-navigation/native';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import { DraggedLocationProvider } from './DraggedLocationContext';
import { useAppContext } from '../context/AppContext';

// source: https://stackoverflow.com/questions/74719540/how-can-i-remove-the-rounded-shape-around-my-selected-tab-text 

import {
    MD3LightTheme as DefaultTheme,
    Provider as PaperProvider,
  } from "react-native-paper";

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      secondaryContainer: "#9DD9D2",
    },
};

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator labeled={false} barStyle={{ backgroundColor: '#3AA7A3' }} activeColor="white">
        <Tab.Screen name="Dashboard" component={Dashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" color={color} size={26}/>
            ),
        }}/>
        <Tab.Screen name="Map" component={Map}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={26}/>
            ),
        }}/>
    </Tab.Navigator>
  )
}

export default function Navigator() {
  const { showWelcome, setShowWelcome } = useAppContext();
  
    return (
      <NavigationContainer>
        <PaperProvider theme={theme}>
        <DraggedLocationProvider>
          <Stack.Navigator>
            {showWelcome ? (
              <Stack.Screen
                name="Welcome"
                options={{ headerShown: false }} // Hide the title of the Welcome screen
              >
                {(props) => <WelcomeScreen {...props} setShowWelcome={setShowWelcome} />}
              </Stack.Screen>
            ) : null}
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }} // Hide the title of the Home screen
            />
          </Stack.Navigator>
          </DraggedLocationProvider>
        </PaperProvider>
      </NavigationContainer>
    );
            }