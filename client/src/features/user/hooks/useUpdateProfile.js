import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "../services/userService"

const useUpdateProfile = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth-user"] })
        }
    })
};

export default useUpdateProfile;