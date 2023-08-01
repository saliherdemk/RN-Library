import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookDetails from "./[isbn]";

export default function BookDetailsLayout() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bookDetails/[isbn]" component={BookDetails} />
    </Stack.Navigator>
  );
}
