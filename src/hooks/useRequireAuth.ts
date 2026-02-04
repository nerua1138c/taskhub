import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { getSession } from "../storage/auth";

export function useRequireAuth() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      (async () => {
        const s = await getSession();
        if (!mounted) return;

        if (!s) {
          setAllowed(false);
          router.replace("/(root)/login");
        } else {
          setAllowed(true);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [router])
  );

  return allowed;
}
