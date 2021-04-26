import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import {SvgFromUri} from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../libs/storage';

import { Button } from '../components/Button';

import waterdrop from '../assets/waterdrop.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Params {
    plant: PlantProps
}

export function PlantSave() {
    const [selectedDateTime, setSelectedDateTime] = useState( new Date);
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');
    const route = useRoute();
    const {plant} = route.params as Params;

    const navigation = useNavigation();

    function handleChangeTime(event: Event, dateTime: Date | undefined) {
        if(Platform.OS === 'android') {
            setShowDatePicker(oldState => !oldState)
        }

        if(dateTime && isBefore(dateTime, new Date())){
            setSelectedDateTime(new Date());
            return Alert.alert("Set a future time! ⏰");
        }
        
        if(dateTime)
            setSelectedDateTime(dateTime);
    }

    function handleOpenTimePickerForAndroid() {
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave() {
        try {
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            });
            navigation.navigate('Confirmation',{
                title: "All right",
                subtitle: "Now I'll always remind you to water your plants.",
                buttonTitle: "Thanks",
                icon: "hug",
                nextScreen: "MyPlants",
            });
        } catch {
            Alert.alert("I couldn't save 😢")
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri 
                        uri={plant.photo}
                        width={150}
                        height={150}
                    />
                    <Text style={styles.plantName}>
                        {plant.name}   
                    </Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>
                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image 
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>
                    <Text style={styles.alertLabel}>
                        Set the best time
                    </Text>
                    {showDatePicker && (
                        <DateTimePicker 
                        value={selectedDateTime}
                        mode="time"
                        display="spinner"
                        onChange={handleChangeTime}
                        style={styles.dateTimePicker}
                        />
                    )}

                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity
                                style={styles.timePickerButton}
                                onPress={handleOpenTimePickerForAndroid}
                            >
                                <Text style={styles.timePickerText}>
                                {`Change: ${format(selectedDateTime, 'HH:mm')}`}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                        
                    <Button 
                        title="Set reminder"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20
    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10        
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 40
    },
    tipImage: {
        width: 56,
        height: 56
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePicker: {
        height: 100
    },
    timePickerButton: {
        width:'100%',
        alignItems: 'center',
        paddingVertical: 40
    },
    timePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text     
    }
})