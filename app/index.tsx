// app/index.js or app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  const isLogged = false; // Change to your actual login check logic

  if (isLogged) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/introPage" />;
  }
}
