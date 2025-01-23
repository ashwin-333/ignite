import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  textLogo: {
    width: 300,
    height: 120,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '80%',
  },
  buttonPrimary: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextPrimary: {
    fontSize: 16,
    color: '#1E1E2C',
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#A9A9A9',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextSecondary: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;
