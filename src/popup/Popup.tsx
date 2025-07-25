import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { MessageType, ResponseType, UserProfile } from '../types';
import SignIn from '../components/SignIn';
import { getCurrentUser, signOut, getCompleteProfile, transformCompleteProfileToUserProfile, shouldRefreshData, saveDataVersions, getDataVersions } from '../lib/supabase';
import ProfileTab from '../components/ProfileTab';

const Container = styled.div`
  width: 400px;
  padding: 28px;
  background: #ffffff;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);
`;

const AutomationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #2D3436;
  font-weight: 700;
  margin: 0;
`;

const SignOutButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(45, 52, 54, 0.05);
    color: #2D3436;
  }
`;

const Button = styled.button<{ isRunning?: boolean }>`
  background: ${props => props.isRunning ? '#e74c3c' : '#2D3436'};
  color: white;
  border: none;
  padding: 16px 28px;
  border-radius: 16px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(45, 52, 54, 0.15);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(45, 52, 54, 0.2);
    background: ${props => props.isRunning ? '#c0392b' : '#1e2527'};
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 15px rgba(45, 52, 54, 0.1);
  }
`;

const SettingsContainer = styled.div`
  background: rgba(45, 52, 54, 0.03);
  border-radius: 12px;
  padding: 16px;
`;

const SettingsTitle = styled.h2`
  font-size: 16px;
  color: #2D3436;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

const DelayInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #edf2f7;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #2D3436;
    outline: none;
    box-shadow: 0 0 0 4px rgba(45, 52, 54, 0.08);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;

  &:after {
    content: '';
    height: 2px;
    width: 24px;
    background: linear-gradient(90deg, #2D3436, transparent);
    border-radius: 2px;
    margin-left: 6px;
  }
`;

const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid #edf2f7;
  border-radius: 16px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  &:focus {
    border-color: #2D3436;
    outline: none;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(45, 52, 54, 0.08);
  }

  &:hover {
    border-color: #2D3436;
    background: #ffffff;
  }

  &[type="file"] {
    padding: 12px;
    background: #ffffff;
    border: 2px dashed #edf2f7;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #2D3436;
      background: rgba(45, 52, 54, 0.02);
    }
  }

  &[type="number"] {
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
  }
`;

const TextArea = styled.textarea`
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);

  &:focus {
    border-color: #0a66c2;
    outline: none;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(10,102,194,0.1);
  }

  &:hover {
    border-color: #0a66c2;
    background: #ffffff;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 28px;
  background: rgba(45, 52, 54, 0.04);
  border-radius: 18px;
  padding: 8px;
  gap: 8px;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 14px;
  background: ${props => props.active ? '#ffffff' : 'transparent'};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? '#2D3436' : '#64748b'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'};
  position: relative;
  overflow: hidden;

  &:hover {
    color: #2D3436;
    background: ${props => props.active ? '#ffffff' : 'rgba(255,255,255,0.8)'};
    transform: translateY(-1px);
  }

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: #2D3436;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover:before {
    width: 80%;
  }
`;

const HelpText = styled.small`
  color: #64748b;
  font-size: 13px;
  margin-top: 6px;
  display: block;
  line-height: 1.5;
  padding-left: 8px;
  border-left: 2px solid rgba(45, 52, 54, 0.2);
  background: rgba(45, 52, 54, 0.03);
  border-radius: 0 4px 4px 0;
  padding: 6px 10px;
  transition: all 0.3s ease;

  &:hover {
    border-left-color: #2D3436;
    background: rgba(45, 52, 54, 0.05);
  }
`;

const ContinuousToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(45, 52, 54, 0.03);
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid rgba(45, 52, 54, 0.08);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(45, 52, 54, 0.05);
    border-color: rgba(45, 52, 54, 0.12);
  }
`;

const ContinuousToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ContinuousToggleTitle = styled.span`
  font-weight: 600;
  color: #2D3436;
  font-size: 14px;
`;

const ContinuousToggleDescription = styled.span`
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
`;

const ToggleSlider = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.checked ? '#2D3436' : '#cbd5e1'};
  border-radius: 24px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: ${props => props.checked ? '27px' : '3px'};
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
`;

const ProgressSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StopButton = styled(Button)`
  background: #e74c3c;
  
  &:hover {
    background: #c0392b;
  }
`;

const ProfileContent = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding: 0 16px 16px 0;
  margin: 0 -16px 0 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 20px;
  }
`;

const Section = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #edf2f7;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const Avatar = styled.div<{ url?: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.url ? `url(${props.url}) center/cover` : '#f1f5f9'};
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
`;

const ProfileTitle = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const ExperienceItem = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fff;
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CompanyTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  font-size: 14px;
`;

