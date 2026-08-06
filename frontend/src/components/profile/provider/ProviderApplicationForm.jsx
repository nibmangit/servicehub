import { ArrowRight, BadgeCheck, TrendingUp, Users, Plus, X } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Label } from "../../ui/Label";
import { Textarea } from "../../ui/Textarea";
import SkillSelectModal from "./SkillSelectModal";

export default function ProviderApplicationForm({
  formData,
  allSkillsMap,
  isSkillModalOpen,
  setIsSkillModalOpen,
  submitting,
  error,
  handleChange,
  handleSubmit,
  removeSkill,
  setFormData,
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          <BadgeCheck className="h-3.5 w-3.5" /> For professionals
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Become a ServiceHub provider
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Reach thousands of customers across Ethiopia. It's free to join.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Users, title: "12,400+ pros", desc: "Join the largest network of Ethiopian professionals." },
          { icon: TrendingUp, title: "2× more jobs", desc: "Providers on ServiceHub earn 2× more on average." },
          { icon: BadgeCheck, title: "Free verification", desc: "Get your verified badge upon admin review." },
        ].map((p) => (
          <div key={p.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <form
        className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-lg font-semibold">Tell us about yourself</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Share your skills and experience so customers and admins know what you can do.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Skill Selector Trigger & Tags Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Your Selected Skills *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSkillModalOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Select Skills
              </Button>
            </div>

            {formData.skills.length === 0 ? (
              <div 
                onClick={() => setIsSkillModalOpen(true)}
                className="border border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
              >
                <p className="text-xs text-muted-foreground">No skills selected yet. Click here to open the skill selector.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 border border-border rounded-xl bg-background">
                {formData.skills.map((skillId) => (
                  <span
                    key={skillId}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-primary text-primary-foreground shadow-sm"
                  >
                    {allSkillsMap[skillId] || `Skill #${skillId}`}
                    <button
                      type="button"
                      onClick={() => removeSkill(skillId)}
                      className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Years of Experience */}
          <div className="space-y-1.5">
            <Label htmlFor="experience_years">Years of Experience *</Label>
            <Input
              id="experience_years"
              name="experience_years"
              type="number"
              min="0"
              max="50"
              required
              placeholder="e.g. 3"
              value={formData.experience_years}
              onChange={handleChange}
            />
          </div>

          {/* Professional Summary */}
          <div className="space-y-1.5">
            <Label htmlFor="professional_summary">Professional Summary & Experience *</Label>
            <Textarea
              id="professional_summary"
              name="professional_summary"
              required
              rows={5}
              placeholder="Certifications, past work history, key proficiencies…"
              value={formData.professional_summary}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">By continuing you agree to our provider terms.</p>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit application"} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>

      {/* Skill Selection Popup Modal */}
      <SkillSelectModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        selectedSkillIds={formData.skills}
        onSave={(newSelectedIds) => {
          setFormData((prev) => ({ ...prev, skills: newSelectedIds }));
        }}
      />
    </div>
  );
}