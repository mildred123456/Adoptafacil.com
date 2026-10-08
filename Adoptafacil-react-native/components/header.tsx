import { Image } from "expo-image";
import { Palette, Shadow } from "@/constants/palette";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; //Area segura

import { ThemedText } from "@/components/themed-text";
import FloatingCritters from "@/components/cute/FloatingCritters";
import { Bob, Wiggle } from "@/components/cute/Motion";
import { authAPI } from "@/api";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  return (
    <LinearGradient
      colors={[Palette.surface, Palette.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top }]}
    >
      <FloatingCritters count={5} size={14} opacity={0.3} pawColor={Palette.borderStrong} />
      <View style={styles.leftSection}>
        <Bob distance={4} duration={1400}>
          <Image
            source={require("@/assets/images/Logo.png")}
            style={styles.logo}
          />
        </Bob>
      </View>

      <View style={styles.centerSection}>
        {user && (
          <View style={styles.userInfo}>
            <ThemedText style={styles.userText} numberOfLines={1}>
              {user.name} {user.lastName}
            </ThemedText>
            {user.role && (
              <ThemedText style={styles.roleText} numberOfLines={1}>
                {user.role.roleType || user.role.name || "Usuario"}
              </ThemedText>
            )}
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.notificationContainer}>
          <Wiggle style={styles.bellIcon}>
            <ThemedText style={styles.bellSymbol}>🔔</ThemedText>
          </Wiggle>
          <View style={styles.notificationDot} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 70,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: "hidden",
    ...Shadow.card,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  leftSection: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  rightSection: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  logo: {
    width: 60,
    height: 60,
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  userText: {
    color: Palette.text,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  roleText: {
    color: Palette.textMuted,
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  notificationContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  bellIcon: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  bellSymbol: {
    fontSize: 21,
    color: Palette.onPrimary,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  notificationDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.danger,
    borderWidth: 1,
    borderColor: Palette.border,
  },
});
