import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

interface AvatarState {
	avatar: string;
	setAvatar: (avatar: string) => void;
}

const avatarStore = (set: any) => ({
	avatar: "",
	setAvatar: (avatar: string) => set({ avatar }),
});

const useAvatarStore = create<AvatarState>()(
	devtools(
		persist(avatarStore, {
			name: "avatar",
		})
	)
)

export default useAvatarStore;