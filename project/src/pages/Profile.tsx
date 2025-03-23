import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { User, UserRole } from '../types';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'employer', 'issuer']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, updateProfile, setRole } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.profile.name || '',
      email: user?.profile.email || '',
      role: user?.role || 'student',
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.profile.name || '',
        email: user.profile.email || '',
        role: user.role,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update profile information
      updateProfile({
        name: data.name,
        email: data.email,
      });

      // Update role if changed
      if (data.role !== user.role) {
        setRole(data.role);
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <Input
              label="Display Name"
              placeholder="Enter your name"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Type</label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="student"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    {...register('role')}
                  />
                  <span>Student / Job Seeker</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="employer"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    {...register('role')}
                  />
                  <span>Employer</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="issuer"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    {...register('role')}
                  />
                  <span>Credential Issuer</span>
                </label>
              </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900">Wallet Address</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your blockchain wallet address cannot be changed
              </p>
              <p className="mt-2 font-mono text-xs text-gray-700">{user.address}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};