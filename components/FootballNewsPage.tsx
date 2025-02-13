import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loading from './Loading';

const FootballNewsPage = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFootballNews();
  }, []);

  const fetchFootballNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=football&apiKey=ef326fb92daf41958d1cb999113cc269`
      );
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error('Error fetching football news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToArticle = (articleUrl) => {
    navigation.navigate('Article', { articleUrl });
  };

  const renderBerita = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      {item.urlToImage ? (
        <Image source={{ uri: item.urlToImage }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity style={styles.readMoreButton} onPress={() => navigateToArticle(item.url)}>
          <Text style={styles.readMoreText}>Baca Selengkapnya</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
        <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')}style={styles.background}><View style={styles.container}>
      {isLoading ? (
<Loading/>
) : (
        <FlatList 
        data={news} 
        keyExtractor={(item) => item.url} 
        renderItem={renderBerita} />
      )}
    </View>
   </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
   
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#dcc91f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'contain',
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'justify',
  },
  readMoreButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  readMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FootballNewsPage;
