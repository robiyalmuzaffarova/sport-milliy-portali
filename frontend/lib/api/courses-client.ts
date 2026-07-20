const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const MEDIA_BASE_URL = API_URL.replace(/\/api\/v1\/?$/, "");

export function getMediaUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${MEDIA_BASE_URL}${path}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type CourseStatus = "pending" | "approved" | "rejected" | "draft";
export type AdminStatusFilter = "" | "pending" | "approved" | "rejected";

export type SportType =
  | "Futbol" | "Kurash" | "Boks" | "Tennis" | "Suzish"
  | "Gimnastika" | "Atletika" | "Basketbol" | "Voleybol"
  | "Karate" | "Taekwondo" | "Boshqa";

export const SPORT_TYPES: SportType[] = [
  "Futbol", "Kurash", "Boks", "Tennis", "Suzish",
  "Gimnastika", "Atletika", "Basketbol", "Voleybol",
  "Karate", "Taekwondo", "Boshqa",
];

export interface UploaderInfo {
  id: number;
  full_name?: string;
  avatar_url?: string;
  sport_type?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  sport_type: SportType;
  difficulty_level: 1 | 2 | 3;
  video_url: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  qr_code_url?: string;
  qr_code_image_url?: string;
  status: CourseStatus;
  rejection_reason?: string;
  view_count: number;
  rating: number;
  uploaded_by?: UploaderInfo;
  created_at: string;
  updated_at: string;
}

export interface CoursesPage {
  items: Course[];
  total: number;
  skip: number;
  limit: number;
}

export interface CourseUploadData {
  title: string;
  description?: string;
  sport_type: SportType;
  difficulty_level: 1 | 2 | 3;
  video: File;
  thumbnail?: File;
}

// ── Client-side validation constants ───────────────────────────────────────────
// These mirror (but don't replace) the server-side checks — the server
// verifies real file signatures; this is just fast feedback before upload.

export const MAX_VIDEO_SIZE_MB = 500;
export const MAX_THUMBNAIL_SIZE_MB = 8;
export const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi"];
export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export function validateVideoFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
    return `Ruxsat etilmagan format. Qabul qilinadi: ${ALLOWED_VIDEO_EXTENSIONS.join(", ")}`;
  }
  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    return `Video hajmi ${MAX_VIDEO_SIZE_MB}MB dan oshmasligi kerak`;
  }
  return null;
}

export function validateThumbnailFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    return `Ruxsat etilmagan rasm formati. Qabul qilinadi: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}`;
  }
  if (file.size > MAX_THUMBNAIL_SIZE_MB * 1024 * 1024) {
    return `Rasm hajmi ${MAX_THUMBNAIL_SIZE_MB}MB dan oshmasligi kerak`;
  }
  return null;
}

// ── Public API ──────────────────────────────────────────────────────────────────

