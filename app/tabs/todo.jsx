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
import { TaskContext } from "../TaskContext";
import { useGoogleAuth } from "../googleAuth"; // ✅ importam hook-ul

export default function TodoPage() {
  const { tasks, addTask, deleteTask, toggleTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState("");
  const { promptAsync } = useGoogleAuth(); // ✅ luam functia de logare Google

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  // 🔹 Functia care adauga task si il sincronizeaza cu Google Calendar
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    // 1️⃣ Deschide login Google
    const result = await promptAsync();

    if (result?.type === "success") {
      const token = result.params.access_token;
      console.log("✅ Google token:", token);

      // 2️⃣ Adauga task + sincronizare
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
