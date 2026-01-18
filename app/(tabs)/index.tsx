import PostCard from '@/components/PostCard';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
   // Added <any[]> to silence TypeScript errors for now. 
   // ideally, you will create a 'Post' interface later.
   const [posts, setPosts] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 1. Define the async function inside the effect
    const fetchData = async () => {
      try {
        // FIXED: Added quotes around the URL
        const response = await fetch('https://gorest.co.in/public/v2/posts');
        const data = await response.json();
        
        // 2. Update state with the result
        setPosts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // 3. Stop loading whether it worked or failed
        setLoading(false);
      }
    };

    // 4. Call the function
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <FlatList 
  data={posts}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{ paddingBottom: 20 }} // Adds space at the bottom
  renderItem={({ item }) => (
      <PostCard post={item} />
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // Temporary styles for the card
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  }
});