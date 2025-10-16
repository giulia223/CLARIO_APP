
import { Tabs } from 'expo-router'; // Important: Importă Tabs din 'expo-router'
import { Ionicons } from '@expo/vector-icons'; // Pentru iconițe


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'home') { // Numele rutei este numele fisierului (fara extensie)
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'todo') { // Numele rutei este numele fisierului
            iconName = focused ? 'list' : 'list-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen
        name="home" // Corespunde app/(tabs)/home.js
        options={{
          title: 'Acasă', // Titlul afișat în tab bar
         
        }}
      />
      <Tabs.Screen
        name="todo" // Corespunde app/(tabs)/todo.js
        options={{
          title: 'Task-uri', // Titlul afișat în tab bar
        }}
      />
      <Tabs.Screen
        name="account" // Corespunde app/(tabs)/todo.js
        options={{
          title: 'Account', // Titlul afișat în tab bar
        }}
      />
      {/* Adaugă mai multe Tabs.Screen-uri pentru alte pagini cu footer */}
    </Tabs>
  );
}