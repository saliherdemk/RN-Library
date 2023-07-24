import { View, Text } from "react-native";
import React from "react";
import { useSearchParams } from "expo-router/src/LocationProvider";

const BookDetails = () => {
  const { id } = useSearchParams();

  return (
    <View>
      <Text>BookDetails: {id}</Text>
    </View>
  );
};

export default BookDetails;
