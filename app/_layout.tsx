import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import { store } from "../redux/store";
import AuthLayout from "./(auth)/_layout";
import HomeLayout from "./(drawer)/_layout";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Layout() {
  const user = useAppSelector((state) => state.userData.user);

  return (
    <Stack.Navigator
      initialRouteName={user ? "(drawer)" : "(auth)"}
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <Stack.Screen name="(drawer)" component={HomeLayout} />
      ) : (
        <Stack.Screen name="(auth)" component={AuthLayout} />
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
