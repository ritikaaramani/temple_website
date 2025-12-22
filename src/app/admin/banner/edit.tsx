'use client';

import { useContent } from '@/context/ContentContext';
import { useState } from 'react';
import { AdminProtected } from '@/components/AdminProtected';

export default function BannerEditPage() {
  const { bannerSettings, updateBannerLogo, updateBannerImage, updateBannerText } = useContent();
  const [logoUploading, setLogoUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [bannerText, setBannerText] = useState(bannerSettings.text || '');

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }
    setLogoUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBannerLogo(reader.result as string);
      setLogoUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to upload image');
      setLogoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Banner image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    setImageUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBannerImage(reader.result as string);
      setImageUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to upload image');
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Banner text update
  const handleTextSave = () => {
    updateBannerText(bannerText);
    alert('Banner text updated!');
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-6">Edit Banner</h1>
            <div className="space-y-8">
              {/* Logo Upload */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Banner Logo</h2>
                {bannerSettings.logo && (
                  <img src={bannerSettings.logo} alt="Banner Logo" className="h-16 mb-4" />
                )}
                <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={logoUploading} />
                <button className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded" onClick={() => updateBannerLogo('')}>Remove Logo</button>
              </div>
              {/* Banner Image Upload */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Banner Background Image</h2>
                {bannerSettings.image && (
                  <img src={bannerSettings.image} alt="Banner Background" className="h-32 mb-4" />
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} />
                <button className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded" onClick={() => updateBannerImage('')}>Remove Image</button>
              </div>
              {/* Banner Text Edit */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Banner Text</h2>
                <textarea
                  className="w-full border rounded p-2"
                  rows={3}
                  value={bannerText}
                  onChange={e => setBannerText(e.target.value)}
                />
                <button className="mt-2 px-4 py-2 bg-amber-600 text-white rounded" onClick={handleTextSave}>Save Text</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}
