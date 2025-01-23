import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './SplashScreenStyles';

export default function SplashScreen() {
    return (
        <LinearGradient
            colors={['#001908', '#7948FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/igniteee.svg')} style={styles.textLogo} />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonSecondary}>
                    <Text style={styles.buttonTextSecondary}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonPrimary}>
                    <Text style={styles.buttonTextPrimary}>Log In</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}
