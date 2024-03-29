import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./[username]";

export default function ProfileLayout() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="profile/[username]"
        component={Profile}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
