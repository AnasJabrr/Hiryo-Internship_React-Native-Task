import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

// Define the shape of the Post data
interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Generate a consistent random avatar based on the user ID
  const avatarUrl = `https://i.pravatar.cc/150?u=${post.user_id}`;

  return (
    // Wrap the card in a Link to handle navigation automatically
    <Link href={`/posts/${post.id}`} asChild>
      <Pressable style={styles.card}>
        
        {/* Header: Avatar and Name */}
        <View style={styles.header}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>User {post.user_id}</Text>
            <Text style={styles.date}>2 hours ago</Text>
          </View>
        </View>

        {/* Content: Title and Body */}
        <Text style={styles.title} numberOfLines={1}>
          {post.title}
        </Text>
        <Text style={styles.body} numberOfLines={3}>
          {post.body}
        </Text>
        
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // varied shadows for iOS and Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // makes it a circle
    marginRight: 10,
    backgroundColor: '#eee',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  date: {
    color: '#666',
    fontSize: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  body: {
    color: '#444',
    lineHeight: 20,
  },
});