/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const dangerRed = "#EF4444";
const dangerRedDark = "#F87171";

const primaryGreen = "#0BB45E";     // main brand color
const primaryGreenTint = "#16C06C"; // lighter/muted tint
const secondaryGreen = "#13A354";   // for hover, accents, or active states

export const Colors = {
  light: {
    text: "#11181C",              // default text
    textSecondary: "#4B5563",     // subtitles, small labels
    background: "#FFFFFF",        // app background
    card: "#F9FAFB",              // cards, modals, sheets
    border: "#E5E7EB",            // borders, dividers
    tint: primaryGreen,           // main brand color
    tintLight: primaryGreenTint,  // lighter/muted accent
    icon: "#687076",              // default icons
    tabIconDefault: "#687076",    // inactive tab icons
    tabIconSelected: primaryGreen, // active tab icon
    buttonPrimary: primaryGreen,   // primary buttons
    buttonSecondary: "#E5E7EB",    // secondary buttons
    placeholder: "#9CA3AF",        // input placeholders
    shadow: "rgba(0,0,0,0.1)",     // subtle shadows
    danger: dangerRed               //for danger
  },

  dark: {
    text: "#ECEDEE",               // default text
    textSecondary: "#9BA1A6",      // subtitles, secondary
    background: "#151718",         // app background
    card: "#1F2224",               // cards, modals
    border: "#374151",             // borders, dividers
    tint: primaryGreen,            // main brand color
    tintLight: primaryGreenTint,   // lighter/muted accent
    icon: "#9BA1A6",               // default icons
    tabIconDefault: "#9BA1A6",     // inactive tab icons
    tabIconSelected: primaryGreen, // active tab icon
    buttonPrimary: primaryGreen,   // primary buttons
    buttonSecondary: "#374151",    // secondary buttons
    placeholder: "#6B7280",        // input placeholders
    shadow: "rgba(0,0,0,0.5)",     // darker shadows
    danger: dangerRedDark          //danger for errors and the rest
  },
};

