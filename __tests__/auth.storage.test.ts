import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser, getRegisteredUser, setSession, getSession, clearSession } from "../src/storage/auth";

describe("storage/auth", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test("registerUser + getRegisteredUser", async () => {
    await registerUser({ email: "test@example.com", password: "123456" });
    const user = await getRegisteredUser();
    expect(user?.email).toBe("test@example.com");
    expect(user?.password).toBe("123456");
  });

  test("setSession + getSession + clearSession", async () => {
    await setSession("a@b.com");
    expect(await getSession()).toBe("a@b.com");

    await clearSession();
    expect(await getSession()).toBeNull();
  });
});
