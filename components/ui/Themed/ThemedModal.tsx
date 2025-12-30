import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, Modal as RNModal } from "react-native";

type ModalProps = {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export function ThemedModal({ visible, onClose, children }: ModalProps) {
  const background = useThemeColor({}, "background");

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose} // Android back button
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose} // tap outside to close
      >
        <Pressable
          style={{
            width: "90%",
            backgroundColor: background,
            borderRadius: 20,
            padding: 24,
          }}
          onPress={() => {}}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
