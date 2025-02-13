import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Loading from './Loading';
import { ScrollView } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

export default function MatchDetailPage({ route }) {
    const { teamId } = route.params;
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [teamLogo, setTeamLogo] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const apiKey = '5f718ec585c64de396d5252c8e10092c';

    useEffect(() => {
        setIsLoading(true);

        const fetchMatches = fetch(`https://api.football-data.org/v4/teams/${teamId}/matches`, {
            headers: { 'X-Auth-Token': apiKey },
        })
        .then(response => response.json())
        .then(data => {
            if (data.matches) {
                setMatches(data.matches);
            }
        })
        .catch(error => console.error(error));

        const fetchTeam = fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
            headers: { 'X-Auth-Token': apiKey },
        })
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                setTeamName(data.name);
                setTeamLogo(data.crest);
            }
        })
        .catch(error => console.error(error));

        Promise.all([fetchMatches, fetchTeam]).finally(() => setIsLoading(false));
    }, [teamId]);

    useEffect(() => {
        if (matches.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            setFilteredMatches(matches.filter(match => match.utcDate.startsWith(today)));
        }
    }, [matches]);

    const renderMatch = ({ item }) => {
        if (!item.homeTeam || !item.awayTeam || !item.utcDate) return null;

        const homeTeam = item.homeTeam.name || 'Unknown';
        const awayTeam = item.awayTeam.name || 'Unknown';
        const matchTime = item.utcDate ? new Date(item.utcDate).toLocaleString() : 'Unknown time';

        return (
            <View style={styles.matchCard}>
                <View style={styles.matchRow}>
                    <Image 
                        source={{ uri: `https://crests.football-data.org/${item.homeTeam.id}.png` }} 
                        style={styles.teamLogo} 
                        resizeMode="contain"
                    />
                    <Text style={[styles.matchText, { flex: 3, textAlign: 'right' }]} numberOfLines={1}>
                        {homeTeam}
                    </Text>
                    <Text style={[styles.matchText, { flex: 1, textAlign: 'center', fontWeight: 'bold' }]}>
                        Vs
                    </Text>
                    <Text style={[styles.matchText, { flex: 3, textAlign: 'left' }]} numberOfLines={1}>
                        {awayTeam}
                    </Text>
                    <Image 
                        source={{ uri: `https://crests.football-data.org/${item.awayTeam.id}.png` }} 
                        style={styles.teamLogo} 
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.matchDate}>{matchTime}</Text>
            </View>
        );
    };

    const getMarkedDates = () => {
        const markedDates = {};
        matches.forEach((match) => {
            if (match.utcDate) {
                const matchDate = match.utcDate.split('T')[0];
                markedDates[matchDate] = { marked: true, selectedColor: 'blue' };
            }
        });
        return markedDates;
    };

    return (
        <ImageBackground source={require('../assets/istockphoto-185007737-612x612.jpg')} style={styles.backgroundImage}>
            <View style={styles.overlay}>
                {isLoading ? (
                    <View>
                        <Loading />
                    </View>
                ) : (
                    <ScrollView>
                        <Text style={styles.title}>Schedule {teamName}</Text>
                        <View style={styles.calendarWrapper}>
                            <Calendar
                                onDayPress={(day) => {
                                    const selectedDate = day.dateString;
                                    setFilteredMatches(matches.filter(match => match.utcDate.startsWith(selectedDate)));
                                }}
                                markedDates={getMarkedDates()}
                            />
                        </View>
                        {filteredMatches.length > 0 ? (
                            <FlatList
                                data={filteredMatches}
                                style={{ marginTop: height * 0.03 }}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderMatch}
                            />
                        ) : (
                            <Text style={styles.noMatchesText}>Tidak ada pertandingan untuk tanggal ini</Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
     
  
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: width * 0.05,
        justifyContent: 'center',
    },
    
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.02,
        color: '#ffffff',
        textAlign: 'center',
    },
    matchCard: {
        backgroundColor: 'white',
        padding: width * 0.04,
        marginBottom: height * 0.015,
        borderRadius: 8,
        elevation: 3,
        alignItems: 'center',
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    teamLogo: {
        width: width * 0.1,
        height: width * 0.1,
        marginHorizontal: 10,
    },
    matchText: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: '#111111',
    },
    matchDate: {
        fontSize: width * 0.04,
        color: '#555',
        textAlign: 'center',
    },
    noMatchesText: {
        fontSize: width * 0.04,
        color: '#f6f3f3',
        textAlign: 'center',
        marginTop: 20,
    },
    calendarWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'black',
        marginTop: height * 0.02,
    },
});
