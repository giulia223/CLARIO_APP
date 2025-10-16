
import React, { useState, useEffect } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ToastMessage = ({ message, visible, onDismiss }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Valoare inițială pentru opacitate

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1, // Arată mesajul (opacitate 1)
        duration: 300, // Durata animației de apariție
        useNativeDriver: true,
      }).start(() => {
        // După ce apare, lasă-l vizibil pentru 2 secunde, apoi dispare
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0, // Ascunde mesajul (opacitate 0)
            duration: 500, // Durata animației de dispariție
            useNativeDriver: true,
          }).start(() => {
            if (onDismiss) {
              onDismiss(); // Apelează funcția de închidere după dispariție
            }
          });
        }, 2000); // Mesajul rămâne vizibil timp de 2 secunde
      });
    }
  }, [visible, fadeAnim, onDismiss]); // Reface efectul când 'visible' se schimbă

  if (!visible && fadeAnim._value === 0) { // Nu randa nimic dacă nu e vizibil și e complet ascuns
    return null;
  }

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 50, // Poziționează mesajul în partea de jos a ecranului
    alignSelf: 'center', // Centrează orizontal
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundal semi-transparent
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: 1000, // Asigură că apare deasupra altor elemente
    width: width * 0.8, // Lățime de 80% din ecran
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ToastMessage;