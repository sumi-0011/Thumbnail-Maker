// theme.ts
export const darkTheme = {
  colors: {
    background: {
      primary: "#1D2027",
      secondary: "#252832",
      tertiary: "#2A2F3A",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A0AEC0",
      accent: "#7371FC",
    },
    accent: {
      primary: "#7371FC",
      secondary: "#463DFF",
      success: "#10B981",
      warning: "#F59E0B",
    },
    gradient: {
      primary: "linear-gradient(135deg, #7371FC 0%, #463DFF 100%)",
      secondary: "linear-gradient(225deg, #463DFF 0%, #252832 100%)",
      glow: "linear-gradient(180deg, rgba(115, 113, 252, 0.2) 0%, rgba(115, 113, 252, 0) 100%)",
    },
  },
  shadows: {
    sm: "0 2px 4px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.5)",
    glow: "0 0 20px rgba(115, 113, 252, 0.3)",
  },
};
