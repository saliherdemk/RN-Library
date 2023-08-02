import { Redirect, Stack, useRouter } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerLayout from "./(drawer)/_layout";
import Login from "./login";
import Register from "./register";
import BookDetailsLayout from "./bookDetails/_layout";
import ProfileLayout from "./profile/_layout";
import AdminDashboard from "./adminDashboard";
import AdminDashboardLayout from "./adminDashboard/_layout";
import UserService from "../services/userService";

function Layout() {
  const user = useAppSelector((state) => state.userData.user);
  const [userRole, setUserRole] = useState<{ name: string; vis: Number }>({
    name: "user",
    vis: 1,
  });
  const Stack = createNativeStackNavigator();

  const fetchRole = async () => {
    const data = await UserService.getUserByUsername(
      user?.user_metadata.username
    );
    //@ts-expect-error
    data?.role && setUserRole(data?.role);
  };
  useEffect(() => {
    fetchRole();
  }, [user]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Group>
          <Stack.Screen name="(drawer)" component={DrawerLayout} />
          <Stack.Screen name="bookDetails" component={BookDetailsLayout} />
          <Stack.Screen name="profile" component={ProfileLayout} />
          {Number(userRole.vis) > 1 && (
            <Stack.Screen
              name="adminDashboard"
              component={AdminDashboardLayout}
            />
          )}
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
