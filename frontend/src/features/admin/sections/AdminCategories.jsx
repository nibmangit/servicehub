import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import AdminModal from '../../../components/admin/AdminModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import EmptyState from '../../../components/common/EmptyState';

const EMPTY_FORM = { name: '', slug: '', description: '', icon: '', is_active: true };

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = editing
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    adminApi.getCategories()
      .then((data) => setCategories(data.results || data))
      .catch(() => setError('Could not load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCategories, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setSaveError('');
    setEditing({});
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '', is_active: cat.is_active });
    setSlugTouched(true);
    setSaveError('');
    setEditing(cat);
  };

  const closeModal = () => {
    if (saving) return;
    setEditing(null);
  };

  const handleNameChange = (name) => {
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      if (editing?.id) {
        await adminApi.updateCategory(editing.id, form);
      } else {
        await adminApi.createCategory(form);
      }
      setEditing(null);
      fetchCategories();
    } catch (err) {
      setSaveError(err.response?.data?.detail || 'Could not save this category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await adminApi.deleteCategory(deleting.id);
      setDeleting(null);
      fetchCategories();
    } catch {
      alert('Could not delete this category. It may still be in use by active services.');
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
          <Plus size={16} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-border) border-t-(--color-primary) animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-(--color-destructive)/10 text-(--color-destructive) text-sm border border-(--color-destructive)/20">{error}</div>
      ) : categories.length === 0 ? (
        <div className="bg-(--color-card) border border-(--color-border) rounded-(--radius-2xl) p-12 shadow-soft">
          <EmptyState message="No categories yet." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between gap-3 p-4 rounded-(--radius-lg) bg-(--color-card) border border-(--color-border)">
              <div className="min-w-0 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-(--color-primary-soft) text-(--color-primary) flex items-center justify-center shrink-0">
                  <Tag size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-(--color-foreground) truncate">{cat.name}</p>
                  <p className="text-xs text-(--color-muted-foreground) truncate">
                    {cat.is_active ? 'Active' : 'Inactive'} · {cat.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg text-(--color-muted-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground) transition-colors cursor-pointer">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeleting(cat)} className="p-2 rounded-lg text-(--color-muted-foreground) hover:bg-(--color-destructive)/10 hover:text-(--color-destructive) transition-colors cursor-pointer">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        isOpen={Boolean(editing)}
        onClose={closeModal}
        title={editing?.id ? 'Edit Category' : 'New Category'}
        footer={
          <>
            <button onClick={closeModal} disabled={saving} className="px-4 py-2.5 rounded-xl bg-(--color-muted) border border-(--color-border) text-(--color-foreground) text-xs font-semibold hover:bg-(--color-muted-foreground)/10 transition-all cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim() || !form.slug.trim()}
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
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-(--color-foreground) block mb-1">Slug</label>
            <input
              type="text"
              disabled
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
              className="w-full px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm font-mono focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-(--color-foreground) block mb-1">Icon</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="e.g. wrench, home, palette"
              className="w-full px-3.5 py-2.5 rounded-lg bg-(--color-input) border border-(--color-border) text-(--color-foreground) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-(--color-foreground) block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
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
        message="Services under this category will keep their existing data, but the category link will be cleared."
        onClose={() => !isDeleting && setDeleting(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}