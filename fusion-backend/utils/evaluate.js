
import Groq from "groq-sdk";

/* Create Groq only when AI evaluation is requested */
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from the backend .env file.");
  }

  return new Groq({ apiKey });
};

/* KEYWORD EVALUATION */
export const evaluateWithKeywords = (answer, keywords, maxMarks) => {
  let score = 0;

  if (!answer || answer.trim().length < 20) {
    return { marks: 0, feedback: "Answer too short" };
  }

  if (!keywords || keywords.length === 0) {
    return { marks: 0 };
  }

  const lowerAnswer = answer.toLowerCase();

  keywords.forEach((keyword) => {
    if (lowerAnswer.includes(keyword.toLowerCase())) {
      score++;
    }
  });

  let marks = Math.round((score / keywords.length) * maxMarks);
  marks = Math.max(0, Math.min(marks, maxMarks));

  return { marks };
};

/* GROQ AI EVALUATION */
export const evaluateWithAI = async (question, studentAnswer, maxMarks) => {
  try {
    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a strict teacher.

Evaluate the student's answer based on the question.

Question: ${question}
Student Answer: ${studentAnswer}

STRICT RULES:
- Maximum marks: ${maxMarks}
- Give marks strictly out of ${maxMarks}
- DO NOT give full marks unless answer is perfect
- If answer is weak, give low marks
- If average, give medium marks
- If good, give high marks

Feedback Rules:
- Only 3 to 4 bullet points
- Each line starts with "-"
- Each point maximum 10 words
- No paragraph

Return EXACT format:

Marks: X

Feedback:
- point 1
- point 2
- point 3
`,
        },
      ],
    });

    const text =
      response?.choices?.[0]?.message?.content ||
      "Marks: 0\nFeedback:\n- Could not evaluate";

    console.log("AI RAW:", text);

    const marksMatch = text.match(/Marks:\s*(\d+)/i);

    let marks = marksMatch ? parseInt(marksMatch[1], 10) : 0;
    marks = Math.max(0, Math.min(marks, maxMarks));

    const feedbackMatch = text.match(/Feedback:\s*([\s\S]*)/i);

    let feedback = feedbackMatch ? feedbackMatch[1].trim() : "";

    if (!feedback || feedback.length < 5) {
      feedback = [
        "- Answer needs improvement",
        "- Add key concepts",
        "- Use bullet points",
      ].join("\n");
    }

    const clean = feedback
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => (line.startsWith("-") ? line : "- " + line));

    return {
      marks,
      feedback: clean.join("\n"),
    };
  } catch (error) {
    console.error("AI ERROR:", error);

    return {
      marks: 0,
      feedback: "- AI evaluation unavailable\n- Check Groq API configuration\n- Try again later",
    };
  }
};
