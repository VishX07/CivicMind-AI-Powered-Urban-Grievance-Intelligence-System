import axios from 'axios';

const callAIService = async (description, imageUrl) => {
  try {
    const response = await axios.post(
      process.env.AI_SERVICE_URL,
      {
        complaint_text: description,
      },
      {
        timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 10000,
      },
    );

    const { category, priority } = response.data;
    console.log('AI RAW RESPONSE:', response.data);

    const validCategories = [
      'Water Supply',
      'Road Damage',
      'Public Property Damage',
      'Electricity Issue',
      'Illegal Construction',
      'Drainage Issue',
      'Street Lights',
      'Garbage Collection',
      'Encroachment',
      'Noise Pollution',
      'Stray Animals',
      'Tree Related',
      'Waste Management',
      'Sanitation',
      'Others',
    ];

    const validatedCategory = validCategories.includes(category)
      ? category
      : 'Others';

    const clampedPriority = Math.min(Math.max(priority, 1), 10);

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
