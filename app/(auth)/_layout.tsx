import { Stack } from "expo-router";

function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    ></Stack>
  );
}

export default AuthLayout;
