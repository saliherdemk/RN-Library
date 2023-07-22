import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../redux/hooks";

export default function Page() {
  const user = useAppSelector((state) => state.userData.user);
  console.log(user);
  return (
    <View>
      <Text>index </Text>
      <StatusBar style="auto" />
    </View>
  );
}
