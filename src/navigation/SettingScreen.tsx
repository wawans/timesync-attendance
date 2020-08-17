import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {loadString, saveString} from '../utils/Storage';
import constants from '../common/Constants';

// @ts-ignore
const SettingScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Setting',
    });
  }, [navigation]);

  const [url, setUrl] = useState('http://');
  const [key, setKey] = useState('');

  useEffect(() => {
    readData();
  }, []);

  const readData = async () => {
    try {
      const dataurl = await loadString(constants.Storage.URL);
      const datakey = await loadString(constants.Storage.KEY);

      if (dataurl !== null) {
        setUrl(dataurl);
      }

      if (datakey !== null) {
        setKey(datakey);
      }
    } catch (e) {
      Alert.alert('Error!', 'Gagal membaca konfigurasi dari media penyimpanan');
    }
  };

  const submit = () => {
    // if (!url || !key) return;

    saveString(constants.Storage.URL, url);
    saveString(constants.Storage.KEY, key);
    Alert.alert('Sukses', 'Konfigurasi baru disimpan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text style={styles.label}>Hostname / IP :</Text>
          <TextInput
            style={styles.input}
            placeholder="http://192.168.0.1"
            onChangeText={(text) => setUrl(text)}
            value={url}
          />
          <Text style={styles.label}>Password / Key :</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            onChangeText={(text) => setKey(text)}
            value={key}
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => submit()}>
            <View style={styles.button}>
              <Text>S I M P A N</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  label: {
    padding: 10,
    fontSize: 18,
  },
  input: {
    margin: 10,
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#044d86',
  },
  button: {
    margin: 10,
    padding: 20,
    backgroundColor: '#06af06',
    alignItems: 'center',
  },
});

export default SettingScreen;
