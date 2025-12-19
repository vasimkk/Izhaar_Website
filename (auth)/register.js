import { OTP } from "@/app/config/routes";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LOGIN } from "../config/routes";
import api from "../utils/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (mobile.length !== 10) return alert("Enter valid mobile number");

    try {
      setLoading(true);
      await api.post("/auth/send-otp", { mobile, role: "user" });

      router.push({
        pathname: OTP,
        params: { mobile, type: "register" },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={24}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* HEADER SPACING */}
            <View style={styles.topSpacing} />

            {/* TITLE AND SUBTITLE */}
            <View style={styles.header}>
              <Text style={styles.title}>My Mobile</Text>
              <Text style={styles.subtitle}>
                This helps us verify and avoid false{"\n"}profiles
              </Text>
            </View>

            {/* MOBILE INPUT WITH COUNTRY CODE */}
            <View style={styles.inputContainer}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCode}>(+91)</Text>
                <Text style={styles.divider}>|</Text>
              </View>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                maxLength={10}
                placeholder="9642424298"
                placeholderTextColor="#666"
                value={mobile}
                onChangeText={setMobile}
              />
            </View>

            {/* SPACER */}
            <View style={styles.spacer} />

            {/* CONTINUE BUTTON */}
            <Pressable
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? "Sending OTP..." : "Continue"}
              </Text>
            </Pressable>

            {/* SIGN IN LINK */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <Pressable onPress={() => router.push({ pathname: LOGIN })}>
                <Text style={styles.signInLink}>Sign in</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    borderRadius: 14,
    overflow: "hidden",
  },
  topSpacing: {
    height: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 16,
    paddingLeft: 15,
    backgroundColor: "#1a1a1a",
    marginBottom: 40,
  },
  countryCodeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 12,
  },
  flag: {
    fontSize: 18,
  },
  countryCode: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    color: "#666",
    fontSize: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 15,
    fontSize: 16,
    color: "#fff",
  },
  spacer: {
    flex: 1,
  },
  btn: {
    backgroundColor: "#ff3a76",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  btnDisabled: {
    backgroundColor: "#ccc",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 60,
  },
  signInText: {
    fontSize: 14,
    color: "#999",
  },
  signInLink: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
