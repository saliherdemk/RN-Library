import { Redirect, Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";

function Layout() {
  const user = useAppSelector((state) => state.userData.user);

  useEffect(() => {
    if (!user) {
      <Redirect href="/login" />;
      return;
    }
    <Redirect href="/books" />;
  }, [user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default () => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
};
