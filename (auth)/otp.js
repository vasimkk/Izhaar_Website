// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
// import api from "../utils/api";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { CREATE_PASSWORD,  ENTRY_PAGE } from "@/app/config/routes";

// export default function OtpScreen() {
//   const { mobile, type } = useLocalSearchParams();
//   const router = useRouter();

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🚨 SAFE REDIRECT FIX — Avoid "navigate before root layout mounts"
//   useEffect(() => {
//     if (!mobile) {
//       console.warn("[OTP] Missing mobile param — redirecting safely...");

//       // Delay ensures root layout is mounted
//       setTimeout(() => {
//         router.replace(ENTRY_PAGE);
//       }, 50);
//     }
//   }, [mobile]);

//   const verifyOTP = async () => {
//     if (otp.length !== 4) return alert("Enter valid 4-digit OTP");

//     try {
//       setLoading(true);

//       // Try to validate OTP (if backend supports it)
//       await api.post("/auth/verify-otp", { mobile, otp });

//       router.push({
//         pathname: CREATE_PASSWORD,
//         params: { mobile, otp },
//       });

//     } catch (err) {
//       // Fallback: if backend does not support validate-otp
//       if (err.response?.status === 404) {
//         router.push({
//           pathname: CREATE_PASSWORD,
//           params: { mobile, otp },
//         });
//         return;
//       }

//       alert(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const regenerateOtp = async () => {
//     try {
//       await api.post("/auth/regenerate-otp", { mobile });
//       alert("New OTP sent!");
//     } catch (err) {
//       alert("Error sending new OTP");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Verify OTP</Text>

//       <Text style={styles.subtitle}>
//         {mobile ? `Sent to +91 ${mobile}` : "Redirecting..."}
//       </Text>

//       <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         maxLength={4}
//         placeholder="Enter OTP"
//         value={otp}
//         onChangeText={setOtp}
//       />

//       <Pressable
//         style={styles.btn}
//         onPress={verifyOTP}
//         disabled={loading}
//       >
//         <Text style={styles.btnText}>
//           {loading ? "Verifying..." : "Verify & Set Password"}
//         </Text>
//       </Pressable>

//       <Pressable onPress={regenerateOtp}>
//         <Text style={styles.resend}>Resend OTP</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24, justifyContent: "center" },
//   title: { fontSize: 32, fontWeight: "700", textAlign: "center" },
//   subtitle: { textAlign: "center", marginBottom: 20, color: "#666" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   btn: {
//     backgroundColor: "#ff3a76",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   btnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
//   resend: {
//     marginTop: 20,
//     textAlign: "center",
//     fontWeight: "600",
//     color: "#ff3a76",
//   },
// });
//new 
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import api from "../utils/api";

import { CREATE_PASSWORD, ENTRY_PAGE, RESET_PASSWORD } from "@/app/config/routes";

export default function OtpScreen() {
  const { mobile, type } = useLocalSearchParams(); // type = register | forgot
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mobile) {
      setTimeout(() => router.replace(ENTRY_PAGE), 50);
    }
  }, [mobile]);

  const verifyOTP = async () => {
    if (otp.length !== 4) return alert("Enter valid 4-digit OTP");

    try {
      setLoading(true);

      let endpoint = "";

      if (type === "forgot") {
        endpoint = "/auth/forgot-password/verify-otp";
      } else {
        endpoint = "/auth/verify-otp";
      }

      const res = await api.post(endpoint, { mobile, otp });

      if (type === "forgot") {
        router.push({
          pathname: RESET_PASSWORD,
          params: { mobile },
        });
      } else {
        router.push({
          pathname: CREATE_PASSWORD,
          params: { mobile },
        });
      }

    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const regenerateOtp = async () => {
    try {
      let endpoint = "";

      if (type === "forgot") {
        endpoint = "/auth/forgot-password/regenerate-otp";
      } else {
        endpoint = "/auth/regenerate-otp";
      }

      await api.post(endpoint, { mobile });
      alert("New OTP sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending new OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Sent to +91 {mobile}</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={4}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
      />

      <Pressable style={styles.btn} onPress={verifyOTP} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
      </Pressable>

      <Pressable onPress={regenerateOtp}>
        <Text style={styles.resend}>Resend OTP</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 20, color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 4,
  },
  btn: {
    backgroundColor: "#ff3a76",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  resend: { marginTop: 20, textAlign: "center", fontWeight: "600", color: "#ff3a76" },
});
