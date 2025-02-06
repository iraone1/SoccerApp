import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MatchDetail({ route }) {
    const { matchId } = route.params;
    const [matchDetails, setMatchDetails] = useState(null);
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
                if (data.response) {
                    setMatchDetails(data.response[0]);
                }
            } catch (error) {
                console.error('Error fetching match details:', error);
            }
        };

        fetchMatchDetails();
    }, [matchId]);

    if (!matchDetails) {
        return <Text>Loading...</Text>;
    }

    const { teams, goals, lineup, scorers } = matchDetails;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{teams.home.name} vs {teams.away.name}</Text>
            <Text>Score: {goals.home} - {goals.away}</Text>
            <Text>Lineup:</Text>
            {lineup?.home?.map((player, index) => (
                <Text key={index}>{player.player.name}</Text>
            ))}
            <Text>Top Scorers:</Text>
            {scorers?.map((scorer, index) => (
                <Text key={index}>{scorer.player.name}: {scorer.goals} goals</Text>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
