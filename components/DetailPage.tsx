import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Loading from './Loading';

export default function DetailPage({ route, navigation }) {
  const { leagueId } = route.params;
  const [leagueName, setLeagueName] = useState('');
  const [teams, setTeams] = useState([]);
  const [klasmen, setKlasmen] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = '5f718ec585c64de396d5252c8e10092c'; // Ganti dengan API Key Anda

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch(`https://api.football-data.org/v4/competitions/${leagueId}/standings`, {
        headers: { 'X-Auth-Token': apiKey },
      }).then(response => response.json()),
      fetch(`https://api.football-data.org/v4/competitions/${leagueId}/teams`, {
        headers: { 'X-Auth-Token': apiKey },
      }).then(response => response.json())
    ])
      .then(([standingsResponse, teamsResponse]) => {
        if (standingsResponse.competition) {
          setLeagueName(standingsResponse.competition.name);
        }
        setKlasmen(standingsResponse.standings[0].table);
        setTeams(teamsResponse.teams);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [leagueId]);

  const renderTeam = ({ item }) => (
    <TouchableOpacity
      style={styles.teaminfo}
      onPress={() => navigation.navigate('InfoTeam', { teamId: item.id })}
    >
      <Image source={{ uri: item.crest }} style={styles.teamLogo} />
    </TouchableOpacity>
  );

  const renderKlasmen = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.rowText, { flex: 3 }]}>{item.team.name}</Text>
      <Text style={[styles.rowText1, { flex: 1 }]}>{item.won}</Text>
      <Text style={[styles.rowText1, { flex: 1 }]}>{item.lost}</Text>
      <Text style={[styles.rowText1, { flex: 1 }]}>{item.points}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')} style={styles.background}>
      <View style={styles.container}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Text style={styles.title}>{leagueName}</Text>

            <Text style={styles.subtitle}>Team</Text>
            <View style={styles.teamList}>
              <FlatList 
                data={teams}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTeam}
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}
              />
            </View>

            <Text style={styles.subtitle}>Tabel Klasmen</Text>
            <FlatList
              data={klasmen}
              keyExtractor={(item) => item.team.id.toString()}
              renderItem={renderKlasmen}
             
              ListHeaderComponent={
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerText, { flex: 3 }]}>Team</Text>
                  <Text style={[styles.headerText, { flex: 1 }]}>Won</Text>
                  <Text style={[styles.headerText, { flex: 1 }]}>Lost</Text>
                  <Text style={[styles.headerText, { flex: 1 }]}>Points</Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Memberikan efek transparan pada background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
    textAlign: 'center',
  },
  teamList: {
    marginBottom: 20,
  },
  teaminfo: {
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#dcc91f',
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
    width: 130,
    borderRadius: 80,
    marginHorizontal: 10,
  },
  teamLogo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    marginHorizontal: 10,
    flexDirection: 'row',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rowText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  rowText1: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
