import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Loading from './Loading';

const { width } = Dimensions.get('window');

export default function LiveScore({ navigation }) {
    const [liveScores, setLiveScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const apiKey = '761e7fe919cb1a6d01dde37cadd27fd7'; // Ganti dengan API Key yang valid

    useEffect(() => {
        const fetchLiveScores = async () => {
            try {
                const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
                    method: 'GET',
                    headers: {
                        'x-apisports-key': apiKey,
                    },
                });
                const data = await response.json();
                if (data.response) {
                    setLiveScores(data.response);
                }
            } catch (error) {
                console.error('Error fetching live scores:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLiveScores();
        const interval = setInterval(fetchLiveScores, 30000);

        return () => clearInterval(interval);
    }, []);

    const renderLiveScore = ({ item }) => {
        const homeTeam = item.teams?.home?.name || 'Unknown';
        const awayTeam = item.teams?.away?.name || 'Unknown';
        const homeScore = item.goals?.home ?? 0;
        const awayScore = item.goals?.away ?? 0;
        const matchTime = item.fixture?.status?.elapsed ?? 0;
        const leagueName = item.league?.name || 'Unknown League';
        const isHighlighted = matchTime > 0 && matchTime < 90; // Highlight untuk pertandingan yang sedang berlangsung

        return (
            <View style={[styles.liveScoreCard, isHighlighted && styles.highlightedMatch]}>
                <Text style={styles.leagueName}>{leagueName}</Text>
                <View>
                <Text style={styles.matchTime}> Min</Text>
                
                </View>
                <Text style={styles.team}>{homeTeam} {homeScore} Vs {awayScore} {awayTeam}</Text>
              <Text style={styles.team1}> {homeScore} - {awayScore} </Text>
             
             <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() => navigation.navigate('MatchDetail', { matchId: item.fixture.id })}
                >
                    <Text style={styles.detailButtonText}>Lihat Detail</Text>
                </TouchableOpacity>
            </View>
            
        );
    };

    return (
        <View style={styles.container}>
            
            {isLoading ? (
               <Loading/>
            ) : liveScores.length > 0 ? (
            <View>
            <Text style={styles.title}>Live Skor Pertandingan</Text>
            
                <FlatList
                    data={liveScores}
                    keyExtractor={(item) => item.fixture?.id?.toString() || Math.random().toString()}
                    renderItem={renderLiveScore}
                    showsVerticalScrollIndicator={false}
                />
                </View>
            ) : (
                <View style={{flex:1,justifyContent:'center'}}>
                <Text style={styles.noDataText}>Tidak ada pertandingan yang sedang berlangsung</Text>
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: 'gray',
    },
     detailButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    detailButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#fff',
        textAlign: 'center',
    },
    liveScoreCard: {
        width: width * 0.9,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    matchTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    },
    highlightedMatch: {
        borderColor: 'gold',
        borderWidth: 3,
        backgroundColor: '#fff8dc',
    },
    team: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    team1: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        
    },
    leagueName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#353030',
        marginBottom: 5,
    },
    noDataText: {
        
        textAlign: 'center',
     
        fontSize: 24,
        color: '#fff',
    },
    loader: {
        marginTop: 20,
    },
});
