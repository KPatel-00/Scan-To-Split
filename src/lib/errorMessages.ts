/**
 * Graceful Error Messages - Part 0, Section 5 Voice & Tone
 * ✨ PROMPT 9: Helpful & Reassuring error copy
 * 
 * All error messages follow the blueprint's "witty, reassuring, and human" voice.
 * Instead of technical jargon, we provide context and next steps.
 */

export interface ErrorMessage {
  title: string;
  description: string;
  action?: string;
}

/**
 * Get user-friendly error message for API errors
 */
export function getErrorMessage(error: any): ErrorMessage {
  // Rate limit errors (429)
  if (error?.status === 429 || error?.message?.includes('rate limit')) {
    return {
      title: "Looks like we're popular! 🎉",
      description: "We've hit our scanning limit for the hour. Take a quick break and try again in a bit. Your receipts will still be here!",
      action: "Try again later"
    };
  }

  // Network errors
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return {
      title: "Connection hiccup 📡",
      description: "Can't reach our servers right now. Check your internet connection and give it another shot.",
      action: "Retry"
    };
  }

  // File upload errors
  if (error?.message?.includes('file') || error?.message?.includes('upload')) {
    return {
      title: "File upload issue 📄",
      description: "Something went wrong uploading your receipt. Make sure it's a valid image (JPG or PNG) under 5MB.",
      action: "Try another file"
    };
  }

  // Authentication errors (401/403)
  if (error?.status === 401 || error?.status === 403) {
    return {
      title: "Session expired 🔐",
      description: "For your security, please refresh the page to continue.",
      action: "Refresh page"
    };
  }

  // Server errors (500+)
  if (error?.status >= 500) {
    return {
      title: "Our bad! 😅",
      description: "Something's not quite right on our end. We're on it! Try again in a moment or enter your items manually.",
      action: "Try again"
    };
  }

  // OCR/Scanning errors
  if (error?.message?.includes('OCR') || error?.message?.includes('scan')) {
    return {
      title: "Couldn't read that receipt 🔍",
      description: "The image might be blurry or the receipt format is tricky. Try a clearer photo or add items manually.",
      action: "Add manually"
    };
  }

  // Validation errors
  if (error?.message?.includes('validation') || error?.message?.includes('invalid')) {
    return {
      title: "Oops! Check your input ✏️",
      description: error?.message || "Something doesn't look quite right. Double-check your entries and try again.",
      action: "Fix and retry"
    };
  }

  // Generic fallback with reassuring tone
  return {
    title: "Unexpected hiccup 🤔",
    description: "Something didn't go as planned, but don't worry! Try again or reach out if this keeps happening.",
    action: "Try again"
  };
}

/**
 * Get graceful storage quota error message
 */
export function getStorageQuotaError(): ErrorMessage {
  return {
    title: "Storage almost full 💾",
    description: "You're running low on browser storage. Clear some old sessions or data to free up space.",
    action: "Manage storage"
  };
}

/**
 * Get graceful permission error message
 */
export function getPermissionError(permission: 'camera' | 'storage' | 'location'): ErrorMessage {
  const permissionNames = {
    camera: 'camera',
    storage: 'storage',
    location: 'location'
  };

  return {
    title: `Need ${permissionNames[permission]} access 📸`,
    description: `To use this feature, please allow ${permissionNames[permission]} access in your browser settings.`,
    action: "Check settings"
  };
}

/**
 * Get graceful timeout error message
 */
export function getTimeoutError(): ErrorMessage {
  return {
    title: "Taking longer than expected ⏱️",
    description: "This is taking a while. Your internet might be slow, or the receipt is complex. Want to try again or add items manually?",
    action: "Try again"
  };
}
