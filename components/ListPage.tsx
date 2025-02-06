import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import Loading from './Loading';

const { width } = Dimensions.get('window');

export default function ListPage({ navigation }) {
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = '5f718ec585c64de396d5252c8e10092c'; // Replace with a valid API key

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch('https://api.football-data.org/v4/competitions', {
          headers: { 'X-Auth-Token': apiKey },
        });
        const json = await response.json();
        
        if (json.competitions) {
          const excludedLeagues = [
            'Campeonato Brasileiro Série A',
            'Copa Libertadores',
            'FIFA World Cup',
            'European Championship',
          ];

          const filteredLeagues = json.competitions.filter(
            (item) => !excludedLeagues.includes(item.name)
          );

          setLeagues(filteredLeagues);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const renderItem = ({ item }, navigateTo) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(navigateTo, { leagueId: item.id })}
    >
      {item.emblem && <Image source={{ uri: item.emblem }} style={styles.flag} />}
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
    <ScrollView>
      <View style={styles.section}>
        <Text style={styles.title}>Klasemen Liga</Text>
        <FlatList
          data={leagues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => renderItem(item, 'Detail')}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Jadwal Pertandingan</Text>
        <FlatList
          data={leagues} // Uses the same league data
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => renderItem(item, 'Match')}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'gray',
    justifyContent: 'flex-start',
    alignItems: 'center',
    
    
  
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 3,
    padding: 10,
    marginBottom: 30,
    backgroundColor: 'white',
    borderColor: '#dcc91f',
  },
  card: {
    width: width * 0.7,
    height: 140,
    backgroundColor: '#8c8e88',
    borderWidth: 3,
    borderColor: '#dcc91f',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    opacity: 0.9,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1ecec',
    textAlign: 'center',
    marginTop: 8,
  },
  flag: {
    width: 110,
    height: 100,
    resizeMode: 'contain',
  },
});

