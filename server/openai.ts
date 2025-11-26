import OpenAI from "openai";
import type { 
  FortuneInput, 
  FortuneResult,
  PersonalityAnalysis,
  CareerAnalysis,
  DailyFortune,
  FaceReadingAnalysis,
  ZiWeiAnalysis,
  HumanDesignAnalysis,
  AstrologyAnalysis,
  IChing
} from "@shared/schema";

// Using gpt-4o for reliable availability
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getZodiacSign(month: number, day: number): string {
  const signs = [
    { name: "摩羯座", start: [12, 22], end: [1, 19] },
    { name: "水瓶座", start: [1, 20], end: [2, 18] },
    { name: "雙魚座", start: [2, 19], end: [3, 20] },
    { name: "牡羊座", start: [3, 21], end: [4, 19] },
    { name: "金牛座", start: [4, 20], end: [5, 20] },
    { name: "雙子座", start: [5, 21], end: [6, 20] },
    { name: "巨蟹座", start: [6, 21], end: [7, 22] },
    { name: "獅子座", start: [7, 23], end: [8, 22] },
    { name: "處女座", start: [8, 23], end: [9, 22] },
    { name: "天秤座", start: [9, 23], end: [10, 22] },
    { name: "天蠍座", start: [10, 23], end: [11, 21] },
    { name: "射手座", start: [11, 22], end: [12, 21] },
  ];

  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return sign.name;
      }
    } else if (startMonth > endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    }
  }
  
  return "摩羯座";
}

export async function analyzeFortuneWithAI(input: FortuneInput): Promise<FortuneResult> {
  const zodiacSign = getZodiacSign(input.birthMonth, input.birthDay);
  const today = new Date().toLocaleDateString("zh-TW");
  
  const birthInfo = `
姓名：${input.name}
出生日期：${input.birthYear}年${input.birthMonth}月${input.birthDay}日
性別：${input.gender === "male" ? "男" : input.gender === "female" ? "女" : "其他"}
${input.birthHour !== undefined ? `出生時間：${input.birthHour}時${input.birthMinute || 0}分` : ""}
${input.birthPlace ? `出生地：${input.birthPlace}` : ""}
${input.currentLocation ? `現居地：${input.currentLocation}` : ""}
太陽星座：${zodiacSign}
今日日期：${today}
`;

  const systemPrompt = `你是一位精通東西方命理的大師，擅長西洋占星術、人類圖、紫微斗數、面相學和易經。
請根據提供的個人資料進行全面的命理分析。
回應必須使用繁體中文，並以 JSON 格式輸出。
分析要具體、有深度，但語氣要親切易懂。
幸運號碼應該給出6個1-49之間的數字（台灣樂透格式）。
幸運顏色從以下選擇：紅色、橙色、黃色、綠色、藍色、紫色、粉色、白色、黑色、金色、銀色、米色、棕色、灰色`;

  const analysisPrompt = `請為以下人士進行完整的命理分析：

${birthInfo}

請以 JSON 格式回應，包含以下結構：
{
  "personality": {
    "traits": ["特質1", "特質2", "特質3", "特質4", "特質5"],
    "strengths": ["優點1", "優點2", "優點3"],
    "weaknesses": ["需注意1", "需注意2", "需注意3"],
    "description": "200字左右的性格綜合描述"
  },
  "career": {
    "suitableFields": ["適合領域1", "適合領域2", "適合領域3", "適合領域4"],
    "avoidFields": ["需謹慎領域1", "需謹慎領域2"],
    "advice": "150字左右的職業發展建議"
  },
  "dailyFortune": {
    "luckyColors": ["顏色1", "顏色2"],
    "luckyNumbers": [數字1, 數字2, 數字3, 數字4, 數字5, 數字6],
    "overallFortune": "100字左右的今日整體運勢",
    "advice": "50字左右的今日行動建議"
  },
  "ziWei": {
    "mainStar": "命宮主星名稱",
    "palace": "命宮名稱",
    "interpretation": "100字左右的紫微斗數解讀"
  },
  "humanDesign": {
    "type": "人類圖類型（生產者/投射者/顯示者/反映者/顯示生產者之一）",
    "strategy": "人生策略",
    "authority": "內在權威",
    "description": "100字左右的人類圖解讀"
  },
  "astrology": {
    "zodiacSign": "${zodiacSign}",
    "moonSign": "可能的月亮星座",
    "risingSign": "可能的上升星座",
    "interpretation": "100字左右的星盤解讀"
  },
  "iChing": {
    "hexagram": "卦象符號（如☰）",
    "hexagramName": "卦名（如乾卦）",
    "interpretation": "100字左右的易經解讀",
    "advice": "卦辭或爻辭建議"
  }
}`;

  try {
    console.log("Starting AI analysis for:", input.name);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: analysisPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4096,
    });
    console.log("AI analysis completed for:", input.name);

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const analysis = JSON.parse(content);

    const result: FortuneResult = {
      id: crypto.randomUUID(),
      input,
      personality: analysis.personality as PersonalityAnalysis,
      career: analysis.career as CareerAnalysis,
      dailyFortune: analysis.dailyFortune as DailyFortune,
      ziWei: analysis.ziWei as ZiWeiAnalysis,
      humanDesign: analysis.humanDesign as HumanDesignAnalysis,
      astrology: analysis.astrology as AstrologyAnalysis,
      iChing: analysis.iChing as IChing,
      generatedAt: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    console.error("AI analysis error:", error);
    throw error;
  }
}

export async function analyzeFaceWithAI(base64Image: string): Promise<FaceReadingAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `你是一位精通面相學的大師。請分析照片中人物的面相特徵，並提供面相解讀。
回應必須使用繁體中文，並以 JSON 格式輸出。
分析要專業但語氣親切，著重於正面特質的描述。`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `請分析這張照片中的面相，以 JSON 格式回應：
{
  "features": ["面相特徵1", "面相特徵2", "面相特徵3", "面相特徵4", "面相特徵5"],
  "interpretation": "200字左右的面相綜合解讀，包含運勢和性格分析"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    return JSON.parse(content) as FaceReadingAnalysis;
  } catch (error) {
    console.error("Face analysis error:", error);
    return {
      features: ["面相分析暫時無法使用"],
      interpretation: "抱歉，面相分析功能目前暫時無法使用，請稍後再試。"
    };
  }
}
