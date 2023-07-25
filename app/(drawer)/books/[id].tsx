import { View, Text } from "react-native";
import React from "react";
import { useSearchParams } from "expo-router/src/LocationProvider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const BookDetails = () => {
  const { id } = useSearchParams();

  return (
    <SafeAreaView>
      <Text>BookDetails: {id}</Text>
    </SafeAreaView>
  );
};

export default BookDetails;
