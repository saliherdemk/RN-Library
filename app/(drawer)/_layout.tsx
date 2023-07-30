import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Books from "./books";
import Dashboard from "./dashboard";
import Account from "./account";

export default function DrawerLayout() {
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator screenOptions={{ unmountOnBlur: true, headerShown: false }}>
      <Tabs.Screen
        name="books"
        component={Books}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            );
          },
        }}
      />

      <Tabs.Screen
        name="dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="view-dashboard"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        component={Account}
        name="account"
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="account"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs.Navigator>
  );
}
