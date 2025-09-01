/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from '@google/genai';

// Note: In a real app, you should handle the API key more securely
// and not expose it in client-side code. For this example, we are
// using an environment variable that should be configured in the build
// process.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const form = document.getElementById('prompt-form') as HTMLFormElement;
const input = document.getElementById('prompt-input') as HTMLTextAreaElement;
const output = document.getElementById('output') as HTMLDivElement;
const button = document.getElementById('prompt-button') as HTMLButtonElement;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = input.value;

  if (!prompt) {
    output.textContent = 'Please enter a prompt.';
    return;
  }

  output.textContent = '';
  button.disabled = true;
  button.textContent = 'Generating...';

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    for await (const chunk of response) {
      // Use innerText to prevent potential XSS from formatted text
      output.innerText += chunk.text;
    }
  } catch (error) {
    console.error(error);
    output.textContent = `Error: ${error.message}`;
  } finally {
    button.disabled = false;
    button.textContent = 'Generate';
    input.value = ''; // Clear input after submission
  }
});
