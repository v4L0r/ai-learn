// server/services/aiService.js
const { queryPoe } = require('../utils/poe');

// ============ COURSE PLAN ============

async function generateCoursePlan(topic) {
  const prompt = `You are an expert curriculum designer. Given the topic below, create a structured course plan.

Topic: "${topic}"

Respond ONLY with valid JSON — no markdown fences, no extra text:
{
  "title": "Course title",
  "description": "A 1-2 sentence course description",
  "chapters": [
    { "title": "Chapter title", "description": "Brief description of what this chapter covers", "order": 1 }
  ]
}

Create 5-8 chapters that progressively build understanding from basics to advanced concepts.`;

  let raw = await queryPoe(prompt);
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let plan;
  try {
    plan = JSON.parse(raw);
  } catch (e) {
    console.error('[COURSE PLAN] JSON parse failed:', e.message);
    console.error('[COURSE PLAN] Raw response:', raw.substring(0, 500));
    plan = {
      title: topic,
      description: `A course about ${topic}`,
      chapters: [
        { title: 'Introduction to ' + topic, description: 'Overview and fundamentals', order: 1 },
        { title: 'Core Concepts', description: 'Key ideas and principles', order: 2 },
        { title: 'Advanced Topics', description: 'Deeper exploration', order: 3 },
      ],
    };
  }

  return plan;
}

// ============ CHAPTER CONTENT (with personalisation + difficulty) ============

async function generateChapterContent(courseTitle, chapterTitle, chapterDescription, learnerProfile = null, difficulty = 'intermediate') {
  let personalization = '';

  if (learnerProfile && learnerProfile.notes) {
    personalization = `

IMPORTANT — Personalise this content based on the student's learning profile from previous chapters:
- Comprehension level: ${learnerProfile.comprehension || 'medium'}
- They struggled with: ${(learnerProfile.struggles || []).join(', ') || 'nothing specific'}
- They are strong at: ${(learnerProfile.strengths || []).join(', ') || 'nothing specific'}
- Learning style preference: ${learnerProfile.preferredStyle || 'no preference detected'}
- Pace: ${learnerProfile.pace || 'moderate'}
- Instructor notes: ${learnerProfile.notes}

Adjust the depth, number of examples, and tone accordingly. If they struggled with prerequisite concepts, briefly revisit them. If they are fast learners, go deeper and add nuance.`;
  }

  let difficultyGuide = '';
  switch (difficulty) {
    case 'beginner':
      difficultyGuide = `
DIFFICULTY LEVEL: Beginner
- Use simple, everyday language — avoid jargon or define it immediately when first introduced
- Include plenty of analogies and real-world examples to ground abstract ideas
- Break concepts into small, digestible steps — never assume prior knowledge
- Prioritise approachability and clarity over completeness
- Aim for around 600 words`;
      break;
    case 'advanced':
      difficultyGuide = `
DIFFICULTY LEVEL: Advanced
- Assume the reader has solid foundational knowledge — skip obvious basics
- Use precise technical terminology without over-explaining standard terms
- Explore edge cases, nuances, trade-offs, and deeper implications
- Reference connections to related advanced topics where relevant
- Aim for around 900-1000 words with greater depth`;
      break;
    default:
      difficultyGuide = `
DIFFICULTY LEVEL: Intermediate
- Balance clarity with depth — explain concepts thoroughly but efficiently
- Introduce technical terms with brief explanations on first use
- Include a mix of straightforward and moderately complex examples
- Aim for around 700-800 words`;
      break;
  }

  const prompt = `You are an expert educator creating a lesson for an online course.

Course: "${courseTitle}"
Chapter: "${chapterTitle}"
Brief: ${chapterDescription}
${difficultyGuide}
${personalization}

Write comprehensive educational content in Markdown. Include:
- Clear explanations of every key concept
- Real-world examples or analogies
- A short recap / key-takeaways section at the end

Use ## and ### headings, **bold**, bullet points, and code blocks where appropriate.`;

  const content = await queryPoe(prompt);
  return content;
}

// ============ INTERACTIVE WIDGET ============

