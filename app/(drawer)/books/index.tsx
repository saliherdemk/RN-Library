import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Books = () => {
  return (
    <SafeAreaView>
      <Link href="/books/1">1</Link>
      <Link href="/books/2">2</Link>
      <Link href="/books/3">3</Link>
    </SafeAreaView>
  );
};

export default Books;
