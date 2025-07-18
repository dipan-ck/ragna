// stores/useUserStore.ts
import { create } from 'zustand';


interface User {
  email: string;
  fullName: string;
  isVerified: boolean;
  avatar: string;
  usage: number;
  subscriptionStatus: string;
  plan: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null, // Initially null so we can conditionally render
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }
      const data: User = await res.json();
      set({ user: data, loading: false });
    } catch (err) {
      let errorMessage = 'Failed to fetch user';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  clearUser: () => set({ user: null }),
}));

export default useUserStore;
