import { useAutosizeTextareaHeight } from "lib/hooks/useAutosizeTextareaHeight";

interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  labelAction?: React.ReactNode;
  // name is passed in as a const string. Therefore, we make it a generic type so its type can
  // be more restricted as a const for the first argument in onChange
  name: K;
  value?: V;
  placeholder: string;
  maxLength?: number;
  showCounter?: boolean;
  onChange: (name: K, value: V) => void;
}

export const InputGroupWrapper = ({
  label,
  className,
  labelAction,
  children,
}: {
  label: string;
  className?: string;
  labelAction?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div
    className={`text-sm font-semibold text-[color:var(--color-text-primary)] ${className}`}
  >
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {labelAction}
    </div>
    {children}
  </div>
);

export const INPUT_CLASS_NAME =
  "mt-2 block w-full rounded-lg border border-[color:var(--color-surface-border)] bg-[color:var(--color-surface-raised)]/80 px-3 py-2 text-base font-normal text-[color:var(--color-text-primary)] shadow-sm outline-none transition focus:border-[color:var(--color-brand-primary)] focus:ring-2 focus:ring-[color:var(--color-brand-primary)]/15";

export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  maxLength,
  showCounter = true,
  onChange,
  label,
  labelClassName,
  labelAction,
}: InputProps<K, string>) => {
  const clampedValue =
    typeof maxLength === "number" ? value.slice(0, maxLength) : value;
  return (
    <InputGroupWrapper
      label={label}
      className={labelClassName}
      labelAction={labelAction}
    >
      <input
        type="text"
        name={name}
        value={clampedValue}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => {
          const nextValue =
            typeof maxLength === "number"
              ? e.target.value.slice(0, maxLength)
              : e.target.value;
          onChange(name, nextValue);
        }}
        onBlur={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
          }
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter" && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
          }
        }}
        className={INPUT_CLASS_NAME}
      />
      {typeof maxLength === "number" && showCounter && (
        <div className="mt-1 text-right text-xs text-[color:var(--color-text-muted)]">
          {clampedValue.length}/{maxLength}
        </div>
      )}
    </InputGroupWrapper>
  );
};

export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  maxLength,
  showCounter = true,
  onChange,
  labelAction,
}: InputProps<T, string>) => {
  const clampedValue =
    typeof maxLength === "number" ? value.slice(0, maxLength) : value;
  const textareaRef = useAutosizeTextareaHeight({ value });

  return (
    <InputGroupWrapper
      label={label}
      className={wrapperClassName}
      labelAction={labelAction}
    >
      <textarea
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} resize-none overflow-hidden`}
        placeholder={placeholder}
        value={clampedValue}
        maxLength={maxLength}
        onChange={(e) => {
          const nextValue =
            typeof maxLength === "number"
              ? e.target.value.slice(0, maxLength)
              : e.target.value;
          onChange(name, nextValue);
        }}
        onBlur={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
          }
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === "Enter" && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
          }
        }}
      />
      {typeof maxLength === "number" && showCounter && (
        <div className="mt-1 text-right text-xs text-[color:var(--color-text-muted)]">
          {clampedValue.length}/{maxLength}
        </div>
      )}
    </InputGroupWrapper>
  );
};

export const BulletListTextarea = <T extends string>(
  {
    label,
    labelClassName,
    labelAction,
    name,
    value: bulletListStrings = [],
    placeholder,
    onChange,
    maxLength,
    showCounter = true,
  }: InputProps<T, string[]> & { showBulletPoints?: boolean }
) => {
  const normalizedStrings =
    typeof maxLength === "number"
      ? clampBulletLinesToMaxLength(bulletListStrings, maxLength)
      : bulletListStrings.map(stripBulletPrefix);
  const textareaValue = normalizedStrings.join("\n");
  const textareaRef = useAutosizeTextareaHeight({ value: textareaValue });
  const totalLength = textareaValue.length;

  return (
    <InputGroupWrapper
      label={label}
      className={labelClassName}
      labelAction={labelAction}
    >
      <textarea
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} min-h-[7.5rem] resize-y leading-relaxed`}
        placeholder={placeholder}
        value={textareaValue}
        onChange={(e) => {
          const nextValue = normalizeLineBreak(e.target.value);
          const clampedValue =
            typeof maxLength === "number"
              ? nextValue.slice(0, maxLength)
              : nextValue;
          let nextStrings = clampedValue.split("\n");

          // Keep a single empty row when the field is fully cleared.
          if (nextStrings.length === 1 && nextStrings[0] === "") {
            onChange(name, []);
            return;
          }

          nextStrings = nextStrings.map(stripBulletPrefix);

          onChange(name, nextStrings);
        }}
        onBlur={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("resume:refresh-preview"));
          }
        }}
      />
      {typeof maxLength === "number" && showCounter && (
        <div className="mt-1 text-right text-xs text-[color:var(--color-text-muted)]">
          {totalLength}/{maxLength}
        </div>
      )}
    </InputGroupWrapper>
  );
};

const NORMALIZED_LINE_BREAK = "\n";
const normalizeLineBreak = (str: string) =>
  str.replace(/\r\n?/g, NORMALIZED_LINE_BREAK);

const stripBulletPrefix = (str: string) =>
  str.replace(/^\s*(?:[•▪◦‣●\-*]\s*)+/, "");

const clampBulletLinesToMaxLength = (lines: string[], maxLength: number) => {
  const normalizedLines = lines.map(stripBulletPrefix);
  const joined = normalizedLines.join(NORMALIZED_LINE_BREAK).slice(0, maxLength);
  return joined === "" ? [] : joined.split(NORMALIZED_LINE_BREAK);
};
