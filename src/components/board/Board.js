import { useEffect, useState, useCallback } from "react";
import "./Board.css";
import Tile from "../tile/Tile";
import Overlay from "../overlay/Overlay";
import NewGame from "../new-game/NewGame";
import Winner from "../winner/Winner";
import Welcome from "../welcome/Welcome";

const backgroundMusicUrl = "./assets/music.mp3";

const Board = () => {
  const shuffle = () =>
    new Array(16)
      .fill()
      .map((_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .map((x, i) => ({ value: x, index: i }));

  const [numbers, setNumbers] = useState([]);
  const [animating, setAnimating] = useState(false);

  const reset = () => setNumbers(shuffle());

  const moveTile = useCallback((tile) => {
    const i16 = numbers.find((n) => n.value === 16).index;
    if (![i16 - 1, i16 + 1, i16 - 4, i16 + 4].includes(tile.index) || animating)
      return;

    const newNumbers = [...numbers].map((number) => {
      if (number.index !== i16 && number.index !== tile.index) return number;
      else if (number.value === 16) return { value: 16, index: tile.index };

      return { value: tile.value, index: i16 };
    });
    setAnimating(true);
    setNumbers(newNumbers);
    setTimeout(() => setAnimating(false), 200);
  }, [numbers, animating]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const i16 = numbers.find((n) => n.value === 16).index;
      if (e.keyCode === 37 && !(i16 % 4 === 3))
        moveTile(numbers.find((n) => n.index === i16 + 1));
      else if (e.keyCode === 38 && !(i16 > 11))
        moveTile(numbers.find((n) => n.index === i16 + 4));
      else if (e.keyCode === 39 && !(i16 % 4 === 0))
        moveTile(numbers.find((n) => n.index === i16 - 1));
      else if (e.keyCode === 40 && !(i16 < 4))
        moveTile(numbers.find((n) => n.index === i16 - 4));
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [numbers, moveTile]);

  useEffect(() => {
    const audio = new Audio(backgroundMusicUrl);
    audio.loop = true;

    // Function to play audio on user interaction
    const playAudio = () => {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    };

    // Event listener for user interaction (e.g., document click)
    document.addEventListener("click", playAudio);

    // Clean up event listener
    return () => {
      document.removeEventListener("click", playAudio);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(reset, []);

  return (
    <div className="game">
      <Welcome />
      <div className="board">
        <Overlay size={16} />
        {numbers.map((x, i) => {
          return <Tile key={i} number={x} moveTile={moveTile} />;
        })}
      </div>
      <Winner numbers={numbers} reset={reset} />
      <NewGame reset={reset} />
    </div>
  );
};

export default Board;
