import React from "react";
import { View, Text, Dimensions, Image, screenHeight} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTasks } from "../context/TaskContext"
import { badges } from "../data/badges";

export default function Account() {
  const { tasks } = useTasks()
  const { badges } = useTasks()

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const remainingCount = totalCount - completedCount

  const data = {
    labels: ["Finalizate", "Ramase"],
    datasets: [{ data: [completedCount, remainingCount] }],
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Profilul tau</Text>

      {/* Badge-uri */}
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Badge-uri / Realizari</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
  {(badges || []).map(badge => {
    const unlocked = completedCount >= badge.unlockAt;
    return (
      <View
        key={badge.id}
        style={{ alignItems: "center", margin: 10 }}
      >
        <Image
          source={badge.image}
          style={{
            width: 50,
            height: 50,
            tintColor: unlocked ? null : "#C0C0C0", // gri daca e blocat
            resizeMode: "contain",
          }}
        />
        <Text style={{ fontSize: 12, marginTop: 5 }}>{badge.name}</Text>
      </View>
    );
  })}
</View>

      {/* BarChart */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Progres saptamanal</Text>
        <BarChart
          data={data}
          height={screenHeight * 0.25}
          width={Dimensions.get("window").width - 40}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          }}
        />
      </View>

      
      
    </View>
  );
}