export const coursesApi = {

  getAll: (
    skip = 0,
    limit = 20,
    sportType?: string,
    search?: string,
  ): Promise<CoursesPage> => {
    let endpoint = `/courses?skip=${skip}&limit=${limit}`;
    if (sportType) endpoint += `&sport_type=${encodeURIComponent(sportType)}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    return fetch(`${API_URL}${endpoint}`).then(async (res) => {
      if (!res.ok) throw new Error(`Kurslarni yuklab bo'lmadi (${res.status})`);
      return res.json();
    });
  },

  getById: (id: string): Promise<Course> =>
    fetch(`${API_URL}/courses/${id}`).then(async (res) => {
      if (!res.ok) throw new Error("Kurs topilmadi");
      return res.json();
    }),

  downloadQr: (id: string, token?: string): Promise<Blob> =>
    fetch(`${API_URL}/courses/${id}/qr/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(async (res) => {
      if (!res.ok) throw new Error("QR kodni yuklab bo'lmadi");
      return res.blob();
    }),

  /**
   * Upload a new course video with real progress reporting.
   * Uses XMLHttpRequest instead of fetch — fetch() has no upload progress API,
   * and video files are large enough that users need to see something moving.
   *
   * @param data       form fields + files
   * @param token      auth token (from localStorage "access_token", same as
   *                   every other authenticated call in this project)
   * @param onProgress called with 0-100 as the upload streams
   */
  upload: (
    data: CourseUploadData,
    token: string,
    onProgress?: (percent: number) => void,
  ): Promise<Course> => {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description || "");
      form.append("sport_type", data.sport_type);
      form.append("difficulty_level", String(data.difficulty_level));
      form.append("video", data.video);
      if (data.thumbnail) form.append("thumbnail", data.thumbnail);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_URL}/courses`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      // Deliberately NOT setting Content-Type — the browser sets
      // multipart/form-data with the correct boundary automatically.
      // Setting it manually here would break the upload.

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        let body: any = null;
        try { body = JSON.parse(xhr.responseText); } catch { /* ignore */ }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(body as Course);
        } else {
          const detail = body?.detail;
          const message = Array.isArray(detail)
            ? (detail[0]?.msg || "Yuklashda xatolik")
            : (detail || `Yuklashda xatolik (${xhr.status})`);
          reject(new Error(message));
        }
      };

      xhr.onerror = () => reject(new Error("Tarmoq xatoligi — internetni tekshiring"));
      xhr.send(form);
    });
  },

  // ── Trainer: own courses, any status ─────────────────────────────────────

  /**
   * Returns the current user's own courses regardless of status
   * (pending/approved/rejected/draft). Powers the "Mening kurslarim" tab.
   */
  getMyCourses: (token: string, skip = 0, limit = 20): Promise<CoursesPage> =>
    fetch(`${API_URL}/courses/my?skip=${skip}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      if (!res.ok) throw new Error("Kurslaringizni yuklab bo'lmadi");
      return res.json();
    }),

  // ── Admin-only ──────────────────────────────────────────────────────────

  getPending: (token: string, skip = 0, limit = 20): Promise<CoursesPage> =>
    fetch(`${API_URL}/courses/admin/pending?skip=${skip}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      if (!res.ok) throw new Error("Kurslarni yuklab bo'lmadi");
      return res.json();
    }),

  /**
   * Admin view of ALL courses (any status), with optional status/sport filters.
   * Powers the moderation history filter tabs (Approved / Rejected / All).
   */
  getAllAdmin: (
    token: string,
    skip = 0,
    limit = 20,
    status?: AdminStatusFilter,
    sportType?: string,
  ): Promise<CoursesPage> => {
    let endpoint = `/courses/admin/all?skip=${skip}&limit=${limit}`;
    if (status) endpoint += `&status=${encodeURIComponent(status)}`;
    if (sportType) endpoint += `&sport_type=${encodeURIComponent(sportType)}`;
    return fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (res) => {
      if (!res.ok) throw new Error("Kurslarni yuklab bo'lmadi");
      return res.json();
    });
  },

  approve: (id: string, token: string): Promise<Course> =>
    fetch(`${API_URL}/courses/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "approved" }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Tasdiqlashda xatolik");
      return res.json();
    }),

  reject: (id: string, reason: string, token: string): Promise<Course> =>
    fetch(`${API_URL}/courses/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "rejected", rejection_reason: reason }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Rad etishda xatolik");
      return res.json();
    }),
};

// ── Role helper ─────────────────────────────────────────────────────────────
// Matches UserProfile['role'] from lib/api/config.ts.
// Case-insensitive because the backend returns lowercase role strings
// (confirmed: "trainer"), while the type declares uppercase literals.

export function canUploadCourses(role?: string): boolean {
  const normalized = role?.toUpperCase();
  return normalized === "TRAINER" || normalized === "ADMIN" || normalized === "SUPERUSER";
}

// ── Utility ─────────────────────────────────────────────────────────────────

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
