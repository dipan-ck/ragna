import { create } from 'zustand';

interface CreateProjectModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useCreateProjectModalStore = create<CreateProjectModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useCreateProjectModalStore;