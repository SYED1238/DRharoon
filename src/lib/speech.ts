export interface SpeechOptions {
  lang?: 'en' | 'hi' | 'kn';
  volume?: number; // 0 to 1
  rate?: number;   // 0.8 to 1.2
}

export function formatTokenForSpeech(tokenNumber: string, lang: 'en' | 'hi' | 'kn' = 'en'): string {
  // Convert "A-104" or "A104" to spaced phonetics: "A, one, zero, four"
  const clean = tokenNumber.replace('-', ' ');
  const parts = clean.split('');
  
  if (lang === 'hi') {
    // Hindi translation of digits
    const hindiDigits: Record<string, string> = {
      '0': 'शून्य',
      '1': 'एक',
      '2': 'दो',
      '3': 'तीन',
      '4': 'चार',
      '5': 'पाँच',
      '6': 'छह',
      '7': 'सात',
      '8': 'आठ',
      '9': 'नौ',
    };
    const spoken = parts.map(p => hindiDigits[p] || p).join(' ');
    return spoken;
  }

  if (lang === 'kn') {
    // Kannada digits
    const knDigits: Record<string, string> = {
      '0': 'ಸೊನ್ನೆ',
      '1': 'ಒಂದು',
      '2': 'ಎರಡು',
      '3': 'ಮೂರು',
      '4': 'ನಾಲ್ಕು',
      '5': 'ಐದು',
      '6': 'ಆರು',
      '7': 'ಏಳು',
      '8': 'ಎಂಟು',
      '9': 'ಒಂಬತ್ತು',
    };
    const spoken = parts.map(p => knDigits[p] || p).join(' ');
    return spoken;
  }

  // English fallback: "A, one zero four"
  return parts.join(' ');
}

export function announceToken(
  tokenNumber: string,
  roomName: string = "Doctor's Consultation Room",
  options: SpeechOptions = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.log(`[SpeechSynthesis not supported]: Token ${tokenNumber} called for ${roomName}`);
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const lang = options.lang || 'en';
    const volume = options.volume !== undefined ? options.volume : 1.0;
    const rate = options.rate !== undefined ? options.rate : 0.92;

    const formattedToken = formatTokenForSpeech(tokenNumber, lang);
    let speechText = '';

    if (lang === 'hi') {
      speechText = `टोकन संख्या ${formattedToken}, कृपया ${roomName} में पधारें।`;
    } else if (lang === 'kn') {
      speechText = `ಟೋಕನ್ ಸಂಖ್ಯೆ ${formattedToken}, ದಯವಿಟ್ಟು ${roomName} ಗೆ ಬನ್ನಿ.`;
    } else {
      speechText = `Token number ${formattedToken}, please proceed to ${roomName}.`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const langPrefix = lang === 'hi' ? 'hi' : lang === 'kn' ? 'kn' : 'en';
      const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) ||
        voices.find(v => v.lang.toLowerCase().startsWith('en'));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Error invoking speech synthesis:', err);
  }
}
