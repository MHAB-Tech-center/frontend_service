/* eslint-disable @typescript-eslint/no-explicit-any */
import Dialog from "@/components/ui/Dialog";
import { getProfile } from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/utils";
import React from "react";
import { toast } from "react-toastify";
import { DropdownMenuItem } from "@/components/ui/base/dropdown-menu";
import { PencilIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/base/input";

interface ProfileData {
  fullName: string;
  email: string;
  role: string;
  province: string;
  district: string;
  phoneNumber: string;
  profilePic: string;
}

const ProfileModal = () => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState<ProfileData | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Add your API call to update profile here
      // await updateProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open]);

  const ProfileField = ({ label, value, field }: { label: string; value: string; field: keyof ProfileData }) => {
    if (isEditing && field !== 'profilePic' && field !== 'role') {
      return (
        <div>
          <label className="text-sm text-gray-500">{label}</label>
          <Input
            value={editedProfile?.[field] || ''}
            onChange={(e) => 
              setEditedProfile(prev => 
                prev ? { ...prev, [field]: e.target.value } : null
              )
            }
            className="mt-1"
          />
        </div>
      );
    }
    return (
      <div>
        <label className="text-sm text-gray-500">{label}</label>
        <p className="font-medium">{value}</p>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={setOpen}
      contentClassName="!max-w-lg"
      trigger={
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
      }
      title={
        (<div className="flex gap-2 items-center">
          <span>My Profile</span>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>) as any
      }
    >
      {loading ? (
        <div className="flex justify-center items-center p-4">Loading...</div>
      ) : profile ? (
        <div className="p-4 space-y-4">
          <div className="flex justify-center">
            <img
              src={profile.profilePic}
              alt={profile.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ProfileField label="Full Name" value={profile.fullName} field="fullName" />
            <ProfileField label="Email" value={profile.email} field="email" />
            <ProfileField label="Role" value={profile.role} field="role" />
            <ProfileField label="Phone Number" value={profile.phoneNumber} field="phoneNumber" />
            <ProfileField label="Province" value={profile.province} field="province" />
            <ProfileField label="District" value={profile.district} field="district" />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center p-4">
          No profile data available
        </div>
      )}
    </Dialog>
  );
};

export default ProfileModal;
