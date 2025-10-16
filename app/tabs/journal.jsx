import React, {useState, useRef, useEffect} from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Linking, Button, TextInput , Modal, ScrollView} from 'react-native';
import { useMood } from '../MoodContext';
import { Audio } from "expo-av";

const videoData = {
  happy: [
    {
      id: '1',
      title: 'Motivație și energie pozitivă',
      thumbnail: 'https://img.youtube.com/vi/ZbZSe6N_BXs/0.jpg',
      url: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs', 
    },
    {
      id: '2',
      title: 'Powerful Mindset',
      thumbnail: 'https://img.youtube.com/vi/UNQhuFL6CWg/0.jpg',
      url: 'https://www.youtube.com/watch?v=UNQhuFL6CWg',
    },
  ],
  sad: [
    {
      id: '3',
      title: 'Calm & Peaceful Music',
      thumbnail: 'https://img.youtube.com/vi/1ZYbU82GVz4/0.jpg',
      url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    },
    {
      id: '4',
      title: 'You are not alone',
      thumbnail: 'https://img.youtube.com/vi/8Q5L3Q9Lyt8/0.jpg',
      url: 'https://www.youtube.com/watch?v=8Q5L3Q9Lyt8',
    },
  ],
  lazy: [
    {
      id: '5',
      title: 'Focus Boost',
      thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/0.jpg',
      url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    },
    {
      id: '6',
      title: 'Pomodoro Study Music',
      thumbnail: 'https://img.youtube.com/vi/2OEL4P1Rz04/0.jpg',
      url: 'https://www.youtube.com/watch?v=2OEL4P1Rz04',
    },
  ]
};

const Journal = () => {
  const { mood } = useMood();

  const openVideo = (url) => {
    Linking.openURL(url);
  };

  const renderVideo = ({ item }) => (
    <TouchableOpacity onPress={() => openVideo(item.url)} style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  

    const [state, setState] = useState(false)
    const [timeLeft, setTimeLeft] = useState(1500)
    const intervalRef = useRef(null) //avoid stale closures

    const [modalVisible, setModalVisible] = useState(false)
    const [customMinutes, setCustomMinutes] = useState('')

    const soundRef = useRef(null)

    useEffect(() =>{
      if(state) {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) =>{
            if (prev > 0) {
              return prev - 1
            } else {
              clearInterval(intervalRef.current)
              setState(false)
              playSound()
              return 0
            }
          })
        }, 1000)
      } else {
        clearInterval(intervalRef.current)
      }

      return () => clearInterval(intervalRef.current)
    }), [state]

    const playSound = async () => {
      const {sound } = await Audio.Sound.createAsync(
        // require("../../assets/music")
      )
      soundRef.current = sound
      await sound.playAsync() 
    }

    const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
    };

    const handleSetCustomTime = () => {
      const minutes = parseInt(customMinutes)
      if(!isNaN(minutes) && minutes > 0) {
        setTimeLeft(minutes * 60)
      }
      setModalVisible(false)
    }

    const [sound, setSound] = useState(null);

  async function playSound1(track) {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      track
    );
    setSound(newSound);
    await newSound.playAsync();
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
    }
  }
  

  return (
     <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
    <View style={styles.container}>
      <Text style={styles.header}>Recomandari video pentru starea ta: {mood || "?"}</Text>
      {mood && (
        <FlatList
          data={videoData[mood]}
          renderItem={renderVideo}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      )}
      {!mood && <Text style={styles.noMood}>Selectează o stare în pagina Home pentru a primi recomandări.</Text>}
    </View>
    <View style={styles.timerContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      </TouchableOpacity>
      <Button
        title={state ? "Pause" : "Start"}
        onPress={() => setState((prev) => !prev)}
      />
      <Button
        title="Reset"
        onPress={() => {
          clearInterval(intervalRef.current);
          setState(false);
          setTimeLeft(25 * 60);
        }}
      />
    </View>

    <Modal visible={modalVisible} transparent animationType="slide">
      <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Seteaza minutele:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={customMinutes}
              onChangeText={setCustomMinutes}
            />
            <Button title="OK" onPress={handleSetCustomTime} />
            <Button title="Anuleaza" onPress={() => setModalVisible(false)} />
          </View>
        </View>
    </Modal>
    </ScrollView>
  );
};

export default Journal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    marginRight: 16,
    width: 160,
    alignItems: 'center',
  },
  thumbnail: {
    width: 160,
    height: 90,
    borderRadius: 8,
  },
  title: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },
  noMood: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
  },
   timer: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center", width: 250 },
  input: { borderWidth: 1, borderColor: "gray", borderRadius: 5, width: "100%", padding: 8, textAlign: "center" },
});
