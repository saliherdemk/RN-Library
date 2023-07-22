import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";
import NavigationContainer from "expo-router/src/fork/NavigationContainer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./login";
import Register from "./register";
import { Stack } from "expo-router";

const Drawer = createDrawerNavigator();

function AuthLayout() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="auth/login"
        options={{
          drawerLabel: "Login",
          title: "overview",
        }}
        component={Login}
      />
      <Drawer.Screen
        name="auth/register"
        options={{
          drawerLabel: "Register",
          title: "overview",
        }}
        component={Register}
      />
    </Drawer.Navigator>
  );
}

export default AuthLayout;
