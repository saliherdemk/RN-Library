// import { Stack } from "expo-router";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";

function Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default () => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};
