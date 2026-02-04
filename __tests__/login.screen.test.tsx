import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Mock useFocusEffect, żeby nie wymagał NavigationContainer
jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (cb: any) => cb(),
}));

import Login from "../app/(root)/login/index";

describe("Login screen", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test("shows validation for invalid email format", async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText("Email"), "zly-email");
    expect(getByText("Niepoprawny email.")).toBeTruthy();
  });

  test("blocks login when account doesn't exist", async () => {
    const alertSpy = jest.spyOn(require("react-native").Alert, "alert").mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<Login />);
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Hasło"), "123456");
    fireEvent.press(getByText("Zaloguj"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });
});
