import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        profile: {
            full_name: '',
            title: '',
            bio: '',
            skills: '',
            experience: '',
            education: '',
            profile_picture: null
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get('http://127.0.0.1:8000/api/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setFormData({
                email: res.data.email,
                profile: {
                    full_name: res.data.profile.full_name || '',
                    title: res.data.profile.title || '',
                    bio: res.data.profile.bio || '',
                    skills: res.data.profile.skills || '',
                    experience: res.data.profile.experience || '',
                    education: res.data.profile.education || '',
                    profile_picture: null
                }
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('profile.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                profile_picture: e.target.files[0]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            const formDataToSend = new FormData();
            
            // Add user data
            formDataToSend.append('email', formData.email);
            
            // Add profile data
            for (const key in formData.profile) {
                if (key === 'profile_picture' && formData.profile[key]) {
                    formDataToSend.append(`profile.${key}`, formData.profile[key]);
                } else if (formData.profile[key]) {
                    formDataToSend.append(`profile.${key}`, formData.profile[key]);
                }
            }

            await axios.put('http://127.0.0.1:8000/api/profile/', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setEditMode(false);
            fetchProfile();
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    if (!profile) return <div>Loading profile...</div>;

    return (
        <div className="profile-container">
            {editMode ? (
                <form onSubmit={handleSubmit}>
                    <h2>Edit Profile</h2>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div>
                        <label>Full Name:</label>
                        <input 
                            type="text" 
                            name="profile.full_name" 
                            value={formData.profile.full_name} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div>
                        <label>Title:</label>
                        <input 
                            type="text" 
                            name="profile.title" 
                            value={formData.profile.title} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div>
                        <label>Skills (comma separated):</label>
                        <input 
                            type="text" 
                            name="profile.skills" 
                            value={formData.profile.skills} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div>
                        <label>Bio:</label>
                        <textarea 
                            name="profile.bio" 
                            value={formData.profile.bio} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div>
                        <label>Experience:</label>
                        <textarea 
                            name="profile.experience" 
                            value={formData.profile.experience} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div>
                        <label>Education:</label>
                        <textarea 
                            name="profile.education" 
                            value={formData.profile.education} 
                            onChange={handleChange} 
                        />
                    </div>
                    
                    <div>
                        <label>Profile Picture:</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                        />
                    </div>
                    
                    <button type="submit">Save Profile</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <h2>{profile.username}'s Profile</h2>
                    {profile.profile.profile_picture && (
                        <img 
                            src={`http://127.0.0.1:8000${profile.profile.profile_picture}`} 
                            alt="Profile" 
                            width="150" 
                        />
                    )}
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Full Name:</strong> {profile.profile.full_name || 'N/A'}</p>
                    <p><strong>Title:</strong> {profile.profile.title || 'N/A'}</p>
                    <p><strong>Skills:</strong> {profile.profile.skills || 'N/A'}</p>
                    <p><strong>Bio:</strong> {profile.profile.bio || 'N/A'}</p>
                    <p><strong>Experience:</strong> {profile.profile.experience || 'N/A'}</p>
                    <p><strong>Education:</strong> {profile.profile.education || 'N/A'}</p>
                    <button onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default Profile;