import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { MessageType, ResponseType, UserProfile } from '../types';

const Container = styled.div`
  width: 400px;
  padding: 16px;
`;

const Title = styled.h1`
  font-size: 18px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background-color: #0a66c2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 8px;

  &:hover {
    background-color: #004182;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    border-color: #0a66c2;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;

  &:focus {
    border-color: #0a66c2;
    outline: none;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.active ? '#0a66c2' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#0a66c2' : 'transparent'};

  &:hover {
    color: #0a66c2;
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
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'automation' | 'profile' | 'settings'>('automation');
  const [userData, setUserData] = useState<UserProfile>(defaultUserData);

  useEffect(() => {
    // Check automation state when popup opens
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

  const handleStartStop = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        const message: MessageType = {
          type: isRunning ? 'STOP_AUTOMATION' : 'START_AUTOMATION'
        };
        
        chrome.tabs.sendMessage(tabs[0].id, message, (response: ResponseType) => {
          if (response?.isRunning !== undefined) {
            setIsRunning(response.isRunning);
          }
        });
      }
    });
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

  return (
    <Container>
      <Title>LinkedIn Easy Apply Automation</Title>
      
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
        <Button onClick={handleStartStop}>
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
              value={userData.settings.nextJobDelay / 1000}
              onChange={e => {
                const newDelay = Math.max(1, Math.min(30, Number(e.target.value))) * 1000;
                setUserData(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    nextJobDelay: newDelay
                  }
                }));
                // Save immediately when changed
                chrome.storage.local.set({ 
                  userData: {
                    ...userData,
                    settings: {
                      ...userData.settings,
                      nextJobDelay: newDelay
                    }
                  }
                });
              }}
            />
            <small style={{ color: '#666', marginTop: '4px' }}>
              Wait time between applying to jobs (1-30 seconds)
            </small>
          </FormGroup>

          <Button onClick={handleSave}>Save Settings</Button>
        </Form>
      )}
    </Container>
  );
};

export default Popup; 