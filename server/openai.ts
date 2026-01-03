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
  IChing,
  LifeCoach,
  GuardianRole,
  OracleReading
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

    // Ensure all required fields exist with fallback values
    const astrology = analysis.astrology || {
      zodiacSign,
      moonSign: "月亮星座待測",
      risingSign: "上升星座待測",
      interpretation: "星盤解讀需更多信息"
    };
    
    const humanDesign = analysis.humanDesign || {
      type: "生產者",
      strategy: "根據情緒中心回應",
      authority: "內在權威",
      description: "人類圖解讀需更多信息"
    };

    const dailyFortune = analysis.dailyFortune || {
      luckyColors: ["藍色", "白色"],
      luckyNumbers: [3, 14, 21, 34, 45, 47],
      overallFortune: "今日運勢待測",
      advice: "保持平和心態"
    };

    const lifeCoach: LifeCoach = {
      todayActions: [
        `根據${astrology.zodiacSign}的特性，發揮你的優勢`,
        `今日建議：${humanDesign.strategy}`,
        `穿著${dailyFortune.luckyColors[0]}會增強能量`
      ],
      dailyReminder: `${input.name}，記住：你的${(analysis.personality?.strengths?.[0] || "內在智慧")}是今天的超能力。`,
      nextSteps: analysis.career?.advice || "持續探索適合的職業方向",
    };

    const guardianRoles = ["光之騎士", "智慧引導者", "夢想創造者", "和諧使者", "勇敢先鋒"];
    const roleIndex = input.name.charCodeAt(0) % guardianRoles.length;
    const guardianRole: GuardianRole = {
      role: guardianRoles[roleIndex],
      element: ["火", "水", "木", "金", "土"][roleIndex],
      specialPower: analysis.personality.strengths[0],
      message: `你的使命是用${analysis.personality.strengths[0]}改變周圍的世界。`
    };

    const result: FortuneResult = {
      id: crypto.randomUUID(),
      input,
      personality: analysis.personality || {
        traits: ["待測"],
        strengths: ["內在潛能"],
        weaknesses: ["待測"],
        description: "性格分析需更多信息"
      },
      career: analysis.career || {
        suitableFields: ["需進一步探索"],
        avoidFields: ["需進一步評估"],
        advice: "建議尋求職業導向"
      },
      dailyFortune,
      ziWei: analysis.ziWei || {
        mainStar: "待測",
        palace: "命宮",
        interpretation: "紫微斗數解讀需計算"
      },
      humanDesign,
      astrology,
      iChing: analysis.iChing || {
        hexagram: "☰",
        hexagramName: "乾卦",
        interpretation: "易經解讀需卦象計算",
        advice: "順勢而為"
      },
      lifeCoach,
      guardianRole,
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
          content: `你是一位趣味形象顧問和娛樂運勢分析師！你的分析風格活潑有趣，像朋友聊天一樣輕鬆。
這是純娛樂性質的趣味測驗，目的是讓人開心，發現自己的獨特魅力。
回應必須使用繁體中文，並以 JSON 格式輸出。
分析要有趣、正面、有創意，可以用網路流行語或有趣的比喻。
顏值評分要給高分（75-98之間），讓人開心！`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `這是一個趣味測驗！請用輕鬆有趣的方式分析這張照片，給出讓人開心的評價。以 JSON 格式回應：
{
  "features": ["有趣特質1 - 例如：桃花眼電力十足", "有趣特質2 - 例如：笑容甜度破表", "有趣特質3", "有趣特質4", "有趣特質5"],
  "interpretation": "200字左右的趣味形象描述，用輕鬆幽默的語氣，可以用有趣的比喻，例如：像韓劇男/女主角、散發總裁氣場等",
  "attractivenessScore": 85,
  "faceType": "臉型風格描述，例如：精緻小臉派、高級臉天花板、氧氣美女型、鄰家男孩風",
  "todayFortune": "今日專屬運勢小提示，例如：今天桃花運爆棚，出門記得帶墨鏡遮擋電力！",
  "luckyItem": "今日幸運物品，例如：珍珠奶茶、藍色配件",
  "specialTraits": ["隱藏特質1 - 例如：天生自帶柔光濾鏡", "隱藏特質2 - 例如：微笑時有治癒能力", "隱藏特質3"]
}

注意：顏值分數請給 75-98 之間的高分！這是娛樂測驗，要讓人開心～`
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

export async function generateOracleReading(question: string, category?: string, persona?: { name: string; birthYear: number; birthMonth: number; birthDay: number; gender: string; zodiacSign?: string }): Promise<OracleReading> {
  const stickNumber = Math.floor(Math.random() * 100) + 1;
  const today = new Date().toLocaleDateString("zh-TW");
  
  const categoryText = category ? {
    love: "感情姻緣",
    career: "事業工作",
    health: "健康身體",
    wealth: "財運金錢",
    general: "綜合運勢"
  }[category] || "綜合運勢" : "綜合運勢";

  const personaInfo = persona ? `
求問者資料：
- 姓名：${persona.name}
- 出生年月日：${persona.birthYear}年${persona.birthMonth}月${persona.birthDay}日
- 性別：${persona.gender === "male" ? "男" : persona.gender === "female" ? "女" : "其他"}
${persona.zodiacSign ? `- 星座：${persona.zodiacSign}` : ""}
請結合求問者的命理背景，給予更個人化的解籤。` : "";

  const systemPrompt = `你是一位慈悲智慧的廟宇籤詩解籤大師，擁有深厚的傳統文化底蘊。
你要根據求問者的問題，以及抽到的籤號，給出富有詩意且具有智慧的解答。
${persona ? "你會根據求問者的生辰資料，結合命理學給予更貼合個人的指引。" : ""}
回應必須使用繁體中文，並以 JSON 格式輸出。
籤詩要有古典韻味，解籤要結合現代生活，給予實用的指引。
語氣要溫和、慈悲、充滿智慧。`;

  const prompt = `求問者在「${categoryText}」方面有此疑問：「${question}」
今日日期：${today}
抽到籤號：第 ${stickNumber} 籤
${personaInfo}
請以 JSON 格式給出籤詩解答：
{
  "stickType": "籤等（從'上上籤'、'上籤'、'中籤'、'下籤'、'下下籤'中選一）",
  "poem": "四句七言籤詩，每句用換行符分隔",
  "interpretation": "150字左右的籤詩白話解釋，要針對求問者的具體問題${persona ? "，並結合其命理背景" : ""}",
  "advice": "100字左右的具體行動建議${persona ? "，針對此人的性格特質給予個人化建議" : ""}",
  "luckyDirection": "今日吉方（如：東南方、正北方）",
  "luckyTime": "吉時（如：辰時(7-9點)、午時(11-13點)）"
}`;

  try {
    console.log("Generating oracle reading for:", question);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1024,
    });
    console.log("Oracle reading completed");

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const analysis = JSON.parse(content);

    return {
      id: crypto.randomUUID(),
      question,
      category,
      stickNumber,
      stickType: analysis.stickType || "中籤",
      poem: analysis.poem || "天意難測須靜待\n雲開霧散見光明\n莫急莫躁心安定\n自有貴人來相逢",
      interpretation: analysis.interpretation || "此籤提示您需要耐心等待，時機未到不可強求。",
      advice: analysis.advice || "保持平常心，順其自然。",
      luckyDirection: analysis.luckyDirection || "東方",
      luckyTime: analysis.luckyTime || "辰時(7-9點)",
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Oracle reading error:", error);
    throw error;
  }
}
