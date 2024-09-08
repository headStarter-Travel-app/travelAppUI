import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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
          {/* <Text style={styles.subText}>
            Upgrade to Premium for unlimited recommendations.
          </Text> */}
          <View style={{flexDirection: "row", columnGap: 10}}>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyPremium}>
              <LinearGradient
                colors={["#6a11cb", "#2575fc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{width: "100%", height:48, borderRadius:6, borderEndEndRadius:4, borderEndStartRadius:4, padding: 10, paddingHorizontal: 32}}
              >
                <Text style={styles.buyButtonText}>Buy Premium</Text>
              </LinearGradient>
              
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity onPress={onClose} style={{position: "absolute", top: 10, right: 10}}><Text style={{fontSize: 16}}>X</Text></TouchableOpacity>
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
    borderRadius: 8,
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
    borderRadius: 8,
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
    fontSize: 20
  },
  closeButton: {
    backgroundColor: "#f44336",
    borderRadius: 8,
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
    fontSize: 16
  },
});

export default BuyPremiumModal;
