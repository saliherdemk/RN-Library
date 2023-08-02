import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboard from ".";

export default function AdminDashboardLayout() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        component={AdminDashboard}
        options={{ headerTitle: "Admin Dashboard" }}
      />
    </Stack.Navigator>
  );
}