const DateLocation = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:before {
    content: '•';
    color: #cbd5e1;
  }
`;

const Description = styled.div`
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const SkillTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-right: 6px;
  margin-bottom: 6px;
  display: inline-block;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fff;
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    color: #1e293b;
  }
`;

const defaultUserData: UserProfile = {
  full_name: '',
  title: '',
  phone: '',
  location: '',
  bio: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  languages: [],
  socials: {},
  daily_goal: 10,
  settings: {
    nextJobDelay: 5000 // Default 5 seconds
  }
};

const Popup: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'automation' | 'profile' | 'settings'>('automation');
  const [userData, setUserData] = useState<UserProfile>(defaultUserData);
  const [delay, setDelay] = useState(5);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  
  // Continuous autofill state
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [isContinuousRunning, setIsContinuousRunning] = useState(false);
  const [continuousProgress, setContinuousProgress] = useState<{
    currentStep: number;
    totalSteps: number;
    stepName: string;
  } | null>(null);
  
  // Helper function to format last synced time
  const formatLastSynced = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const synced = new Date(timestamp);
    const diffMs = now.getTime() - synced.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  useEffect(() => {
    const initializeData = async () => {
      const authResult = await checkAuth();
      if (!authResult) {
        return;
      }

      // Check automation state when popup opens
      checkAutomationState();

      // Get saved user data from storage first
      chrome.storage.local.get(['userData', 'isContinuousMode', 'isContinuousRunning', 'continuousProgress'], async (result) => {
        if (result.userData) {
          setUserData(result.userData);
          // Set the delay from saved settings
          if (result.userData.settings?.nextJobDelay) {
            const savedDelay = Math.floor(result.userData.settings.nextJobDelay / 1000);
            setDelay(savedDelay);
          }
          // Set the last synced time from cached data
          if (result.userData.lastSyncedAt) {
            setLastSyncedAt(result.userData.lastSyncedAt);
          }
        }
        
        // Load continuous mode preferences
        if (result.isContinuousMode !== undefined) {
          setIsContinuousMode(result.isContinuousMode);
        }
        if (result.isContinuousRunning !== undefined) {
          setIsContinuousRunning(result.isContinuousRunning);
        }
        if (result.continuousProgress !== undefined) {
          setContinuousProgress(result.continuousProgress);
        }
        
        // 🚀 DYNAMIC SYNC: Check if fresh data is needed
        try {
          console.log('🔍 Checking if data refresh is needed...');
          const needsRefresh = await shouldRefreshData();
          
          if (needsRefresh) {
            console.log('🔄 Fresh data needed, fetching from Supabase...');
            console.log('📊 Sync reason: Remote data is newer than cached data');
            
            const completeProfile = await getCompleteProfile();
          
            if (completeProfile) {
              // Get the latest data versions for caching
              const dataVersions = await getDataVersions();
              
              // 🔍 CRITICAL FIX: Clear old cache before setting new data
              console.log('🔄 Clearing old userData cache...');
              await chrome.storage.local.remove("userData");
              
              // 🔍 CRITICAL FIX: Don't transform - use raw complete profile data
            const updatedData = {
                ...completeProfile.profile, // Use raw profile data
                // Keep the normalized arrays for autofill
                work_experiences: completeProfile.work_experiences || [],
                education_records: completeProfile.education || [], // Raw education data
                profile_skills: completeProfile.skills || [],
                profile_languages: completeProfile.languages || [],
                certifications: completeProfile.certifications || [],
                portfolio_links: completeProfile.portfolio_links || [],
                // Required UserProfile fields (keep legacy format for compatibility)
                location: `${completeProfile.profile.city || ''}, ${completeProfile.profile.state || ''}`.replace(/^,\s*|,\s*$/g, '') || '',
                education: [], // Legacy format (empty for now)
                experience: [], // Legacy format (empty for now)
                skills: completeProfile.skills?.map(skill => skill.skill_name) || [],
                languages: completeProfile.languages?.map(lang => lang.language_name) || [],
                projects: [],
                custom_answers: {},
                socials: {},
                // Settings
              settings: {
                nextJobDelay: result.userData?.settings?.nextJobDelay || 5000
                },
                // Add sync metadata
                lastSyncedAt: new Date().toISOString()
              } as UserProfile;
              
              console.log('✅ Setting fresh userData with raw Supabase data');
              console.log('🔍 DEBUG - Fresh education data:', updatedData.education_records);
            
            setUserData(updatedData);
            await chrome.storage.local.set({ userData: updatedData });
              
              // Save the data versions for future comparison
              if (dataVersions) {
                await saveDataVersions(dataVersions);
              }
              
              // Update sync status
              setLastSyncedAt(updatedData.lastSyncedAt);
              
              console.log('✅ Data successfully synced and cached');
            }
          } else {
            console.log('💾 Used cached data - all timestamps are current');
            console.log('📊 Sync reason: Local cache is up to date');
            // Use existing cached data - no API call needed
          }
        } catch (error) {
          console.error('❌ Error during data sync:', error);
          console.log('🔄 Fallback: Attempting direct fetch from Supabase');
          
          // Fallback: try to get data anyway
          try {
            const completeProfile = await getCompleteProfile();
            if (completeProfile) {
              console.log('✅ Fallback successful: fetched data despite sync error');
              console.log('📊 Sync reason: Fallback after version check failure');
              
              // Use the same data setting logic as above (simplified)
              const updatedData = {
                ...completeProfile.profile,
                work_experiences: completeProfile.work_experiences || [],
                education_records: completeProfile.education || [],
                profile_skills: completeProfile.skills || [],
                profile_languages: completeProfile.languages || [],
                certifications: completeProfile.certifications || [],
                portfolio_links: completeProfile.portfolio_links || [],
                location: `${completeProfile.profile.city || ''}, ${completeProfile.profile.state || ''}`.replace(/^,\s*|,\s*$/g, '') || '',
                education: [],
                experience: [],
                skills: completeProfile.skills?.map(skill => skill.skill_name) || [],
                languages: completeProfile.languages?.map(lang => lang.language_name) || [],
                projects: [],
                custom_answers: {},
                socials: {},
                settings: {
                  nextJobDelay: result.userData?.settings?.nextJobDelay || 5000
                },
                lastSyncedAt: new Date().toISOString()
              } as UserProfile;
              
              setUserData(updatedData);
              await chrome.storage.local.set({ userData: updatedData });
              setLastSyncedAt(updatedData.lastSyncedAt);
              
              console.log('✅ Fallback data successfully cached');
            }
          } catch (fallbackError) {
            console.error('❌ Fallback failed: Could not fetch data from Supabase:', fallbackError);
            console.log('⚠️ Using existing cached data if available');
          }
        }
      });
    };

    initializeData();

    // Listen for state changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.isAutomationRunning) {
        setIsRunning(changes.isAutomationRunning.newValue);
      }
      if (changes.isContinuousRunning) {
        setIsContinuousRunning(changes.isContinuousRunning.newValue);
      }
      if (changes.continuousProgress) {
        setContinuousProgress(changes.continuousProgress.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // Add a new useEffect to check automation state when switching to automation tab
  useEffect(() => {
    if (activeTab === 'automation') {
      checkAutomationState();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
      return !!user;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    }
  };

  const checkAutomationState = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'GET_STATE' } as MessageType,
          (response: ResponseType) => {
            if (response?.isRunning !== undefined) {
              setIsRunning(response.isRunning);
            }
          }
        );
      }
    });
  };

  const handleStartStop = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        const message: MessageType = {
          type: isRunning ? 'STOP_AUTOMATION' : 'START_AUTOMATION',
          settings: { nextJobDelay: delay * 1000 }
        };
        
        chrome.tabs.sendMessage(tabs[0].id, message, (response: ResponseType) => {
          if (response?.isRunning !== undefined) {
            setIsRunning(response.isRunning);
          }
        });
      }
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
    } catch (error) {
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await chrome.storage.local.set({ userData });
    chrome.runtime.sendMessage({ 
      type: 'SAVE_USER_DATA',
      data: userData 
    } as MessageType);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData(prev => ({
          ...prev,
          resume: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const updatedData = {
      ...userData,
      settings: {
        ...userData.settings,
        nextJobDelay: delay * 1000 // Convert seconds to milliseconds
      }
    };
    
    setUserData(updatedData);
    await chrome.storage.local.set({ userData: updatedData });
  };

  const handleContinuousToggle = (enabled: boolean) => {
    setIsContinuousMode(enabled);
    // Save the preference
    chrome.storage.local.set({ isContinuousMode: enabled });
  };

  const handleContinuousStart = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        console.log("🚀 Starting continuous autofill mode");
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: "START_CONTINUOUS_AUTOFILL",
            data: userData
          },
          (response) => {
            console.log("🚀 Continuous autofill response:", response);
            if (chrome.runtime.lastError) {
              console.error("🚀 Chrome runtime error:", chrome.runtime.lastError);
            }
          }
        );
      }
    });
  };

  const handleContinuousStop = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        console.log("🛑 Stopping continuous autofill mode");
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: "STOP_CONTINUOUS_AUTOFILL"
          },
          (response) => {
            console.log("🛑 Stop continuous autofill response:", response);
            if (chrome.runtime.lastError) {
              console.error("🛑 Chrome runtime error:", chrome.runtime.lastError);
            }
          }
        );
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <SignIn onSignIn={() => setIsAuthenticated(true)} />
      </Container>
    );
  }

  return (
    <Container>
      <AutomationContainer>
        <Header>
          <Title>LinkedIn Easy Apply</Title>
          <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
        </Header>

        <Tabs>
          <Tab 
            active={activeTab === 'automation'} 
            onClick={() => setActiveTab('automation')}
          >
            Automation
          </Tab>
          <Tab 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </Tab>
          <Tab 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </Tab>
        </Tabs>

        {activeTab === 'automation' ? (
          <>
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginBottom: '10px',
              textAlign: 'center',
              background: 'rgba(45, 52, 54, 0.03)',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>🔄</span>
              <span>Last synced: {formatLastSynced(lastSyncedAt)}</span>
            </div>
            
            {/* Continuous Autofill Toggle */}
            <ContinuousToggleContainer>
              <ContinuousToggleLabel>
                <ContinuousToggleTitle>Continuous Autofill</ContinuousToggleTitle>
                <ContinuousToggleDescription>
                  Auto-fill all steps until submission
                </ContinuousToggleDescription>
              </ContinuousToggleLabel>
              <ToggleSwitch>
                <ToggleInput 
                  type="checkbox" 
                  checked={isContinuousMode}
                  onChange={(e) => handleContinuousToggle(e.target.checked)}
                />
                <ToggleSlider checked={isContinuousMode} />
              </ToggleSwitch>
            </ContinuousToggleContainer>

            {/* Progress Indicator (only show when continuous mode is running) */}
            {isContinuousRunning && continuousProgress && (
              <ProgressIndicator>
                <ProgressSpinner />
                <span>
                  Step {continuousProgress.currentStep}/{continuousProgress.totalSteps}: {continuousProgress.stepName}
                </span>
              </ProgressIndicator>
            )}
            
            <Button 
              onClick={handleStartStop}
              isRunning={isRunning}
            >
              {isRunning ? 'Stop Automation' : 'Start Automation'}
            </Button>
            
            {/* Conditional rendering based on continuous mode */}
            {isContinuousMode ? (
              isContinuousRunning ? (
                <StopButton onClick={handleContinuousStop}>
                  Stop Continuous Autofill
                </StopButton>
              ) : (
                <Button onClick={handleContinuousStart}>
                  Start Continuous Autofill
                </Button>
              )
            ) : (
              <Button 
                onClick={() => {
                  console.log("🔵 Autofill button clicked");
                  console.log("🔵 User data:", userData);
                  console.log("🔵 User data details:", {
                    full_name: userData.full_name,
                    email: userData.email,
                    phone: userData.phone,
                    location: userData.location,
                    hasWorkExperience: userData.experience?.length > 0,
                    hasEducation: userData.education?.length > 0,
                    hasSkills: userData.skills?.length > 0
                  });
                  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    console.log("🔵 Current tab:", tabs[0]);
                    if (tabs[0]?.id) {
                      console.log("🔵 Sending autofill message to tab:", tabs[0].id);
                      chrome.tabs.sendMessage(
                        tabs[0].id, 
                        {
                          type: "AUTOFILL_CURRENT_PAGE",
                          data: userData
                        },
                        (response) => {
                          console.log("🔵 Autofill response:", response);
                          if (chrome.runtime.lastError) {
                            console.error("🔵 Chrome runtime error:", chrome.runtime.lastError);
                          }
                        }
                      );
                    } else {
                      console.error("🔵 No active tab found");
                    }
                  });
                }}
              >
                Autofill This Page
              </Button>
            )}
          </>
        ) : activeTab === 'profile' ? (
          <ProfileTab profile={userData} />
        ) : (
          <Form>
            <FormGroup>
              <Label>Delay between jobs (seconds)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={delay}
                onChange={(e) => {
                  const newDelay = Math.max(1, Math.min(30, Number(e.target.value)));
                  setDelay(newDelay);
                  handleSave(); // Save immediately when delay changes
                }}
                placeholder="Delay between jobs (seconds)"
              />
              <HelpText>
                Wait time between applying to jobs (1-30 seconds)
              </HelpText>
            </FormGroup>

            <Button onClick={handleSave}>Save Settings</Button>
          </Form>
        )}
      </AutomationContainer>
    </Container>
  );
};

export default Popup; 