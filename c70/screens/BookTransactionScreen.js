import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedBookId: '',
      scannedStudentId: '',
      buttonState: 'normal',
    };
  }

  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === 'granted',
      buttonState: id,
      scanned: false,
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const buttonState = this.state.buttonState;
    if(buttonState==='BookId'){
    this.setState({
      scanned: true,
      scannedBookId: data,
      buttonState: 'normal',
    });
    }
    else if(buttonState==='StudentId'){
    this.setState({
      scanned: true,
      scannedStudentId: data,
      buttonState: 'normal',
    });
    }
  };

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== 'normal' && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === 'normal') {
      return (
        <View style={styles.container}>
          <View>
            <Image
              source={require('../assets/booklogo.jpg')}
              style={{ width: 200, height: 200 }}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput placeholder="Student ID" style={styles.inputBox} value={this.state.scannedStudentId}/>
            <TouchableOpacity
              onPress={()=>{ this.getCameraPermissions("StudentId") }}
              style={styles.scanButton}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputView}>
            <TextInput placeholder="Book ID" style={styles.inputBox} value={this.state.scannedBookId}/>
            <TouchableOpacity
              onPress={()=>{ this.getCameraPermissions("BookId") }}
              style={styles.scanButton}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.displayText}>
            {hasCameraPermissions === true
              ? this.state.scannedData
              : 'Request Camera Permission'}
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayText: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  scanButton: {
    backgroundColor: '#216A85',
    width: 56,
    borderWidth: 1.5,
    height: 40,
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  inputView: {
    flexDirection: 'row',
    margin: 20,
  },
  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1,
    fontSize: 20,
  },
});
