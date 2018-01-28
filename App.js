/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import openSocket from 'socket.io-client';

import { NetworkInfo } from 'react-native-network-info';
import Sound from 'react-native-sound';

console.disableYellowBox = true;

// Enable playback in silence mode
Sound.setCategory('Playback');

const loadSound = (filename) => new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', filename, error);
  }
});

const ukulele = {}
for (let f = 0; f <= 4; f++) {
  for (let s = 1; s <= 4; s++) {
    ukulele[`s${s}f${f}`] = loadSound(`ukulele_s${s}f${f}.wav`);
  }
}

const piano = {}
const noteNames = ['Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G'];

for (let i=0; i < noteNames.length; i++) {
  const note = noteNames[i].toLowerCase();
  piano[note] = loadSound(`piano_${note}.wav`);
}

const instruments = { piano, guitar: ukulele }

const getNotesFromData = (data) => {
  data = data.split('/').slice(1);
  if (data.length > 1) {
    data.pop()
  }
  const instrument = instruments[data[0]];
  data = data.slice(1);
  //const instrument = piano;
  //
  let notes = [];
  if (instrument == piano) {
    notes = data.map((k) => instrument[k.replace('_', '').toLowerCase()]);
  }
  else if (instrument == ukulele) {
    const isPressed = data[0]
    data = data.slice(1);

    const strings = {}

    for (let i = 0; i < isPressed.length; i++) {
      if (isPressed[i] == '1') {
        strings[i+1] = 0
      }
    }

    for (let datum of data) {
      const strNum = +datum[1];
      if (strNum in strings) {
        const fret = +datum[3];
        if (fret > strings[strNum]) {
          strings[strNum] = fret
        }
      }
    }

    for (let strNum in strings) {
      const note = ukulele[ `s${strNum}f${strings[strNum]}` ];
      notes.push(note);
    }
  }

  return notes;
}

let i = 0;
export default class App extends Component<{}> {
  componentWillMount(){
    const socket = openSocket('192.168.43.109:8080', { transports: ['websocket'] });
    socket.emit('oi', 'lol')
    socket.on('data', (data) => {
      if (data == this.state.prevData) return;
      if (i++ % 20 == 0) console.log(data, Date.now());
      let notes = getNotesFromData(data);

      try {
        if (notes.length && Array.isArray(notes[0])) {
          notes = notes[0]
          console.log('adjusted notes to be 0th child');
        }
      }
      catch (e) {
        console.log('failed to adjust notes to 0th child');
      }

      this.setState((prevState) => {
        const oldNotes = prevState.notes;
        const filteredNotes = notes.filter( (n) => !oldNotes.includes(n) )
        if (filteredNotes.length) {
          try {
            this.play(...filteredNotes)();
            return { notes }
          }
          catch (e) {
            console.log(e)
            console.log(filteredNotes)
          }
        }


        return { notes }

      });
    });



    NetworkInfo.getIPV4Address(ip => {
      console.log(ip, 1234, 'lul');
    });
  }

  constructor(props) {
    super(props);
    this.state = {notes: [], prevData: ''};
  }

  play = (...sounds) => () => {
    sounds.forEach( (sound) => {
      sound.stop((success) => {

        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });

      });
    });
  };


  render() {
    const piano_buttons = [];
    let count = 0;

    for (const soundName in piano) {
      piano_buttons.push(
        <TouchableOpacity key={count++} style={styles.button} onPress={this.play( piano[soundName] )}>
          <Text>Piano {soundName}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        {piano_buttons}
        <TouchableOpacity style={styles.button} onPress={this.play(...Object.values(ukulele))}>
          <Text>All</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'green',
    padding: 30,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
