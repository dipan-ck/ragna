import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface ModelSelectProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled?: boolean;
  hoverColor?: string; // Accept custom hover color
}

const ModelSelect: React.FC<ModelSelectProps> = ({
  selectedModel,
  setSelectedModel,
  disabled = false,
  hoverColor = "hover:bg-[#212121]",
}) => {
  const [open, setOpen] = useState(false);

  const modelOptions = [
    { label: "DeepSeek-v3", value: "deepSeek-v3", disabled: false },
  { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash", disabled: true },
    { label: "Kimi-K2-Instruct", value: "Kimi-K2-Instruct", disabled: true },
    { label: "DeepSeek-R1", value: "deepSeek-r1", disabled: true },
    { label: "GPT-4 (Coming soon)", value: "gpt-4", disabled: true },
    { label: "GPT-3.5 Turbo (Coming soon)", value: "gpt-3.5-turbo", disabled: true },
    { label: "Claude 3 Opus (Coming soon)", value: "claude-3-opus", disabled: true },
    { label: "Gemini Pro (Coming soon)", value: "gemini-pro", disabled: true },
  ];

  // Force select first enabled model if none selected
  React.useEffect(() => {
    if (!selectedModel) {
      const firstEnabled = modelOptions.find(model => !model.disabled);
      if (firstEnabled) {
        setSelectedModel(firstEnabled.value);
      }
    }
  }, [selectedModel, setSelectedModel]);

  const selected = modelOptions.find((m) => m.value === selectedModel);

  return (
    <div className="relative w-full mb-6">
      <label className="block text-base font-medium mb-3 text-gray-300">
        Choose Model
      </label>

      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full flex justify-between items-center px-4 py-3 border border-white/20 rounded-lg bg-[#0a0a0a] text-white text-base disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none`}
      >
        <span>{selected?.label || "Select a model"}</span>
        <ChevronDown className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-[#0a0a0a] border border-white/20 rounded-lg shadow-lg">
          {modelOptions.map((model) => (
            <button
              key={model.value}
              disabled={model.disabled}
              onClick={() => {
                if (!model.disabled) {
                  setSelectedModel(model.value);
                  setOpen(false);
                }
              }}
              className={`w-full text-left px-4 py-3 text-white text-sm ${
                model.disabled
                  ? "opacity-40 cursor-not-allowed"
                  : `cursor-pointer transition ${hoverColor}`
              } flex items-center justify-between`}
            >
              <span>{model.label}</span>
              {model.value === selectedModel && !model.disabled && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelect;
