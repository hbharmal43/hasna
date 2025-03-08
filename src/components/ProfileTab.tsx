import React from 'react';
import styled from '@emotion/styled';
import { UserProfile } from '../types';

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

interface ProfileTabProps {
  profile: UserProfile;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile }) => {
  return (
    <ProfileContent>
      <Section>
        <ProfileHeader>
          <Avatar url={profile.avatar_url} />
          <ProfileInfo>
            <ProfileName>{profile.full_name || 'No name set'}</ProfileName>
            <ProfileTitle>{profile.title || 'No title set'}</ProfileTitle>
          </ProfileInfo>
        </ProfileHeader>
        <Grid>
          {profile.location && (
            <div>
              <SectionTitle>Location</SectionTitle>
              {profile.location}
            </div>
          )}
          {profile.phone && (
            <div>
              <SectionTitle>Phone</SectionTitle>
              {profile.phone}
            </div>
          )}
        </Grid>
      </Section>

      {profile.bio && (
        <Section>
          <SectionTitle>About</SectionTitle>
          <Description>{profile.bio}</Description>
        </Section>
      )}

      {profile.experience?.length > 0 && (
        <Section>
          <SectionTitle>Experience</SectionTitle>
          {profile.experience?.map((exp: any, index: number) => (
            <ExperienceItem key={index}>
              <CompanyTitle>{exp.title} at {exp.company}</CompanyTitle>
              <DateLocation>{exp.date} • {exp.location}</DateLocation>
              <Description>{exp.description}</Description>
            </ExperienceItem>
          ))}
        </Section>
      )}

      {profile.education?.length > 0 && (
        <Section>
          <SectionTitle>Education</SectionTitle>
          {profile.education?.map((edu: any, index: number) => (
            <ExperienceItem key={index}>
              <CompanyTitle>{edu.degree}</CompanyTitle>
              <DateLocation>{edu.school} • {edu.date}</DateLocation>
              <Description>{edu.description}</Description>
            </ExperienceItem>
          ))}
        </Section>
      )}

      {(profile.skills?.length > 0 || profile.languages?.length > 0) && (
        <Section>
          <SectionTitle>Skills & Languages</SectionTitle>
          {profile.skills?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {profile.skills?.map((skill: string, index: number) => (
                <SkillTag key={index}>{skill}</SkillTag>
              ))}
            </div>
          )}
          {profile.languages?.length > 0 && (
            <div>
              {profile.languages?.map((lang: string, index: number) => (
                <SkillTag key={index}>{lang}</SkillTag>
              ))}
            </div>
          )}
        </Section>
      )}

      {profile.projects?.length > 0 && (
        <Section>
          <SectionTitle>Projects</SectionTitle>
          {profile.projects?.map((project: any, index: number) => (
            <ExperienceItem key={index}>
              <CompanyTitle>{project.name}</CompanyTitle>
              <DateLocation>{project.date}</DateLocation>
              <Description>{project.description}</Description>
            </ExperienceItem>
          ))}
        </Section>
      )}

      {Object.keys(profile.socials || {}).length > 0 && (
        <Section>
          <SectionTitle>Social Links</SectionTitle>
          {Object.entries(profile.socials || {}).map(([platform, url]) => (
            <SocialLink key={platform} href={url as string} target="_blank" rel="noopener noreferrer">
              {platform}
            </SocialLink>
          ))}
        </Section>
      )}

      {profile.resume_url && (
        <Section>
          <SectionTitle>Resume</SectionTitle>
          <SocialLink href={profile.resume_url} target="_blank" rel="noopener noreferrer">
            View Resume
          </SocialLink>
        </Section>
      )}
    </ProfileContent>
  );
};

export default ProfileTab; 