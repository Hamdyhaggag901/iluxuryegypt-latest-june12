
import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Image,
  Upload,
  Trash2,
  Copy,
  File,
  FileText,
  FileImage,
  FileVideo,
  Download
} from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Media } from "@shared/schema";

interface MediaResponse {
  success: boolean;
  media: Media[];
}

export default function AdminMedia() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch all media
  const { data: mediaResponse, isLoading } = useQuery<MediaResponse>({
    queryKey: ['/api/cms/media'],
    enabled: true
  });

  const media = mediaResponse?.media || [];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem("adminToken");
      
      const response = await fetch('/api/cms/media', {
        method: 'POST',
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Upload failed with status ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/media'] });
      toast({
        title: "Upload Successful",
        description: "Media file has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload media file.",
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/cms/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/media'] });
      toast({
        title: "Media Deleted",
        description: "Media file has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete media file.",
        variant: "destructive",
      });
    }
  });

  // Handle file upload
  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      uploadMutation.mutate(file);
    });
  }, [uploadMutation]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // File input change handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Copy URL to clipboard with full domain
  const copyUrl = useCallback(async (url: string) => {
    try {
      const fullUrl = `https://iluxuryegypt.com${url}`;
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "URL Copied",
        description: "Full media URL has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.includes('pdf')) return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout 
      title="Media Library" 
      description="Upload and manage your media files"
    >
      {/* Upload Area */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Media
          </CardTitle>
          <CardDescription>
            Upload images, videos and documents for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Supports: JPG, PNG, GIF, WebP, MP4, MOV, WebM, PDF, DOC, DOCX (Max 50MB for videos)
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              data-testid="button-upload"
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Choose Files'}
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleChange}
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              data-testid="input-file"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Media Library
            </div>
            <Badge variant="secondary" data-testid="text-media-count">
              {media.length} files
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12">
              <Image className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media files yet</h3>
              <p className="text-gray-500">Upload your first file to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {media.map((item) => {
                const FileIcon = getFileIcon(item.mimeType);
                const isImage = item.mimeType.startsWith('image/');
                const isVideo = item.mimeType.startsWith('video/');

                return (
                  <Card key={item.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* File Preview */}
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                        {isImage ? (
                          <img
                            src={item.url}
                            alt={item.originalName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : isVideo ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                          />
                        ) : (
                          <FileIcon className="h-16 w-16 text-gray-400" />
                        )}
                        {isVideo && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            VIDEO
                          </div>
                        )}
                      </div>
                      
                      {/* File Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900 truncate" title={item.originalName}>
                          {item.originalName}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatFileSize(item.size)}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.mimeType.split('/')[1]?.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {/* URL Display */}
                        <div className="flex items-center gap-1">
                          <Input
                            value={`https://iluxuryegypt.com${item.url}`}
                            readOnly
                            className="text-xs h-7"
                            data-testid={`input-url-${item.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => copyUrl(item.url)}
                            data-testid={`button-copy-${item.id}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-1 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-7"
                            onClick={() => window.open(item.url, '_blank')}
                            data-testid={`button-view-${item.id}`}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200"
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
