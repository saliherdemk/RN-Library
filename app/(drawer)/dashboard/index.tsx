import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {
  const user = useAppSelector((state) => state.userData.user);
  const router = useRouter();
  useEffect(() => {});
  return (
    <SafeAreaView className="flex-1 p-4 pb-0">
      <Text className="text-center text-2xl mb-2">Books</Text>
      <ScrollView className="border-2">
        <View className="h-20 bg-gray-300">
          <Text>One</Text>
        </View>
      </ScrollView>
      <AntDesign
        onPress={() => {
          router.push("/dashboard/addBook");
        }}
        style={{ position: "absolute", right: 15, bottom: 15 }}
        name="pluscircle"
        size={40}
        color="lightgreen"
      />
    </SafeAreaView>
  );
};

export default Dashboard;
