import { useState } from "react";
import { WORDS } from "./words";

const ALPHABETS = {
  GR: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split(""),
  EN: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
};

const MAX = 7;

const CATEGORY_NAMES = {
  GR: {
    animals: "🐾 Ζώα",
    food: "🍎 Φαγητά",
    countries: "🌍 Χώρες",
    cities: "🏙️ Πόλεις",
    nature: "🌳 Φύση",
    sports: "⚽ Αθλητισμός",
    technology: "💻 Τεχνολογία",
    professions: "👨‍🔧 Επαγγέλματα",
    cinema: "🎬 Κινηματογράφος",
    history: "🏛️ Ιστορία"
  },
  EN: {
    animals: "🐾 Animals",
    food: "🍎 Food",
    countries: "🌍 Countries",
    cities: "🏙️ Cities",
    nature: "🌳 Nature",
    sports: "⚽ Sports",
    technology: "💻 Technology",
    professions: "👨‍🔧 Professions",
    cinema: "🎬 Cinema",
    history: "🏛️ History"
  }
};

const TEXTS = {
  GR: {
    category: "📚 Κατηγορία",
    difficulty: "Επίπεδο δυσκολίας",
    easy: "Εύκολο",
    medium: "Μεσαίο",
    hard: "Δύσκολο",
    hangman: "🪵 ΚΡΕΜΑΛΑ",
    mistakes: "Λάθη",
    score: "🏆 Σκορ",
    won: "🎉 ΚΕΡΔΙΣΕΣ!",
    lost: "😢 ΤΕΛΟΣ! Η λέξη ήταν",
    newGame: "ΝΕΟ ΠΑΙΧΝΙΔΙ",
    wins: "Νίκες",
    losses: "Ήττες",
    footer: "Μάθε λέξεις • Παίξε • Ανακάλυψε τον κόσμο 🌍"
  },
  EN: {
    category: "📚 Category",
    difficulty: "Difficulty Level",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    hangman: "🪵 HANGMAN",
    mistakes: "Mistakes",
    score: "🏆 Score",
    won: "🎉 YOU WON!",
    lost: "😢 GAME OVER! The word was",
    newGame: "NEW GAME",
    wins: "Wins",
    losses: "Losses",
    footer: "Learn words • Play • Discover the World 🌍"
  }
};

function Hangman({ mistakes }) {
  return (
    <svg viewBox="0 0 220 230" width="210" height="220">
      <g stroke="#d6a45d" strokeWidth="7" fill="none"
        strokeLinecap="round">
        <path d="M20 215 H190 M65 215 V15 H150 V40 M65 55 L105 15" />
      </g>

      <g stroke="#f5c542" strokeWidth="4" fill="none">
        {mistakes >= 1 && <circle cx="150" cy="58" r="18" />}
        {mistakes >= 2 && <path d="M150 76 V140" />}
        {mistakes >= 3 && <path d="M150 90 L120 115" />}
        {mistakes >= 4 && <path d="M150 90 L180 115" />}
        {mistakes >= 5 && <path d="M150 140 L125 180" />}
        {mistakes >= 6 && <path d="M150 140 L175 180" />}
        {mistakes >= 7 && <path d="M143 52 L157 65 M157 52 L143 65" />}
      </g>
    </svg>
  );
}

function getLetters(word) {
  return [...word].filter(char => /\p{L}/u.test(char));
}

function firstLetter(word) {
  return getLetters(word)[0];
}

