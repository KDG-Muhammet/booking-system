import Modal from "./Modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${itemType} verwijderen`}>
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          Weet je zeker dat je{" "}
          {itemType.toLowerCase() === "klant" ? "de" : "de"}{" "}
          {itemType.toLowerCase()}{" "}
          <span className="font-semibold text-gray-900">{itemName}</span> wilt
          verwijderen? Deze actie kan niet ongedaan worden gemaakt.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Annuleren
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Verwijderen
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
