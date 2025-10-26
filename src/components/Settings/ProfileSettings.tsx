import React, { useEffect, useState } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import toast from "react-hot-toast";
import { type UserProfileSettings } from "../../types/workspace";
import type { AuthUser } from "../../types/auth";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { appActions } from "../../store/appSlice";
import Loading from "../UI/Loading";

interface ProfileSettingsProps {
  initialData: AuthUser | null;
  provider: string | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  initialData,
  provider,
}) => {
  const dipsatch = useDispatch<AppDispatch>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfileSettings>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    position: initialData?.position || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const sanitizedValue = value.replace(/[^a-zA-Z0-9 ]/g, "");

      // Check if invalid characters were typed
      if (value !== sanitizedValue) {
        toast.dismiss();
        toast.error("Only letters, numbers, and spaces are allowed!");
      }

      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData?.name?.trim().length === 0) {
      toast.error("User name is required");
      return;
    }

    if (formData?.email?.trim().length === 0) {
      toast.error("Email is required");
      return;
    }

    dipsatch(appActions.setUpdateUserProfile(formData));
  };

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      position: initialData?.position || "",
    });

    setIsDisabled(provider === "google.com");
  }, [initialData, provider]);

  let content: React.ReactNode;

  if (!initialData || !provider) {
    content = (
      <div className="glassmorphic rounded-2xl p-8 min-h-60">
        <h3 className="text-xl font-semibold dark:text-white text-black mb-13">
          Profile Configuration
        </h3>
        <Loading />
      </div>
    );
  }

  if (initialData && provider) {
    content = (
      <form onSubmit={handleSubmit} className="glassmorphic rounded-2xl p-8">
        <h3 className="text-xl font-semibold dark:text-white text-black mb-6">
          Profile Configuration
        </h3>

        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-3"
              title="Full Name (Mandatory)"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-3"
              title="Email Address (Mandatory)"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isDisabled}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              title="Position (Optional)"
            >
              Position
            </label>
            <Input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Please type your current position"
            />
          </div>
        </div>
        <Button type="submit" variant="primary" size="md-full" className="mt-6">
          Save Profile
        </Button>
      </form>
    );
  }

  return content;
};

export default ProfileSettings;
