import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import Loading from './Loading';

const { width } = Dimensions.get('window');
const apiKey = '761e7fe919cb1a6d01dde37cadd27fd7'; // Ganti dengan API Key yang valid

export default function LiveScore({ navigation }) {
    const [liveScores, setLiveScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLiveScores = async () => {
            try {
                const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
                    method: 'GET',
                    headers: { 'x-apisports-key': apiKey },
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
        const matchStatus = item.fixture?.status?.short;
        const isOngoing = matchStatus !== 'FT' && matchStatus !== 'NS';
        const isHighlighted = isOngoing && matchTime > 0 && matchTime < 90;

        return (
            <View style={[styles.liveScoreCard, isHighlighted && styles.highlightedMatch]}>
                
                <Text style={styles.leagueName}>{leagueName}</Text>
                
                <View style={styles.teamScoreContainer}>
                    <Text style={styles.team}>{homeTeam}</Text>
                    <Text style={styles.team}>Vs</Text>
                    <Text style={styles.team}>{awayTeam}</Text>
                </View>
                <Text style={styles.score}>{homeScore} - {awayScore}</Text>
                <Text style={isOngoing ? styles.matchTime : styles.finishedText}>
                    {isOngoing ? `${matchTime} Min` : 'Pertandingan Selesai'}
                </Text>
                
                <View style={{flexDirection:'row',justifyContent:'space-between',gap:5}}>
                <TouchableOpacity
    style={styles.detailButton}
    onPress={() => navigation.navigate('MatchDetail', { matchId: item.fixture.id })}
>
    <Text style={styles.detailButtonText}>Statistik</Text>
</TouchableOpacity>


<TouchableOpacity
    style={styles.detailButton}
    onPress={() => navigation.navigate('MatchTimeline', { matchId: item.fixture.id })}
>
    <Text style={styles.detailButtonText}>Timeline</Text>
</TouchableOpacity>
</View>

            </View>
            );
    };

    return (
        <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')} style={styles.background}>
            
        <View style={styles.container}>
            {isLoading ? (
                <Loading />
            ) : liveScores.length > 0 ? (
                <FlatList
                    data={liveScores}
                    keyExtractor={(item) => item.fixture?.id?.toString() || Math.random().toString()}
                    renderItem={renderLiveScore}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<Text style={styles.title}>Live Skor Pertandingan</Text>}
                />
            ) : (
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={styles.noDataText}>Tidak ada pertandingan yang sedang berlangsung</Text>
            </View>
            )}
        </View>
        </ImageBackground>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.3)',
     
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom:10,
        color: '#000',
   
    },
    finishedText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    highlightedMatch: {
        borderColor: 'gold',
        borderWidth: 3,
        backgroundColor: '#fff8dc',
    },
    teamScoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    team: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        flex: 1, // Ensures both team names take equal space
        textAlign: 'center',
    },
    score: {
        fontSize: 20,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 10,
        
    },
    leagueName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#353030',
        marginBottom: 15,
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
    noDataText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
        marginTop: 20,
    },
     background: {
    flex: 1,
    resizeMode: 'cover',
  },
});
