
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateThankYouMessage(guestName: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a short, heart-warming, and elegant thank you message for a wedding RSVP from ${guestName}. 
                  The wedding theme is Rustic African Winter with Sunflowers. 
                  Keep it under 60 words. The couple is Jessica and Juan Vorster.`,
      });
      return response.text || "Thank you so much for your RSVP! We can't wait to celebrate with you.";
    } catch (error) {
      console.error("Gemini error:", error);
      return "Thank you for your response! We look forward to seeing you at our wedding.";
    }
  }

  async summarizeGuestbook(messages: string[]): Promise<string> {
    if (messages.length === 0) return "No messages yet.";
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a warm summary of the following wedding guestbook messages for the couple: 
                  ${messages.join('\n')}. 
                  Highlight the common themes of love and well-wishes.`,
      });
      return response.text || "You have received many beautiful messages of love and luck!";
    } catch (error) {
      return "A summary of your beautiful guestbook messages will appear here.";
    }
  }
}

export const geminiService = new GeminiService();
