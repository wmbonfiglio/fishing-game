import useTrackingMechanic from "./useTrackingMechanic";
import TrackingMechanicUI from "../../components/mechanics/TrackingMechanicUI";
import useRhythmMechanic from "./useRhythmMechanic";
import RhythmMechanicUI from "../../components/mechanics/RhythmMechanicUI";

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
];

export default MECHANICS;
