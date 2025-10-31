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
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Dimensions } from "react-native";
import Checkbox from "expo-checkbox";
import * as Progress from "react-native-progress";
import { TaskContext } from "../context/TaskContext";
import { useGoogleAuth } from "../hooks/googleAuth"; // ✅ importam hook-ul

export default function TodoPage() {
  const { tasks, addTask, deleteTask, toggleTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState("");
  const { promptAsync, accessToken, request } = useGoogleAuth();

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

 const handleAddTask = async () => {
  if (!newTask.trim()) return;

  // ⚠️ Asigură-te că request-ul e pregătit
  if (!request) {
  console.log("⏳ Asteapta un moment, se initializeaza autentificarea Google...");
  setTimeout(handleAddTask, 500); // reincerca dupa jumatate de secunda
  return;
}


  // 1️⃣ Deschide autentificarea Google
  const result = await promptAsync();

  // 2️⃣ Verifică dacă userul a acceptat
  if (result?.type === "success") {
    const token = result.params.access_token;
    console.log("✅ Google token:", token);

    // 3️⃣ Adaugă task-ul și sincronizează cu Calendar
    await addTask(newTask, token);
    setNewTask("");
  } else {
    console.warn("⚠️ Logare Google anulata sau esuata");
  }
};


  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: "15%", marginTop: "10%" }}>
        Toate task-urile
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Progress: {completedCount}/{totalCount}
      </Text>

      <Progress.Bar
        progress={progress}
        width={Dimensions.get("window").width - 40}
        color="#007AFF"
        height={12}
        borderRadius={6}
      />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            <Checkbox
              value={item.completed}
              onValueChange={() => toggleTask(item.id)}
            />
            <Text
              style={{
                textDecorationLine: item.completed ? "line-through" : "none",
              }}
            >
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={{ color: "red" }}>Sterge</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TextInput
        placeholder="Adauga task nou"
        value={newTask}
        onChangeText={setNewTask}
        style={{ borderWidth: 1, marginVertical: 10, padding: 5 }}
      />

      <Button title="Adauga si sincronizeaza" onPress={handleAddTask} />
    </View>
  );
}
