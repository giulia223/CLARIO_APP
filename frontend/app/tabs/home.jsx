import {Modal, Alert, StyleSheet, Text, View , Button, Pressable, Dimensions, TextInput} from 'react-native'
import {useRouter} from 'expo-router'
import ToastMessage from '../components/toastMsg'; // Asigură-te că calea este corectă
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Stars from 'react-native-stars';
import { useMood } from '../context/MoodContext';
import { useTasks } from "../context/TaskContext";
import Card from '../components/ui/Card';
import { Title, Subtitle, Body } from '../components/ui/StyledText';
import { theme } from '../theme';




const Home = () => { 
  const { completeQuickCheck } = useTasks()
  const router=useRouter(); 
  const tasks=['1', '2', '3']

  const [modalVisible, setModalVisible] = useState(false)
  const [question, setQuestion] = useState('')

  const [sleepStars, setSleepStars] = useState(0);
  const [energyStars, setEnStars] = useState(0);

  useEffect(() => {
  
  if (sleepStars > 0 && energyStars > 0) {
    completeQuickCheck(); 
  }
}, [sleepStars, energyStars]);


  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [text, setText] = useState('')
  const [step, setStep] = useState('question')

  const { setMood } = useMood();

  const showToast = (message) => {
    setToastMessage(message)
    setToastVisible(true)

    setTimeout(() => {
      setToastVisible(false)
      setModalVisible(true)
    },2500)
  }

  const handleMood =  (mood) => {
    if (mood === 'happy') {
      showToast('Keep up the positive vibes! 😄');
      setQuestion('What made you happy today?')
      setMood(mood); 
    } else if (mood === 'sad') {
      showToast("We're here to help you feel better! 😕");
      setQuestion("What's on your mind?")
      setMood(mood); 
    } else if (mood === 'lazy') {
      showToast("It's okay to feel low-energy. Be kind to yourself. 😴");
      setQuestion('What would motivate you?')
      setMood(mood); 
    }
  }
  //task for googleCalendar
  const today = new Date();
  const tasksToday = tasks.filter(task => {
    if (!task.createdAt) return false;
    const d = new Date(task.createdAt);
    return d.toDateString() === today.toDateString();
  });


  
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() =>{
      const dateObject = new Date();
      var date = dateObject.getDate();
      var month = dateObject.getMonth() + 1; 
      var year = dateObject.getFullYear();
      setCurrentDate(
        date+'.'+month+'.'+year
      )
  }, [])
  
  return (
    <View style={styles.container}>

      <ToastMessage
        message={toastMessage}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      <Card style={{ marginBottom: 20 }}>
        <Title style={{ marginBottom: 6 }}>Welcome!</Title>
        <Subtitle>{currentDate}</Subtitle>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <Subtitle style={{ marginBottom: 10 }}>How are you feeling today?</Subtitle>
        <View style={styles.emojiContainer}>

          <TouchableOpacity onPress={() => handleMood("happy")}>
            <Text style={styles.emoji}>😄</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleMood("sad")}>
            <Text style={styles.emoji}>😕</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleMood("lazy")}>
            <Text style={styles.emoji}>😴</Text>
          </TouchableOpacity>

        </View>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <Subtitle style={{ marginBottom: 10 }}>Today highlights</Subtitle>
        {tasksToday && tasksToday.length > 0 ? (
          tasksToday.slice(0, 3).map((task, index) => (
            <Body key={task._id || task.id || index} style={{ marginBottom: 6 }}>• {task.text}</Body>
          ))
        )  : (
          <Body style={{ fontStyle: 'italic', color: '#A7B0C4' }}>
            You are free! 🎉
          </Body>
        )}
        <Pressable onPress={()=>router.push(('/tabs/todo'))}>
          <Text style={styles.link}>See complete list →</Text>
        </Pressable>
      </Card>

      <Card>
        <Subtitle style={{ marginBottom: 10 }}>Quick checks</Subtitle>
        <Body style={{ marginBottom: 8 }}>Sleep</Body>
        <View style={{alignItems:'center', marginBottom: 12}}>
          <Stars
            half={false}
            default={sleepStars}
            update={(val) => setSleepStars(val)}
            spacing={4}
            starSize={40}
            count={5}
            fullStar={require('../../assets/Images/filled_star.png')}
            emptyStar={require('../../assets/Images/empty_star.png')}
            />
        </View>

        <Body style={{ marginBottom: 8 }}>Energy</Body>
        <View style={{alignItems:'center'}}>
          <Stars
            half={false}
            default={energyStars}
            update={(val) => setEnStars(val)}
            spacing={4}
            starSize={40}
            count={5}
            fullStar={require('../../assets/Images/filled_star.png')}
            emptyStar={require('../../assets/Images/empty_star.png')}
          />
        </View>
      </Card>
      


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {step === 'question' && (

            <>
            <Text style={styles.modalText}>{question}</Text>

            <TextInput
              style={styles.input}
              placeholder="Write your response..."
              value={text}
              onChangeText={text => setText(text)}
              multiline={true}
            />
            <TouchableOpacity
              onPress={() => {
                setStep('response')
              }}>
                <Text style={styles.closeBtn}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtn}>Later</Text>
            </TouchableOpacity>
            </>
    )}
            {step === 'response' && (
               <>
          <Text style={styles.modalText}>Thanks for your response! 🌟</Text>
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
            It matters that you shared this. Would you like to continue mood analysis?
          </Text>

            <TouchableOpacity
              onPress={() => { //redirect pag 
                router.push(('/tabs/journal'))
                setModalVisible(false);
                setText('');
                setStep('question');
              }}>
              <Text style={{ color: 'green' }}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setText('');
                setStep('question');
              }}
            >
               <Text style={{ color: 'red' }}>Later</Text>
            </TouchableOpacity>
        </>
      )}      
          </View>
        </View>
      </Modal>
    </View> 
  )
}



const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background
  },
  emojiContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  emoji: { 
    fontSize: 40, 
    padding: 10
  }, 
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#181C2F',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3152'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#E6EAF3'
  },
  closeBtn: {
    color: '#5B8DEF',
    fontWeight: 'bold',
    marginTop: 10
  },
  input: {
    width: '100%',
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#2A3152',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    color: '#E6EAF3'
  },
  link: {
    color: '#5B8DEF',
    marginTop: 10,
    fontWeight: '600'
  }
})

export default Home