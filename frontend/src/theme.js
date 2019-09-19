import { createMuiTheme } from "@material-ui/core";
// reference this palette in your component within makeStyles with theme.palette
export default createMuiTheme({
  palette: {
    common: {
      black: "#000",
      white: "#FFF"
    },
    background: {
      paper: "#FFF",
      dark: "#222222",
      default: "#FAFAFA",
      react: "#282c34"
    },
    primary: {
      light: "#F25C16",
      main: "#DD3826",
      contrastText: "#FFF"
    },
    secondary: {
      main: "#009CAD",
      dark: "#018391",
      contrastText: "#FFF"
    },
    error: {
      light: "#F25C16",
      main: "#DD3826",
      contrastText: "#FFF"
    },
    text: {
      primary: "#111C24",
      secondary: "#8C8C8C",
      disabled: "#949494",
      hint: "#757575"
    }
  },
  typography: {
    // this along with giving html font-size 62.5% in index.css allows
    // us to have 1rem == 10px for easier calculation
    // for example, 24px will be equal to 2.4rem, see: https://material-ui.com/customization/typography/#font-size
    htmlFontSize: 10
  },
  // werkt uses a 10px (1rem) grid in their design software so, best to align with them
  spacing: factor => `${1 * factor}rem`
});
