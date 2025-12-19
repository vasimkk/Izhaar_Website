// import React, { useState } from "react";
// import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
// import api from "../utils/api";
// import { useRouter } from "expo-router";
// import { OTP } from '@/app/config/routes';
// import { CREATE_PASSWORD } from '@/app/config/routes';

// export default function ForgotPassword() {
//   const router = useRouter();
//   const [mobile, setMobile] = useState("");

//   const sendOtp = async () => {
//     try {
//       await api.post("/auth/forgot-password/send-otp", { mobile });

//       router.push({ pathname: OTP, params: { mobile, type: "forgot" } });
//     } catch (err) {
//       alert(err.response?.data?.message || "Error sending OTP");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Forgot Password</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Mobile Number"
//         keyboardType="number-pad"
//         maxLength={10}
//         value={mobile}
//         onChangeText={setMobile}
//       />

//       <Pressable style={styles.btn} onPress={sendOtp}>
//         <Text style={styles.btnText}>Send OTP</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24, justifyContent: "center" },
//   title: { fontSize: 34, textAlign: "center", marginBottom: 30 },
//   input: {
//     borderWidth: 1,
//     padding: 14,
//     borderColor: "#ccc",
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   btn: {
//     backgroundColor: "#ff3a76",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
// });

import { OTP } from "@/app/config/routes";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import api from "../utils/api";

export default function ForgotPassword() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      return alert("Enter a valid 10-digit mobile number");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password/send-otp", { mobile });

      // Navigate to OTP screen
      router.push({
        pathname: OTP,
        params: { mobile, type: "forgot" },
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="number-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <Pressable style={[styles.btn, loading && { opacity: 0.6 }]} disabled={loading} onPress={sendOtp}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Send OTP</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 34, textAlign: "center", marginBottom: 30 },
  input: {
    borderWidth: 1,
    padding: 14,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#ff3a76",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
