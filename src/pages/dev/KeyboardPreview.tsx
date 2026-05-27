import Keyboard from "../../components/Keyboard/Keyboard";
import { qwertyLayout } from "../../components/Keyboard/KeyboardLayout";
import useKeyboardInput from "../../components/Keyboard/useKeyboardInput";

const KeyboardPreview = () => {
  const { pressedCodes, shiftActive } = useKeyboardInput();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Keyboard
        layout={qwertyLayout}
        pressedCodes={pressedCodes}
        shiftActive={shiftActive}
      />
    </div>
  );
};

export default KeyboardPreview;
