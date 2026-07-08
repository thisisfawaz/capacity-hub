/**
 * Centralized AI Service for CapacityHub
 * Handles both simulated response for testing and live integration
 * with the backend DeepSeek API.
 */

export async function askAIAssistant(messages) {
  // If the user triggers it, try to fetch from the local API route
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    // If it's a 400 meaning key is missing, return fallback simulation
    if (response.status === 400) {
      return {
        success: true,
        message: "I am the CapacityHub AI Assistant powered by DeepSeek. I can help you draft proposals and check eligibility. (To activate live responses, rename .env.example to .env and configure your DEEPSEEK_API_KEY)."
      };
    }

    if (!response.ok) {
      throw new Error(data.message || "Unknown error occurred calling DeepSeek");
    }

    return data;
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      success: false,
      message: `Error connecting to AI assistant: ${error.message}`
    };
  }
}
