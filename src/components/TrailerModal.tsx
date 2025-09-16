import Modal from "./Modal";
import ReactPlayer from "react-player";
import { usePlayback } from "../store/usePlayback";

export default function TrailerModal({
  open, onClose, youtubeKey, media,
}: {
  open: boolean;
  onClose: () => void;
  youtubeKey?: string;
  media?: { id: number; type: "movie" | "tv"; title: string; poster_path?: string | null; genres?: number[] };
}) {
  const { upsert } = usePlayback();

  const onProgress = (ratio: number) => {
    if (!media) return;
    const pct = Math.max(1, Math.min(99, Math.round(ratio * 100)));
    upsert({ ...media, progress: pct });
  };
  const onEnded = () => {
    if (!media) return;
    upsert({ ...media, progress: 100 });
  };

  return (
    <Modal open={open} onClose={onClose} title="Trailer">
      {youtubeKey ? (
        <div style={{ aspectRatio: "16/9" }}>
          <ReactPlayer
            src={`https://www.youtube.com/watch?v=${youtubeKey}`}
            controls width="100%" height="100%"
            onEnded={onEnded}
          />
        </div>
      ) : (
        <p style={{ opacity: .8 }}>Sem trailer disponível.</p>
      )}
    </Modal>
  );
}
