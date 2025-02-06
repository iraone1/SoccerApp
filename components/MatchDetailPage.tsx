import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Loading from './Loading';

export default function MatchDetailPage({ route }) {
    const { teamId } = route.params;
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);  // Matches for the selected date
    const [teamName, setTeamName] = useState("");  // To store team name
    const [isLoading, setIsLoading] = useState(true);
    const apiKey = '5f718ec585c64de396d5252c8e10092c';  // Replace with your API Key

    useEffect(() => {
        setIsLoading(true);
        // Fetch matches for the selected team
        fetch(`https://api.football-data.org/v4/teams/${teamId}/matches`, {
            headers: { 'X-Auth-Token': apiKey },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.matches) {
                setMatches(data.matches);  // Assuming 'matches' is the key for the match data
            }
        })
        .catch((error) => {
            console.error(error);
        });

        // Fetch team information (name) for the selected team
        fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
            headers: { 'X-Auth-Token': apiKey },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.name) {
                setTeamName(data.name);  // Set the team name
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [teamId]);

    useEffect(() => {
        if (matches.length > 0) {
            const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format
            const todayMatches = matches.filter((match) => match.utcDate.startsWith(today));  // Filter matches for today
            setFilteredMatches(todayMatches);  // Set the filtered matches
        }
    }, [matches]);  // Runs when matches are fetched

    const renderMatch = ({ item }) => {
        if (!item.homeTeam || !item.awayTeam || !item.utcDate) {
            return null;  // Handle missing data
        }

        const homeTeam = item.homeTeam.name || 'Unknown';
        const awayTeam = item.awayTeam.name || 'Unknown';
        const matchTime = item.utcDate ? new Date(item.utcDate).toLocaleString() : 'Unknown time';

        return (
            <View style={styles.matchCard}>
                {/* Ensure all text is inside a Text component */}
                <Text style={styles.matchText}>{homeTeam} vs {awayTeam}</Text>
                <Text style={styles.matchDate}>{matchTime}</Text>
            </View>
        );
    };

    // Calendar date marking (only mark dates with matches for the selected team)
    const getMarkedDates = () => {
        const markedDates = {};
        matches.forEach((match) => {
            const matchDate = match.utcDate.split('T')[0];  // Use only the date part (YYYY-MM-DD)
            markedDates[matchDate] = { marked: true, selectedColor: 'blue' };
        });
        return markedDates;
    };

    

    // Add logging for debugging the data
    console.log('Filtered Matches:', filteredMatches);

    return (
        <View style={styles.container}>
            {/* Display the team name dynamically */}
           {isLoading ?(<Loading/>) :(<>
            <Text style={styles.title}>Schedule {teamName}</Text>

            <View style={styles.calendarWrapper}>
                {/* Calendar to show matches on selected date */}
                <Calendar
                    onDayPress={(day) => {
                        const selectedDate = day.dateString;
                        const filtered = matches.filter((match) => match.utcDate.startsWith(selectedDate));
                        setFilteredMatches(filtered);  // Filter matches by selected date
                    }}
                    markedDates={getMarkedDates()}  // Mark dates that have matches
                />
            </View>

            {/* Display matches for the selected date */}
            {filteredMatches.length > 0 ? (
                <FlatList
                    data={filteredMatches}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMatch}
                />
            ) : (
                <Text style={styles.noMatchesText}>Tidak ada pertandingan untuk tanggal ini</Text>
            )}
            </>

            )}
            
        </View>
    );
}

const styles = StyleSheet.create({
    calendarWrapper: {
        borderRadius: 10, // Set your desired borderRadius here
        overflow: 'hidden', // Ensures the borderRadius applies to the content inside
        backgroundColor: 'black', // Optional: you can set a background color for the wrapper
        marginBottom: 20, // Optional: add margin if needed
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'gray',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    matchCard: {
        padding: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        marginVertical: 5,
        borderRadius: 5,
    },
    matchText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    matchDate: {
        fontSize: 16,
        color: '#555',
    },
    noMatchesText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
