import { useSearchParams } from "expo-router/src/LocationProvider";
import React from "react";
import { Text } from "react-native";
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
