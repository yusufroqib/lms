import ReactDOM from 'react-dom';

const Overlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 bg-gray-400 bg-opacity-20"
      onClick={onClose}
    ></div>,
    document.body
  );
};

export default Overlay;