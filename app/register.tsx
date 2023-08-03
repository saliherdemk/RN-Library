import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Container from "../components/Container";
import FormTextInput from "../components/FormTextInput";
import Logo from "../components/Logo";
import { isEmailValid } from "../helper/validateEmail";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/slicers/userSlicer";
import { supabase } from "../services/supabase";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("asd@gmail.com");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("123456");

  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const clear = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsBtnLoading(false);
  };

  const checkErrors = () => {
    setError(null);
    if (!email || !password || !confirmPassword) {
      alert("All Fields Required");
      setIsBtnLoading(false);
      return true;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email.");
      setIsBtnLoading(false);
      return true;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      setIsBtnLoading(false);
      return true;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setIsBtnLoading(false);
      return true;
    }

    return false;
  };

  const handleRegister = async () => {
    setIsBtnLoading(true);
    if (checkErrors()) return;

    const { data: usernameData, error: usernameErr } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .maybeSingle();

    if (usernameData) {
      setError("Username already taken");
      setIsBtnLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error?.status == 400) {
      setError("User Already Exists");
      clear();
      return;
    }

    if (data.user) {
      const { error } = await supabase
        .from("users")
        .insert({ id: data.user.id, username: username });
      dispatch(setUser(data.user));

      return;
    }
    setError("Unexpected error");
    setIsBtnLoading(false);
  };

  return (
    <Container classList="justify-center items-center">
      <View className="w-5/6 px-8 py-5 flex bg-white rounded-md shadow items-center">
        <Logo />
        {error && <Text className="text-rose-500">{error}</Text>}

        <FormTextInput
          label=""
          value={username}
          setValue={setUsername}
          placeHolder="Username"
        />

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

        <FormTextInput
          label=""
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeHolder="Confirm Password"
          secureTextEntry={true}
        />
        <Button
          onPress={handleRegister}
          title="Sign Up"
          isLoading={isBtnLoading}
        />

        <TouchableOpacity
          onPress={() => {
            router.push("login");
          }}
          className="w-full my-2 flex flex-row justify-center gap-x-1"
        >
          <Text className="">Do you have an account?</Text>
          <Text className="text-blue-500">Sign In</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Register;
