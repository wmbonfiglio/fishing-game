import useTrackingMechanic from "./useTrackingMechanic";
import TrackingMechanicUI from "../../components/mechanics/TrackingMechanicUI";
import useRhythmMechanic from "./useRhythmMechanic";
import RhythmMechanicUI from "../../components/mechanics/RhythmMechanicUI";
import useSlingshotMechanic from "./useSlingshotMechanic";
import SlingshotMechanicUI from "../../components/mechanics/SlingshotMechanicUI";

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
    id: "slingshot",
    name: "Estilingue",
    description: "Mire a direção e controle a força para acertar o peixe!",
    useHook: useSlingshotMechanic,
    UIComponent: SlingshotMechanicUI,
  },
];

export default MECHANICS;
