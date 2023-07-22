import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import index from ".";
import { useAppDispatch } from "../../redux/hooks";
import { removeUser } from "../../redux/slicers/userSlicer";
import { supabase } from "../../services/supabase";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    !error && dispatch(removeUser(null));
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Sign Out" onPress={handleSignOut} />
    </DrawerContentScrollView>
  );
}

function HomeLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="/"
        options={{
          drawerLabel: "Home",
          title: "overview",
        }}
        component={index}
      />
    </Drawer.Navigator>
  );
}

export default HomeLayout;
