import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

// Define types for our data
interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
}

export default function PostDetails() {
  const { id } = useLocalSearchParams();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Post and Comments in parallel for better performance
        const [postRes, commentRes] = await Promise.all([
          fetch(`https://gorest.co.in/public/v2/posts/${id}`),
          fetch(`https://gorest.co.in/public/v2/posts/${id}/comments`)
        ]);

        const postData = await postRes.json();
        const commentData = await commentRes.json();

        setPost(postData);
        setComments(commentData);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      {/* Update the top navigation bar title */}
      <Stack.Screen options={{ title: 'Post Details' }} />

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        
        // RENDER POST DETAILS (HEADER)
        ListHeaderComponent={() => (
          post ? (
            <View style={styles.postContainer}>
              <View style={styles.header}>
                <Image 
                  source={{ uri: `https://i.pravatar.cc/150?u=${post.user_id}` }} 
                  style={styles.avatar} 
                />
                <Text style={styles.username}>User {post.user_id}</Text>
              </View>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postBody}>{post.body}</Text>
              
              <Text style={styles.sectionTitle}>Comments</Text>
            </View>
          ) : null
        )}

        // RENDER COMMENTS (LIST)
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
             <View style={styles.header}>
                {/* Comments actually have names in the API! */}
                <Image 
                  source={{ uri: `https://i.pravatar.cc/150?u=${item.name}` }} 
                  style={styles.smallAvatar} 
                />
                <View>
                    <Text style={styles.commentUser}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                </View>
             </View>
             <Text style={styles.commentBody}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Post Styles
  postContainer: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10, backgroundColor: '#eee' },
  username: { fontWeight: 'bold', fontSize: 16 },
  postTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  postBody: { fontSize: 16, lineHeight: 24, color: '#444', marginBottom: 20 },
  
  // Comment Styles
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10 },
  commentCard: { 
    backgroundColor: '#f9f9f9', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  smallAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8, backgroundColor: '#ccc' },
  commentUser: { fontWeight: 'bold', fontSize: 14 },
  email: { fontSize: 12, color: '#666' },
  commentBody: { marginTop: 6, fontSize: 14, color: '#333', lineHeight: 20 }
});