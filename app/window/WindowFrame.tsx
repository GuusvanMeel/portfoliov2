import { WindowFrameProps } from "@/app/Features/Window/type";


export default function WindowFrame({ title, children, onClose }: WindowFrameProps) {
  return (
    <div className="window">
      <div className="title-bar">
        <span>{title}</span>

        {onClose && (
          <button type="button" onClick={onClose}>
            X
          </button>
        )}
      </div>

      <div className="window-content">
        {children}
      </div>
    </div>
  );
}