async function generateInteractiveWidget(courseTitle, chapterTitle, chapterContent) {
  const prompt = `You are an expert educational technologist who creates interactive HTML learning widgets.

Based on this lesson, create ONE focused interactive widget that helps the learner deeply understand a core concept through hands-on exploration.

Course: "${courseTitle}"
Chapter: "${chapterTitle}"

Lesson excerpt:
${chapterContent.substring(0, 3000)}

STRICT REQUIREMENTS:
1. Return ONLY a complete HTML document starting with <!DOCTYPE html>
2. Do NOT wrap your response in markdown code fences — return raw HTML only
3. ALL styles in a <style> tag, ALL scripts in a <script> tag
4. ZERO external dependencies — no CDNs, no imports, no external fonts, no images
5. Must be interactive: use event listeners, sliders, buttons, inputs, or clickable elements
6. Clean modern design: white (#ffffff) background, system font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif), rounded corners, subtle box-shadows
7. Fully responsive — works from 320px to 800px width
8. Include a clear title and a one-line instruction so the learner knows what to do
9. Total HTML must be under 150 lines
10. Use colour meaningfully: blue (#4F46E5) for interactive elements, green (#059669) for correct/positive, red (#DC2626) for incorrect, gray (#6B7280) for secondary text

Choose the BEST format for this specific concept:
- Slider/knob showing cause-and-effect (e.g., adjusting a variable and seeing live results)
- Step-by-step reveal (click "Next" to walk through a process)
- Flashcards that flip on click to reveal definitions or answers
- Mini calculator or formula explorer with live output
- Interactive diagram with clickable hotspots that show explanations
- Fill-in-the-blank or matching exercise with instant feedback
- Visual comparison (toggle between two states)

Focus on making ONE concept truly interactive and educational. The widget should teach, not just decorate.`;

  let raw = await queryPoe(prompt);

  // Strip markdown fences if the AI wrapped them
  raw = raw.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();

  // Try to find the start of valid HTML if there's preamble text
  const doctypeIndex = raw.indexOf('<!DOCTYPE');
  const htmlIndex = raw.indexOf('<html');
  const startIndex = doctypeIndex !== -1 ? doctypeIndex : htmlIndex;
  if (startIndex > 0) {
    raw = raw.substring(startIndex);
  }

  console.log('[INTERACTIVE] Generated widget, length:', raw.length);
  return raw;
}

// ============ QUIZ ============

async function generateQuiz(courseTitle, chapterTitle, chapterContent) {
  const prompt = `Based on the lesson below, create exactly 5 multiple-choice questions.

Course: "${courseTitle}"
Chapter: "${chapterTitle}"

Lesson content (may be truncated):
${chapterContent.substring(0, 3000)}

Respond ONLY with valid JSON — no markdown fences, no extra text:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0
  }
]
correctIndex = zero-based index of the correct option.`;

  let raw = await queryPoe(prompt);
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let questions = [];
  try {
    questions = JSON.parse(raw);
  } catch (e) {
    console.error('[QUIZ] JSON parse failed:', e.message);
    console.error('[QUIZ] Raw response:', raw.substring(0, 500));
  }

  return questions;
}

// ============ AI TUTOR CHAT ============

