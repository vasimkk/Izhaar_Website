import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import api from "../utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import {  ADMIN_DASHBOARD } from "@/app/config/routes";
import { USER_WELCOME } from "../config/routes";
export default function CreatePasswordScreen() {
  const { mobile } = useLocalSearchParams();
  const router = useRouter();
  const auth = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // -----------------------------
  // Password Validation
  // -----------------------------
  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };

  // -----------------------------
  // SUBMIT PASSWORD
  // -----------------------------
  const submitPassword = async () => {
    const error = validatePassword();
    if (error) return alert(error);

    if (password !== confirmPassword)
      return alert("Passwords do not match");

    try {
      setLoading(true);

      const res = await api.post("/auth/set-password", {
        mobile,
        password,
      });

      const { accessToken, refreshToken, role } = res.data;

      // Save tokens via context
      auth.setAccessToken(accessToken);
      await auth.setRefreshToken(refreshToken);
      if (role) auth.setRole(role);

      // Set axios default header
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      alert("Password set successfully!");

      // Redirect based on role
      if (role === "admin") {
        router.replace(ADMIN_DASHBOARD);
      } else {
        router.replace(USER_WELCOME);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Error setting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Password</Text>
      <Text style={styles.subtitle}>Account: +91 {mobile}</Text>

      {/* PASSWORD INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          maxLength={12}
          placeholder="Create Password"
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.eyeText}>{showPassword ? "🙈" : "👁️"}</Text>
        </Pressable>
      </View>

      {/* CONFIRM PASSWORD INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showConfirm}
          maxLength={12}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Pressable
          style={styles.eyeButton}
          onPress={() => setShowConfirm(!showConfirm)}
        >
          <Text style={styles.eyeText}>{showConfirm ? "🙈" : "👁️"}</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.btn}
        onPress={submitPassword}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? "Setting..." : "Set Password"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 32, textAlign: "center", marginBottom: 10, fontWeight: "700" },
  subtitle: { textAlign: "center", marginBottom: 20, color: "#666" },

  inputContainer: {
    position: "relative",
    marginBottom: 18,
  },

  input: {
    borderWidth: 1,
    padding: 14,
    paddingRight: 50,
    borderColor: "#ccc",
    borderRadius: 12,
  },

  eyeButton: {
    position: "absolute",
    right: 14,
    top: 14,
  },

  eyeText: { fontSize: 20 },

  btn: {
    backgroundColor: "#ff3a76",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
