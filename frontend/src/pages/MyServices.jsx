import { Link } from "react-router-dom";
import { Edit3, Eye, MoreVertical, Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "../components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import { Switch } from "../components/ui/Switch";
import { servicesApi } from "../api/servicesApi";
import ConfirmModal from "../components/services/ConfirmModal.jsx";

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyServices = async () => {
    try {
      const data = await servicesApi.getMyServices();
      console.log(data)
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
      toast.error("Could not load your services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  const handleStatusToggle = async (serviceId, currentStatus) => {
    const newStatus = !currentStatus;
    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, is_active: newStatus } : s))
    );

    try {
      await servicesApi.updateServiceStatus(serviceId, newStatus);
      toast.success(newStatus ? "Service activated" : "Service deactivated");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update service status.");
      // Revert on error
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, is_active: currentStatus } : s))
      );
    }
  };

  const confirmDelete = (serviceId) => {
    setServiceToDelete(serviceId);
  };

  const handleDeleteAction = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      await servicesApi.deleteService(serviceToDelete);
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete));
      toast.success("Service deleted successfully.");
      setServiceToDelete(null);
    } catch (err) {
      console.error("Failed to delete service:", err);
      toast.error("Could not delete service.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Compute stats dynamically from loaded services
  const activeCount = services.filter((s) => s.is_active).length;
  const avgRating =
    services.length > 0
      ? (
          services.reduce((acc, curr) => acc + (curr.average_rating || 0), 0) /
          services.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage listings, pricing, and availability.
          </p>
        </div>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="h-4 w-4 mr-1" />
            New service
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active listings", value: activeCount },
          { label: "Total services", value: services.length },
          { label: "Avg. rating", value: `${avgRating} ★` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        {services.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground">You haven't created any services yet.</p>
            <Button asChild className="mt-4">
              <Link to="/services/new">Create your first service</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4 text-left font-semibold">Service</th>
                <th className="p-4 text-left font-semibold">Category</th>
                <th className="p-4 text-left font-semibold">Price</th>
                <th className="p-4 text-left font-semibold">Reviews</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((s) => {
                const coverImage = s.images?.[0]?.image;
                return (
                  <tr key={s.id} className="hover:bg-secondary/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted grid place-items-center">
                          {coverImage ? (
                            <img src={coverImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/services/${s.id}`}
                            className="line-clamp-1 font-medium hover:text-primary"
                          >
                            {s.title}
                          </Link>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {s.duration || "Flexible duration"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {/* If your category serializer returns an object or ID */}
                      {typeof s.category_detail === "object" ? s.category_detail?.name : `Category #${s.category}`}
                    </td>
                    <td className="p-4 font-semibold">
                      {s.price_type === "negotiable"
                        ? "Negotiable"
                        : `ETB ${Number(s.price || 0).toLocaleString()}`}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {s.review_count} · {s.average_rating}★
                    </td>
                    <td className="p-4">
                      <Switch
                        checked={s.is_active}
                        onCheckedChange={() => handleStatusToggle(s.id, s.is_active)}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Actions">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/services/${s.id}/edit`}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/services/${s.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => confirmDelete(s.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>


    <ConfirmModal
      isOpen={Boolean(serviceToDelete)}
      title="Delete Service"
      description="Are you sure you want to delete this service? This action cannot be undone and will remove all associated bookings and reviews."
      confirmText="Yes, Delete"
      loading={isDeleting}
      onConfirm={handleDeleteAction}
      onClose={() => setServiceToDelete(null)}
    />

    </div>
  );
}