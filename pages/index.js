import appConfig from '../config.json';
import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';

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

//Componente react 
//Criação de uma tag que recebe como parametro o conteudo de onde ela é chamada
//Jutando todos as linguagens em um componente HTML, CSS E JS
function Titulo(props) {
    console.log(props)
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
                    background-color: ${appConfig.theme.colors.neutrals['050']}; 
                    border-radius: 5px;
                }
            `}</style>
        </>

    );
}


export default function PaginaInicial() {
    //const username = 'jose-luan19';
    //Iniciando uma variavel para que o react reconheça que ela pode mudar e se mudar, que possa reatribuir esses valores(Mudança de state)
    //React.useState(''); -> A função devolve um array e uma function, que essa function será o set
    const [username, setUsername] = React.useState('jose-luan19');

    const roteamento = useRouter();

    return (
        <>
            <GlobalStyle />
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',/*alignContent: 'center',*/
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://images7.alphacoders.com/611/thumbbig-611138.webp)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '600px',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals[100],
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (infosDoEvento) {
                            /* Faz com que o form para de recarregar a pagina automaticamente */
                            infosDoEvento.preventDefault();
                            console.log('Submeteu')
                            //window.location.href = '/chat'; Maneira padrão, que dá o refresh

                            //Magica do next/React de mudar a pagina mais elegantemente e sem refresh
                            roteamento.push('/chat');
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Titulo>Boas vindas de volta!</Titulo>
                        <Text variant="body2" styleSheet={{ 
                            marginBottom: '20px', 
                            color: appConfig.theme.colors.neutrals[200],
                            backgroundColor: appConfig.theme.colors.neutrals['050'], 
                            borderRadius: '0px',
                            width: '130px'
                            }}>
                            {appConfig.name}
                        </Text>

                        {/* Input */}
                        <TextField
                            value={username}
                            onChange={function (event) {
                                console.log('usuario digitou', event.target.value);
                                // Onde ta o valor?
                                const valor = event.target.value;
                                //Trocar o valor da variavel
                                //através do React e avise quem precisa saber
                                //O React é performatico, esse simples set modifica em todos os componentes em que a variavel é usada
                                setUsername(valor);
                            }}
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals["000"],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[300],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                        />

                        <Button
                            type='submit'
                            label='Entrar'
                            size='lg'
                            // fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[700],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            //backgroundColor: appConfig.theme.colors.neutrals[100],
                            //borderColor: appConfig.theme.colors.neutrals[100],
                            //border: '1px solid',
                            //borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >
                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                            }}
                            src={`https://github.com/${username}.png`}
                        />
                        <Text
                            variant="body4"
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals[300],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                //borderRadius: '1000px'
                            }}
                        >
                            {username}
                        </Text>
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}