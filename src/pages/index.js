import appConfig from '../../config.json';
import { Box, Button, Text, TextField, Image, Icon } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';


import CircularProgress from '@material-ui/core/CircularProgress';
import GetUserInfoGithub from '../services/getUserInfoGithub';
import Titulo from '../components/title';
import ListAlert from './../components/listAlert';
import GithubInfo from './../components/githubInfo';
import { Context } from '../contexts/context';
import IndexPage from '../components/indexPage';


export default function PaginaInicial() {
    let { login } = React.useContext(Context);

    const [username, setUsername] = React.useState('');
    const [seeking, setSeeking] = React.useState('');
    const [alerts, setAlerts] = React.useState([]);
    const [user, setUser] = React.useState({ followers: 0, repositories: 0 });
    const [image, setImage] = React.useState(appConfig.STANDERT_USER);

    //Variavel para mudar as Routers
    const roteamento = useRouter();
    const validUsername = (event) => {

        const value = event.target.value;

        const success = (dados) => {
            setImage(`${appConfig.GITHUB}${dados.login}.png`)
            setUser({ followers: dados.followers, repositories: dados.public_repos })
        }

        if (value.length > 2) {
            let result = GetUserInfoGithub(value, success, setAlerts);
        }
        else {
            setUser({ followers: 0, repositories: 0 })
            setImage(appConfig.STANDERT_USER)
        }

        setUsername(value)
    }

    const changePage = async (event) => {
        event.preventDefault();

        const success = (dados) => {
            let log = login.value
            log.username = dados.login
            login.set(log)
            roteamento.push(`/chat?username=${dados.login}`)
        }
        setSeeking(true)
        GetUserInfoGithub(username, success, setAlerts);

    }

    return (
        <>
            <IndexPage />
            <Box styleSheet={styles.view}>
                <Box styleSheet={styles.panel}>
                    <Box as="form" onSubmit={changePage} styleSheet={styles.form}>
                        {seeking ? <CircularProgress color="secondary" /> : <></>}

                        <Titulo>Boas vindas de volta!</Titulo>
                        <Text variant="body2" styleSheet={styles.subtitle}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            onChange={validUsername}
                            placeholder="Usuário do Github"
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
                        <ListAlert messages={alerts} type={'warning'} />

                        <Button
                            type='submit'
                            disabled={(username.length < 3) && !seeking}
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

                    <Box
                        as='form'
                        onSubmit={function (e) {
                            e.preventDefault();
                            roteamento.push(userURL);
                        }}
                        styleSheet={styles.photoBox}
                    >
                        <Image
                            styleSheet={styles.image}
                            src={username.length > 2 ? image : ""}
                            onError={function (event) {
                                event.target.src = "https://openclipart.org/download/247319/abstract-user-flat-3.svg"
                            }}
                        />

                        <Text variant="body" styleSheet={styles.nameArea}>
                            {username}
                        </Text>

                        <Box styleSheet={styles.infoArea}>
                            <GithubInfo icon={"FaCode"} text={'Repositories'}
                                number={user.repositories} />
                            <GithubInfo icon={"FaPeopleArrows"} text={'Followers'}
                                number={user.followers} />
                        </Box>


                        <Button
                            type='submit'
                            label='Visit profile'
                            size='lg'
                            styleSheet={buttonProfile}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[700],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />

                    </Box>


                    {/* Photo Area */}

                </Box>
            </Box>
        </>
    );
}

const styles = {
    view: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',/*alignContent: 'center',*/
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(${appConfig.BACKGROUND})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
    },
    panel: {
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
    },
    form: {
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
    },
    subtitle: {
        marginBottom: '20px',
        color: appConfig.theme.colors.neutrals[200],
        width: '130px'
    },
    photoBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '200px',
        padding: '16px',
        backgroundColor: appConfig.theme.colors.neutrals[100],
        border: '1px solid',
        borderColor: appConfig.theme.colors.neutrals[100],
        borderRadius: '10px',
        flex: 1,
        minHeight: '240px',
    },
    image: {
        borderRadius: '50%',
        marginBottom: '16px',
    },
    nameArea: {
        color: appConfig.theme.colors.neutrals[200],
        padding: '3px 10px',
        borderRadius: '1000px',
        fontSize: '20px',
    },
    infoArea: {
        flexDirection: 'column',
        marginTop: '10px'
    },
    buttonProfile: {
        padding: '3px 10px',
        borderRadius: '1500px'
    }
}