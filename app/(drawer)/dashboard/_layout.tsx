import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddBook from "./addBook";
import EditBook from "./editBook/[isbn]";
import Dashboard from ".";

export default function DashBoardLayout() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={Dashboard} />
      <Stack.Screen
        name="addBook"
        options={{ headerShown: true, presentation: "modal" }}
        component={AddBook}
      />
      <Stack.Screen
        name="editBook/[isbn]"
        options={{ headerShown: true, presentation: "modal" }}
        component={EditBook}
      />
    </Stack.Navigator>
  );
}
