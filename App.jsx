import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import React, { useState } from 'react'

const App = () => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const handleNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '*':
        return firstValue * secondValue
      case '/':
        return firstValue / secondValue
      default:
        return secondValue
    }
  }

  const handleEqual = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation !== null) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.buttonDouble]} onPress={handleClear}>
            <Text style={styles.buttonText}>AC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operationButton]} onPress={() => handleOperation('/')}>
            <Text style={styles.buttonText}>÷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operationButton]} onPress={() => handleOperation('*')}>
            <Text style={styles.buttonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(7)}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(8)}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(9)}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operationButton]} onPress={() => handleOperation('-')}>
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(4)}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(5)}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(6)}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operationButton]} onPress={() => handleOperation('+')}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(1)}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(2)}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => handleNumber(3)}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.equalsButton]} onPress={handleEqual}>
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.buttonDouble, styles.numberButton]} onPress={() => handleNumber(0)}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={handleDecimal}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  displayText: {
    fontSize: 72,
    color: '#ffffff',
    fontWeight: '300',
  },
  buttonsContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonDouble: {
    width: 150,
  },
  buttonText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '400',
  },
  numberButton: {
    backgroundColor: '#333333',
  },
  operationButton: {
    backgroundColor: '#FF9500',
  },
  equalsButton: {
    backgroundColor: '#FF9500',
  },
})