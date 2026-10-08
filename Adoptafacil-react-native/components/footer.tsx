import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Palette } from "@/constants/palette";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Bob } from "@/components/cute/Motion";

const FOOTER_FRIENDS = ["🐶", "🐱", "🐰", "🐹", "🐻"];

export default function Footer() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
    >
      {/* Decoración: animalitos saltarines */}
      <View style={styles.friendsRow}>
        {FOOTER_FRIENDS.map((f, i) => (
          <Bob key={f} delay={i * 180} distance={7} duration={900}>
            <ThemedText style={styles.friend}>{f}</ThemedText>
          </Bob>
        ))}
      </View>

      <View style={styles.footerContent}>
        {/* Información principal */}
        <View style={styles.mainSection}>
          <ThemedText style={styles.companyName}>ADOPTAFÁCIL</ThemedText>
          <ThemedText style={styles.description}>
            Conectando mascotas con hogares amorosos
          </ThemedText>
        </View>

        {/* Contacto y Redes sociales en fila */}
        <View style={styles.bottomSections}>
          <View style={styles.contactSection}>
            <ThemedText style={styles.sectionTitle}>Contacto</ThemedText>
            <ThemedText style={styles.contactInfo}>
              info@adoptafacil.com
            </ThemedText>
            <ThemedText style={styles.contactInfo}>+1 234 567 890</ThemedText>
          </View>

          <View style={styles.socialSection}>
            <ThemedText style={styles.sectionTitle}>Síguenos</ThemedText>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <ThemedText style={styles.socialText}>FB</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <ThemedText style={styles.socialText}>IG</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <ThemedText style={styles.socialText}>TW</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Copyright */}
      <View style={styles.copyright}>
        <ThemedText style={styles.copyrightText}>
          © 2025 Adoptafácil. Todos los derechos reservados
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Palette.surfacePink,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 2,
    borderColor: Palette.border,
    marginTop: 10,
  },
  friendsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  friend: {
    fontSize: 24,
    lineHeight: 32,
  },
  footerContent: {
    gap: 20,
  },
  mainSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  bottomSections: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },
  contactSection: {
    flex: 1,
  },
  socialSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Palette.primary,
    marginBottom: 5,
    textAlign: "center",
  },
  description: {
    fontSize: 13,
    color: Palette.primary,
    lineHeight: 18,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Palette.text,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 12,
    color: Palette.textMuted,
    marginBottom: 4,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 8,
  },
  socialButton: {
    width: 30,
    height: 30,
    backgroundColor: Palette.surface,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Palette.border,
    justifyContent: "center",
    alignItems: "center",
  },
  socialText: {
    color: Palette.primary,
    fontSize: 10,
    fontWeight: "bold",
  },
  copyright: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    alignItems: "center",
  },
  copyrightText: {
    fontSize: 10,
    color: Palette.textMuted,
    textAlign: "center",
  },
});
