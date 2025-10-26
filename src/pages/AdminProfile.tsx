import { useEffect, useState } from 'react';
import { User, Lock, Mail, Phone, Key, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { usePageTitle } from '../context/PageTitleContext';

type AdminRole = 'super' | 'admin' | 'editor' | 'viewer';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: string;
}

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'subadmins'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const { setPageTitle } = usePageTitle();
  
  useEffect(() => {
    setPageTitle('Admin Profile');
  }, [setPageTitle]);

  // Current admin profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'super' as AdminRole,
  });

  // Sub-admins list
  const [subAdmins, setSubAdmins] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
      role: 'admin',
      isActive: true,
      lastLogin: '2023-10-25T14:30:00Z',
    },
  ]);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState<Omit<AdminUser, 'id' | 'isActive' | 'lastLogin'>>({ 
    name: '',
    email: '',
    phone: '',
    role: 'admin',
  });

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to update profile
    setIsEditing(false);
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to change password
  };

  // Handle add new admin
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add API call to create new admin
    setSubAdmins([
      ...subAdmins,
      {
        ...newAdmin,
        id: Date.now().toString(),
        isActive: true,
        lastLogin: new Date().toISOString(),
      },
    ]);
    setNewAdmin({ name: '', email: '', phone: '', role: 'admin' });
    setShowAddAdmin(false);
  };

  // Toggle admin status
  const toggleAdminStatus = (id: string) => {
    setSubAdmins(
      subAdmins.map((admin) =>
        admin.id === id ? { ...admin, isActive: !admin.isActive } : admin
      )
    );
    // Add API call to update admin status
  };

  // Delete admin
  const deleteAdmin = (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setSubAdmins(subAdmins.filter((admin) => admin.id !== id));
      // Add API call to delete admin
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1> */}
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your profile and administrator accounts
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              {profile.role === 'super' && (
                <button
                  onClick={() => setActiveTab('subadmins')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'subadmins'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Manage Sub-Admins
                </button>
              )}
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                  <p className="mt-1 text-sm text-gray-500">Update your account's profile information and email address.</p>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button form="profile-form" type="submit">
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <form id="profile-form" onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ensure your account is using a long, random password to stay secure.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="current-password"
                      name="current-password"
                      type="password"
                      required
                      className="pl-10 block w-full"
                      placeholder="Current password"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="new-password"
                      name="new-password"
                      type="password"
                      required
                      className="pl-10 block w-full"
                      placeholder="New password"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      className="pl-10 block w-full"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </div>
          )}

          {/* Sub-Admins Tab */}
          {activeTab === 'subadmins' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Manage Sub-Admins</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View and manage all sub-admin accounts.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowAddAdmin(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Admin
                </Button>
              </div>

              {/* Add Admin Modal */}
              {showAddAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Add New Admin</h3>
                      <button
                        onClick={() => setShowAddAdmin(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <Input
                          id="new-admin-name"
                          type="text"
                          required
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                          className="w-full"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="new-admin-email"
                            type="email"
                            required
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                            className="pl-10 block w-full"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="new-admin-phone"
                            type="tel"
                            value={newAdmin.phone}
                            onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                            className="pl-10 block w-full"
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <Select
                          value={newAdmin.role}
                          onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value as AdminRole })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddAdmin(false)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="w-full sm:w-auto"
                        >
                          Add Admin
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Sub-Admins Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subAdmins.length > 0 ? (
                      subAdmins.map((admin) => (
                        <tr key={admin.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                <div className="text-sm text-gray-500">{admin.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Switch
                                checked={admin.isActive}
                                onCheckedChange={() => toggleAdminStatus(admin.id)}
                              />
                              <span className="ml-2 text-sm text-gray-600">
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => deleteAdmin(admin.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete admin"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No sub-admins found. Click the "Add Admin" button to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}