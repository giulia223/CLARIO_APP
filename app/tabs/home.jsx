import {Modal, Alert, StyleSheet, Text, View , Button, Pressable, Dimensions, TextInput} from 'react-native'
import {useRouter} from 'expo-router'
import ToastMessage from '../components/toastMsg'; // Asigură-te că calea este corectă
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Stars from 'react-native-stars';
import { useMood } from '../context/MoodContext';
import { useTasks } from "../context/TaskContext";




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
      setQuestion('what made you happy today?')
      setMood(mood); 
    } else if (mood === 'sad') {
      showToast('Suntem aici să te ajutăm să te simți mai bine! 😕');
      setQuestion('what s on your mind?')
      setMood(mood); 
    } else if (mood === 'lazy') {
      showToast('E în regulă să te simți leneș! Fii blând cu tine. 😴');
      setQuestion('what would motivate you?')
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

      <View style={[styles.row, { height: '10%' }]}>
       <View style={styles.box}>
        <Text style={styles.citat}> {currentDate}</Text>
       </View>
      </View>

      <View>
      <Text style={styles.text}>How are u feeling today?</Text>
        <View style={styles.emojiContainer}> {}

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
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.list}>Today highlights </Text>
          
          {tasksToday && tasksToday.length > 0 ? (
            tasks.slice(0, 3).map((task, index)=>(
            tasksToday.map((task, index) => (
              <Text key={index} style={styles.list}></Text>
            ))
            ))
          )  : (
            <Text style={{ fontStyle: 'italic', color: 'gray' }}>
              You are free! 🎉
           </Text>
          )}
        </View>  
      </View>

      <Pressable  onPress={()=>router.push(('/tabs/todo'))}>
        <Text style={{color: 'blue', margin: 10}}>See complete list..</Text>
      </Pressable>

      <View>    

        <Text>Quick checks</Text>

        <Text>Sleep</Text>
        <View style={{alignItems:'center'}}>
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

        <Text>Energy</Text>
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
      </View>
      


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
              placeholder="Scrie răspunsul tău..."
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
          <Text style={styles.modalText}>Mulțumim pentru răspuns! 🌟</Text>
          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
            E important că ai împărtășit asta. Ai vrea să continui analiza mood-ului?
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
      backgroundColor: '#f0f0f0',    
    },
     row: {
      flexDirection: 'row', 
    },
    box: {
      flex: 1, 
      justifyContent: 'center',
    },
    button:{
      backgroundColor: 'white',
      padding: 10,
      width: '50%'
    },
    citat:{
      fontSize: 18,
      fontStyle: 'italic',
      textAlign: 'center',
      color: 'gray'
    },
    list:{
      fontSize: 20,
      fontStyle: 'italic'
    },
     emojiContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20, // Spațiu de la margini
  },
  emoji: { 
    fontSize: 40, 
    padding: 10, 
  }, 
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeBtn: {
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
  width: '100%',
  minHeight: 60,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 15,
  textAlignVertical: 'top',
},
})

export default Home