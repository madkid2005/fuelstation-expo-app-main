import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, StyleSheet, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import CalculationScreen from './screens/CalculationScreen';
import ResultsTabs from './screens/ResultsTabs';
import { ThemeProvider } from './context/ThemeContext'; // Adjust the path as per your project structure
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

const Stack = createStackNavigator();

const PasscodeScreen = ({ onPasscodeSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const correctPasscode = 'JZAbL2KdYiGm0ECC';

  const handlePasscodeSubmit = async () => {
    if (passcode === correctPasscode) {
      await AsyncStorage.setItem('passcodeEnteredG', 'true');
      onPasscodeSuccess();
    } else {
      alert('رمز اشتباه است');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>رمز عبور خود را وارد کنید:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={passcode}
        onChangeText={setPasscode}
        placeholder="رمز عبور"
      />
      <Button title="تایید" style={styles.Button} onPress={handlePasscodeSubmit} />
    </View>
  );
};

const App = () => {
  const [approvedNumbers, setApprovedNumbers] = useState([]);
  const [ispasscodeEnteredG, setIspasscodeEnteredG] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPasscode = async () => {
      const passcodeStatus = await AsyncStorage.getItem('passcodeEnteredG');
      if (passcodeStatus === 'true') {
        setIspasscodeEnteredG(true);
      }
      setIsLoading(false); // End loading
    };
    checkPasscode();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderCustomHeader = (title) => (
    <View style={styles.headerContainer}>
      <Image source={headerImages[title]} style={styles.headerImage} />
    </View>
  );

  const headerImages = {
    Home: require('./assets/GSPMC.png'),          // Adjust the path
    Calculations: require('./assets/GSPMC.png'), // Adjust the path
    ResultsTabs: require('./assets/GSPMC.png'),       // Adjust the path
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        {ispasscodeEnteredG ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                header: () => renderCustomHeader('Home'),
              }}
            />
            <Stack.Screen
              name="Calculations"
              component={CalculationScreen}
              options={{
                header: () => renderCustomHeader('Calculations'),
              }}
            />
            <Stack.Screen
              name="ResultsTabs"
              component={ResultsTabs}
              options={{
                header: () => renderCustomHeader('ResultsTabs'),
              }}
            />
          </Stack.Navigator>
        ) : (
          <PasscodeScreen onPasscodeSuccess={() => setIspasscodeEnteredG(true)} />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
    backgroundColor: 'blue',
  },
  headerImage: {
    marginTop: 20,
    width: 200,
    height: 45,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  Button: {
    width: '80%',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default App;
