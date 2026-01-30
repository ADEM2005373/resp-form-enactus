import { ref } from 'vue';

const isWarping = ref(false);

export const useSpace = () => {
    const triggerWarp = () => {
        isWarping.value = true;
        setTimeout(() => {
            isWarping.value = false;
        }, 2000); // Warp lasts 2 seconds
    };

    return { isWarping, triggerWarp };
};
