import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => props.theme.text};
    font-family: "Cairo", sans-serif;
    background-color: ${props => props.theme.background};
  }
`;
 
export default GlobalStyle;