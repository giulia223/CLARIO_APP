import React from "react";
import { View, Text, Dimensions, Image, screenHeight, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTasks } from "../context/TaskContext"
import AllBadges from "../data/badges";
import Card from "../components/ui/Card";
import { Title, Subtitle, Body } from "../components/ui/StyledText";
import { theme } from "../theme";

export default function Account() {
  const { tasks, badges } = useTasks()

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const remainingCount = totalCount - completedCount

  const data = {
    labels: ["Finalizate", "Ramase"],
    datasets: [{ data: [completedCount, remainingCount] }],
  };
  

  return (
    <View style={styles.container}>
      <Card style={{ marginBottom: theme.spacing.lg }}>
        <Title style={{ marginBottom: 6 }}>Your profile</Title>
        <Subtitle>Completed tasks: {completedCount} of {totalCount}</Subtitle>
      </Card>

      <Card style={{ marginBottom: theme.spacing.lg }}>
        <Subtitle style={{ marginBottom: 10 }}>Badges / Achievements</Subtitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {AllBadges.map(badge => {
            const unlocked = completedCount >= badge.unlockAt;
            return (
              <View key={badge.id} style={{ alignItems: "center", margin: 10 }}>
                <Image
                  source={badge.image}
                  style={{
                    width: 50,
                    height: 50,
                    tintColor: unlocked ? null : "#6B7280",
                    resizeMode: "contain",
                  }}
                />
                <Body style={{ marginTop: 5 }}>{badge.name}</Body>
              </View>
            );
          })}
        </View>
      </Card>

      <Card>
        <Subtitle style={{ marginBottom: 10 }}>Weekly progress</Subtitle>
        <BarChart
          data={data}
          height={screenHeight * 0.25}
          width={Dimensions.get("window").width - 40}
          chartConfig={{
            backgroundColor: theme.colors.card,
            backgroundGradientFrom: theme.colors.card,
            backgroundGradientTo: theme.colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(91, 141, 239, ${opacity})`,
            labelColor: () => theme.colors.textSecondary,
          }}
          style={{ borderRadius: 12 }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background
  }
})
