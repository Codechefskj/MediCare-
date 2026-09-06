import { createContext, useCallback, useContext, useState } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { title, message, confirmLabel, danger, resolve }

  const confirm = useCallback(
    ({ title = 'Are you sure?', message = '', confirmLabel = 'Confirm', danger = false } = {}) =>
      new Promise((resolve) => {
        setDialog({ title, message, confirmLabel, danger, resolve });
      }),
    []
  );

  const handleClose = (result) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-[95] bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[fadeIn_.15s_ease-out]">
            <h3 className="font-bold text-slate-800 text-lg">{dialog.title}</h3>
            {dialog.message && <p className="text-sm text-slate-500 mt-2">{dialog.message}</p>}
            <div className="flex gap-3 mt-6">
              <button className="btn-secondary flex-1" onClick={() => handleClose(false)}>Cancel</button>
              <button
                className={dialog.danger ? 'btn-danger flex-1' : 'btn-primary flex-1'}
                onClick={() => handleClose(true)}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
