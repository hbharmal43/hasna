import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { MessageType, ResponseType, UserProfile } from '../types';
import SignIn from '../components/SignIn';
import { getCurrentUser, signOut } from '../lib/supabase';

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

const defaultUserData: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  experience: [],
  education: [],
  skills: [],
  resume: '',
  additionalQuestions: {},
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

  useEffect(() => {
    checkAuth();
    checkAutomationState();

    // Get saved user data
    chrome.storage.local.get(['userData'], (result) => {
      if (result.userData) {
        setUserData(result.userData);
      }
    });

    // Listen for state changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.isAutomationRunning) {
        setIsRunning(changes.isAutomationRunning.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
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
      console.error('Sign out failed:', error);
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

  const handleSave = () => {
    chrome.storage.local.set({ userData }, () => {
      console.log('Profile saved successfully');
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
          <Button 
            onClick={handleStartStop}
            isRunning={isRunning}
          >
            {isRunning ? 'Stop Automation' : 'Start Automation'}
          </Button>
        ) : activeTab === 'profile' ? (
          <Form onSubmit={handleSaveProfile}>
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                value={userData.firstName}
                onChange={e => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                value={userData.lastName}
                onChange={e => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={userData.email}
                onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={userData.phone}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                value={userData.location}
                onChange={e => setUserData(prev => ({ ...prev, location: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Resume (PDF)</Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>LinkedIn URL (Optional)</Label>
              <Input
                type="url"
                value={userData.linkedin || ''}
                onChange={e => setUserData(prev => ({ ...prev, linkedin: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Website/Portfolio (Optional)</Label>
              <Input
                type="url"
                value={userData.website || ''}
                onChange={e => setUserData(prev => ({ ...prev, website: e.target.value }))}
              />
            </FormGroup>

            <Button type="submit" onClick={handleSave}>Save Profile</Button>
          </Form>
        ) : (
          <Form>
            <FormGroup>
              <Label>Delay between jobs (seconds)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={delay}
                onChange={(e) => setDelay(Math.max(1, Math.min(30, Number(e.target.value))))}
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