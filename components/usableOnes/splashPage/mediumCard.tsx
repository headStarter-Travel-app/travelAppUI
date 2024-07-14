import React from "react";
import { View, Text, Image } from "react-native";
const priceTagImage = require("@/assets/public/splashImages/priceTag.png");
interface MediumCardProps {
  title: string;
  priceRangeLower: number;
  priceRangeUpper: number;
  image: any;
}

const MediumCard: React.FC<MediumCardProps> = ({
  title,
  priceRangeLower,
  priceRangeUpper,
  image,
}) => {
  let lower = "$";
  let higher = "$$";
  if (priceRangeLower == 1) {
    lower = "$";
  } else if (priceRangeLower == 2) {
    lower = "$$";
  } else if (priceRangeLower == 3) {
    lower = "$$$";
  }
  if (priceRangeUpper == 1) {
    higher = "$";
  } else if (priceRangeUpper == 2) {
    higher = "$$";
  } else if (priceRangeUpper == 3) {
    higher = "$$$";
  }

  return (
    <View className="rounded-2xl overflow-hidden w-[100%] h-[215px] border-2 border-[#CACBD4]">
      <Image
        source={image}
        style={{ height: 140, width: "100%" }}
        className="rounded-t-2xl"
      />
      <View className="bg-[#E3E4EB] p-2 flex-1">
        <Text className="text-black text-bs font-dmSansBold">{title}</Text>
        <View className="flex flex-row items-center space-x-1">
          <Image source={priceTagImage} style={{ height: 15, width: 15 }} />
          <Text className="text-black text-md font-dmSansRegular">
            {" "}
            {lower}-{higher}{" "}
          </Text>
        </View>
      </View>
    </View>
  );
};
export const SmallCard: React.FC<MediumCardProps> = ({
  title,
  priceRangeLower,
  priceRangeUpper,
  image,
}) => {
  let lower = "$";
  let higher = "$$";
  if (priceRangeLower == 1) {
    lower = "$";
  } else if (priceRangeLower == 2) {
    lower = "$$";
  } else if (priceRangeLower == 3) {
    lower = "$$$";
  }
  if (priceRangeUpper == 1) {
    higher = "$";
  } else if (priceRangeUpper == 2) {
    higher = "$$";
  } else if (priceRangeUpper == 3) {
    higher = "$$$";
  }

  return (
    <View className="rounded-2xl overflow-hidden w-[100%] h-[140px] border-2 border-[#CACBD4]">
      <Image
        source={image}
        style={{ height: 90, width: "100%" }}
        className="rounded-t-2xl"
      />
      <View className="bg-[#E3E4EB] p-2 flex-1">
        <Text
          style={{ color: "black", fontSize: 10, fontFamily: "DMSans-Bold" }}
        >
          {title}
        </Text>
        <View className="flex flex-row items-center space-x-1">
          <Image source={priceTagImage} style={{ height: 12, width: 12 }} />
          <Text className="text-black font-dmSansRegular text-xs">
            {" "}
            {lower}-{higher}{" "}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MediumCard;
