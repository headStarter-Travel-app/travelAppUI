import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const BuyPremiumModal = ({
  visible,
  onClose,
}: {
  visible: any;
  onClose: any;
}) => {
  const router = useRouter();

  const handleBuyPremium = () => {
    onClose();
    router.push("/premium");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            You've run out of free recommendations!
          </Text>
          <Text style={styles.subText}>
            Upgrade to Premium for unlimited recommendations.
          </Text>
          <View style={{flexDirection: "row", columnGap: 10}}>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyPremium}>
              <Text style={styles.buyButtonText}>Buy Premium</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#000"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "spaceGroteskBold",
  },
  subText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
    fontFamily: "spaceGroteskregular",
  },
  buyButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 16,
    elevation: 2,
    borderColor: "#000",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "spaceGroteskBold",
  },
  closeButton: {
    backgroundColor: "#f44336",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    borderColor: "#000",
    borderWidth: 2,
    borderBottomWidth: 4,
    paddingHorizontal: 16,
    
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "spaceGroteskBold",
  },
});

export default BuyPremiumModal;
