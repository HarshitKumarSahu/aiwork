import { prompts } from './data.js';
// console.log(prompts)

const surpriseBtn = document.getElementById('surpriseBtn');
const imagePromptInput = document.getElementById('imagePrompt');

surpriseBtn.addEventListener('click', () => {
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  imagePromptInput.value = randomPrompt;
});