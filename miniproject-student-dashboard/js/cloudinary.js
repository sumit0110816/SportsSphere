/**
 * SportSphere Cloudinary Service (HTML5 + Fetch API)
 * Handles client-side unsigned video and media uploads directly to Cloudinary.
 */

const STORAGE_KEY = 'sportsphere_cloudinary_config';

// Default / fallback configuration (can be updated via UI settings modal)
const DEFAULT_CONFIG = {
  cloudName: 'sportsphere-demo',
  uploadPreset: 'sportsphere_reels',
  folder: 'sportsphere/highlights'
};

export function getCloudinaryConfig() {
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

export function saveCloudinaryConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error saving Cloudinary config:', e);
    return false;
  }
}

/**
 * Uploads a video or media file directly to Cloudinary using Fetch API / XHR for progress tracking.
 * @param {File} file - The video file to upload
 * @param {Function} onProgress - Callback with percentage (0 - 100)
 * @returns {Promise<{success: boolean, url?: string, thumbnailUrl?: string, duration?: number, error?: string}>}
 */
export async function uploadVideoToCloudinary(file, onProgress) {
  const config = getCloudinaryConfig();

  if (!config.cloudName || config.cloudName === 'sportsphere-demo') {
    // If not yet configured with a custom cloud name, give user feedback or simulate upload
    console.info('Using Cloudinary with current config:', config.cloudName);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/video/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset || 'sportsphere_reels');
  if (config.folder) {
    formData.append('folder', config.folder);
  }

  return new Promise((resolve, reject) => {
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
          // Generate poster thumbnail from video
          const thumbnailUrl = secureUrl.replace(/\.[^/.]+$/, ".jpg");
          resolve({
            success: true,
            url: secureUrl,
            thumbnailUrl: thumbnailUrl,
            duration: res.duration || 0,
            publicId: res.public_id,
            format: res.format,
            bytes: res.bytes
          });
        } catch (err) {
          resolve({ success: false, error: 'Failed to parse Cloudinary response' });
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          resolve({
            success: false,
            error: errRes.error?.message || `Upload failed with status ${xhr.status}`
          });
        } catch (e) {
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`
          });
        }
      }
    };

    xhr.onerror = () => {
      resolve({
        success: false,
        error: 'Network connection failed during Cloudinary upload'
      });
    };

    xhr.send(formData);
  });
}

