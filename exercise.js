const { chromium } = require('playwright');

// Define test cases: each has input + expected output
const testCases = [
  // True cases (expected matches)
  { input: 'Naan koviluku pogiren', expected: 'நான் கோவிலுக்கு போகிறேன்' },
  { input: 'vanakkam eppadi irukkinga?', expected: 'வணக்கம் எப்படி இருக்கீங்க?' },
  { input: 'nethu OTP varala nu message vandhuduchu', expected: 'நேத்து OTP வரலனு மெசேஜ் வந்துச்சு' },
  { input: 'please enakku oru help pannunga', expected: 'ப்ளீஸ் எனக்கு ஒரு ஹெல்ப் பண்ணுங்க' },
  { input: 'laptop eduthu vaa machan', expected: 'லேப்டாப் எடுத்து வா மச்சான்' },
  { input: 'naan meeting ku join pannuren office la', expected: 'நான் மீட்டிங் கு ஜோஇன் பண்ணுறேன் ஆபீஸ் ல' },
  { input: 'mazhai peiyudhu aana naan velaiku poren', expected: 'மழை பெய்யுது ஆனா நான் வேலைக்கு போறேன்' },
  { input: 'naaliku naan friends ellarum trip porom', expected: 'நாளைக்கு நான் ஃப்ரெண்ட்ஸ் ஓட ட்ரிப் போகுறேன்' },
  { input: 'romba thanks machan neenga help pannirukeenga', expected: 'ரொம்ப தேங்க்ஸ் மச்சான் நீங்க ஹெல்ப் பண்ணிருக்கீங்க' },
  { input: 'naan nethu movie paathen romba nalla irundhuchu', expected: 'நான் நேத்து மூவி பாத்தேன் ரொம்ப நல்லா இருந்துச்சு' },
  { input: 'machi semma jolly today', expected: 'மச்சி செம்ம ஜாலி டுடே' },
  { input: 'Meeting irukku attend pannuviya ?', expected: 'மீட்டிங் இருக்கு அட்டென்ட் பண்ணுவியா ?' },
  { input: 'idhu 2500 rupees ku vanginen 2 kg weight irukku', expected: 'இது 2500 ரூபாய்க்கு வாங்கினேன் 2 kg வெயிட் இருக்கு' },
  { input: 'unga ellarukum vanakkam sollu', expected: 'உங்க எல்லாருக்கும் வணக்கம் சொல்லு' },
  { input: 'super super da idhu', expected: 'சூப்பர் சூப்பர் இது' },  
  { input: 'machi semma jolly today', expected: 'மச்சி செம்ம ஜாலி டுடே' },
  { input: 'naan veetuku poren apparam dinner pannuren', expected: 'நான் வீட்டுக்கு போறேன் அப்புறம் டின்னர் பண்றேன்' },
  { input: 'enakkupasikkudhunga', expected: 'எனக்குபசிக்குதுங்க' },
  { input: 'OTP correct ah irukku', expected: 'OTP கரெக்ட் ஆ இருக்கு' },
  { input: 'late aana naan auto eduthu poren', expected: 'லேட் ஆனா நான் ஆட்டோ எடுத்து போறேன்' },
  { input: 'adhu super da machan full enjoy panninen', expected: 'அத செம்ம டா மச்சான் ஃபுல் என்ஜாய் பண்ணினேன்' },
  { input: 'naan    office   ku    late    aachu', expected: 'நான்     ஆபிஸ்    க்கு     லேட்     ஆச்சு' },
  { input: 'naan office la work panren daily but traffic romba irukku so late aagudhu machi enakku romba pidikkala idhu change pannanum next month ku car vanguren plan irukku Rs 500000 ku around budget irukku please help pannu tips kudunga Zoom la discuss pannalam ?', expected: 'நான் ஆபிஸ் ல வொர்க் பண்றேன் டெய்லி ஆனா ட்ராபிக் ரொம்ப இருக்கு சோ லேட் ஆகுது மச்சி எனக்கு ரொம்ப பிடிக்கல இது சேஞ்ச் பண்ணணும் நெக்ஸ்ட் மன்த் க்கு கார் வாங்குறேன் பிளான் இருக்கு Rs 500000 க்கு அரவுண்ட் பட்ஜெட் இருக்கு' },
       
  // ... add until you have 35 valid cases

  { input: 'Enna bro logic illai', expected: 'என்ன ப்ரோ லாஜிக் இல்லை' }, // wrong mapping
  { input: 'machan idhu venamla da semma waste', expected: 'மச்சான் இது வேணாம்ல டா செம்ம வேஸ்ட்' },  // wrong mapping
  { input: 'idhu venam nu sollu da', expected: 'இது வேணாம்னு சொல்லு ' }, // engine may not match
  { input: 'machan idhu waste venamla boring aachu', expected: 'மச்சான் இது வேஸ்ட் வேணாம்ல போரிங் ஆச்சு' }, // mismatch
  { input: 'Indha system nalla illai', expected: 'இந்த சிஸ்டம் நல்லா இல்லை' },
  { input: 'party 12.00 noon ku irukku aana naan vara maatten', expected: 'பார்ட்டி 12.00 noon க்கு இருக்கு ஆனா நான் வரமாட்டேன்' },
  { input: 'nee varavillaiya ?', expected: 'நீ வரவில்லையா ?' },
  { input: 'xray scan illa machine venam da', expected: 'ஃக்ஸ்ரே ஸ்கேன் இல்ல மெஷின் வேணாம் டா' },
  { input: 'illa illa illa vendaam vendaam machi no no', expected: 'இல்ல இல்ல இல்ல வேண்டாம் வேண்டாம் மச்சி நோ நோ' },
  { input: 'phone illa da OTP varala SMS illa call pannala', expected: 'போன் இல்ல டா OTP வரல SMS இல்ல கால் பண்ணல' },
  
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://tamil.changathi.com/');
  await page.waitForTimeout(2000);

  for (let { input, expected } of testCases) {
    console.log(`\n--- Testing: "${input}" ---`);

    // Clear textarea
    await page.click('#transliterateTextarea');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');

    // Type input
    await page.type('#transliterateTextarea', input, { delay: 100 });
    await page.keyboard.press('Enter');

    // Wait for transliteration
    await page.waitForTimeout(2000);

    // Get output
    const output = await page.inputValue('#transliterateTextarea');

    // Compare with expected
    if (output.trim() === expected.trim()) {
      console.log(`✅ PASS | Input: "${input}" → Output: "${output}"`);
    } else {
      console.log(`❌ FAIL | Input: "${input}" → Output: "${output}" | Expected: "${expected}"`);
    }
  }

  await browser.close();
})();