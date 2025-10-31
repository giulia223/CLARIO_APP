import { StyleSheet, Text, View, Pressable, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// import logo from 'Images/logo.png'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';


export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <Image source={logo} style={styles.logo} /> */}
      <Text style={styles.title}>Login / Create Account</Text>
      <Pressable onPress={() => router.replace('/tabs/home')}>
        <Text style={styles.button}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { fontSize: 18, color: 'blue' }
});
