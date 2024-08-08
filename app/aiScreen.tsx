import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TitleContainer from "@/components/aiPage/TitleContainer"
import AddInfoContainer from "@/components/aiPage/AddInfoContainer";
import BudgetContainer from "@/components/aiPage/BudgetContainer";
import ThemeContainer from "@/components/aiPage/ThemeContainer";
import SubmitButton from "@/components/aiPage/SubmitButton";

export default function aiScreen() {
  const [theme, setTheme] = useState<string>("")
  const [budget, setBudget] = useState<number>(10);
  const [time, setTime] = useState<string>("");
  const [groupId, setGroupId] = useState<number>(-1) 
  const [location, setLocation] = useState<string>("")
  const [addInfo, setAddInfo] = useState<string>("")
  const submit : boolean = (theme != "" && location != "")
  return (
    <SafeAreaView style={styles.screen}>
      <TitleContainer />
      <ThemeContainer 
        setTheme={(theme: string) => setTheme(theme)} 
        theme={theme} 
      />
      <BudgetContainer 
        budget={budget}
        time={time}
        groupId={groupId}
        location={location}
        setBudget={(num: any) => setBudget(num as number)}
        setTime={(time: any) => setTime(time as string)}
        setGroupId={(id: any) => setGroupId(id as number)}
        setLocation={(location: any) => setLocation(location as string)}
      />
      <AddInfoContainer
        addInfo={addInfo}
        setAddInfo={(info: string) => setAddInfo(info)}
      />
      <SubmitButton active={submit} />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  screen: {
    marginTop: 64,
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    rowGap: 10,
  }
});
