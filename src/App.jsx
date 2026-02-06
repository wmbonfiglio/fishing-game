import useGameState from "./hooks/useGameState";
import TitleScreen from "./components/TitleScreen";
import GameScreen from "./components/GameScreen";
import ShopScreen from "./components/ShopScreen";
import CollectionScreen from "./components/CollectionScreen";
import AchievementsScreen from "./components/AchievementsScreen";
import InventoryScreen from "./components/InventoryScreen";
import MissionsScreen from "./components/MissionsScreen";

export default function FishingGame() {
  const game = useGameState();

  switch (game.screen) {
    case "title":        return <TitleScreen game={game} />;
    case "shop":         return <ShopScreen game={game} />;
    case "collection":   return <CollectionScreen game={game} />;
    case "achievements": return <AchievementsScreen game={game} />;
    case "inventory":    return <InventoryScreen game={game} />;
    case "missions":     return <MissionsScreen game={game} />;
    default:             return <GameScreen game={game} />;
  }
}
