const { askAIForJSON } = require('./aiService')
const {
  buildSkillsExtractionPrompt,
  buildGapAnalysisPrompt,
  buildRewritePrompt,
  buildInterviewQuestionsPrompt
} = require('./prompts')

async function runAnalysisAgent(resumeText, jobDescription) {

  console.log('🤖 Step 1: Extracting skills + strengths...')
  let skillsResult
  try {
    const skillsPrompt = buildSkillsExtractionPrompt(resumeText, jobDescription)
    skillsResult = await askAIForJSON(skillsPrompt)
  } catch (err) {
    console.error('Step 1 failed:', err.message)
    throw new Error('AI failed to extract skills. Please try again in a moment.')
  }

  console.log('🤖 Step 2: Match score + interview focus areas...')
  let gapResult
  try {
    const gapPrompt = buildGapAnalysisPrompt(skillsResult.resumeSkills, skillsResult.requiredSkills)
    gapResult = await askAIForJSON(gapPrompt)
  } catch (err) {
    console.error('Step 2 failed:', err.message)
    throw new Error('AI failed to analyze skill gaps. Please try again in a moment.')
  }

  console.log('🤖 Step 3: Rewrites + project talking points...')
  let rewriteResult
  try {
    const rewritePrompt = buildRewritePrompt(resumeText, jobDescription)
    rewriteResult = await askAIForJSON(rewritePrompt)
  } catch (err) {
    console.error('Step 3 failed:', err.message)
    throw new Error('AI failed to generate rewrites. Please try again in a moment.')
  }

  console.log('🤖 Step 4: Interview questions...')
  let questionsResult
  try {
    const questionsPrompt = buildInterviewQuestionsPrompt(resumeText, jobDescription)
    questionsResult = await askAIForJSON(questionsPrompt)
  } catch (err) {
    console.error('Step 4 failed:', err.message)
    throw new Error('AI failed to generate interview questions. Please try again in a moment.')
  }

  console.log('✅ Agent pipeline complete!')

  return {
    matchScore: gapResult.matchScore || 0,
    topStrengths: skillsResult.topStrengths || [],
    matchedSkills: gapResult.matchedSkills || [],
    missingSkills: gapResult.missingSkills || [],
    interviewFocusAreas: gapResult.interviewFocusAreas || [],
    rewrites: rewriteResult.rewrites || [],
    projectTalkingPoints: rewriteResult.projectTalkingPoints || [],
    interviewQuestions: questionsResult.questions || []
  }
}

module.exports = { runAnalysisAgent }