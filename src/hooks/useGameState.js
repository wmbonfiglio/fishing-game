import { useState, useEffect, useCallback, useRef } from "react";
import {
  LOCATIONS, FISH_DATABASE, RODS, BAITS, LINES, ACHIEVEMENTS,
  RARITY_NAMES, xpForLevel,
} from "../data/gameData";

export default function useGameState() {
  // Game state
  const [screen, setScreen] = useState("title");
  const [gamePhase, setGamePhase] = useState("idle");
  const [gold, setGold] = useState(50);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [equippedRod, setEquippedRod] = useState(0);
  const [equippedBait, setEquippedBait] = useState(0);
  const [equippedLine, setEquippedLine] = useState(0);
  const [ownedRods, setOwnedRods] = useState([0]);
  const [ownedBaits, setOwnedBaits] = useState([0]);
  const [ownedLines, setOwnedLines] = useState([0]);
  const [caughtFish, setCaughtFish] = useState({});
  const [totalCaught, setTotalCaught] = useState(0);
  const [totalGoldEarned, setTotalGoldEarned] = useState(0);
  const [biggestFish, setBiggestFish] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [achievementPopup, setAchievementPopup] = useState(null);
  const [shopTab, setShopTab] = useState("rods");

  // Casting state
  const [castPower, setCastPower] = useState(0);
  const [castDirection, setCastDirection] = useState(1);
  const castPowerRef = useRef(0);

  // Fishing state
  const [waitTimer, setWaitTimer] = useState(0);
  const [currentFish, setCurrentFish] = useState(null);
  const [fishWeight, setFishWeight] = useState(0);
  const [bobberExclamation, setBobberExclamation] = useState(false);

  // Reeling state
  const [fishPosition, setFishPosition] = useState(50);
  const fishPositionRef = useRef(50);
  const [catchZonePos, setCatchZonePos] = useState(40);
  const [tension, setTension] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);
  const [fishDir, setFishDir] = useState(1);
  const fishDirRef = useRef(1);
  const [catchResult, setCatchResult] = useState(null);

  // Message
  const [message, setMessage] = useState("");

  const keysRef = useRef({});

  // Stats for achievements
  const getStats = useCallback(() => {
    let rareCaught = 0, epicCaught = 0, legendaryCaught = 0, mythicCaught = 0, uniqueSpecies = 0;
    Object.entries(caughtFish).forEach(([id, data]) => {
      uniqueSpecies++;
      const fish = FISH_DATABASE.find(f => f.id === id);
      if (fish) {
        if (fish.rarity === "rare") rareCaught += data.count;
        if (fish.rarity === "epic") epicCaught += data.count;
        if (fish.rarity === "legendary") legendaryCaught += data.count;
        if (fish.rarity === "mythic") mythicCaught += data.count;
      }
    });
    return { totalCaught, totalGoldEarned, level, biggestFish, rareCaught, epicCaught, legendaryCaught, mythicCaught, uniqueSpecies };
  }, [caughtFish, totalCaught, totalGoldEarned, level, biggestFish]);

  // Check achievements
  const checkAchievements = useCallback(() => {
    const stats = getStats();
    ACHIEVEMENTS.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id) && ach.check(stats)) {
        setUnlockedAchievements(prev => [...prev, ach.id]);
        setAchievementPopup(ach);
        setTimeout(() => setAchievementPopup(null), 3000);
      }
    });
  }, [getStats, unlockedAchievements]);

  useEffect(() => {
    checkAchievements();
  }, [totalCaught, level, gold, caughtFish]);

  // Add XP and handle level up
  const addXp = useCallback((amount) => {
    setXp(prev => {
      let newXp = prev + amount;
      let newLevel = level;
      while (newXp >= xpForLevel(newLevel)) {
        newXp -= xpForLevel(newLevel);
        newLevel++;
      }
      if (newLevel > level) {
        setLevel(newLevel);
        setMessage(`🎉 NÍVEL ${newLevel}! Novas possibilidades desbloqueadas!`);
      }
      return newXp;
    });
  }, [level]);

  // Select fish based on location, bait, rod
  const selectFish = useCallback(() => {
    const loc = LOCATIONS[currentLocation];
    const bait = BAITS[equippedBait];
    const rod = RODS[equippedRod];
    const available = FISH_DATABASE.filter(f => f.location === loc.id);

    const rarityWeights = { common: 50, uncommon: 25, rare: 12, epic: 5, legendary: 2, mythic: 0.5 };

    const weightedFish = available.map(f => {
      let weight = rarityWeights[f.rarity] || 1;
      if (f.rarity !== "common") weight *= (1 + bait.rarityBonus + rod.luck);
      return { fish: f, weight };
    });

    const totalWeight = weightedFish.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const wf of weightedFish) {
      roll -= wf.weight;
      if (roll <= 0) return wf.fish;
    }
    return weightedFish[0].fish;
  }, [currentLocation, equippedBait, equippedRod]);

  // Start casting
  const startCasting = () => {
    if (gamePhase !== "idle") return;
    setGamePhase("casting");
    setCastPower(0);
    setCastDirection(1);
    setMessage("Segure ESPAÇO para lançar...");
  };

  // Release cast
  const releaseCast = () => {
    if (gamePhase !== "casting") return;
    setGamePhase("waiting");
    const bait = BAITS[equippedBait];
    const power = castPowerRef.current;
    const waitTime = Math.max(1, 5 - bait.attraction * 0.5 - power * 0.02 + Math.random() * 3);
    setWaitTimer(waitTime);
    setBobberExclamation(false);
    setMessage("Esperando o peixe morder... 🎣");
  };

  // Hook fish
  const hookFish = () => {
    const fish = selectFish();
    const weight = fish.minWeight + Math.random() * (fish.maxWeight - fish.minWeight);
    setCurrentFish(fish);
    setFishWeight(Math.round(weight * 100) / 100);
    setGamePhase("reeling");
    setFishPosition(50);
    fishPositionRef.current = 50;
    setCatchZonePos(50);
    setTension(0);
    setReelProgress(0);
    const initialDir = Math.random() > 0.5 ? 1 : -1;
    setFishDir(initialDir);
    fishDirRef.current = initialDir;
    setMessage(`${fish.emoji} ${fish.name} (${RARITY_NAMES[fish.rarity]}) mordeu! Mantenha no alvo!`);
  };

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        keysRef.current.space = true;

        if (screen === "game") {
          if (gamePhase === "idle") {
            startCasting();
          } else if (gamePhase === "waiting" && bobberExclamation) {
            hookFish();
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        keysRef.current.space = false;

        if (gamePhase === "casting") {
          releaseCast();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gamePhase, screen, bobberExclamation]);

  // Casting animation
  useEffect(() => {
    if (gamePhase !== "casting") return;
    const interval = setInterval(() => {
      setCastPower(prev => {
        const next = prev + castDirection * 2;
        let val;
        if (next >= 100) { setCastDirection(-1); val = 100; }
        else if (next <= 0) { setCastDirection(1); val = 0; }
        else { val = next; }
        castPowerRef.current = val;
        return val;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [gamePhase, castDirection]);

  // Wait timer
  useEffect(() => {
    if (gamePhase !== "waiting") return;
    const interval = setInterval(() => {
      setWaitTimer(prev => {
        if (prev <= 0) {
          setBobberExclamation(true);
          setMessage("❗ PEIXE! Aperte ESPAÇO agora!");
          setTimeout(() => {
            setGamePhase(prev2 => {
              if (prev2 === "waiting") {
                setMessage("O peixe escapou... Tente de novo!");
                setBobberExclamation(false);
                return "idle";
              }
              return prev2;
            });
          }, 2000);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gamePhase]);

  // Reeling game loop
  useEffect(() => {
    if (gamePhase !== "reeling" || !currentFish) return;

    const rod = RODS[equippedRod];
    const line = LINES[equippedLine];
    const difficulty = currentFish.difficulty;
    const speed = currentFish.speed;
    const catchZoneSizeLocal = 15 + rod.tension * 3;
    let changeTimer = 0;

    const interval = setInterval(() => {
      changeTimer -= 1;
      if (changeTimer <= 0) {
        const newDir = Math.random() > 0.5 ? 1 : -1;
        fishDirRef.current = newDir;
        setFishDir(newDir);
        changeTimer = Math.random() * 60 + 20;
      }

      setFishPosition(prev => {
        const dir = fishDirRef.current;
        const movement = dir * speed * difficulty * 0.4 * (0.5 + Math.random());
        const jitter = (Math.random() - 0.5) * difficulty * 0.5;
        let next = prev + movement + jitter;
        if (next < 5) { next = 5; fishDirRef.current = 1; setFishDir(1); }
        if (next > 95) { next = 95; fishDirRef.current = -1; setFishDir(-1); }
        fishPositionRef.current = next;
        return next;
      });

      setCatchZonePos(prev => {
        const fp = fishPositionRef.current;
        if (keysRef.current.space) {
          const moveSpeed = 1.5 * rod.power;
          const diff = fp - prev;
          return prev + Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed);
        }
        return prev + (Math.random() - 0.5) * 0.5;
      });

      setCatchZonePos(currentCatchZone => {
        const fp = fishPositionRef.current;
        const inZone = Math.abs(fp - currentCatchZone) < catchZoneSizeLocal / 2;

        setTension(prev => {
          let newTension = prev;
          if (keysRef.current.space && !inZone) {
            newTension += 0.8 * difficulty / line.strength;
          } else if (inZone && keysRef.current.space) {
            newTension -= 0.3 * line.strength;
          } else {
            newTension -= 0.5;
          }
          return Math.max(0, Math.min(100, newTension));
        });

        setReelProgress(prev => {
          if (inZone) {
            return Math.min(100, prev + 0.3 * rod.power);
          }
          return Math.max(0, prev - 0.15 * difficulty);
        });

        return currentCatchZone;
      });
    }, 33);

    return () => clearInterval(interval);
  }, [gamePhase, currentFish, equippedRod, equippedLine]);

  // Check win/lose conditions
  useEffect(() => {
    if (gamePhase !== "reeling") return;

    if (tension >= 100) {
      setGamePhase("escaped");
      setCatchResult(null);
      setMessage(`💔 A linha arrebentou! ${currentFish?.name} escapou...`);
      setTimeout(() => setGamePhase("idle"), 2500);
    }

    if (reelProgress >= 100) {
      setGamePhase("caught");
      const fish = currentFish;
      const weight = fishWeight;
      const priceMultiplier = 1 + (weight - fish.minWeight) / (fish.maxWeight - fish.minWeight);
      const sellPrice = Math.floor(fish.basePrice * priceMultiplier);

      setCatchResult({ fish, weight, sellPrice });
      setGold(prev => prev + sellPrice);
      setTotalGoldEarned(prev => prev + sellPrice);
      setTotalCaught(prev => prev + 1);
      if (weight > biggestFish) setBiggestFish(weight);
      addXp(fish.xp);

      setCaughtFish(prev => {
        const existing = prev[fish.id] || { count: 0, biggest: 0, smallest: Infinity };
        return {
          ...prev,
          [fish.id]: {
            count: existing.count + 1,
            biggest: Math.max(existing.biggest, weight),
            smallest: Math.min(existing.smallest, weight),
          }
        };
      });
    }
  }, [tension, reelProgress, gamePhase]);

  // Reset fishing
  const resetFishing = () => {
    setGamePhase("idle");
    setCatchResult(null);
    setCurrentFish(null);
    setMessage("");
  };

  // Buy / equip item
  const buyItem = (type, index) => {
    const items = type === "rods" ? RODS : type === "baits" ? BAITS : LINES;
    const item = items[index];
    if (!item || gold < item.price) return;
    if (item.unlockLevel && level < item.unlockLevel) return;

    const owned = type === "rods" ? ownedRods : type === "baits" ? ownedBaits : ownedLines;
    if (owned.includes(index)) {
      if (type === "rods") setEquippedRod(index);
      else if (type === "baits") setEquippedBait(index);
      else setEquippedLine(index);
      return;
    }

    setGold(prev => prev - item.price);
    if (type === "rods") { setOwnedRods(prev => [...prev, index]); setEquippedRod(index); }
    else if (type === "baits") { setOwnedBaits(prev => [...prev, index]); setEquippedBait(index); }
    else { setOwnedLines(prev => [...prev, index]); setEquippedLine(index); }
  };

  // Derived values
  const rod = RODS[equippedRod];
  const bait = BAITS[equippedBait];
  const line = LINES[equippedLine];
  const loc = LOCATIONS[currentLocation];
  const catchZoneSize = 15 + rod.tension * 3;
  const xpNeeded = xpForLevel(level);
  const xpPercent = (xp / xpNeeded) * 100;

  return {
    // Screen
    screen, setScreen,
    // Game phase
    gamePhase, message,
    // Player
    gold, xp, level, xpPercent,
    // Location
    currentLocation, setCurrentLocation, loc,
    // Equipment
    rod, bait, line,
    ownedRods, ownedBaits, ownedLines,
    equippedRod, equippedBait, equippedLine,
    shopTab, setShopTab,
    // Casting
    castPower,
    // Fishing
    bobberExclamation,
    currentFish, fishWeight,
    fishPosition, catchZonePos, catchZoneSize,
    tension, reelProgress,
    catchResult,
    // Stats
    totalCaught, totalGoldEarned, biggestFish, caughtFish,
    unlockedAchievements, achievementPopup,
    // Actions
    startCasting, releaseCast, resetFishing, buyItem,
    // Refs
    keysRef,
  };
}
