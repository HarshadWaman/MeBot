import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native';

const { width, height } = Dimensions.get('window');

const API_KEY = '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';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botMood, setBotMood] = useState('friendly');
  const [botAnimation, setBotAnimation] = useState('idle');
  const scrollViewRef = useRef(null);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const eyeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startFloatingAnimation();
    if (messages.length === 0) {
      addBotMessage("Hey buddy! I'm Cosmo, your AI assistant. Type your questions and I'll help you out! 🚀");
    }
  }, []);

  const startFloatingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const blinkEyes = () => {
    Animated.sequence([
      Animated.timing(eyeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(eyeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const blinkInterval = setInterval(blinkEyes, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  const triggerCosmoResponse = () => {
    setBotAnimation('excited');
    const responses = [
      "Hey buddy! I'm here and ready to help! What can I do for you today? 🌟",
      "Hey buddy! Cosmo at your service! How can I make your day better? 😊",
      "Hey buddy! I'm listening! What's on your mind? 🤖",
      "Hey buddy! Ready to assist! Ask me anything! 💫"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addBotMessage(randomResponse);
    setBotMood('excited');
    setTimeout(() => {
      setBotMood('friendly');
      setBotAnimation('idle');
    }, 3000);
  };

  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const addBotMessage = (text) => {
    const botMessage = {
      id: Date.now() + 1,
      text: text,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('hey cosmo')) {
      triggerCosmoResponse();
      setInputText('');
      return;
    }

    addUserMessage(text);
    setInputText('');
    setIsTyping(true);
    setBotAnimation('thinking');

    try {
      const response = await fetchOpenAIResponse(text);
      setIsTyping(false);
      setBotAnimation('idle');
      addBotMessage(response);
    } catch (error) {
      setIsTyping(false);
      setBotAnimation('idle');
      console.error('Detailed error:', error);
      
      const fallbackResponses = [
        "I'm having some technical difficulties right now, but I'm still here to chat! Tell me more about what's on your mind. 😊",
        "Oops! My connection is acting up. How about we talk about something else? What's your day been like? 🌟",
        "I'm experiencing some issues with my brain circuits at the moment. Let's try a simpler question! 🤖",
        "Connection issues detected! But don't worry, I can still chat with you. What would you like to discuss? 💫"
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addBotMessage(randomFallback);
    }
  };

  const fetchOpenAIResponse = async (userMessage) => {
    try {
      console.log('Sending request to OpenAI...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are Cosmo, a friendly, enthusiastic, and slightly witty AI assistant. You respond like a helpful human friend with a positive attitude. Use emojis occasionally to express emotions. Keep responses conversational and engaging.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const clearChat = () => {
    setMessages([]);
    addBotMessage("Chat cleared! How can I help you fresh start? 🌟");
  };

  const getBotColor = () => {
    switch (botMood) {
      case 'excited': return '#4CAF50';
      case 'thinking': return '#FF9800';
      case 'happy': return '#2196F3';
      default: return '#9C27B0';
    }
  };

  const getEyeExpression = () => {
    switch (botAnimation) {
      case 'excited': return '😊';
      case 'thinking': return '🤔';
      default: return '👁️';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.header}>
        <Animated.View style={[
          styles.botContainer,
          {
            transform: [{ translateY: floatAnim.interpolate({
              inputRange: [-1, 1],
              outputRange: [-10, 10],
            }) }]
          }
        ]}>
          <View style={[styles.botBody, { backgroundColor: getBotColor() }]}>
            <View style={styles.botHead}>
              <View style={styles.eyeContainer}>
                <Animated.View style={[
                  styles.eye,
                  { 
                    height: eyeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 2],
                    })
                  }
                ]}>
                  <Text style={styles.eyeText}>{getEyeExpression()}</Text>
                </Animated.View>
                <Animated.View style={[
                  styles.eye,
                  { 
                    height: eyeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 2],
                    })
                  }
                ]}>
                  <Text style={styles.eyeText}>{getEyeExpression()}</Text>
                </Animated.View>
              </View>
              <View style={styles.botMouth}>
                <Text style={styles.mouthText}>
                  {botAnimation === 'excited' ? '◠' : botAnimation === 'thinking' ? '○' : '◡'}
                </Text>
              </View>
            </View>
            <View style={styles.botAntenna}>
              <View style={styles.antennaBall} />
            </View>
          </View>
          <Text style={styles.botName}>Cosmo</Text>
        </Animated.View>
        <Text style={styles.headerSubtitle}>Your AI Buddy</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}
          >
            <View style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userText : styles.botText
              ]}>
                {message.text}
              </Text>
              <Text style={styles.timestamp}>
                {message.timestamp}
              </Text>
            </View>
          </View>
        ))}
        
        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>Cosmo is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() => {
              setBotAnimation('excited');
              setTimeout(() => setBotAnimation('idle'), 1000);
            }}
          >
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message or say 'hey cosmo'..."
            placeholderTextColor="#888"
            multiline
            maxLength={500}
            onSubmitEditing={() => handleSendMessage()}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log('Test button pressed');
              addBotMessage("Test message! The app is working! 🎉");
            }}
          >
            <Text style={styles.actionIcon}>🧪</Text>
            <Text style={styles.actionButtonText}>Test</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={clearChat}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  botContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  botBody: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  botHead: {
    position: 'absolute',
    top: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  eyeContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  eye: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeText: {
    fontSize: 12,
  },
  botMouth: {
    marginTop: 2,
  },
  mouthText: {
    fontSize: 16,
    color: '#ffffff',
  },
  botAntenna: {
    position: 'absolute',
    top: -15,
    width: 2,
    height: 15,
    backgroundColor: '#ffffff',
  },
  antennaBall: {
    position: 'absolute',
    top: -4,
    left: -3,
    width: 8,
    height: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },
  botName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 15,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  userBubble: {
    backgroundColor: '#4a7c7e',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#2d3561',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 5,
    textAlign: 'right',
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  typingBubble: {
    backgroundColor: '#2d3561',
    padding: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
  },
  typingText: {
    color: '#ffffff',
    fontSize: 16,
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  voiceButton: {
    backgroundColor: '#2d3561',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  micIcon: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2d3561',
    color: '#ffffff',
    fontSize: 16,
    padding: 15,
    borderRadius: 25,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4a7c7e',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#2d3561',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    minWidth: 80,
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default App;