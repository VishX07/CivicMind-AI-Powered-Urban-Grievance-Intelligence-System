// utils/aiService.js
import axios from 'axios';

const callAIService = async (description, imageUrl) => {
  try {
    const response = await axios.post(
      process.env.AI_SERVICE_URL,
      {
        description,
        imageUrl,
      },
      {
        timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 10000,
      },
    );

    const { category, priority } = response.data;

    const validCategories = [
      'Waste Management',
      'Water Supply',
      'Road Damage',
      'Streetlights',
      'Sanitation',
      'Others',
    ];
    const validatedCategory = validCategories.includes(category)
      ? category
      : 'Others';
    const clampedPriority = Math.min(Math.max(priority, 0), 10);

    return {
      category: validatedCategory,
      priority: clampedPriority,
    };
  } catch (error) {
    console.error('AI Service Error:', error.message);
    return {
      category: 'Others',
      priority: 1,
    };
  }
};

export default callAIService;
