"use client";

import { Button } from "@/components/ui/base/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import { Input } from "@/components/ui/base/input";
import { Label } from "@/components/ui/base/label";
import { Upload } from "lucide-react";
import { useState } from "react";

import Logo from "@/assets/rmb-logo.png";
import { ComplexInput } from "@/components/ui/Input";
import { toast } from "react-toastify";
import { setupRMBStaff } from "@/hooks/useApi";
import { getErrorMessage } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Provinces, Districts } from "rwanda";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonenumber: "",
    gender: "",
    password: "",
    province: "",
    district: "",
    national_id: "",
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoRaw, setPhotoRaw] = useState<File | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setPhotoRaw(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) {
      return toast.error(passwordError);
    }
    if (step === 1) {
      setStep(2);
    } else {
      const data = new FormData();
      (Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (photoRaw) {
        data.append("picture", photoRaw, photoRaw.name);
      }

      try {
        setLoading(true);
        const response = await setupRMBStaff(data);
        toast.info(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center pt-20 relative">
      <div className="absolute w-full top-0 left-0 h-16 p-4">
        <img src={Logo} alt="RMB Logo" className="h-full" />
      </div>
      <Card className="w-full max-w-md mx-auto border-none">
        <CardHeader className=" text-center">
          <CardTitle>
            {step === 1 ? "Create account" : "Complete profile"}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {step === 1
              ? "Enter your details to create an account"
              : "Complete your profile to continue"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContinue} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your full name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phonenumber">Phone number</Label>
                  <Input
                    id="phonenumber"
                    name="phonenumber"
                    placeholder="078965432"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select your gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <ComplexInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    error={passwordError}
                  />
                  <p className="text-xs text-gray-500">
                    Minimum of 8 characters with upper and lowercase and number
                    of symbols
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  {/* <Label>Upload photo</Label> */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-primary-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-primary-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt="Uploaded"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                        </div>
                      )}
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  {/* <Input
                    id="province"
                    name="province"
                    placeholder="Enter your province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                  /> */}
                  {/* <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, rmbRoleId: value })
                    }
                    defaultValue={formData.rmbRoleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.rtbRoleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, province: value, district: "" })
                    }
                    defaultValue={formData.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                    <SelectContent>
                      {Provinces().map((province: string) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  {/* <Input
                    id="district"
                    name="district"
                    placeholder="Enter your district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  /> */}
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, district: value })
                    }
                    defaultValue={formData.district}
                    disabled={!formData.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                      {Districts(formData.province).map((district: string) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="national_id">National ID</Label>
                  <Input
                    id="national_id"
                    name="national_id"
                    placeholder="Enter your national ID"
                    value={formData.national_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            {step === 2 && (
              <Button
                type="button"
                className="w-full mb-2"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : step === 1 ? "Continue" : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
