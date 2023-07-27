import { Stack } from "expo-router";

export default () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="addBook"
        options={{ headerShown: true, presentation: "modal" }}
      />
      <Stack.Screen
        name="editBook/[isbn]"
        options={{ headerShown: true, presentation: "modal" }}
      />
    </Stack>
  );
};
