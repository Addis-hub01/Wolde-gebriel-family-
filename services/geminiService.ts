import { GoogleGenAI } from "@google/genai";
import { FamilyMember } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set securely.
const ai = new GoogleGenAI({ apiKey });

export const askFamilyHistorian = async (
  question: string,
  familyData: FamilyMember[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment variable.";
  }

  // Create a context string from the family data
  const context = JSON.stringify(familyData.map(m => ({
    name: `${m.firstName} ${m.lastName}`,
    born: m.birthDate,
    died: m.deathDate,
    location: m.location,
    id: m.id,
    parentId: m.parentId,
    bio: m.bio
  })));

  const prompt = `
    You are the 'Family Archivist' for the Wolde Gebriel family.
    Here is the family tree data in JSON format:
    ${context}

    Please answer the following question from a family member based ONLY on the data provided above.
    If the answer isn't in the data, politely say you don't know but encourage them to add that information to the tree.
    Be warm, respectful, and celebratory of the family history.

    User Question: "${question}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "I couldn't find an answer to that in our records.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble accessing the archives right now. Please try again later.";
  }
};
