// src/utils/common/bunny.ts

export const BUNNY_LIBRARY_ID = import.meta.env.VITE_APP_BUNNY_LIBRARY_ID;
export const BUNNY_API_KEY = import.meta.env.VITE_APP_BUNNY_STREAM_API_KEY;
export const BUNNY_PULLZONE = import.meta.env.VITE_APP_BUNNY_PULLZONE_URL;
export const BUNNY_HLS_PATH =
  import.meta.env.VITE_APP_BUNNY_HLS_PATH || "/playlist.m3u8";

export const uploadVideoToBunny = async (
  file: File,
  onProgress?: (percent: number) => void
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const libraryId = BUNNY_LIBRARY_ID;
      const apiKey = BUNNY_API_KEY;

      // 1) Create a new video entry
      const createRes = await fetch(
        `https://video.bunnycdn.com/library/${libraryId}/videos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            AccessKey: apiKey,
          },
          body: JSON.stringify({ title: file.name }),
        }
      );

      const createJson = await createRes.json();
      const videoId = createJson.guid;

      // 2) Upload video with progress handling
      const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("AccessKey", apiKey);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve({
            videoId,
            videoUrl: `${BUNNY_PULLZONE}/${videoId}${BUNNY_HLS_PATH}`,
          });
        } else {
          reject("Upload failed: " + xhr.status);
        }
      };

      xhr.onerror = () => reject("Upload error");

      xhr.send(file);
    } catch (err) {
      reject(err);
    }
  });
};
