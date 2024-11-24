import { useState } from "react";
import { addReviewAPI } from "../../apiConfig";
import { toast } from "react-toastify";
import { PawIcon } from "../../assets/PawIcon";
import { CircularProgress } from "@mui/material";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitId: number;
  onReviewAdded: () => void;
  reviewExists: string | undefined | null;
  ratingExists: number | undefined | null;
}

export function AddReviewModal({ isOpen, onClose, visitId, onReviewAdded, reviewExists, ratingExists }: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(ratingExists || 0);
  const [review, setReview] = useState<string>(reviewExists || "");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Proszę wybrać ocenę", {
        position: "top-right",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addReviewAPI({ visit: visitId, rating: rating, review: review });
      toast.success("Opinia została dodana", {
        position: "top-right",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });
      onReviewAdded();
      onClose();
    } catch (error) {
      toast.error("Nie udało się dodać opinii", {
        position: "top-right",
        autoClose: 3000,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      });
      console.error("Error adding review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Dodaj/zmień opinię</h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ocena
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1"
                  >
                    <div className={`${
                      value <= (hoveredRating || rating)
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}>
                      <PawIcon
                        width="32"
                        height="32"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twoja opinia
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Napisz swoją opinię..."
                className="w-full p-2 border rounded-lg h-32 resize-none"
                required
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-white rounded-lg">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Anuluj
            </button>
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Dodaj opinię
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 