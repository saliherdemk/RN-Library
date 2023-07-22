import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useAppSelector } from "../redux/hooks";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Index from "./index";
import Login from "./auth/login";
import Register from "./auth/register";
import { createStackNavigator } from "@react-navigation/stack";
import index from "./(drawer)";
import AuthLayout from "./auth/_layout";
import HomeLayout from "./(drawer)/_layout";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Layout() {
  const user = useAppSelector((state) => state.userData.user);
  console.log(user);
  return (
    <Stack.Navigator initialRouteName={!user ? "(drawer)" : "auth"}>
      {user ? (
        <Stack.Screen name="(drawer)" component={HomeLayout} />
      ) : (
        <Stack.Screen name="auth" component={AuthLayout} />
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
