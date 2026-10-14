"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryItem } from "../domain/gallery.entity";
import { Upload, Trash2, Camera, Sparkles, X, CheckCircle, Tag, Eye } from "lucide-react";

interface AdminGalleryManagerProps {
  initialItems: GalleryItem[];
}

export default function AdminGalleryManager({ initialItems }: AdminGalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryItem["category"]>("Destinations");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    }
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file to upload");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Upload to /api/upload (Cloudflare R2 or local storage)
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.error || "Failed to upload file to storage");
      }

      const uploadData = await uploadRes.json();

      // 2. Save gallery entry to database
      const galleryRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url: uploadData.url,
          r2_key: uploadData.key,
          category,
          caption: caption || null,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          is_featured: isFeatured,
        }),
      });

      if (!galleryRes.ok) {
        throw new Error("Failed to save gallery metadata");
      }

      const newItem = await galleryRes.json();
      setItems([newItem, ...items]);
      setSuccess(`Image uploaded and indexed successfully (${uploadData.storage.toUpperCase()})!`);

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle("");
      setCaption("");
      setTags("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Delete image "${itemTitle}" from gallery and storage?`)) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete image");
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Photo Gallery & Cloudflare R2 Media
        </h1>
        <p className="text-xs text-slate-500">
          Upload media to Cloudflare R2 (or local storage fallback). Uploads automatically reflect on the public <a href="/gallery" target="_blank" className="text-amber-600 underline">/gallery</a> page.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Upload className="w-5 h-5 text-amber-500" />
          <span>Upload New Image</span>
        </h3>

        {error && (
          <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleUploadAndSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* File Picker / Preview */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Choose Image File (JPG, PNG, WebP)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50 relative aspect-[4/3] flex flex-col items-center justify-center overflow-hidden">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="space-y-2 pointer-events-none">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                  <span className="text-xs font-semibold text-slate-600 block">
                    Click to browse file
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Uploads directly to R2 Bucket / Local Media
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Metadata Fields */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shikara on Dal Lake at Sunrise"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="Destinations">Destinations</option>
                  <option value="Tours">Tours</option>
                  <option value="Hotels & Stays">Hotels & Stays</option>
                  <option value="Travelers">Travelers</option>
                  <option value="Flights">Flights</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Caption / Description (Optional)
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Our happy traveler group from Hyderabad during sunset"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Kashmir, Dal Lake, Shikara, Honeymoon"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="gal_featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="gal_featured" className="text-xs font-semibold text-slate-700">
                  Feature in top gallery highlights
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={uploading || !file}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? "Uploading to Storage..." : "Upload & Save to Gallery"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Gallery Items Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900">
          Existing Media ({items.length} Images)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group relative"
            >
              <div className="relative aspect-square bg-slate-100">
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  loading="lazy"
                  decoding="async"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-2.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase block truncate">
                  {item.category}
                </span>
                <div className="text-xs font-semibold text-slate-900 truncate" title={item.title}>
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
