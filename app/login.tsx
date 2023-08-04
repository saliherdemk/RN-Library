import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Container from "../components/Container";
import FormTextInput from "../components/FormTextInput";
import Logo from "../components/Logo";
import { isEmailValid } from "../helper/validateEmail";
import { useAppDispatch } from "../redux/hooks";
import { setBooks } from "../redux/slicers/bookSlicer";
import {
  setAuthorsFilter,
  setTypesFilter,
} from "../redux/slicers/filterSlicer";
import { setUser, setUserData } from "../redux/slicers/userSlicer";
import BookService from "../services/bookService";
import FilterService from "../services/filterService";
import { supabase } from "../services/supabase";
import ShowError from "../components/ShowError";

const Login = () => {
  const [email, setEmail] = useState("asffjd@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const clear = () => {
    setEmail("");
    setPassword("");
    setIsBtnLoading(false);
  };

  const checkErrors = () => {
    setError(null);
    if (!email || !password) {
      alert("All Fields Required");
      setIsBtnLoading(false);

      return true;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email.");
      setIsBtnLoading(false);
      return true;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setIsBtnLoading(false);
      return true;
    }
  };

  const handleLogIn = async () => {
    setIsBtnLoading(true);
    if (checkErrors()) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error?.status) {
      setError("Invalid credentials");
      clear();
      return;
    }
    if (data.user) {
      const userBooks = await BookService.getUsersBooks(data.user.id);
      const favBooks = await BookService.getUsersFavBooks(data.user.id);

      dispatch(setUser(data.user));
      dispatch(
        setUserData({
          userBooks,
          favBooks,
        })
      );

      dispatch(setBooks(await BookService.getBooks()));
      dispatch(setTypesFilter(await FilterService.getAllTypeFilters()));
      dispatch(setAuthorsFilter(await FilterService.getAllAuthorFilters()));
      return;
    }
    setError("Unexpected error");
    setIsBtnLoading(false);
  };

  return (
    <Container classList="justify-center items-center">
      <View className="w-5/6 px-8 py-5 flex bg-white rounded-md shadow items-center">
        <Logo />
        {error && <ShowError err={error as string} />}

        <FormTextInput
          label=""
          value={email}
          setValue={setEmail}
          placeHolder="Email"
          keyboardType="email-address"
        />

        <FormTextInput
          label=""
          value={password}
          setValue={setPassword}
          placeHolder="Password"
          secureTextEntry={true}
        />
        <TouchableOpacity className="w-full mb-2">
          <Text className="text-right text-blue-500">Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          onPress={handleLogIn}
          title="Sign In"
          isLoading={isBtnLoading}
        />

        <TouchableOpacity
          onPress={() => {
            router.push("register");
          }}
          className="w-full my-2 flex flex-row justify-center gap-x-1"
        >
          <Text className="">Don't you have an account?</Text>
          <Text className="text-blue-500">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Login;
