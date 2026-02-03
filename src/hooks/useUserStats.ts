import { useCallback, useMemo } from "react";
import useStorageState from "use-storage-state";
import {
  USER_STATS_STORAGE_KEY,
  THUMBNAIL_MAKER_STORAGE_KEY,
} from "src/components/thumbnail-maker/assets/constants";

interface UserStats {
  visitCount: number;
  downloadCount: number;
}

const DEFAULT_STATS: UserStats = {
  visitCount: 0,
  downloadCount: 0,
};

export function useUserStats() {
  const [stats, setStats] = useStorageState<UserStats>(USER_STATS_STORAGE_KEY, {
    defaultValue: DEFAULT_STATS,
  });

  const incrementVisit = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      visitCount: prev.visitCount + 1,
    }));
  }, [setStats]);

  const incrementDownload = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      downloadCount: prev.downloadCount + 1,
    }));
  }, [setStats]);

  const shouldShowGitHubToast = useMemo(() => {
    const tagCountFromStorage = (() => {
      try {
        const stored = localStorage.getItem(THUMBNAIL_MAKER_STORAGE_KEY);
        if (stored) {
          const tags = JSON.parse(stored);
          return Array.isArray(tags) ? tags.length : 0;
        }
      } catch {
        return 0;
      }
      return 0;
    })();

    const hasEnoughVisits = stats.visitCount >= 2;
    const hasDownloaded = stats.downloadCount >= 1;
    const hasEnoughTags = tagCountFromStorage >= 3;

    return hasEnoughVisits && (hasDownloaded || hasEnoughTags);
  }, [stats.visitCount, stats.downloadCount]);

  return {
    stats,
    incrementVisit,
    incrementDownload,
    shouldShowGitHubToast,
  };
}
