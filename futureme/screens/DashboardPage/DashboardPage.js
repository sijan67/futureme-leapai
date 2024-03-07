import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added state to track loading
  const [goalsHierarchy, setGoalsHierarchy] = useState(null);
  const [showForm, setShowForm] = useState(true); // Added state to control the visibility of the form

  useEffect(() => {
    setupAudioMode();
    requestPermissionsAsync();
  }, []);

  async function setupAudioMode() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  async function requestPermissionsAsync() {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need audio recording permissions to make this work!');
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    setShowForm(false); // Hide form
    Keyboard.dismiss();

  
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Given a long term goal: "${text}", generate a goal hierarchy with 3 mid term goals and for each mid term goal, list 3 short term goals.` }
      ],
      temperature: 0.7
    };
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer OPENAI-API-KEY` // Ensure your API key is correctly inserted here
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        // If the response is not OK, throw an error with the status text
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Accessing the message content from the assistant
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        setGoalsHierarchy(data.choices[0].message.content);
        console.log("Goal Hierarchy is: ", data.choices[0].message.content)
      } else {
        throw new Error("No response content from OpenAI.");
      }
    } catch (error) {
      console.error("Error fetching data from OpenAI:", error.message);
      alert(`Failed to fetch goals from OpenAI: ${error.message}`);
    }

    setIsLoading(false); // Stop loading when the fetch is complete
    // setShowForm(false); // This is now set at the beginning of the function
  };
  
  const handleGoBack = () => {
    setShowForm(true); // Show form
    setGoalsHierarchy(null); // Reset goals hierarchy
    setText(''); // Reset text input
  };

  return (
    <View style={styles.container}>
      {showForm ? (
        <>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginVertical: 10 }}>
            Share Your Future Goals 🚀
          </Text>

          <Text style={{ fontSize: 16, fontWeight: 'normal',  marginBottom: 20, color: "#3AA7A3" }}>
            And get your personalized goal hierarchy
          </Text>

          <TextInput
            style={styles.textInput}
            onChangeText={setText}
            value={text}
            placeholder="Type your goal here along and by when you want to achieve it"
            multiline
          />

          <Text style={styles.welcome}>Your goal: "{text}"</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </>
      ) : isLoading ? (
        <ActivityIndicator size="large" color="#9DD9D2" />
      ) : (
        <>
          {goalsHierarchy && (
            <View style={styles.results}>
              <Text style={styles.resultsTitle}>Goal Hierarchy</Text>
              <Text style={styles.resultsText}>{goalsHierarchy}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleGoBack}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  textInput: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',
    padding: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 12,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  button: {
    backgroundColor: '#3AA7A3', // Set the button color to blue
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10
  },
  buttonText: {
    color: '#ffffff', // Set the text color to white
    fontSize: 16,
  },
  resultsTitle:{
    color:  '#3AA7A3',
    fontWeight: "600",
    fontSize: 20, 
    paddingVertical: 10
  }
});

async function playFromPath(path) {
  try {
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri: path });
    await soundObject.playAsync();
  } catch (error) {
    console.error("An error occurred while playing the audio:", error);
  }
}
