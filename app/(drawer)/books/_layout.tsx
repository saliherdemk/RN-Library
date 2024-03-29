import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Books from ".";

export default function BooksLayout() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={Books} />
    </Stack.Navigator>
  );
}
