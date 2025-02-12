import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


const StreakAward: React.FC = () => {
   const router = useRouter();


   return (
       <View style={styles.container}>
           {/* Back Button */}
           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
               <Text style={styles.backText}>←</Text>
           </TouchableOpacity>


           {/* Badge Image */}
           <View style={styles.badgeContainer}>
               <View style={styles.badgeCircle}>
                   <Image source={require('../../assets/images/awardslogo.svg')} style={styles.badgeImage} />
               </View>
           </View>


           {/* Success Message */}
           <Text style={styles.congratulationsText}>Congratulations!</Text>
           <Text style={styles.descriptionText}>You just reached a habit goal!</Text>
           <Text style={styles.subtext}>You completed a habit for 2 weeks straight.</Text>
       </View>
   );
};


const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: '#FFCC5C', // Adjust to match the exact shade
       justifyContent: 'center',
       alignItems: 'center',
       paddingHorizontal: 20,
   },
   backButton: {
       position: 'absolute',
       top: 50,
       left: 20,
       backgroundColor: 'white',
       padding: 10,
       borderRadius: 50,
   },
   backText: {
       fontSize: 18,
       fontWeight: 'bold',
   },
   badgeContainer: {
       alignItems: 'center',
       justifyContent: 'center',
       marginBottom: 30,
   },
   badgeCircle: {
       width: 250,
       height: 250,
       borderRadius: 125,
       backgroundColor: '#FFD700',
       justifyContent: 'center',
       alignItems: 'center',
       borderWidth: 5,
       borderColor: 'blue', // Adjust to match the glow effect
   },
   badgeImage: {
       width: 100,
       height: 100,
       resizeMode: 'contain',
   },
   congratulationsText: {
       fontSize: 24,
       fontWeight: 'bold',
       color: '#fff',
       marginTop: 20,
   },
   descriptionText: {
       fontSize: 20,
       fontWeight: '600',
       color: '#fff',
       textAlign: 'center',
       marginBottom: 10,
   },
   subtext: {
       fontSize: 16,
       color: '#fff',
       textAlign: 'center',
   },
});


export default StreakAward;