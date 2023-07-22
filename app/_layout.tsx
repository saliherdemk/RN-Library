import { Drawer } from "expo-router/drawer";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useAppSelector } from "../redux/hooks";

function Layout() {
  const user = useAppSelector((state) => state.userData.user);

  return <Drawer />;
}

export default () => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};
