import {
  ADMIN_DASHBOARD,
  FORGOT_PASSWORD,
  USER_DASHBOARD,
  USER_PROFILE,
  USER_WELCOME
} from "@/app/config/routes";
import { useAuth } from "@/app/context/AuthContext";
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
import api from "../utils/api";

export default function Login() {
  const router = useRouter();
  const auth = useAuth();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const goAndReset = (pathname) => {
    // Clear previous stack entries, then navigate so back cannot return to login.
    try {
      router.dismissAll();
    } catch (e) {
      // Dismiss may not exist in older router versions; ignore.
    }
    router.replace({ pathname });
  };

  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password.length > 12) return "Password must be max 12 characters";
    if (!/[A-Za-z]/.test(password)) return "Must include letters (A–Z)";
    if (!/[0-9]/.test(password)) return "Must include numbers (0–9)";
    return null;
  };

  const loginUser = async () => {
    if (mobile.length !== 10) return alert("Enter valid 10-digit mobile number");

    const error = validatePassword();
    if (error) return alert(error);

    try {
      const res = await api.post("/auth/login-password", { mobile, password });

      // Save access + refresh token
      auth.setAccessToken(res.data.accessToken);
      await auth.setRefreshToken(res.data.refreshToken);

      if (res.data.role) auth.setRole(res.data.role);

      // Set default header
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;

      // Redirect based on role + agreement status
      if (res.data.role === "admin") {
        goAndReset(ADMIN_DASHBOARD);
        return;
      }

      try {
        // Check agreement status
        const agreeRes = await api.get("/user-agreement/status");
        console.log('[Login] Agreement status after login:', agreeRes.data);

        if (!agreeRes.data?.agreed) {
          // Not agreed yet, send to welcome/terms page
          console.log('[Login] User not agreed, redirecting to welcome');
          goAndReset(USER_WELCOME);
          return;
        }

        // User agreed, check if profile exists
        try {
          const profileRes = await api.get("/profile/me");
          console.log('[Login] Profile check - Full response:', JSON.stringify(profileRes.data, null, 2));
          console.log('[Login] Profile check - Keys:', Object.keys(profileRes.data));
          console.log('[Login] Profile check - profileRes.data.profile:', profileRes.data.profile);
          console.log('[Login] Profile check - profileRes.data.id:', profileRes.data.id);

          // Profile data might be nested under .profile or at root level
          const profileData = profileRes.data.profile || profileRes.data;
          const hasProfile = profileData && (profileData.id || profileData._id);

          if (hasProfile) {
            // Has profile, now check template history
            try {
              const historyRes = await api.get("/user/template-history");
              console.log('[Login] Template history check - Full response:', JSON.stringify(historyRes.data, null, 2));
              console.log('[Login] Template history check - Type:', typeof historyRes.data);
              console.log('[Login] Template history check - Is Array:', Array.isArray(historyRes.data));
              console.log('[Login] Template history check - Length:', historyRes.data?.length);

              if (historyRes.data && historyRes.data.length > 0) {
                // Has both profile and template history, go to dashboard
                console.log('[Login] User has profile and template history, redirecting to dashboard');
                goAndReset(USER_DASHBOARD);
                return;
              } else {
                // Has profile but no template history
                console.log('[Login] User has profile but no template history');
                 goAndReset(USER_DASHBOARD);
                
                return;
              }
            } catch (historyErr) {
              console.log('[Login] Template history check failed, but profile exists, going to dashboard', historyErr?.response?.status);
              // Even if history check fails, if profile exists, go to dashboard
              goAndReset(USER_DASHBOARD);
              return;
            }
          }
        } catch (profileErr) {
          console.log('[Login] Profile not found, redirecting to profile creation', profileErr?.response?.status);
        }

        // Agreed but no profile, go to profile creation
        goAndReset(USER_PROFILE);
      } catch (e) {
        console.log('[Login] Error checking status, sending to welcome', e?.response?.status);
        goAndReset(USER_WELCOME);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login error");
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
            <View style={styles.topSpacing} />

            <View style={styles.header}>
              <Text style={styles.title}>Log In</Text>
              <Text style={styles.subtitle}>
                Welcome back! Enter your mobile and password.
              </Text>
            </View>

            {/* MOBILE INPUT */}
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />

            {/* PASSWORD INPUT WITH SHOW/HIDE */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                maxLength={12}
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

            <View style={styles.footerArea}>
              {/* LOGIN BUTTON */}
              <Pressable style={styles.btn} onPress={loginUser}>
                <Text style={styles.btnText}>Login</Text>
              </Pressable>

              {/* FORGOT PASSWORD */}
              <Pressable onPress={() => router.push({ pathname: FORGOT_PASSWORD })}>
                <Text style={styles.forgot}>Forgot Password?</Text>
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
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },

  inputContainer: {
    position: "relative",
    marginBottom: 18,
  },

  input: {
    borderWidth: 1,
    padding: 16,
    paddingRight: 50,
    borderColor: "#444",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 12,
    marginBottom: 16,
  },

  eyeButton: {
    position: "absolute",
    right: 14,
    top: 18,
  },
  eyeText: { fontSize: 20 },

  spacer: {
    height: 20,
  },

  footerArea: {
    marginTop: 20,
    paddingBottom: 24,
  },

  btn: {
    backgroundColor: "#ff3a76",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  forgot: {
    marginTop: 14,
    textAlign: "center",
    color: "#ff3a76",
    fontWeight: "600",
  },

  rules: { marginTop: 20 },
  rule: { color: "#555", fontSize: 14, marginBottom: 4 },
});
