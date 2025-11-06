// import React, { useContext, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import Checkbox from "expo-checkbox";
// import * as Progress from "react-native-progress";
// import { TaskContext } from "../TaskContext";

// export default function TodoPage() {
//   const { tasks, addTask, deleteTask, toggleTask, lastAddedTask, addTaskToGoogleCalendar } =
//     useContext(TaskContext);

//   const [newTask, setNewTask] = useState("");

//   const { promptAsync } = useGoogleAuth();

//   const completedCount = tasks.filter((t) => t.completed).length;
//   const totalCount = tasks.length;
//   const progress = totalCount > 0 ? completedCount / totalCount : 0;

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 24, marginBottom: "15%", marginTop: "10%" }}>
//         Toate task-urile
//       </Text>

//       <Text style={{ fontSize: 16, marginBottom: 10 }}>
//         Progress: {completedCount}/{totalCount}
//       </Text>

//       <Progress.Bar
//         progress={progress}
//         width={Dimensions.get("window").width - 40}
//         color="#007AFF"
//         height={12}
//         borderRadius={6}
//       />

//       <FlatList
//         data={tasks}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               marginBottom: 5,
//               alignItems: "center",
//             }}
//           >
//             <Checkbox value={item.completed} onValueChange={() => toggleTask(item.id)} />
//             <Text style={{ textDecorationLine: item.completed ? "line-through" : "none" }}>
//               {item.text}
//             </Text>
//             <TouchableOpacity onPress={() => deleteTask(item.id)}>
//               <Text style={{ color: "red" }}>Sterge</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       <TextInput
//         placeholder="Adauga task nou"
//         value={newTask}
//         onChangeText={setNewTask}
//         style={{ borderWidth: 1, marginVertical: 10, padding: 5 }}
//       />

//       <Button
//         title="Adauga Task"
//         onPress={() => {
//           addTask(newTask);
//           setNewTask("");
//         }}
//       />

//       {lastAddedTask && (
//         <View style={{ marginTop: 10 }}>
//           <Button title="Add to Google Calendar" onPress={() => promptAsync() } />
//         </View>
//       )}
//     </View>
//   );
// }
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import * as Progress from "react-native-progress";
import { TaskContext } from "../context/TaskContext";
import { useGoogleAuth } from "../hooks/googleAuth"; // ✅ importam hook-ul
import Card from "../components/ui/Card";
import { Title, Subtitle, Body } from "../components/ui/StyledText";
import PrimaryButton from "../components/ui/PrimaryButton";
import { theme } from "../theme";

export default function TodoPage() {
  const { tasks, addTask, deleteTask, toggleTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState("");
  const { promptAsync, accessToken, request } = useGoogleAuth();

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

 const handleAddTask = async () => {
  if (!newTask.trim()) return;

  // Ensure the auth request is ready
  if (!request) {
  console.log("⏳ Please wait, initializing Google auth...");
  setTimeout(handleAddTask, 500);
  return;
}


  // 1) Open Google auth
  const result = await promptAsync();

  // 2) Check consent
  if (result?.type === "success") {
    const token = result.params.access_token;
    console.log("✅ Google token:", token);

    // 3) Add task and sync with Calendar
    await addTask(newTask, token);
    setNewTask("");
  } else {
    console.warn("⚠️ Google login canceled or failed");
  }
};


  return (
    <View style={styles.container}>
      <Card style={{ marginBottom: theme.spacing.lg }}>
        <Title style={{ marginBottom: 8 }}>Toate task-urile</Title>
        <Subtitle style={{ marginBottom: 10 }}>
          Progress: {completedCount}/{totalCount}
        </Subtitle>
        <Progress.Bar
          progress={progress}
          width={Dimensions.get("window").width - 40}
          color={theme.colors.primary}
          height={12}
          borderRadius={6}
        />
      </Card>

      <Card style={{ marginBottom: theme.spacing.lg }}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id || item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Checkbox
                value={item.completed}
                onValueChange={() => toggleTask(item._id || item.id)}
                color={theme.colors.primary}
              />
              <Body style={[styles.itemText, item.completed && styles.itemCompleted]}>
                {item.text}
              </Body>
              <TouchableOpacity onPress={() => deleteTask(item._id || item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Body style={{ color: theme.colors.textSecondary }}>
              No tasks yet. Add one below.
            </Body>
          }
        />
      </Card>

      <Card>
        <TextInput
          placeholder="Add new task"
          placeholderTextColor={theme.colors.textSecondary}
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
        />
        <PrimaryButton title="Add and sync" onPress={handleAddTask} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12
  },
  itemText: {
    flex: 1,
    marginHorizontal: 10,
    color: theme.colors.textPrimary
  },
  itemCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary
  },
  delete: {
    color: theme.colors.danger,
    fontWeight: '700'
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface
  }
})
