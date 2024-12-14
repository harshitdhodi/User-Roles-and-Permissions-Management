import React, { useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useUpdateProfileImageMutation } from '@/store/api/apiSlice';
import { updateUserImage } from '@/store/reducer/authSlice';


const ImageUploader = ({ onUploadSuccess }) => {
    const dispatch = useDispatch();
    const [updateProfileImage, { isLoading }] = useUpdateProfileImageMutation();

    const handleFileChange = useCallback(async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await updateProfileImage(formData);
            
            if(response && !isLoading){

                dispatch(updateUserImage(response.data.user.img));
                // toast.success(response.data.message);
            }


        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to update profile image. Please try again.');
        }
    }, [dispatch]);

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="imageUpload"
            />
            <Button
                onClick={() => document.getElementById('imageUpload')?.click()}
                variant="outline"
            >
                Update Profile Image
            </Button>
        </div>
    );
};

export default ImageUploader;

