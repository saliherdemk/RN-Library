import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Books = () => {
  return (
    <View>
      <Link href="/books/1">1</Link>
      <Link href="/books/2">2</Link>
      <Link href="/books/3">3</Link>
    </View>
  );
};

export default Books;
