import { useState } from "react";

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([...Array(6)]); // each guess is an array
  const [history, setHistory] = useState([]); // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});

  const formatGuess = () => {
    let solutionArray = [...solution];

    // let formattedGuess = [...currentGuess].map((l) => {
    //   return { key: l, color: "grey" };
    // });
    // // find any green letters
    // formattedGuess.forEach((l, i) => {
    //   if (solutionArray[i] === l.key) {
    //     l.color = "green";
    //     solutionArray[i] = null;
    //   }
    // });

    // formattedGuess.forEach((l, i) => {
    //   if (solutionArray.includes(l.key) && l.color !== "green") {
    //     l.color = "yellow";
    //     solutionArray[solutionArray.indexOf(l.key)] = null;
    //   }
    // });
    // return formattedGuess;

    const formattedGuess = [...currentGuess].map((letter, index) => {
      let color = "grey";
      if (solutionArray[index] === letter) {
        color = "green";
        solutionArray[index] = null;
      } else if (solutionArray.includes(letter)) {
        color = "yellow";
        solutionArray[solutionArray.indexOf(letter)] = null;
      }
      return { key: letter, color };
    });

    return formattedGuess;
  };

  // add a new guess to the guesses state
  // update the isCorrect state if the guess is correct
  // add one the the turn state
  const addNewGuess = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true);
    }
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess];
    });
    setTurn((prevTurn) => {
      return prevTurn + 1;
    });
    setUsedKeys((prevUsedKeys) => {
      let newKeys = { ...prevUsedKeys };

      formattedGuess.forEach((letter) => {
        const currentColor = newKeys[letter.key];
        if (letter.color === "green") {
          newKeys[letter.key] = "green";
          return;
        }
        if (letter.color === "yellow" && currentColor !== "green") {
          newKeys[letter.key] = "yellow";
          return;
        }
        if (
          letter.color === "grey" &&
          currentColor !== "green" &&
          currentColor !== "yellow"
        ) {
          newKeys[letter.key] = "grey";
          return;
        }
      });
      return newKeys;
    });
    setCurrentGuess("");
  };

  const handleKeyup = ({ key }) => {
    if (key === "Enter") {
      // only guess if turn is less than 5
      if (turn > 5) {
        console.log("you used all your guesses");
        return;
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        console.log("you already tried that word");
        return;
      }
      // check word is 5 chars long
      if (currentGuess.length !== 5) {
        console.log("word must be 5 chars long");
        return;
      }

      const formatted = formatGuess();
      addNewGuess(formatted);
      return;
    }
    if (key === "Backspace") {
      setCurrentGuess((prev) => {
        return prev.slice(0, -1);
      });
      return;
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => {
          return prev + key;
        });
      }
    }
  };

  return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup };
};

export default useWordle;
