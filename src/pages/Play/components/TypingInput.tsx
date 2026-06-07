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
        aria-label="타자 입력"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-lg font-semibold leading-8 text-slate-950 shadow-sm transition focus:border-sky-300 focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:text-xl sm:leading-8"
      />
    );
  },
);

TypingInput.displayName = "TypingInput";

export default TypingInput;