async function generateTutorResponse(courseTitle, chapterTitle, chapterContent, chatHistory, userMessage) {
  const historyText = chatHistory
    .map((msg) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
    .join('\n\n');

  const prompt = `You are a friendly, adaptive AI tutor helping a student learn about "${chapterTitle}" in the course "${courseTitle}".

Here is the chapter content the student has been studying:
${chapterContent.substring(0, 4000)}

Your role:
- Answer questions about the material clearly and accurately
- Ask probing follow-up questions to gauge understanding
- Provide additional examples or analogies if the student seems confused
- Be encouraging but honest about misconceptions
- Keep responses concise (2-3 paragraphs max)
- Do NOT give quiz answers directly — guide them to the answer instead

${historyText ? `Conversation so far:\n${historyText}\n\n` : ''}Student: ${userMessage}

Tutor:`;

  const response = await queryPoe(prompt);
  return response;
}

// ============ LEARNER ASSESSMENT ============

async function assessLearner(courseTitle, chapterTitle, chatHistory) {
  const historyText = chatHistory
    .map((msg) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
    .join('\n\n');

  const prompt = `You are an educational assessment AI. Based on the tutoring conversation below, analyse the student's learning profile for this chapter.

Course: "${courseTitle}"
Chapter: "${chapterTitle}"

Conversation:
${historyText}

Respond ONLY with valid JSON — no markdown fences, no extra text:
{
  "comprehension": "low" or "medium" or "high",
  "struggles": ["specific topic or concept they struggled with"],
  "strengths": ["specific topic or concept they understood well"],
  "preferredStyle": "brief description of how they seem to learn best",
  "pace": "slow" or "moderate" or "fast",
  "notes": "1-2 sentence summary with recommendations for future content"
}`;

  let raw = await queryPoe(prompt);
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let assessment;
  try {
    assessment = JSON.parse(raw);
  } catch (e) {
    console.error('[ASSESS] JSON parse failed:', e.message);
    console.error('[ASSESS] Raw response:', raw.substring(0, 500));
    assessment = {
      comprehension: 'medium',
      struggles: [],
      strengths: [],
      preferredStyle: '',
      pace: 'moderate',
      notes: 'Assessment could not be parsed.',
    };
  }

  return assessment;
}


/**
 * Generate a mixed quiz — 3 MCQ + 2 open-ended (adjustable)
 */
async function generateMixedQuiz(chapterContent, difficulty = 'intermediate', learnerProfile = null) {
  const profileHint = learnerProfile
    ? `\nLearner context — comprehension: ${learnerProfile.comprehension}, ` +
      `struggles: ${(learnerProfile.struggles || []).join(', ') || 'none noted'}, ` +
      `strengths: ${(learnerProfile.strengths || []).join(', ') || 'none noted'}, ` +
      `pace: ${learnerProfile.pace}.`
    : '';

  const prompt = `You are an expert educator. Based on the chapter content below, generate a quiz with exactly 3 multiple-choice questions and 2 open-ended questions.

Difficulty: ${difficulty}${profileHint}

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "questions": [
    {
      "type": "mcq",
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A) ..."
    },
    {
      "type": "open_ended",
      "question": "... (should require a thoughtful paragraph-length answer)",
      "gradingCriteria": "A good answer should cover: 1) ... 2) ... 3) ...",
      "sampleAnswer": "..."
    }
  ]
}

Rules:
- correctAnswer must exactly match one of the options strings.
- Open-ended questions should test deeper understanding, not simple recall.
- gradingCriteria must list the specific points you will look for.
- sampleAnswer should be a model answer (3-5 sentences).

Chapter content:
${chapterContent}`;

  let raw = await queryPoe(prompt);
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error('[MIXED QUIZ] JSON parse failed:', e.message);
    console.error('[MIXED QUIZ] Raw response:', raw.substring(0, 500));
    return [];
  }

  return parsed.questions || [];
}

/**
 * AI-grade a single open-ended student response
 */
async function gradeOpenEndedResponse(question, gradingCriteria, sampleAnswer, studentResponse) {
  const prompt = `You are grading a student's open-ended response. Be fair, rigorous, and constructive.

Question:
${question}

Grading criteria (key points a good answer should cover):
${gradingCriteria}

Reference / sample answer:
${sampleAnswer}

Student's response:
${studentResponse}

Evaluate on three axes:
1. Correctness — Is the answer factually accurate?
2. Completeness — Does it address the key points listed in the grading criteria?
3. Clarity — Is it coherent and well-expressed?

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "score": <integer 0-100>,
  "feedback": "<2-3 sentences: what was good, what was missing or could be improved>"
}`;

  let raw = await queryPoe(prompt);
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error('[GRADE] JSON parse failed:', e.message);
    console.error('[GRADE] Raw response:', raw.substring(0, 500));
    return { score: 0, feedback: 'Grading failed — could not parse AI response.' };
  }

  return {
    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
    feedback: parsed.feedback || 'No feedback available.',
  };
}

module.exports = {
  generateCoursePlan,
  generateChapterContent,
  generateInteractiveWidget,
  generateQuiz,
  generateTutorResponse,
  assessLearner,
  generateMixedQuiz,
  gradeOpenEndedResponse,
};