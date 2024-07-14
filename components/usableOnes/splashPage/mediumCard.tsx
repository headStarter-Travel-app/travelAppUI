import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

interface MediumCardProps {
  title: string;
  priceRangeLower: number;
  PriceRangeUpper: number;
  image: any;
}

const MediumCard: React.FC<MediumCardProps> = ({
  title,
  priceRangeLower,
  PriceRangeUpper,
  image,
}) => {
  return (
    <View>
      <View className="rounded-2xl">
        <Image source={image} height={100} width={100} />

        <Text className="">{title}</Text>
        <Text>
          {priceRangeLower} - {PriceRangeUpper}
        </Text>
      </View>
    </View>
  );
};

export default MediumCard;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
