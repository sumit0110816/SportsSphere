/**
 * SportSphere Cloudinary Service for Coach Platform (Fetch API / XHR)
 * Handles unsigned video and tactical highlight uploads directly to Cloudinary.
 */

const STORAGE_KEY = 'sportsphere_cloudinary_config';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder?: string;
}

const DEFAULT_CONFIG: CloudinaryConfig = {
  cloudName: 'sportsphere-demo',
  uploadPreset: 'sportsphere_reels',
  folder: 'sportsphere/coach_clips'
};

export function getCloudinaryConfig(): CloudinaryConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Error reading Cloudinary config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveCloudinaryConfig(config: CloudinaryConfig): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error saving Cloudinary config:', e);
    return false;
  }
}

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  publicId?: string;
  error?: string;
}

export async function uploadVideoToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const config = getCloudinaryConfig();
  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/video/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset || 'sportsphere_reels');
  if (config.folder) {
    formData.append('folder', config.folder);
  }

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          const secureUrl = res.secure_url;
          const thumbnailUrl = secureUrl.replace(/\.[^/.]+$/, '.jpg');
          resolve({
            success: true,
            url: secureUrl,
            thumbnailUrl: thumbnailUrl,
            duration: res.duration || 0,
            publicId: res.public_id
          });
        } catch {
          resolve({ success: false, error: 'Failed to parse Cloudinary response' });
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          resolve({
            success: false,
            error: errRes.error?.message || `Upload failed with HTTP ${xhr.status}`
          });
        } catch {
          resolve({ success: false, error: `Upload failed with HTTP ${xhr.status}` });
        }
      }
    };

    xhr.onerror = () => {
      resolve({ success: false, error: 'Network connection error during Cloudinary upload' });
    };

    xhr.send(formData);
  });
}

