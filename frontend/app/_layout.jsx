import {Stack} from 'expo-router'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MoodProvider } from './context/MoodContext';
import { TaskProvider } from './context/TaskContext';
import { Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;


import TodoPage from "./tabs/todo";
import AccountPage from "./tabs/account";
import { theme } from './theme';

export default function Layout() {
  return (
    <TaskProvider>
    <MoodProvider>
    <GestureHandlerRootView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
    <Stack screenOptions={{
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.textPrimary,
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      
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
  container: { flex: 1, backgroundColor: theme.colors.background },
})



