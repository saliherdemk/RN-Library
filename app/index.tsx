import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../redux/hooks";

export default function Index() {
  return (
    <View>
      <Text>index </Text>
      <StatusBar style="auto" />
    </View>
  );
}
