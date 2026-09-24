import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import AdminModal from '../../../components/admin/AdminModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import EmptyState from '../../../components/common/EmptyState';

const EMPTY_FORM = { name: '', is_active: true };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSkills = () => {
    setLoading(true);
    adminApi.getSkills()
      .then((data) => setSkills(data.results || data))
      .catch(() => setError('Could not load skills.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchSkills, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSaveError('');
    setEditing({});
  };

  const openEdit = (skill) => {
    setForm({ name: skill.name, is_active: skill.is_active });
    setSaveError('');
    setEditing(skill);
  };

  const closeModal = () => {
    if (saving) return;
    setEditing(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      if (editing?.id) {
        await adminApi.updateSkill(editing.id, form);
      } else {
        await adminApi.createSkill(form);
      }
      setEditing(null);
      fetchSkills();
    } catch (err) {
      setSaveError(err.response?.data?.detail || 'Could not save this skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await adminApi.deleteSkill(deleting.id);
      setDeleting(null);
      fetchSkills();
    } catch {
      alert('Could not delete this skill. It may still be referenced by provider applications.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) text-sm font-semibold shadow-soft hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus size={16} /> New Skill
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">{error}</div>
      ) : skills.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="No skills yet." />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-(--color-card) border border-(--color-border)">
              <Sparkles size={13} className="text-(--color-primary)" />
              <span className="text-sm text-(--color-foreground)">{skill.name}</span>
              {!skill.is_active && <span className="text-[10px] text-(--color-muted-foreground)">(inactive)</span>}
              <button onClick={() => openEdit(skill)} className="p-1.5 rounded-full text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors cursor-pointer">
                <Pencil size={12} />
              </button>
              <button onClick={() => setDeleting(skill)} className="p-1.5 rounded-full text-(--color-muted-foreground) hover:bg-(--color-destructive)/10 hover:text-(--color-destructive) transition-colors cursor-pointer">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={Boolean(editing)}
        onClose={closeModal}
        title={editing?.id ? 'Edit Skill' : 'New Skill'}
        footer={
          <>
            <button onClick={closeModal} disabled={saving} className="px-4 py-2.5 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) text-xs font-semibold hover:bg-(--color-muted-foreground)/10 transition-all cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) text-xs font-semibold shadow-soft hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-(--color-foreground) block mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-(--color-foreground) cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 accent-(--color-primary)"
            />
            Active
          </label>
          {saveError && (
            <div className="p-3 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">{saveError}</div>
          )}
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={Boolean(deleting)}
        title={`Delete "${deleting?.name}"?`}
        message="This skill will be removed from any provider applications that reference it."
        onClose={() => !isDeleting && setDeleting(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}