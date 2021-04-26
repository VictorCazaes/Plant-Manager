import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    Alert
} from 'react-native';

import { Header } from '../components/Header';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns/esm';
import { enCA } from 'date-fns/locale';

import waterdrop from '../assets/waterdrop.png';

import colors from '../styles/colors'
import fonts from '../styles/fonts';
import { SecondaryPlantCard } from '../components/SecondaryPlantCard';
import { Load } from '../components/load';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState((true));
    const [nextToWater, setNextToWater] = useState<string>();

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remove', `Would you like to remove ${plant.name}?`, [
            {
                text: 'No',
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id !== plant.id)
                        );
                    } catch (error) {
                        Alert.alert("Couldn't remove")
                    }
                }
            }
        ]
        
        )
    }

    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                {locale: enCA}
            );

            setNextToWater(
                `Don't forget to water ${plantsStoraged[0].name} in ${nextTime}`
            )

            setMyPlants(plantsStoraged);
            setLoading(false);
        }

        loadStorageData();
    },[])

    if(loading)
    return <Load />

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image 
                source={waterdrop}
                style={styles.spotlightImage}
                />
                <Text style={styles.spotlightText}>
                    {nextToWater}
                </Text>
            </View>
            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Next to water
                </Text>

                <FlatList 
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => (
                        <SecondaryPlantCard 
                        data={item}
                        handleRemove={() => {handleRemove(item)}}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{flex:1}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
})
