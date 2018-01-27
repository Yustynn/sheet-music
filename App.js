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
for (let f = 0; f < 2; f++) {
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

const instruments = { piano, ukulele }

const getNotesFromData = (data) => {
  data = data.split('/').slice(1);
  if (data.length > 1) {
    data.pop()
  }
  //const instrument = instruments[data[0]];
  const instrument = piano;
  const notes = data.slice(1).map((k) => instrument[k.replace('_', '').toLowerCase()]);

  return notes;
}

getNotesFromData('/piano/Ab/C/')

let i = 0;
export default class App extends Component<{}> {
  componentWillMount(){
    const socket = openSocket('192.168.43.109:8080', { transports: ['websocket'] });
    socket.emit('oi', 'lol')
    socket.on('data', (data) => {
      if (data == this.state.prevData) return;
      if (i++ % 200 == 0) console.log(data, Date.now());
      const notes = getNotesFromData(data);

      this.setState((prevState) => {
        const oldNotes = prevState.notes;
        const filteredNotes = []
        for (const note of notes) {
          if (!oldNotes.includes(note)) {
            filteredNotes.push(notes);
          }
        }
        if (filteredNotes.length) {
          console.log(filteredNotes);
          try {
            const note = filteredNotes[0][0];
            console.log('Trying to play note', note);
            //this.play(...filteredNotes)();
            //this.play(note)();
            this.play(...filteredNotes[0])();
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
            sound.reset();
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