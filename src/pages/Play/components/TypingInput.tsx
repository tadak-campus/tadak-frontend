import { forwardRef } from "react";

type TypingInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const TypingInput = forwardRef<HTMLInputElement, TypingInputProps>(
  ({ value, onChange, onKeyDown }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="w-full px-4 py-3 border-3 border-slate-300 rounded-xl text-2xl leading-relaxed mb-2 focus:outline-none bg-slate-300"
      />
    );
  },
);

TypingInput.displayName = "TypingInput";

export default TypingInput;
