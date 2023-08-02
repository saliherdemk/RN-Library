import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Account from ".";

function AccountLayout() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" component={Account} />
    </Stack.Navigator>
  );
}

export default AccountLayout;
