import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';

const Timer = () => {
  const [mainTime, setMainTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const [lapTime, setLapTime] = useState(0);
  const [lapRunning, setLapRunning] = useState(false);

  const [shortestLapIndex, setShortestLapIndex] = useState(-1);
  const [longestLapIndex, setLongestLapIndex] = useState(-1);

  useEffect(() => {
    let mainTimer: NodeJS.Timeout | null = null;
    let lapTimer: NodeJS.Timeout | null = null;

    if (running) {
      mainTimer = setInterval(() => {
        setMainTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (mainTimer) {
        clearInterval(mainTimer);
      }
    }

    if (lapRunning) {
      lapTimer = setInterval(() => {
        setLapTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (lapTimer) {
        clearInterval(lapTimer);
      }
    }

    return () => {
      if (mainTimer) {
        clearInterval(mainTimer);
      }
      if (lapTimer) {
        clearInterval(lapTimer);
      }
    };
  }, [running, lapRunning]);

  const handleToggle = () => {
    setRunning(!running);
    setLapRunning(!lapRunning);
  };

  const handleLap = () => {
    if (running) {
      setLaps(prevLaps => [...prevLaps, lapTime]);
      setLapTime(0);
    }
  };

  const renderLapItem = ({item, index}: {item: number; index: number}) => (
    <View style={styles.lapItem}>
      <Text
        style={[
          styles.lapIndex,
          laps.length - 1 - index === shortestLapIndex
            ? styles.shortestLap
            : laps.length - 1 - index === longestLapIndex
            ? styles.longestLap
            : null,
        ]}>
        Lap {laps.length - index}:
      </Text>
      <Text
        style={[
          styles.lapTime,
          laps.length - 1 - index === shortestLapIndex
            ? styles.shortestLap
            : laps.length - 1 - index === longestLapIndex
            ? styles.longestLap
            : null,
        ]}>
        {formatTime(item)}
      </Text>
    </View>
  );

  const formatTime = (timeInMilliseconds: number) => {
    const minutes = Math.floor(timeInMilliseconds / 60000);
    const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds},${milliseconds < 10 ? '0' : ''}${milliseconds}`;
  };

  useEffect(() => {
    if (laps.length <= 2) {
      setShortestLapIndex(-1);
      setLongestLapIndex(-1);
      return;
    }

    let shortestIndex = 0;
    let longestIndex = 0;

    for (let i = 1; i < laps.length; i++) {
      if (laps[i] < laps[shortestIndex]) {
        shortestIndex = i;
      }
      if (laps[i] > laps[longestIndex]) {
        longestIndex = i;
      }
    }

    setShortestLapIndex(shortestIndex);
    setLongestLapIndex(longestIndex);
  }, [laps]);

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Text style={styles.timerText}>{formatTime(mainTime)}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.lapButton]}
            onPress={handleLap}>
            <Text style={styles.buttonText}>Lap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.startStopButton,
              running ? styles.stopButton : styles.startButton,
            ]}
            onPress={handleToggle}>
            <Text style={styles.buttonText}>{running ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomHalf}>
        <FlatList
          data={laps}
          renderItem={renderLapItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.lapList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
  },
  timerText: {
    fontSize: 85,
    color: 'white',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 90,
  },
  lapButton: {
    backgroundColor: 'gray',
  },
  startStopButton: {
    backgroundColor: 'green',
  },
  stopButton: {
    backgroundColor: 'red',
  },
  startButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  lapList: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  lapIndex: {
    color: 'white',
    fontSize: 20,
  },
  lapTime: {
    color: 'white',
    fontSize: 20,
  },
  shortestLap: {
    color: '#00FF00',
  },
  longestLap: {
    color: 'red',
  },
});

export default Timer;
