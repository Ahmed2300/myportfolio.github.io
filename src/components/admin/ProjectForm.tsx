"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema, type Project } from "@/schemas/project.schema";
import { createProject, updateProject } from "@/actions/admin.actions";
import { useState } from "react";
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  initialData?: Project;
}

export function ProjectForm({ initialData }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const router = useRouter();
  
  const form = useForm<Project>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: initialData || {
      id: "",
      title: "",
      description: "",
      detailedDescription: "",
      image: "",
      imageUrl: "",
      category: "",
      platform: "",
      tags: [],
      technologies: [],
      features: [],
      problem: "",
      solution: "",
      detailImages: [],
      links: {
        github: "",
        demo: "",
        playStore: "",
        appStore: ""
      },
      featured: false,
    }
  });

  const onSubmit = async (data: Project) => {
    setIsPending(true);
    try {
      if (initialData?.id) {
        await updateProject(initialData.id, data);
      } else {
        await createProject(data);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to save project");
      setIsPending(false);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      const current = form.getValues("detailImages") || [];
      form.setValue("detailImages", [...current, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (indexToRemove: number) => {
    const current = form.getValues("detailImages") || [];
    form.setValue("detailImages", current.filter((_, i) => i !== indexToRemove));
  };

  const getArrayString = (arr?: string[]) => arr?.join(", ") || "";
  const parseArrayString = (str: string) => str.split(",").map(s => s.trim()).filter(Boolean);

  const getLinesString = (arr?: string[]) => arr?.join("\n") || "";
  const parseLinesString = (str: string) => str.split("\n").map(s => s.trim()).filter(Boolean);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/projects"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-2xl font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isPending ? "Saving..." : "Save Project"}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8 shadow-sm">
        <h2 className="text-xl font-display font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">Basic Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project ID / Slug (Leave empty for auto-generation)</label>
            <input 
              {...form.register("id")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              placeholder="e.g. flutter-ecom" 
              disabled={!!initialData?.id}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title <span className="text-red-500">*</span></label>
            <input 
              {...form.register("title")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              placeholder="Project Title" 
            />
            {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
          </div>
          
           <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Short Description <span className="text-red-500">*</span></label>
            <textarea 
              {...form.register("description")}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white resize-y"
              placeholder="Brief summary used in cards..." 
              rows={2}
            />
            {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Thumbnail Image URL</label>
            <div className="flex items-start gap-4">
              {form.watch("imageUrl") ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <img src={form.watch("imageUrl")} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 opacity-50 mb-1" />
                  <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-wider">No Image</span>
                </div>
              )}
              <input 
                {...form.register("imageUrl")}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                placeholder="https://..." 
              />
            </div>
          </div>

           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Platform & Category</label>
            <div className="grid grid-cols-2 gap-4">
              <input 
                {...form.register("platform")}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                placeholder="Flutter, Android, etc." 
              />
              <input 
                {...form.register("category")}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                placeholder="Category" 
              />
            </div>
          </div>
          
           <div className="space-y-4 md:col-span-2">
            <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <input 
                type="checkbox" 
                {...form.register("featured")}
                className="w-5 h-5 rounded text-brand-500 focus:ring-brand-500"
              />
              <div>
                <span className="block font-medium dark:text-white">Featured Project</span>
                <span className="text-xs text-slate-500">Show this prominently on the homepage</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8 shadow-sm">
        <h2 className="text-xl font-display font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">Deep Dive</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">The Problem</label>
            <textarea 
              {...form.register("problem")}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white resize-y"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">The Solution</label>
            <textarea 
              {...form.register("solution")}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white resize-y"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Technologies (Comma separated)</label>
            <input 
              value={getArrayString(form.watch("technologies"))}
              onChange={e => form.setValue("technologies", parseArrayString(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              placeholder="React, Next.js, Firebase..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags (Comma separated)</label>
            <input 
              value={getArrayString(form.watch("tags"))}
              onChange={e => form.setValue("tags", parseArrayString(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              placeholder="Mobile, E-Commerce..." 
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Key Features (One per line)</label>
            <textarea 
              value={getLinesString(form.watch("features"))}
              onChange={e => form.setValue("features", parseLinesString(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white resize-y font-mono text-sm leading-relaxed"
              rows={5}
              placeholder="Real-time chat&#10;Push notifications&#10;Google Sign-In..."
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gallery Images</label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="url"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                  placeholder="Paste image URL here and press Enter..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={addImageUrl}
                disabled={!newImageUrl.trim()}
                className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Plus className="w-5 h-5" />
                Add Image
              </button>
            </div>

            {(form.watch("detailImages") || []).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                {(form.watch("detailImages") || []).map((url, i) => (
                  <div key={i} className="group relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 backdrop-blur-[2px]">
                      <p className="text-white text-[10px] break-all text-center mb-2 line-clamp-2 px-1 font-mono">
                        {url}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(i)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8 shadow-sm">
        <h2 className="text-xl font-display font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">External Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</label>
            <input 
              {...form.register("links.github")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              type="url"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Demo URL</label>
            <input 
              {...form.register("links.demo")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              type="url"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Play Store URL</label>
            <input 
              {...form.register("links.playStore")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              type="url"
            />
          </div>
           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">App Store URL</label>
            <input 
              {...form.register("links.appStore")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
              type="url"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
