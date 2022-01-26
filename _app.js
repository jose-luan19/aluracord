//Criação de uma tag de estilos global
function GlobalStyle() {
    return (
        <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;

      }
      body {
        font-family: 'Open Sans', sans-serif;
      }
      /* App fit Height */ 
      html, body, #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      /* ./App fit Height */ 
    `}</style>
    );
}


//Arquivo default e raiz da minha aplicação, onde todas as pages terão esse padrão inicial
export default function App({ Component, pageProps }) {
    console.log('Roda em todas as páginas');
    return (
        <>
            {/* <GlobalStyle/> */}
            <Component {...pageProps} />
        </>
    );
}