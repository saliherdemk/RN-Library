import { Redirect, Stack, useRouter } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerLayout from "./(drawer)/_layout";
import Login from "./login";
import Register from "./register";
import BookDetailsLayout from "./bookDetails/_layout";

function Layout() {
  const user = useAppSelector((state) => state.userData.user);

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Group>
          <Stack.Screen name="(drawer)" component={DrawerLayout} />
          <Stack.Screen name="bookDetails" component={BookDetailsLayout} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};
