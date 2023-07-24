import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { useAppSelector } from "../redux/hooks";

export default function Page() {
  const user = useAppSelector((state) => state.userData.user);

  if (!user) {
    return <Redirect href="/login" />;
  }
  return <Redirect href="/home" />;
}
