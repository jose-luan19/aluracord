import appConfig from '../config.json';
import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";



//Componente para por o nome na aba do navegador
function IndexPage() { 
    return (
        <Head>
            <title>AluraCord - DBZ</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
    );
}

//Componente react 
//Criação de uma tag que recebe como parametro o conteudo de onde ela é chamada
//Jutando todos as linguagens em um componente HTML, CSS E JS
function Titulo(props) {
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


export default function PaginaInicial() {
    //const username = 'jose-luan19';
    //Iniciando uma variavel para que o react reconheça que ela pode mudar e se mudar, que possa reatribuir esses valores(Mudança de state)
    //React.useState(''); -> A função devolve um array e uma function, que essa function será o set
    const [username, setUsername] = React.useState('jose-luan19');
    //Varivael para verificar se o ususario existe
    const [userExiste, setUserExiste] = React.useState(true);

    const [userFollowers, setUserFollowers] = React.useState();

    const [userFollowing, setUserFollowing] = React.useState();

    const [userURL, setUserURL] = React.useState('https://github.com/jose-luan19');

    //Variavel para mudar as Routers
    const roteamento = useRouter();

    function getGithubUser(event) {
        fetch(`https://api.github.com/users/${event.target.value}`)
            .then(async data => {
                var obj = await data.json()
                if (obj.message == undefined) {
                    setUserExiste(true)
                    setUsername(obj.login)
                    setUserFollowers(obj.followers)
                    setUserFollowing(obj.following)
                    setUserURL(obj.html_url)
                }
                else if ((obj.message == 'Not Found' || event.target.value == '') && username.length > 2) {
                    setUserExiste(false)
                    setName('')
                    setUsername('Usuário não encontrado')
                    setUserFollowers('')
                    setUserFollowing('')
                    setUserURL('')
                }
                else {
                    setUserExiste(true)
                    setName("")
                    setUsername(event.target.value)
                }
            })
            .catch(error => {
                console.log(error)
                return ''
            })
    }

    return (
        <>
            <IndexPage />
            <Box
                styleSheet={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',/*alignContent: 'center',*/
                    backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://images7.alphacoders.com/611/thumbbig-611138.webp)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundBlendMode: 'multiply',
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
                        width: '100%',
                        maxWidth: '600px',
                        borderRadius: '5px',
                        padding: '32px',
                        margin: '16px',
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
                            // console.log('Submeteu')
                            //window.location.href = '/chat'; Maneira padrão, que dá o refresh

                            //Magica do next/React de mudar a pagina mais elegantemente e sem refresh
                            if (userExiste) {
                                appConfig.username = username
                                roteamento.push(`/chat?username=${username}`)
                            }
                        }}
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: {
                                xs: '100%',
                                sm: '50%'
                            },
                            textAlign: 'center',
                            marginBottom: '32px',
                        }}
                    >
                        <Titulo>Boas vindas de volta!</Titulo>
                        <Text variant="body2" styleSheet={{
                            marginBottom: '20px',
                            color: appConfig.theme.colors.neutrals[200],
                            width: '130px'
                        }}>
                            {appConfig.name}
                        </Text>

                        {/* Texto de alerta caso o login não exista no github */}
                        {username.length > 2 && (
                            <Text
                                tag="label"
                                className="userNotFound"
                                styleSheet={{
                                    color: "red",
                                    fontSize: "14px",
                                    fontWeight: "300",
                                    alignSelf: "start",
                                    padding: "3px",
                                }}
                            >
                                {userExiste ? "" : "Usuário não encontrado"}
                            </Text>
                        ) }

                        {/* Input */}
                        <TextField
                            onChange={event => getGithubUser(event)}
                            placeholder="Usuário do Github"
                            /* onChange={function (event) {
                                console.log('usuario digitou', event.target.value);
                                // Onde ta o valor?
                                const valor = event.target.value;
                                //Trocar o valor da variavel
                                //através do React e avise quem precisa saber
                                //O React é performatico, esse simples set modifica em todos os componentes em que a variavel é usada
                                setUsername(valor);
                            }} */
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals["000"],
                                    mainColor: userExiste ? (username.length > 2 ? appConfig.theme.colors.neutrals[900] : "red") : "red",
                                    mainColorHighlight: userExiste ? (username.length > 2 ? appConfig.theme.colors.primary[300] : "red") : "red",
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
                    {username.length > 2 && (
                        /* condicional para que só mude o layout da box só se houver mais de 2 char's no input */
                        <Box
                            as='form'
                            onSubmit={function (e) {
                                e.preventDefault();
                                roteamento.push(userURL);
                            }}
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
                                /* condicional para que só mostre a imagem se houver mais de 2 char's no input */
                                src={userExiste ? (username.length > 2 ? `https://github.com/${username}.png` : "") : ""}
                                onError={function (event) {
                                    event.target.src = "https://openclipart.org/download/247319/abstract-user-flat-3.svg"
                                }}
                            />

                            {/* Username */}
                            {userExiste && (
                                <Text
                                    variant="body"
                                    styleSheet={{
                                        color: appConfig.theme.colors.neutrals[200],
                                        padding: '3px 10px',
                                        borderRadius: '1000px',
                                        fontSize: '20px',
                                    }}
                                >
                                    {username}
                                </Text>
                            ) }

                            {userExiste && (

                                <Text
                                    variant="body6"
                                    styleSheet={{
                                        color: appConfig.theme.colors.neutrals[200],
                                        padding: '3px 10px',
                                        borderRadius: '1000px'
                                    }}
                                >
                                    {(userFollowers != null) && (`Followers: ${userFollowers}`) }
                                    <br></br>
                                    {(userFollowing != null) && (`Following: ${userFollowing}`) }
                                    
                                </Text>


                            ) }

                            {userExiste && (
                                <Button
                                    type='submit'
                                    label='Visit profile'
                                    size='lg'
                                    styleSheet={{
                                        padding: '3px 10px',
                                        borderRadius: '1500px'
                                    }}
                                    buttonColors={{
                                        contrastColor: appConfig.theme.colors.neutrals["000"],
                                        mainColor: appConfig.theme.colors.primary[700],
                                        mainColorLight: appConfig.theme.colors.primary[400],
                                        mainColorStrong: appConfig.theme.colors.primary[600],
                                    }}
                                />
                            )}
                        </Box>
                    ) }

                    {/* Photo Area */}

                </Box>
            </Box>
        </>
    );
}