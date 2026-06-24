const { askAIForJSON } = require('./aiService')
const {
  buildSkillsExtractionPrompt,
  buildGapAnalysisPrompt,
  buildRewritePrompt,
  buildInterviewQuestionsPrompt
} = require('./prompts')

async function runAnalysisAgent(resumeText, jobDescription) {

  console.log('🤖 Step 1: Extracting skills + strengths...')
  const skillsPrompt = buildSkillsExtractionPrompt(resumeText, jobDescription)
  const skillsResult = await askAIForJSON(skillsPrompt)
  // { resumeSkills, requiredSkills, topStrengths }

  console.log('🤖 Step 2: Match score + interview focus areas...')
  const gapPrompt = buildGapAnalysisPrompt(skillsResult.resumeSkills, skillsResult.requiredSkills)
  const gapResult = await askAIForJSON(gapPrompt)
  // { matchScore, matchedSkills, missingSkills, interviewFocusAreas }

  console.log('🤖 Step 3: Rewrites + project talking points...')
  const rewritePrompt = buildRewritePrompt(resumeText, jobDescription)
  const rewriteResult = await askAIForJSON(rewritePrompt)
  // { rewrites, projectTalkingPoints }

  console.log('🤖 Step 4: Interview questions...')
  const questionsPrompt = buildInterviewQuestionsPrompt(resumeText, jobDescription)
  const questionsResult = await askAIForJSON(questionsPrompt)
  // { questions }

  console.log('✅ Agent pipeline complete!')

  return {
    matchScore: gapResult.matchScore,
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