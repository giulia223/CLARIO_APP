import React, { createContext, useState, useContext, useRef } from "react";
import { Alert } from "react-native";
import AllBadges from "./data/badges";
import { useGoogleAuth } from './googleAuth';
import { addEventToGoogleCalendar } from './googlecalendar';
export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    { id: "1", text: "1", completed: false, completedAt: null },
    { id: "2", text: "2", completed: false, completedAt: null },
  ]);
  const [badges, setBadges] = useState([]);
  const [lastAddedTask, setLastAddedTask] = useState(null);

  const unlockedIdsRef = useRef(new Set()); // ids deja deblocate

  
  const [quickCheckDoneToday, setQuickCheckToday] = useState(false)

  const completeQuickCheck = () => {
    if(quickCheckDoneToday) return

    setQuickCheckToday(true)

    checkQuickCheckBadge()
  }

  const checkQuickCheckBadge = () => {
    const badge = AllBadges.find(b => b.type === 'quickCheck')

    if (!badge) return
    if (unlockedIdsRef.current.has(badge.id)) return

    setBadges(prev => {
      unlockedIdsRef.current.add(badge.id)
      Alert.alert("Congrats!", `You earned the badge: ${badge.name}`)
      return [...prev, badge]
    })
  }
  
  

const addTask = async (text, token) => {
  if (!text.trim()) return;

  const now = new Date();
  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: now,
    completedAt: null,
  };

  setTasks((prev) => [...prev, newTask]);
  setLastAddedTask(newTask);

  if(!token) {
    console.warn('no token provided');
    return ;
  }

  try {
    await addEventToGoogleCalendar(text, now, token);
    console.log('Task sincronizat cu Google Calendar');
  } catch (err) {
    console.error('Google Calendar sync failed', err);
  }
};


  // 🔹 Sterge task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 🔹 Toggle completare task
  const toggleTask = (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : null }
          : t
      );

      const toggledTask = updated.find((t) => t.id === id);
      if (toggledTask.completed) checkBadges(updated);

      return updated;
    });
  };

  // 🔹 Marcare complet
  const completeTask = (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: true, completedAt: new Date() } : t
      );
      checkBadges(updated);
      return updated;
    });
  };

  // 🔹 Check badges
  const checkBadges = (currentTasks) => {
    const completedCount = currentTasks.filter((t) => t.completed).length;

    const newUnlocked = AllBadges.filter(
      (b) => !unlockedIdsRef.current.has(b.id) && completedCount >= b.unlockAt
    );

    if (newUnlocked.length === 0) return;

    setBadges((prev) => {
      newUnlocked.forEach((b) => unlockedIdsRef.current.add(b.id));
      return [...prev, ...newUnlocked];
    });

    newUnlocked.forEach((badge) => {
      Alert.alert("🎉 Felicitări!", `Ai primit insigna: ${badge.name}`);
    });
  };

  // 🔹 Add task to Google Calendar (exemplu)
  const addTaskToGoogleCalendar = () => {
    if (lastAddedTask) {
      console.log(`Task "${lastAddedTask.text}" adaugat in Google Calendar`);
      setLastAddedTask(null);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTask,
        completeTask,
        lastAddedTask,
        addTaskToGoogleCalendar,
        badges,
        completeQuickCheck,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

//npm run start -- --reset-cache