import { reactive } from 'vue';

export const useForm = () => {
    const formState = reactive({
        currentStep: 0,
        answers: {} as Record<string, any>
    });

    return { formState };
};
