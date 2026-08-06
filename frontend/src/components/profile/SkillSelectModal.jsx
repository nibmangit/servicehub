import { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { profileApi } from "../../api/profileApi";
import { toast } from "sonner";

export default function SkillSelectModal({ isOpen, onClose, selectedSkillIds, onSave }) {
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] = useState(selectedSkillIds || []);

  // Sync internal selection state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedSkillIds || []);
      fetchSkills();
    }
  }, [isOpen, selectedSkillIds]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getSkills();
      setSkillsList(data);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      toast.error("Could not load skills list.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleToggle = (skillId) => {
    setTempSelected((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const filteredSkills = skillsList.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-card text-card-foreground border border-border shadow-elevated rounded-2xl p-6 space-y-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Select Your Skills</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose the areas of expertise you specialize in.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Skills List Container */}
        <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[320px] space-y-1.5 pr-1">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              Loading skills...
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No matching skills found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredSkills.map((skill) => {
                const isSelected = tempSelected.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleToggle(skill.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                        : "bg-background border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    <span>{skill.name}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            {tempSelected.length} skill{tempSelected.length === 1 ? "" : "s"} selected
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm}>
              Apply Selection
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}