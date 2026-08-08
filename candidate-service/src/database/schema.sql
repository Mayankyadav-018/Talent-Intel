-- ==========================================
-- Candidate Service Database Schema
-- Logic Loop Hackathon
-- ==========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- Candidates Table
-- ==========================================
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    phone TEXT,

    linkedin_url TEXT,

    github_username TEXT,

    resume_url TEXT,

    ppt_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Skills Table
-- ==========================================
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    candidate_id UUID NOT NULL,

    skill_name TEXT NOT NULL,

    source TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_candidate_skill
        FOREIGN KEY(candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Projects Table
-- ==========================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    candidate_id UUID NOT NULL,

    project_name TEXT NOT NULL,

    description TEXT,

    source TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_candidate_project
        FOREIGN KEY(candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE
);

-- ==========================================
-- GitHub Profiles
-- ==========================================
CREATE TABLE github_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    candidate_id UUID UNIQUE NOT NULL,

    username TEXT NOT NULL,

    followers INTEGER DEFAULT 0,

    following INTEGER DEFAULT 0,

    public_repos INTEGER DEFAULT 0,

    total_stars INTEGER DEFAULT 0,

    languages JSONB,

    fetched_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_candidate_github
        FOREIGN KEY(candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Resume Metadata
-- ==========================================
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    candidate_id UUID NOT NULL,

    file_name TEXT,

    extracted_text TEXT,

    uploaded_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_candidate_resume
        FOREIGN KEY(candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE
);

-- ==========================================
-- Presentation Metadata
-- ==========================================
CREATE TABLE presentations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    candidate_id UUID NOT NULL,

    file_name TEXT,

    extracted_text TEXT,

    uploaded_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_candidate_presentation
        FOREIGN KEY(candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE
);