export default function App() {
  const initialCategory = Object.keys(WORDS.GR)[0];
  const initialWord = WORDS.GR[initialCategory].easy[0];

  const [language, setLanguage] = useState("GR");
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState(initialCategory);
  const [word, setWord] = useState(initialWord);
  const [guessed, setGuessed] = useState([firstLetter(initialWord)]);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [setGames, setSetGames] = useState(0);
  const [currentSetWins, setCurrentSetWins] = useState(0);
  const [currentSetLosses, setCurrentSetLosses] = useState(0);

  const [totalSetWins, setTotalSetWins] = useState(0);
  const [totalSetLosses, setTotalSetLosses] = useState(0);
  const [totalSetDraws, setTotalSetDraws] = useState(0);
   
  const [setResult, setSetResult] = useState(null);

  const won = getLetters(word).every(letter => guessed.includes(letter));
  const lost = mistakes >= MAX;
  const finished = won || lost;

  const categories = Object.keys(WORDS[language]);
  const t = TEXTS[language];

  function newGame(
    lang = language,
    level = difficulty,
    cat = category
  ) {
    const availableCategories = Object.keys(WORDS[lang]);

    const selectedCategory = availableCategories.includes(cat)
      ? cat
      : availableCategories[0];

    const list = WORDS[lang][selectedCategory][level];
    const next = list[Math.floor(Math.random() * list.length)];

    setLanguage(lang);
    setDifficulty(level);
    setCategory(selectedCategory);
    setWord(next);
    setGuessed([firstLetter(next)]);
    setMistakes(0);
  }
      function recordSetGame(result) {
    const nextGames = setGames + 1;

    const nextWins =
      currentSetWins + (result === "win" ? 1 : 0);

    const nextLosses =
      currentSetLosses + (result === "loss" ? 1 : 0);

    setSetGames(nextGames);
    setCurrentSetWins(nextWins);
    setCurrentSetLosses(nextLosses);

    if (nextGames === 10) {
      let outcome;

      if (nextWins > nextLosses) {
        outcome = "win";
        setTotalSetWins(prev => prev + 1);
      } else if (nextWins < nextLosses) {
        outcome = "loss";
        setTotalSetLosses(prev => prev + 1);
      } else {
        outcome = "draw";
        setTotalSetDraws(prev => prev + 1);
      }

      setSetResult({
        outcome,
        wins: nextWins,
        losses: nextLosses
      });
           setSetGames(0);
      setCurrentSetWins(0);
      setCurrentSetLosses(0);

      setTimeout(() => {
        setSetResult(null);
      }, 4000);
    }
  }
  
  function guess(letter) {
    if (finished || guessed.includes(letter)) return;

    const next = [...guessed, letter];
    setGuessed(next);

    if (!word.includes(letter)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

     if (newMistakes >= MAX) {
        setLosses(prev => prev + 1);
        recordSetGame("loss");
      }
    } else {
      const allLettersFound = getLetters(word)
        .every(l => next.includes(l));
      if (allLettersFound) {
        setScore(prev => prev + 10);
        setWins(prev => prev + 1);
        recordSetGame("win");
      }
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#101827,#243b55)",
      color: "white",
      fontFamily: "Arial",
      textAlign: "center",
      padding: "20px"
    }}>

      <h1 style={{ color: "#f5c542", fontSize: 34 }}>
  SMART HANGMAN
</h1>

<h3>WORLD EDITION 🌍</h3>

<p style={{ fontSize: 18, color: "#ffffff", marginTop: 5 }}>
  {language === "GR"
    ? "ΚΡΕΜΑΛΑ – Παιχνίδι λέξεων και γνώσεων"
    : "HANGMAN – Word & Knowledge Game"}
</p>

<div style={{ margin: 20 }}>
  <button onClick={() => newGame("GR")}>
    🇬🇷 Ελληνικά
  </button>

  <button
    onClick={() => newGame("EN")}
    style={{ marginLeft: 8 }}
  >
    🇬🇧 English
  </button>
</div>

      <div style={{ margin: 15 }}>
        <h3>{t.category}</h3>

        <select
          value={category}
          onChange={e => newGame(language, difficulty, e.target.value)}
          style={{
            padding: 12,
            borderRadius: 8,
            fontSize: 16,
            minWidth: 200
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {CATEGORY_NAMES[language][cat] || cat}
            </option>
          ))}
        </select>
      </div>

      <div style={{ margin: 15 }}>
        <h3>{t.difficulty}</h3>

        {["easy", "medium", "hard"].map(level => (
          <button
            key={level}
            onClick={() => newGame(language, level)}
            style={{
              margin: 5,
              padding: "10px 15px",
              background: difficulty === level ? "#f5c542" : "#ddd",
              border: 0,
              borderRadius: 8
            }}
          >
            {t[level]}
          </button>
        ))}
      </div>

            <div style={{
        background: "#172638",
        maxWidth: 520,
        margin: "15px auto",
        padding: 15,
        borderRadius: 12
      }}>
        <h3>🏆 {language === "GR" ? "SET" : "SET"}</h3>
                {setResult && (
          <div style={{
            background: "#f5c542",
            color: "#172638",
            padding: 12,
            borderRadius: 10,
            margin: 10
          }}>
            <h2>
              {setResult.outcome === "win"
                ? (language === "GR"
    ? "🎉 ΣΥΓΧΑΡΗΤΗΡΙΑ! ΚΕΡΔΙΣΕΣ ΤΟ SET!"
    : "🎉 CONGRATULATIONS! YOU WON THE SET!")
                : setResult.outcome === "loss"
               ? (language === "GR"
    ? "💪 ΠΡΟΣΠΑΘΗΣΕ ΞΑΝΑ!"
    : "💪 BETTER LUCK NEXT TIME!")
                : (language === "GR" ? "⚖️ ΙΣΟΠΑΛΙΑ!" : "⚖️ IT'S A DRAW!")}
            </h2>

            <p>
  {setResult.wins} {language === "GR" ? "νίκες" : "wins"} –{" "}
  {setResult.losses} {language === "GR" ? "ήττες" : "losses"}
</p>
          </div>
        )}

        <p>{language === "GR" ? "Παιχνίδια" : "Games"}: {setGames} / 10</p>
        <p>
  {language === "GR" ? "Νίκες" : "Wins"}: {currentSetWins} |{" "}
  {language === "GR" ? "Ήττες" : "Losses"}: {currentSetLosses}
