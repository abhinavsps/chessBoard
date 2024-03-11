import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Chessboard, { ChessboardRef } from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import Sound from 'react-native-sound';
import styles from './Style';

const soundMoveFile = require('./assets/sounds/move.mp3');
const soundGameOverFile = require('./assets/sounds/failure.mp3');

export default function App() {
  const initialBoardvalue = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const [fenHistory, setFenHistory] = useState<string[]>([initialBoardvalue]);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [currentFen, setCurrentFen] = useState<string>(initialBoardvalue);
  const ref = useRef<ChessboardRef>(null);
  const [moves, setMoves] = useState<string[]>([]);

  var movePairs = groupMovesIntoPairs();

  const onMoveData = (from, to) => {
    // Assuming from and to are in algebraic notation (e.g., 'e4', 'e6')
    const move = `${to}`;

    setMoves(prevMoves => [...prevMoves, move]);
    // console.log(moves)
  };

  const soundMove = new Sound(soundMoveFile, Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
  });
  const soundGameOver = new Sound(soundGameOverFile, Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('Failed to load the sound', error);
      return;
    }
  });
  const playSound = (soundEffect: any) => {
    soundEffect.play((success: any) => {

      if (!success) {
        console.log('Sound did not play');
      }
    });
  };
  const handleMove = (state: { fen: string }) => {
    playSound(soundMove)
    const newFenHistory = fenHistory.slice(0, currentPosition + 1);
    setFenHistory([...newFenHistory, state.fen]);
    setCurrentPosition(currentPosition + 1);
    setCurrentFen(state.fen);
  };

  const handleMoveBack = () => {

    if (currentPosition > 0) {
      const newCurrentFen = fenHistory[currentPosition - 1];
      setCurrentPosition(currentPosition - 1);
      setCurrentFen(fenHistory[currentPosition - 1]);
      resetBoard(newCurrentFen)
    }
  };

  const handleMoveForward = () => {
    if (currentPosition < fenHistory.length - 1) {
      const newCurrentFen = fenHistory[currentPosition + 1];
      setCurrentPosition(currentPosition + 1);
      setCurrentFen(fenHistory[currentPosition + 1]);
      resetBoard(newCurrentFen)
    }
  };
  const resetValue = () => {
    resetBoard(initialBoardvalue)
    setCurrentPosition(0);
    setFenHistory([initialBoardvalue]);
    setCurrentFen(initialBoardvalue);
    playSound(soundGameOver)
    setMoves([])
    movePairs = [];

  }

  useEffect(() => {

  }, [fenHistory, currentPosition, currentFen]);

  const snackbar = (msg: any) => {
    Snackbar.show({
      backgroundColor: '#94E6F0',
      textColor: 'black',

      text: msg,
      duration: Snackbar.LENGTH_LONG,
    });
  }
  const resetBoard = async (fen: any) => {
    ref.current?.resetBoard(fen)
  }
  function groupMovesIntoPairs() {
    const pairs = [];
    for (let i = 0; i < moves.length; i += 2) {
      pairs.push([moves[i], moves[i + 1]]);
    }
    return pairs;
  }

  const ChessBoardMoves = () => {
    return (
      <View style={styles.containerChessMoves}>
        <Text style={styles.moveTitle}>ChessBoard Moves</Text>
        {movePairs.map((pair, index) => (
          <View key={index} style={styles.moveContainer}>
            {pair.map((move, moveIndex) => (
              <Text key={moveIndex} style={styles.moveStyle}>
                {moveIndex == 0 ? `${index + 1}.   ${move || ''}` : `${move || ''}`}
              </Text>
            ))}
          </View>
        ))}
      </View>);
  }

  const ResetButton = ({ title, onPress }) => {
    return (
      <View style={styles.buttonStyle1} >
        <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity></View>);
  }
  const ButtonsComponent = () => {
    return (
      <View style={styles.buttonContainer}>
        <ResetButton title="Move Back" onPress={handleMoveBack} />
        <ResetButton title="Move Forward" onPress={handleMoveForward} />
        <ResetButton title="New Game" onPress={() => resetValue()} />
      </View>);
  }
  function getCurrentTeam(fen) {
    const fields = fen.split(' ');
    const turn = fields[1]; // Get the turn field (indicates current player to move)
    return turn === 'w' ? 'Black' : 'White';
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <View >
        <ScrollView>
          <View style={styles.titleContainer} >
            <Text style={styles.title}>Chess</Text>
          </View>
          <Chessboard
            ref={ref}
            fen={currentFen}
            // onMoveSqaure={(from, to) => {
            //   if (from !== to) {
            //     onMoveData(from, to)
            //   }
            // }}
            colors={
              {
                white: "#E2ECED",
                black: "#94E6F0",
                lastMoveHighlight: "#12A7BB",
                checkmateHighlight: "#BB3712",
                promotionPieceButton: 'red'
              }
            }
            durations={
              { move: 1 }
            }
            onMove={({ state }) => {
              handleMove(state)
              switch (true) {
                case state.game_over:
                  snackbar(`Team ${getCurrentTeam(state.fen)} is the winner!`);
                  resetValue()
                  break;
                case state.in_checkmate:
                  snackbar('Its check Mate');
                  break;
                case state.in_check:
                  snackbar('Its a check, Life goes on.');
                  break;
                case state.in_threefold_repetition:
                  snackbar('in_threefold_repetition.');
                  break;
                case state.in_promotion:
                  snackbar('in_promotion');
                  break;
                case state.in_draw:
                  snackbar('in_draw');
                  break;
                case state.insufficient_material:
                  snackbar('insufficient_material');
                  break;
                default:
                  // Handle other cases or do nothing
                  break;
              }
            }}
          />
          <ButtonsComponent />
          {/* <ChessBoardMoves /> */}
        </ScrollView>
      </View>

    </GestureHandlerRootView>
  );
}

