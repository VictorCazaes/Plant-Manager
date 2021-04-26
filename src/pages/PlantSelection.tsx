import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Header } from '../components/Header'
import { EnvironmentButton } from '../components/EnvironmentButton';
import { PrimaryPlantCard } from '../components/PrimaryPlantCard';
import { Load } from '../components/load';
import { PlantProps } from '../libs/storage';
 
import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentProps {
    key: string;
    title: string;
}

export function PlantSelection() {

    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation();
    
    function hanldeEnvironmentSelected(environment: string) {
        setEnvironmentSelected(environment);

        if(environment === 'all')
            return setFilteredPlants(plants);
        
        const filtered = plants.filter(plant =>
            plant.environments.includes(environment)
        );

        setFilteredPlants(filtered);
    }

    async function fetchPlants() {
        const { data } = await api
        .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`)
        
        if(!data)
            return setLoading(true);
        if(page > 1) {
            setPlants( oldvalue => [...oldvalue, ...data ])
            setFilteredPlants( oldvalue => [...oldvalue, ...data ])
        } else {
            setPlants(data);
            setFilteredPlants(data);
        }
        setLoading(false);
        setLoadingMore(false);
    }

    function handleFetchMore(distance: number) {
        if(distance < 1)
            return;
        setLoadingMore(true);
        setPage(oldvalue => oldvalue + 1);
        fetchPlants();
    }

    function handlePlantSelect(plant: PlantProps) {
        navigation.navigate('PlantSave', {plant});
    }

    useEffect(() => {
        async function fetchEnvironment() {
            const { data } = await api
            .get('plants_environments?_sort=title&_order=asc')
            setEnvironments([
                {
                    key: 'all',
                    title: 'All'
                },
                ...data
            ])
        }

        fetchEnvironment();
    }, [])
    
    useEffect(() => {
        fetchPlants();
    }, [])

    if(loading)
        return <Load />
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>
                    Select the environment
                </Text>
                <Text style={styles.subtitle}>
                    that you're placing your plant
                </Text>
            </View>

            <View>
                <FlatList 
                    data={environments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item}) => (
                        <EnvironmentButton 
                            title={item.title} 
                            active={item.key === environmentSelected}
                            onPress={() => hanldeEnvironmentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>
            <View style={styles.plants}>
                <FlatList 
                data={(environmentSelected=='all') ? plants : filteredPlants}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <PrimaryPlantCard 
                    data={item}
                    onPress={() => handlePlantSelect(item)}
                    />
                )}
                showsVerticalScrollIndicator= {false}
                numColumns={2}
                onEndReachedThreshold={0.1}
                onEndReached={({distanceFromEnd}) =>
                    handleFetchMore(distanceFromEnd)    
                }
                ListFooterComponent= {
                    loadingMore ? <ActivityIndicator color={colors.green}/> : <></>
                }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontSize: 17,
        fontFamily: fonts.text,
        color: colors.heading,
        lineHeight: 20
    },
    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingLeft: 40,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
})