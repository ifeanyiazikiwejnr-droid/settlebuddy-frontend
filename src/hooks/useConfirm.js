import { useState } from 'react';

export default function useConfirm() {
  const [modal, setModal] = useState({ isOpen: false });

  const confirm = ({ title, message, confirmText, cancelText, danger }) => {
    return new Promise((resolve) => {
      setModal({
        isOpen: true,
        title, message, confirmText, cancelText, danger,
        onConfirm: () => { setModal({ isOpen: false }); resolve(true); },
        onCancel: () => { setModal({ isOpen: false }); resolve(false); },
      });
    });
  };

  return { modal, confirm };
}