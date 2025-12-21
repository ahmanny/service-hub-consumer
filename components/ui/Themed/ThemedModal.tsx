import { Modal as RNModal, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

type ModalProps = {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export function ThemedModal({ visible, children }: ModalProps) {
  const background = useThemeColor({}, "background");

  return (
    <RNModal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: background,
            borderRadius: 20,
            padding: 24,
          }}
        >
          {children}
        </View>
      </View>
    </RNModal>
  );
}
