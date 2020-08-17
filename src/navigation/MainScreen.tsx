import React, {useLayoutEffect, useEffect, useState, useCallback} from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import moment from 'moment';
import {loadString} from '../utils/Storage';
import constants from '../common/Constants';

// @ts-ignore
const MainScreen = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Anti Telat',
      headerShown: false,
    });
  }, [navigation]);

  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    readConfig();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    readConfig().then(() => setRefreshing(false));
  }, []);

  const readConfig = async () => {
    try {
      const dataurl = await loadString(constants.Storage.URL);
      const datakey = await loadString(constants.Storage.KEY);

      if (dataurl !== null) {
        setUrl(dataurl);
        console.log(dataurl);
      }

      if (datakey !== null) {
        setKey(datakey);
        console.log(datakey);
      }
    } catch (e) {
      Alert.alert('Error!', 'Gagal membaca konfigurasi dari media penyimpanan');
    }
  };

  const goTo = (to: string) => {
    navigation.navigate(to);
  };

  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(currentDate);
  };

  const showMode = (currentMode: React.SetStateAction<string>) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const getLocalDate = () => {
    return moment(date).utcOffset('+07:00').format('YYYY-MM-DD');
  };

  const getLocalTime = () => {
    return moment(date).utcOffset('+07:00').format('HH:mm:ss');
  };

  const isLoading = () => {
    return loading;
  };

  const now = () => {
    setDate(new Date());
  };

  const xmlToPost = () => {
    return (
      '<SetDate><ArgComKey xsi:type="xsd:integer">' +
      key +
      '</ArgComKey><Arg><Date xsi:type="xsd:string">' +
      getLocalDate() +
      '</Date><Time xsi:type="xsd:string">' +
      getLocalTime() +
      '</Time></Arg></SetDate>'
    );
  };

  const postToDevice = () => {
    // Alert.alert('XML To Post', xmlToPost())
    if (isLoading()) {
      return;
    }

    setLoading(true);
    axios({
      method: 'post',
      baseURL: url,
      url: '/iWsService',
      headers: {'Content-Type': 'text/xml'},
      data: xmlToPost(),
      responseType: 'text', //document // text,
      // `timeout` specifies the number of milliseconds before the request times out.
      // If the request takes longer than `timeout`, the request will be aborted.
      timeout: 3000, // default is `0` (no timeout)
    })
      .then(({data}) => {
        Alert.alert('OK!', data);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          Alert.alert('Gagal!', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          Alert.alert('Gagal!', JSON.stringify(error.request));
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          Alert.alert('Gagal!', JSON.stringify(error.message));
        }
        console.log(error.config);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.body}>
          <Text style={styles.title}>TELAT LAGI YA ?</Text>
          <View>
            <Text style={styles.label}>Setelan saat ini :</Text>
            <View>
              <TouchableOpacity onPress={showDatepicker}>
                <View>
                  <Text style={styles.datetime}>{getLocalDate()}</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.label}> (sentuh untuk mengubah) </Text>
              <TouchableOpacity onPress={showTimepicker}>
                <View>
                  <Text style={styles.datetime}>{getLocalTime()}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
              timeZoneOffsetInMinutes={60 * 7}
            />
          )}
          <View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={now}>
                <View style={[styles.button, styles.reset]}>
                  <Text>Reset</Text>
                </View>
              </TouchableOpacity>
              {isLoading() && (
                <ActivityIndicator
                  size="large"
                  color="green"
                  animating={loading}
                />
              )}
              {!loading && (
                <TouchableOpacity onPress={postToDevice}>
                  <View style={[styles.button, styles.submit]}>
                    <Text>POST</Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => goTo('Setting')}>
                <View style={[styles.button, styles.setting]}>
                  <Text>Setting</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 20,
  },
  label: {
    marginVertical: 10,
    textAlign: 'center',
  },
  datetime: {
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonGroup: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 20,
    margin: 20,
  },
  reset: {
    backgroundColor: '#ffaa00',
  },
  submit: {
    backgroundColor: '#00bb00',
  },
  setting: {
    backgroundColor: '#ff0077',
  },
});

export default MainScreen;
