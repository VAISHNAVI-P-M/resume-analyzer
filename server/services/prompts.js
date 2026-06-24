// Call 1 — Skills extraction + Top Strengths
function buildSkillsExtractionPrompt(resumeText, jobDescription) {
  return `You are a resume analysis assistant. Analyze the resume and job description below.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object in this exact format, with no extra text before or after:
{
  "resumeSkills": ["skill1", "skill2", ...],
  "requiredSkills": ["skill1", "skill2", ...],
  "topStrengths": ["skill1", "skill2", "skill3"]
}

resumeSkills: all technical skills, tools, frameworks found in the resume.
requiredSkills: all skills required by the job description.
topStrengths: pick the 3-4 STRONGEST overlapping skills between resume and JD — the ones the candidate should lead with confidently in an interview.`
}

// Call 2 — Match Score + Interview Focus Areas (merged weaknesses + how to answer)
function buildGapAnalysisPrompt(resumeSkills, requiredSkills) {
  return `You are a career advisor preparing a candidate for an interview happening very soon (within 24-48 hours).

RESUME SKILLS: ${JSON.stringify(resumeSkills)}
REQUIRED SKILLS: ${JSON.stringify(requiredSkills)}

Return ONLY a valid JSON object in this exact format, with no extra text before or after:
{
  "matchScore": 73,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": [
    { "skill": "AWS", "resource": "AWS Cloud Practitioner free course on AWS Skill Builder" }
  ],
  "interviewFocusAreas": [
    {
      "gap": "No direct experience with AWS",
      "howToAnswer": "A short, confident sentence the candidate can say in the interview if asked about this gap — bridging it to a related skill they DO have."
    }
  ]
}

matchScore is 0-100, representing overall fit.
interviewFocusAreas: pick the TOP 3 most important gaps only (not every missing skill) — these are for someone with very little prep time, so focus only on what's likely to come up and matters most. For each, give a specific, ready-to-say sentence — not generic advice like "be honest about it."`
}

// Call 3 — Resume Rewrites + Project Talking Points
function buildRewritePrompt(resumeText, jobDescription) {
  return `You are a resume and interview coach. Read this resume and job description.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object in this exact format, with no extra text before or after:
{
  "rewrites": [
    { "before": "original weak sentence from resume", "after": "improved, impactful version tailored to the job" }
  ],
  "projectTalkingPoints": [
    {
      "project": "Project name from the resume",
      "talkingPoint": "A short, natural, spoken-style narrative (3-4 sentences) the candidate could literally SAY out loud if asked 'tell me about this project' — should highlight relevance to the job description."
    }
  ]
}

rewrites: find 3 bullet points that could be improved, make them specific and quantified where possible.
projectTalkingPoints: pick the 2-3 most relevant projects from the resume and write a natural spoken narrative for each — something a nervous candidate could read once and then say confidently in their own words.`
}

// Call 4 — Interview Questions (expanded to 12-13)
function buildInterviewQuestionsPrompt(resumeText, jobDescription) {
  return `You are an interview coach. Based on this resume and job description, generate likely interview questions.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object in this exact format, with no extra text before or after:
{
  "questions": [
    "question 1",
    "question 2"
  ]
}

Generate exactly 13 questions: a mix of technical questions based on the resume's actual skills/projects, and behavioral questions relevant to the job description. Make them specific to THIS resume and THIS job, not generic.`
}

module.exports = {
  buildSkillsExtractionPrompt,
  buildGapAnalysisPrompt,
  buildRewritePrompt,
  buildInterviewQuestionsPrompt
}