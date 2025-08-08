import React, { useState } from "react";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import Button from "../ui/Button";
import ModelSelect from "../ui/ModelSelect";
import { Sparkles } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useProject } from "@/lib/hooks/useProject";
import { SuccessToast, ErrorToast } from "../ui/Toast";
import { useNotificationUnreadCheck } from "@/lib/hooks/useNotificationUnreadCheck";

const modelOptions = [
    { label: "DeepSeek-v3", value: "deepSeek-v3", disabled: false },
  { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash", disabled: true },
  { label: "Kimi-K2-Instruct", value: "Kimi-K2-Instruct", disabled: true },
  { label: "DeepSeek-R1", value: "deepSeek-r1", disabled: true },
  { label: "GPT-4 (Coming soon)", value: "gpt-4", disabled: true },
  { label: "GPT-3.5 (Coming soon)", value: "gpt-3.5", disabled: true },
];

const AddProject: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    AgentInstructions: "",
  });
  const [selectedModel, setSelectedModel] = useState("deepSeek-v3");
  const [isLoading, setIsLoading] = useState(false);
  const { refetch: refetchUser } = useUser();
  const { refetch: refetchProject } = useProject();
  const {refetch : notificationStatus} = useNotificationUnreadCheck();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModelChange = (value: string) => {
    const found = modelOptions.find(opt => opt.value === value);
    if (found && !found.disabled) {
      setSelectedModel(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const payload = {
        name: formData.projectName,
        model: selectedModel,
        AgentInstructions: formData.AgentInstructions,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/project/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!result.success) {
        ErrorToast(result.message);
        return;
      } else if (result.success) {
        SuccessToast(result.message);
        await refetchUser();
        await refetchProject();
        await notificationStatus()
      }
      closeModal();
      setFormData({ projectName: "", AgentInstructions: "" });
      setSelectedModel("gemini-2.5-flash");
    } catch (error) {
      console.error("Error creating project:", error);
      ErrorToast("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Input
        label="Project Name"
        type="text"
        name="projectName"
        id="projectName"
        value={formData.projectName}
        onChange={handleInputChange}
        placeholder="E.g., Customer Support Bot"
        required
        disabled={isLoading}
      />
      <ModelSelect
        selectedModel={selectedModel}
        setSelectedModel={handleModelChange}
        disabled={isLoading}
        modelOptions={modelOptions}
      />
      <TextArea
        label="Agent instructions"
        name="AgentInstructions"
        id="AgentInstructions"
        value={formData.AgentInstructions}
        onChange={handleInputChange}
        placeholder="Give your agent instructions that tell it what you want it to do and how it should do it. You can adjust these instructions at any time."
        disabled={isLoading}
      />
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          onClick={closeModal}
          disabled={isLoading}
          variant="secondary"
          className="w-auto px-6 py-3 text-base"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !formData.projectName.trim()}
          variant="primary"
          className="w-auto px-6 py-3 text-base"
        >
          <Sparkles className="w-5 h-5" /> Create Project
        </Button>
      </div>
    </form>
  );
};

export default AddProject;
