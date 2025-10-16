import {StyleSheet, Text, View} from 'react-native'
import {useRootNavigationState, useRouter} from 'expo-router'
import {useEffect} from 'react'

export default function Start() {
  const router = useRouter();
  const rootNaviagtionState = useRootNavigationState() 

  useEffect(() =>{
    if (!rootNaviagtionState?.key) return;

    const timer = setTimeout(()=>{
       router.replace('/login');
    }, 3000)

    return () => clearTimeout(timer)
  }, [rootNaviagtionState])

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>HELP BUDDY</Text>     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  button: { fontSize: 18, color: 'blue' }
});



