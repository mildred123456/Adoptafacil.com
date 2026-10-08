import React, { useState } from "react";
import { Palette, Radius, Shadow } from "@/constants/palette";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/themed-text";
import CuteHint from "@/components/cute/CuteHint";
import FloatingCritters from "@/components/cute/FloatingCritters";
import PawGround from "@/components/cute/PawGround";
import { PopIn } from "@/components/cute/Motion";
import { ThemedView } from "@/components/themed-view";

// --- Interfaces ---
interface Post {
  id: number;
  author: { name: string; avatarUrl: string };
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  is_liked: boolean;
  comments: number;
  category: string;
}

// --- Datos de ejemplo (asegurando is_liked) ---
const samplePosts: Post[] = [
  {
    id: 1,
    author: {
      name: "Fundación Huellitas Felices",
      avatarUrl: "https://i.pravatar.cc/150?u=huellitasfelices",
    },
    timestamp: "hace 2 horas",
    content:
      "¡Gran jornada de esterilización este fin de semana! 🐾 Tendremos precios especiales y apoyo de veterinarios expertos.",
    imageUrl:
      "https://images.unsplash.com/photo-1549483363-1c8b7be41523?q=80&w=870&auto=format&fit=crop",
    likes: 125,
    is_liked: false,
    comments: 12,
    category: "Campañas",
  },
  {
    id: 2,
    author: {
      name: "AdoptaFácil Admin",
      avatarUrl: "https://i.pravatar.cc/150?u=adoptafaciladmin",
    },
    timestamp: "hace 1 día",
    content:
      "¡Bienvenidos a nuestra nueva sección de Comunidad! ✨ Este es un espacio para conectar, compartir y colaborar por los animales.",
    likes: 350,
    is_liked: false,
    comments: 45,
    category: "Noticias",
  },
];

// --- PostCard ---
const PostCard = ({
  post,
  onLike,
}: {
  post: Post;
  onLike: (id: number) => void;
}) => (
  <View style={styles.card}>
    <View style={styles.postHeader}>
      <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.author}>{post.author.name}</ThemedText>
        <ThemedText style={styles.timestamp}>{post.timestamp}</ThemedText>
      </View>
    </View>

    <ThemedText style={styles.content}>{post.content}</ThemedText>

    {post.imageUrl ? (
      <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
    ) : null}

    <View style={styles.actions}>
      <TouchableOpacity
        onPress={() => onLike(post.id)}
        style={styles.actionBtn}
      >
        <Ionicons
          name={post.is_liked ? "heart" : "heart-outline"}
          size={20}
          color={post.is_liked ? Palette.primary : Palette.textMuted}
        />
        <ThemedText style={styles.actionText}>{post.likes}</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn}>
        <Ionicons name="chatbubble-outline" size={20} color={Palette.textMuted} />
        <ThemedText style={styles.actionText}>{post.comments}</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn}>
        <Ionicons name="share-social-outline" size={20} color={Palette.textMuted} />
      </TouchableOpacity>
    </View>
  </View>
);

// --- Filtros (simple UI) ---
const PostFilters = () => (
  <View style={styles.filtersCard}>
    <ThemedText style={styles.filterTitle}>Filtrar Publicaciones</ThemedText>
    <View style={styles.searchBar}>
      <TextInput
        placeholder="Buscar por palabra clave..."
        style={styles.searchInput}
        placeholderTextColor={Palette.textMuted}
      />
      <Ionicons name="search" size={20} color={Palette.primary} />
    </View>
    <ThemedText style={styles.categoriesTitle}>Categorías</ThemedText>
    {["Campañas", "Noticias", "Consejos", "General"].map((cat, idx) => (
      <View key={idx} style={styles.categoryRow}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: [Palette.primary, Palette.secondaryText, Palette.successText, Palette.textMuted][
                idx
              ],
            },
          ]}
        />
        <ThemedText style={styles.categoryText}>{cat}</ThemedText>
      </View>
    ))}
  </View>
);

// --- Crear Post (comportamiento real) ---
const CreatePost = ({ onPublish }: { onPublish: (text: string) => void }) => {
  const [text, setText] = useState("");
  return (
    <View style={styles.createPost}>
      <TextInput
        style={styles.input}
        placeholder="¿Qué quieres compartir hoy?"
        value={text}
        onChangeText={setText}
        placeholderTextColor={Palette.textMuted}
      />
      <TouchableOpacity
        style={styles.publishBtn}
        onPress={() => {
          if (!text.trim()) return;
          onPublish(text.trim());
          setText("");
          Keyboard.dismiss();
        }}
      >
        <ThemedText style={styles.publishText}>Publicar</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

// --- Pantalla principal ---
export default function Comunidad() {
  // inicializar posts garantizando is_liked
  const [posts, setPosts] = useState<Post[]>(() =>
    samplePosts.map((p) => ({ ...p }))
  );

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              is_liked: !p.is_liked,
              likes: p.is_liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handlePublish = (text: string) => {
    const newPost: Post = {
      id: Date.now(),
      author: {
        name: "Tú",
        avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
      },
      timestamp: "ahora",
      content: text,
      likes: 0,
      is_liked: false,
      comments: 0,
      category: "General",
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section con gradiente */}
      <LinearGradient
        colors={[Palette.surfacePink, Palette.surfacePink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <FloatingCritters count={8} size={22} opacity={0.35} />
        <ThemedText style={styles.heroTitle}>
          Únete a nuestra Comunidad
        </ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Comparte historias, consejos, eventos y conecta con personas que
          buscan el bienestar animal
        </ThemedText>
      </LinearGradient>

      {/* Sección de contenido */}
      <PopIn delay={120}>
      <ThemedView style={styles.contentSection}>
        <PostFilters />
        <CuteHint
          id="community-post"
          text="Comparte algo lindo con la comunidad ✍️"
        />
        <CreatePost onPublish={handlePublish} />

        {/* Posts */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </ThemedView>
      </PopIn>
      {/* Huellitas que caminan por la página (se mueven con el scroll) */}
      <PawGround />
    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  heroSection: {
    padding: 20,
    paddingVertical: 34,
    alignItems: "center",
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: Palette.primary,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Palette.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    textShadowColor: "transparent",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentSection: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    padding: 20,
  },
  filtersCard: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Palette.text,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.field,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    ...Shadow.card,
  },
  searchInput: {
    flex: 1,
    color: Palette.text,
    marginRight: 8,
    fontSize: 15,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.text,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  categoryText: {
    color: Palette.text,
    fontSize: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  createPost: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.card,
    padding: 12,
    alignItems: "center",
    ...Shadow.card,
  },
  input: {
    flex: 1,
    marginRight: 10,
    color: Palette.text,
    fontSize: 15,
  },
  publishBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: Radius.pill,
    ...Shadow.button,
  },
  publishText: {
    color: Palette.onPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.card,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadow.card,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Palette.border,
  },
  author: {
    fontWeight: "600",
    color: Palette.text,
    fontSize: 15,
  },
  timestamp: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
  content: {
    marginBottom: 10,
    color: Palette.text,
    lineHeight: 20,
    fontSize: 15,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: Palette.surfacePink,
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 6,
    color: Palette.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
});
