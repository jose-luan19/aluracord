import Head from "next/head";

//Componente para por o nome na aba do navegador
function IndexPage(props) {

    const texto = props.text || 'Aluracord - DBZ';

    return (
        <Head>
            <title>{texto}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
    );
}

export default IndexPage