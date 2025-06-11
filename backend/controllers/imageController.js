import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_API_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const verifyImage = async (req, res) => {
  try {
    console.log('Starting image verification...');
    
    if (!req.file) {
      console.log('No file provided in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // Process image with OpenRouter API
    const verificationResult = await verifyImageWithOpenRouter(dataUrl);
    
    console.log('Verification completed successfully:', verificationResult);

    res.status(200).json({
      message: 'Image verified successfully',
      imageUri: dataUrl,
      verificationResult
    });
    console.log('Backend sending imageUri:', dataUrl);
  } catch (error) {
    console.error('Verification Error Details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: error.message || 'Failed to verify image',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const verifyImageUrl = async (req, res) => {
  try {
    console.log('Starting image URL verification...');
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      console.log('No image URL provided');
      return res.status(400).json({ error: 'No image URL provided' });
    }

    console.log('Image URL received:', imageUrl);
    const verificationResult = await verifyImageWithOpenRouter(imageUrl);
    
    console.log('URL verification completed successfully:', verificationResult);
    res.status(200).json({
      message: 'Image verified successfully',
      imageUri: imageUrl,
      verificationResult
    });
  } catch (error) {
    console.error('URL Verification Error Details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const verifyImageWithOpenRouter = async (imageData) => {
  try {
    console.log('Processing image with OpenRouter...');
    
    // Validate environment variables
    if (!process.env.OPENROUTER_API_URL || !process.env.OPENROUTER_API_KEY) {
      throw new Error('Missing OpenRouter API configuration. Please check OPENROUTER_API_URL and OPENROUTER_API_KEY environment variables.');
    }

    // If the imageData is a base64 string, convert it to a proper data URL
    const imageUrl = imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`;

    console.log("Sending request to AI model...");
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-05-20",
      messages: [
        {
          role: "system",
          content: "You are a product authenticity verification expert. Always provide a complete analysis with a numerical score and specific flags. Be thorough and detailed in your response."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this product image for authenticity and provide a verification report in this exact format:

Authenticity Score: [number between 0-100]

Discrepancy Flags:
- [flag 1 if any issues found]
- [flag 2 if any issues found]
- [flag 3 if any issues found]

Detailed Analysis:
[Provide a comprehensive analysis of the product's authenticity, examining details like logos, text quality, materials, packaging, overall quality, and any suspicious elements. Be specific about what you observe.]

If the product appears authentic, still provide the score and mention "No significant discrepancies detected" for the flags section.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Invalid response from AI model');
    }

    console.log("Raw AI response:", response.choices[0].message.content);
    
    // Parse the text response
    const analysis = response.choices[0].message.content;
    
    if (!analysis || analysis.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }
    
    // Extract authenticity score using multiple patterns
    const scorePatterns = [
      /authenticity score:?\s*(\d+)/i,
      /score:?\s*(\d+)/i,
      /(\d+)\s*%?\s*authenticity/i,
      /(\d+)\s*%?\s*score/i,
      /(\d+)\s*out of 100/i,
      /(\d+)\/100/i
    ];
    
    let matchPercentage = 0;
    for (const pattern of scorePatterns) {
      const match = analysis.match(pattern);
      if (match) {
        matchPercentage = parseInt(match[1]);
        break;
      }
    }
    
    console.log("Extracted score:", matchPercentage);

    // Extract discrepancy flags with improved pattern matching
    const flagsSection = analysis.match(/discrepancy flags:?\s*([\s\S]*?)(?=detailed analysis|$)/i) ||
                        analysis.match(/flags:?\s*([\s\S]*?)(?=detailed analysis|$)/i);
    
    console.log("Flags section found:", !!flagsSection);
    
    let discrepancyFlags = [];
    if (flagsSection && flagsSection[1]) {
      // Extract flags from bullet points or numbered list
      const flagText = flagsSection[1].trim();
      
      if (flagText.toLowerCase().includes('no significant') || 
          flagText.toLowerCase().includes('none detected') ||
          flagText.toLowerCase().includes('no discrepancies')) {
        discrepancyFlags = [];
      } else {
        const flagMatches = flagText.match(/[-*•]\s*([^\n]+)/g) || 
                           flagText.match(/\d+\.\s*([^\n]+)/g) ||
                           flagText.split('\n').filter(line => line.trim().length > 0);
        
        if (flagMatches) {
          discrepancyFlags = flagMatches
            .map(flag => flag.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
            .filter(flag => flag.length > 5) // Filter out very short flags
            .slice(0, 5); // Limit to 5 flags max
        }
      }
    }

    // Get the detailed analysis section
    const analysisSection = analysis.match(/detailed analysis:?\s*([\s\S]*?)$/i);
    const detailedAnalysis = analysisSection ? analysisSection[1].trim() : 
                            analysis.split('Detailed Analysis:')[1]?.trim() || 
                            analysis;

    console.log("Parsed results:", {
      matchPercentage,
      discrepancyFlags: discrepancyFlags.length,
      analysisLength: detailedAnalysis.length
    });

    // Provide fallback values if parsing failed
    if (matchPercentage === 0) {
      console.log('Score extraction failed, using fallback logic');
      // Try to infer from content
      if (analysis.toLowerCase().includes('authentic') && !analysis.toLowerCase().includes('not authentic')) {
        matchPercentage = 75;
      } else if (analysis.toLowerCase().includes('fake') || analysis.toLowerCase().includes('counterfeit')) {
        matchPercentage = 25;
      } else {
        matchPercentage = 50; // Neutral fallback
      }
    }

    const finalResult = {
      matchPercentage: Math.max(0, Math.min(100, matchPercentage)), // Ensure 0-100 range
      discrepancyFlags,
      analysis: detailedAnalysis || 'Analysis completed successfully.',
      timestamp: new Date().toISOString(),
      rawResponse: analysis // Include raw response for debugging
    };

    console.log("Final verification result:", finalResult);
    return finalResult;
    
  } catch (error) {
    console.error('OpenRouter API error details:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    
    // Return a meaningful fallback response instead of throwing
    return {
      matchPercentage: 0,
      discrepancyFlags: ['API Error: Unable to complete verification'],
      analysis: `Verification failed due to: ${error.message}. Please try again or contact support if the issue persists.`,
      timestamp: new Date().toISOString(),
      error: true
    };
  }
};