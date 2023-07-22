import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";
import NavigationContainer from "expo-router/src/fork/NavigationContainer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "../auth/login";
import Register from "../auth/register";
import { Stack } from "expo-router";

const Drawer = createDrawerNavigator();

function HomeLayout() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="auth/login"
        options={{
          drawerLabel: "Home",
          title: "overview",
        }}
        component={Login}
      />
    </Drawer.Navigator>
  );
}

export default HomeLayout;
