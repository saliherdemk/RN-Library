import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
import Register from "./register";

function AuthLayout() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
    </Stack.Navigator>
  );
}

export default AuthLayout;
