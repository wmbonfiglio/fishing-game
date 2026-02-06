import useTrackingMechanic from "./useTrackingMechanic";
import TrackingMechanicUI from "../../components/mechanics/TrackingMechanicUI";
import useRhythmMechanic from "./useRhythmMechanic";
import RhythmMechanicUI from "../../components/mechanics/RhythmMechanicUI";
<<<<<<< E:/_Wagner/DEV/_AI/Games/fishing-game/src/hooks/mechanics/mechanicsList.js
<<<<<<< E:/_Wagner/DEV/_AI/Games/fishing-game/src/hooks/mechanics/mechanicsList.js
import useSlingshotMechanic from "./useSlingshotMechanic";
import SlingshotMechanicUI from "../../components/mechanics/SlingshotMechanicUI";
=======
import usePumpMechanic from "./usePumpMechanic";
import PumpMechanicUI from "../../components/mechanics/PumpMechanicUI";
>>>>>>> C:/Users/wmbon/.windsurf/worktrees/fishing-game/fishing-game-d2b4053a/src/hooks/mechanics/mechanicsList.js
=======
import useSlingshotMechanic from "./useSlingshotMechanic";
import SlingshotMechanicUI from "../../components/mechanics/SlingshotMechanicUI";
>>>>>>> C:/Users/wmbon/.windsurf/worktrees/fishing-game/fishing-game-6f075725/src/hooks/mechanics/mechanicsList.js

const MECHANICS = [
  {
    id: "tracking",
    name: "Tracking",
    description: "Segure ESPAÇO para mover a zona até o peixe. Clássico!",
    useHook: useTrackingMechanic,
    UIComponent: TrackingMechanicUI,
  },
  {
    id: "rhythm",
    name: "Ritmo",
    description: "Aperte ESPAÇO no momento certo quando o anel chegar ao centro!",
    useHook: useRhythmMechanic,
    UIComponent: RhythmMechanicUI,
  },
  {
<<<<<<< E:/_Wagner/DEV/_AI/Games/fishing-game/src/hooks/mechanics/mechanicsList.js
<<<<<<< E:/_Wagner/DEV/_AI/Games/fishing-game/src/hooks/mechanics/mechanicsList.js
=======
>>>>>>> C:/Users/wmbon/.windsurf/worktrees/fishing-game/fishing-game-6f075725/src/hooks/mechanics/mechanicsList.js
    id: "slingshot",
    name: "Estilingue",
    description: "Mire a direção e controle a força para acertar o peixe!",
    useHook: useSlingshotMechanic,
    UIComponent: SlingshotMechanicUI,
<<<<<<< E:/_Wagner/DEV/_AI/Games/fishing-game/src/hooks/mechanics/mechanicsList.js
=======
    id: "pump",
    name: "Bombeada",
    description: "Aperte ESPAÇO no timing certo (não aperte rápido demais) para puxar o peixe!",
    useHook: usePumpMechanic,
    UIComponent: PumpMechanicUI,
>>>>>>> C:/Users/wmbon/.windsurf/worktrees/fishing-game/fishing-game-d2b4053a/src/hooks/mechanics/mechanicsList.js
=======
>>>>>>> C:/Users/wmbon/.windsurf/worktrees/fishing-game/fishing-game-6f075725/src/hooks/mechanics/mechanicsList.js
  },
];

export default MECHANICS;
