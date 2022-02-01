function Titulo(props) {
    //Componente react 
    //Criação de uma tag que recebe como parametro o conteudo de onde ela é chamada
    //Jutando todos as linguagens em um componente HTML, CSS E JS
    // console.log(props)
    const Tag = props.tag || 'h1';
    return (
        //Deixando o codigo mais variavel a partir do parametro props, 
        //para facilitar a manuntenção dele

        <>{/*tag vazia para que seja possivel usar o <style jsx>*/}
            <Tag>{props.children}</Tag>{/*props.children resgada o valor de onde a tag foi usada*/}
            {/*<style jsx>: Estilo de css especifico para essa tag, 
            ele cria uma classe para esse tag e faz toda a associação*/}
            <style jsx>{`
                ${Tag} {
                    color: ${appConfig.theme.colors.neutrals['200']};
                    font-size: 26px;
                    font-weight: 600;
                    
                }
            `}</style>
        </>

    );
}

export default Titulo