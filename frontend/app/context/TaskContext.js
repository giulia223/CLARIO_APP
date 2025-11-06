import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { Alert } from "react-native";
import AllBadges from "../data/badges";
import { addEventToGoogleCalendar } from '../services/googlecalendar';
import { tasksAPI, badgesAPI } from '../services/api';

export const TaskContext = createContext();

// Temporary userId until authentication is implemented
const TEMP_USER_ID = '507f1f77bcf86cd799439011';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [badges, setBadges] = useState([]);
  const [lastAddedTask, setLastAddedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const unlockedIdsRef = useRef(new Set()); // ids deja deblocate

  const [quickCheckDoneToday, setQuickCheckToday] = useState(false);

  // Load tasks and badges from backend on mount
  useEffect(() => {
    loadTasks();
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const fetchedBadges = await badgesAPI.getAll(TEMP_USER_ID);
      // Map backend badges to frontend badge objects
      const badgeIds = fetchedBadges.map(b => String(b.id));
      const frontendBadges = AllBadges.filter(b => badgeIds.includes(String(b.id)));
      
      // Update unlockedIdsRef with numeric IDs
      frontendBadges.forEach(badge => unlockedIdsRef.current.add(badge.id));
      
      setBadges(frontendBadges);
    } catch (error) {
      console.error('Failed to load badges:', error);
      // Fallback to empty array if API fails
      setBadges([]);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await tasksAPI.getAll(TEMP_USER_ID);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      // Fallback to empty array if API fails
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const completeQuickCheck = () => {
    if(quickCheckDoneToday) return;

    setQuickCheckToday(true);
    checkQuickCheckBadge();
  };

  const checkQuickCheckBadge = () => {
    const badge = AllBadges.find(b => b.type === 'quickCheck');

    if (!badge) return;
    if (unlockedIdsRef.current.has(badge.id)) return;

    setBadges(prev => {
      unlockedIdsRef.current.add(badge.id);
      Alert.alert("Congrats!", `You earned the badge: ${badge.name}`);
      return [...prev, badge];
    });
  };

  const addTask = async (text, token) => {
    if (!text.trim()) return;

    const now = new Date();
    
    try {
      // Create task in backend
      const newTask = await tasksAPI.create({
        userId: TEMP_USER_ID,
        text: text.trim(),
      });

      // Update local state
      setTasks((prev) => [...prev, newTask]);
      setLastAddedTask(newTask);

      // Add to Google Calendar if token provided
      if (token) {
        try {
          await addEventToGoogleCalendar(text, now, token);
          console.log('Task sincronizat cu Google Calendar');
        } catch (err) {
          console.error('Google Calendar sync failed', err);
        }
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      Alert.alert('Error', 'Failed to add task. Please try again.');
    }
  };

  // 🔹 Delete task
  const deleteTask = async (id) => {
    try {
      await tasksAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    }
  };

  // 🔹 Toggle task completion
  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => (t._id === id || t.id === id));
      const updatedData = {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      };

      await tasksAPI.update(id, updatedData);
      
      setTasks((prev) => {
        const updated = prev.map((t) =>
          (t._id === id || t.id === id)
            ? { ...t, ...updatedData, completedAt: !task.completed ? new Date() : null }
            : t
        );

        const toggledTask = updated.find((t) => (t._id === id || t.id === id));
        if (toggledTask.completed) checkBadges(updated);

        return updated;
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  // 🔹 Mark as complete
  const completeTask = async (id) => {
    try {
      const updateData = {
        completed: true,
        completedAt: new Date()
      };

      await tasksAPI.update(id, updateData);
      
      setTasks((prev) => {
        const updated = prev.map((t) =>
          (t._id === id || t.id === id) ? { ...t, ...updateData } : t
        );
        checkBadges(updated);
        return updated;
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
      Alert.alert('Error', 'Failed to complete task. Please try again.');
    }
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
      Alert.alert("🎉 Congratulations!", `You received the badge: ${badge.name}`);
    });
  };

  // 🔹 Check for badge by ID (called from actions)
  const checkForBadge = async (badgeId) => {
    try {
      // Normalize badgeId to number for comparison
      const numericId = typeof badgeId === 'string' ? parseInt(badgeId, 10) : badgeId;
      
      // Verifică dacă badge-ul există deja local
      if (unlockedIdsRef.current.has(numericId)) {
        return null;
      }

      // Apelează backend-ul pentru a verifica și adăuga badge-ul (convertim la string pentru API)
      const backendBadge = await badgesAPI.checkForBadge(TEMP_USER_ID, String(badgeId));
      
      // Dacă backend-ul returnează null, badge-ul există deja în baza de date
      if (!backendBadge) {
        // Badge-ul există deja, actualizează doar referința locală
        unlockedIdsRef.current.add(numericId);
        return null;
      }

      // Găsește badge-ul în lista predefinită (folosim numericId pentru comparare)
      const badge = AllBadges.find(b => b.id === numericId);
      
      if (!badge) {
        console.warn(`Badge with id ${badgeId} not found in AllBadges`);
        return null;
      }

      // Adaugă badge-ul în state local
      setBadges((prev) => {
        unlockedIdsRef.current.add(numericId);
        return [...prev, badge];
      });

      // Afișează alertă
      Alert.alert("🎉 Congratulations!", `You received the badge: ${badge.name}`);
      
      return badge;
    } catch (error) {
      console.error('Failed to check for badge:', error);
      return null;
    }
  };

  // 🔹 Add task to Google Calendar (exemplu)
  const addTaskToGoogleCalendar = () => {
    if (lastAddedTask) {
      console.log(`Task "${lastAddedTask.text}" added to Google Calendar`);
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
        checkForBadge,
        loading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

//npm run start -- --reset-cache

export default function __NonRouteTaskContext() { return null }