</p>

        <hr />

        <h3>{language === "GR" ? "Συνολικά SET" : "Total SETs"}</h3>
        <p>
  {language === "GR" ? "Νίκες" : "Wins"}: {totalSetWins} |
  {language === "GR" ? "Ήττες" : "Losses"}: {totalSetLosses} |
  {language === "GR" ? "Ισοπαλίες" : "Draws"}: {totalSetDraws}
</p>
      </div>
      <div style={{
        background: "#172638",
        maxWidth: 520,
        margin: "auto",
        padding: 20,
        borderRadius: 18
      }}>

        <h2>{t.hangman}</h2>

        <Hangman mistakes={mistakes} />

        <p style={{ color: "#f5c542", fontSize: 18 }}>
          {CATEGORY_NAMES[language][category] || category}
        </p>

        <div style={{
          fontSize: 30,
          letterSpacing: 8,
          margin: "20px 0",
          minHeight: 40
        }}>
          {[...word].map((letter, index) => (
            <span key={index}>
              {letter === " " ? "\u00A0\u00A0" :
                guessed.includes(letter) || lost ? letter : "_"}
            </span>
          ))}
        </div>

        <p>{t.mistakes}: {mistakes} / {MAX}</p>
        <p>{t.score}: {score}</p>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 6
        }}>
          {ALPHABETS[language].map(letter => (
            <button
              key={letter}
              onClick={() => guess(letter)}
              disabled={guessed.includes(letter) || finished}
              style={{
                padding: 10,
                minWidth: 35,
                border: 0,
                borderRadius: 7,
                background: guessed.includes(letter) ? "#555" : "#f5c542",
                color: "#111",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {letter}
            </button>
          ))}
        </div>

        {won && (
          <h2 style={{ color: "#55e68a" }}>
            {t.won}
          </h2>
        )}

        {lost && (
          <h2 style={{ color: "#ff7777" }}>
            {t.lost} {word}
          </h2>
        )}

        {finished && (
          <button
            onClick={() => newGame()}
            style={{
              padding: 14,
              margin: 20,
              background: "#55e68a",
              border: 0,
              borderRadius: 10,
              fontWeight: "bold"
            }}
          >
            {t.newGame}
          </button>
        )}

      </div>

      <p>{t.wins}: {wins} | {t.losses}: {losses}</p>

      <p style={{ color: "#bdc9d8" }}>
        {t.footer}
      </p>

    </div>
  );
}