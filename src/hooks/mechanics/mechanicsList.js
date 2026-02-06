import useTrackingMechanic from "./useTrackingMechanic";
import TrackingMechanicUI from "../../components/mechanics/TrackingMechanicUI";
import useRhythmMechanic from "./useRhythmMechanic";
import RhythmMechanicUI from "../../components/mechanics/RhythmMechanicUI";
import usePumpMechanic from "./usePumpMechanic";
import PumpMechanicUI from "../../components/mechanics/PumpMechanicUI";

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
    id: "pump",
    name: "Bombeada",
    description: "Aperte ESPAÇO no timing certo (não aperte rápido demais) para puxar o peixe!",
    useHook: usePumpMechanic,
    UIComponent: PumpMechanicUI,
  },
];

export default MECHANICS;
