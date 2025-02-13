import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Dimensions, Image, ScrollView, 
  ImageBackground 
} from 'react-native';
import Loading from './Loading';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function ListPage({ navigation }) {
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = '5f718ec585c64de396d5252c8e10092c';

  useEffect(() => {
  const fetchLeagues = async () => {
    try {
      console.log("Fetching leagues...");
      const response = await fetch('https://api.football-data.org/v4/competitions', {
        method: 'GET',
        headers: { 'X-Auth-Token': apiKey },
      });

      console.log("Response status:", response.status);
      const json = await response.json();
      console.log("Response JSON:", json);

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
    <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')} style={styles.background}>
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
              data={leagues}
              keyExtractor={(item) => item.id.toString()}
              renderItem={(item) => renderItem(item, 'Match')}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginVertical: height * 0.015,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 2,
    padding: width * 0.04,
    marginBottom: height * 0.03,
    backgroundColor: 'white',
    borderColor: '#dcc91f',
    width: width * 0.9,
  },
  card: {
    width: width * 0.5, 
    height: height * 0.2, 
    backgroundColor: '#8c8e88',
    borderWidth: 2,
    borderColor: '#dcc91f',
    borderRadius: 15,
    padding: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.02,
    opacity: 0.9,
  },
  name: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#f1ecec',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  flag: {
    width: width * 0.2,
    height: height * 0.1,
    resizeMode: 'contain',
  },
});
