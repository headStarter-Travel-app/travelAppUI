import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

enum SocializingOption {
  ENERGETIC = "ENERGETIC",
  RELAXED = "RELAXED",
  BOTH = "BOTH",
}

enum Time {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
}

enum Shopping {
  YES = "YES",
  SOMETIME = "SOMETIME",
  NO = "NO",
}

interface FinalQuizProps {
  setAtmosphere: (option: string[]) => void;
  existingAtmosphere: string[];
  setSocializing: (option: SocializingOption) => void;
  existingSocializing: SocializingOption;
  setTime: (option: Time[]) => void;
  existingTime: Time[];
  setFamilyFriendly: (option: boolean) => void;
  familyFriendly: boolean;
  setShopping: (option: Shopping) => void;
  existingShopping: Shopping;
}

export const FinalQuiz: React.FC<FinalQuizProps> = ({
  setAtmosphere,
  existingAtmosphere,
  setSocializing,
  existingSocializing,
  setTime,
  existingTime,
  setFamilyFriendly,
  familyFriendly,
  setShopping,
  existingShopping,
}) => {
  const toggleMultiOption = (
    setter: (option: any[]) => void,
    existing: any[],
    option: any
  ) => {
    setter(
      existing.includes(option)
        ? existing.filter((item) => item !== option)
        : [...existing, option]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Final Details</Text>
      <Text style={styles.paragraph}>
        Please select the options that best describe your preferences.
      </Text>

      <Section title="Atmosphere">
        {["Cozy", "Vibrant", "Quiet", "Lively"].map((option) => (
          <OptionButton
            key={option}
            title={option}
            selected={existingAtmosphere.includes(option)}
            onPress={() =>
              toggleMultiOption(setAtmosphere, existingAtmosphere, option)
            }
          />
        ))}
      </Section>

      <Section title="Socializing">
        {Object.values(SocializingOption).map((option) => (
          <OptionButton
            key={option}
            title={option}
            selected={existingSocializing === option}
            onPress={() => setSocializing(option)}
          />
        ))}
      </Section>

      <Section title="Time of Day">
        {Object.values(Time).map((option) => (
          <OptionButton
            key={option}
            title={option}
            selected={existingTime.includes(option)}
            onPress={() => toggleMultiOption(setTime, existingTime, option)}
          />
        ))}
      </Section>

      <Section title="Family Friendly">
        <OptionButton
          title="Family Friendly"
          selected={familyFriendly}
          onPress={() => setFamilyFriendly(!familyFriendly)}
        />
      </Section>

      <Section title="Shopping">
        {Object.values(Shopping).map((option) => (
          <OptionButton
            key={option}
            title={option}
            selected={existingShopping === option}
            onPress={() => setShopping(option)}
          />
        ))}
      </Section>
    </ScrollView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.optionsContainer}>{children}</View>
  </View>
);

const OptionButton: React.FC<{
  title: string;
  selected: boolean;
  onPress: () => void;
}> = ({ title, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.optionButton, selected && styles.selectedOption]}
    onPress={onPress}
  >
    <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "dmSansBold",
    color: "#333",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: "spaceGroteskRegular",
    color: "#333",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "dmSansBold",
    color: "#4040ff",
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#d0d0ff",
  },
  selectedOption: {
    backgroundColor: "#4040ff",
  },
  optionText: {
    fontFamily: "spaceGroteskMedium",
    color: "#333",
    fontSize: 14,
  },
  selectedOptionText: {
    color: "#fff",
  },
});
