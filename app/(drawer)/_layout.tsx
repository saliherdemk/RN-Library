import { Drawer } from "expo-router/drawer";

export default () => {
  return (
    <Drawer screenOptions={{ unmountOnBlur: true }}>
      <Drawer.Screen name="books" options={{ drawerLabel: "Home" }} />
      <Drawer.Screen name="profile" options={{ drawerLabel: "Profile" }} />

      <Drawer.Screen
        name="dashboard"
        options={{ drawerLabel: "Dashboard", headerShown: true }}
      />
      <Drawer.Screen name="logout" options={{ drawerLabel: "Sign Out" }} />
    </Drawer>
  );
};
