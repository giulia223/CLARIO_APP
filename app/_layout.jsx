import {Stack} from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MoodProvider } from './MoodContext';
import { TaskProvider } from './TaskContext';
import { Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;


import TodoPage from "./tabs/todo";
import AccountPage from "./tabs/account";

export default function Layout() {
  return (
    <TaskProvider>
    <MoodProvider>
    <GestureHandlerRootView style={styles.container}>
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#3aaf3cff' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="account" options={{ title: 'Account' }} />
       <Stack.Screen
        name="tabs" 
        options={{
          headerShown: false, 
          title: 'Main App' 
        }}
      />
    </Stack>
    </GestureHandlerRootView>
    </MoodProvider>
    </TaskProvider>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
})



