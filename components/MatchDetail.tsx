import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList, ImageBackground } from 'react-native';
import Loading from './Loading';

export default function MatchDetail({ route }) {
    const { matchId } = route.params;
    const [matchDetails, setMatchDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiKey = '761e7fe919cb1a6d01dde37cadd27fd7';

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await fetch(`https://v3.football.api-sports.io/fixtures?id=${matchId}`, {
                    method: 'GET',
                    headers: {
                        'x-apisports-key': apiKey,
                    },
                });
                const data = await response.json();
                console.log('API Response:', data);

                if (data.response.length > 0) {
                    setMatchDetails(data.response[0]);
                }
            } catch (error) {
                console.error('Error fetching match details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatchDetails();
    }, [matchId]);

    if (loading) {
       <Loading/>
    }

    if (!matchDetails) {
        return <Text style={styles.errorText}>Match details not available.</Text>;
    }

    const { teams, goals, events, statistics } = matchDetails;
    
    // Filter daftar pencetak gol
    const homeGoals = events?.filter(event => event.type === "Goal" && event.team.id === teams.home.id) || [];
    const awayGoals = events?.filter(event => event.type === "Goal" && event.team.id === teams.away.id) || [];

    // Ambil statistik
    const homeStats = statistics?.map(stat => stat.team.id === teams.home.id ? stat.statistics : null).filter(Boolean)[0] || [];
    const awayStats = statistics?.map(stat => stat.team.id === teams.away.id ? stat.statistics : null).filter(Boolean)[0] || [];

    return (
        <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')}style={styles.background}>
        <ScrollView style={styles.container}>
            {/* Header - Nama Tim dan Skor */}
            <View style={styles.header}>
                <View style={styles.teamContainer}>
                    <Text style={styles.teamName}>{teams.home.name}</Text>
                    <FlatList
                        data={homeGoals}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Text style={styles.scorerText}>{item.player.name} ({item.time.elapsed}')</Text>
                        )}
                    />
                </View>

                <Text style={styles.score}>{goals.home} - {goals.away}</Text>

                <View style={styles.teamContainer}>
                    <Text style={[styles.teamName, styles.alignRight]}>{teams.away.name}</Text>
                    <FlatList
                        data={awayGoals}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Text style={[styles.scorerText, styles.alignRight]}>{item.player.name} ({item.time.elapsed}')</Text>
                        )}
                    />
                </View>
            </View>

            {/* Statistik Pertandingan */}
            <Text style={styles.statsTitle}>Match Statistics</Text>
            <View style={styles.statsContainer}>
                {homeStats.length > 0 && awayStats.length > 0 ? (
                    <FlatList
                        data={homeStats}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.statsRow}>
                                <Text style={styles.statsValue}>{item.value}</Text>
                                <Text style={styles.statsLabel}>{item.type}</Text>
                                <Text style={styles.statsValue}>{awayStats[index]?.value || 0}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noStatsText}>Statistik tidak tersedia</Text>
                )}
            </View>
        </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
     
    },
   
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    teamContainer: {
        flex: 1,
    },
    teamName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    alignRight: {
        textAlign: 'right',
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        width: 60,
    },
    scorerText: {
        fontSize: 16,
        color: '#ddd',
    },
    statsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        textAlign: 'center',
    },
    statsContainer: {
        marginTop: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    statsValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        width: 50,
        textAlign: 'center',
    },
    statsLabel: {
        fontSize: 16,
        color: '#ddd',
        flex: 1,
        textAlign: 'center',
    },
    noStatsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
     background: {
    flex: 1,
    resizeMode: 'cover',
  },
});
