//Por ser um arquivo criado em pages e exportado o default ele já cria a pagina 
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import IndexPage from '../components/indexPage';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Context } from '../contexts/context'
import GetUserInfoGithub from '../services/getUserInfoGithub'
import GithubInfo from '../components/githubInfo';
import Sticker from '../components/sticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU1NTU2MiwiZXhwIjoxOTU5MTMxNTYyfQ.WaFTvmsTtc0CVpWsYsOVbYx7zrSRPrufsnRlw1yUxmA';
const SUPABASE_URL = 'https://teuzaridijlkadtsrknj.supabase.co';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export default function ChatPage() {
  const appRouter = useRouter();
  let { login } = React.useContext(Context)
  const USER = login.value.username
  const [message, setMessage] = React.useState('');
  const [messageList, setMessageList] = React.useState([]);


  React.useEffect(() => {
    if (!USER) {
      window.location.href = '/'

    }
    else {
      listemMesages();
      getListMessagens();
    }
  }, []);

  const Erase = (id) => {
    supabaseClient.from('mensagens').delete().match({ id: id }).then();
  }

  const listemMesages = () => {
    return supabaseClient.from('mensagens')
      .on('*', (retorno) => {
        getListMessagens()
      })
      .subscribe();
  }

  const getListMessagens = () => {
    supabaseClient.from('mensagens').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      let messages = data.map((message) => { return { ...message, dono: message.de === USER } })
      setMessageList(messages);
    });

  }

  const handleNewMessage = (newMessage) => {
    if (newMessage.replaceAll(' ', '') !== '') {
      let men = { de: USER, texto: newMessage }
      supabaseClient.from('mensagens').insert([men])
        .then((retorno) => {
          getListMessagens();
        });
      setMessage('');
    }

  }

  const keyPress = (event) => {
    if ((event.key === 'Enter') && (!event.shiftKey)) {
      event.preventDefault();
      handleNewMessage(message);
    }
  }

  const onStickerClick = (stiker) => {
    let men = `:stiker:${stiker}`
    handleNewMessage(men);
  }

  if (!USER) {
    return (<Box styleSheet={styles.view}>
      <CircularProgress color="secondary" />
    </Box>)
  }

  return (
    <Box styleSheet={styles.view}>
      <Box styleSheet={styles.panel}>
        <Header login={login} />
        <Box styleSheet={styles.innerPanel}>
          {
            messageList.length <= 0 ?
              <CircularProgress color="secondary" />
              :
              <MessageList messages={messageList} erase={Erase} />
          }

          <Box as="form" styleSheet={styles.form}>
            <Box styleSheet={styles.formTextArea}>
              <TextField
                placeholder="Insira sua mensagem aqui..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={keyPress}
                type="textarea"
                styleSheet={styles.textArea}
              />
            </Box>
            <Box styleSheet={styles.formButtonsArea}>
              <Button
                onClick={() => handleNewMessage(message)}
                type='button'
                label='Ok'
                styleSheet={styles.button}
                buttonColors={{
                  contrastColor: style.theme.colors.neutrals["000"],
                  mainColor: style.theme.colors.primary[500],
                  mainColorLight: style.theme.colors.primary[400],
                  mainColorStrong: style.theme.colors.primary[600],
                }}
              />
              <Box styleSheet={styles.buttonStiker}>
                <ButtonSendSticker onStickerClick={onStickerClick} />
              </Box>
            </Box>


          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header({ login }) {

  const logout = () => {
    let log = login.value
    log.username = ''
    login.set(log)
    window.location.href = '/'
  }
  return (
    <Box styleSheet={styles.components.header.panel} >
      <Text variant='heading5' styleSheet={styles.components.header.title}>
        Chat
      </Text>
      <Box styleSheet={styles.components.header.imagePanel} >
        <Image styleSheet={styles.components.header.image}
          src={`${appConfig.GITHUB}${login.value.username}.png`}
        />
      </Box>


      <Button
        variant='tertiary'
        colorVariant='neutral'
        label='Logout'
        onClick={logout}
      />
    </Box>
  )
}

function Message({ message, erase }) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Text tag="li" styleSheet={styles.components.message.panel}>
      <Box
      >
        <Box styleSheet={{
          flexDirection: 'row', display: 'flex',
          alignItems: 'center',
          justifyContent: `${message.dono ? 'right' : 'left'}`,
        }}>
          <Image
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            styleSheet={styles.components.message.image}
            src={`${appConfig.GITHUB}${message.de}.png`}
          />
          <Text tag="strong" styleSheet={styles.components.message.name}>
            {message.de}
          </Text>
          <Text styleSheet={styles.components.message.data} tag="span">
            {new Date(message.created_at).toLocaleDateString()}
          </Text>
          {
            (message.dono) ?
              <Icon name={"FaEraser"}
                onClick={() => erase(message.id)}
                styleSheet={styles.components.message.iconErase} /> :
              <></>

          }
        </Box>
      </Box>
      <Box styleSheet={{
        flexDirection: 'row', display: 'flex',
        alignItems: 'center',
        justifyContent: `${message.dono ? 'right' : 'left'}`
      }}>

        {
          message.texto.startsWith(':stiker:') ?
            (
              <Box styleSheet={styles.components.message.stiker} >
                <Sticker src={message.texto.replace(':stiker:', '')} />
              </Box>
            ) :
            (
              <Text styleSheet={styles.components.message.text}>
                {message.texto}
              </Text>)
        }


      </Box>

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <GithubPanel id={message.id} name={message.de} />
      </Popover>
    </Text>
  )
}

const GithubPanel = ({ id, name }) => {

  const [userGitHub, setuserGitHub] = React.useState({});

  React.useEffect(() => {
    const getUserGitHub = async (username) => {
      const success = (dados) => {
        setuserGitHub(dados)
      }
      GetUserInfoGithub(username, success, () => { });
    }

    getUserGitHub(name);
  }, []);
  if (userGitHub.id === null) {
    return (<Card sx={styles.components.githubPanel.card}>
      <CircularProgress color="secondary" />
    </Card>
    )
  }

  return (
    <Card sx={styles.components.githubPanel.card}>
      <CardMedia
        component="img"
        height="140"
        image={`${appConfig.GITHUB}${name}.png`}
        alt={name}
      />
      <CardContent>
        <Box styleSheet={styles.components.githubPanel.nameBox}>
          <Text styleSheet={styles.components.githubPanel.name}>
            {userGitHub.name}
          </Text>
        </Box>
        <Box styleSheet={styles.components.githubPanel.infosBox}>
          <GithubInfo icon={"FaCode"} text={'Repositórios'}
            number={userGitHub.public_repos} />
          <GithubInfo icon={"FaPeopleArrows"} text={'Seguidores'}
            number={userGitHub.followers} />
        </Box>
        <Box styleSheet={styles.components.githubPanel.bio}>
          <Text styleSheet={styles.components.githubPanel.bioText}>
            {userGitHub.bio}
          </Text>
        </Box>
        <Box styleSheet={styles.components.githubPanel.gitLink}>
          <Icon name={"FaGithub"} size="5ch"
            onClick={() => erase(message.id)}
            styleSheet={styles.components.githubPanel.icon} />
        </Box>



      </CardContent>
      <CardActions>

      </CardActions>
    </Card>

  )
}

function MessageList({ messages, erase }) {
  return (
    <Box tag="ul" styleSheet={styles.components.messageList.panel}>
      {messages.map((message) => {
        return (
          <Box key={message.id}>
            <Message message={message} erase={erase} />
          </Box>
        )
      })}
    </Box>
  )
}
const styles = {
  view: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: appConfig.theme.colors.primary[500],
    backgroundImage: `url(${appConfig.BACKGROUND})`,
    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
    borderRadius: '5px',
    backgroundColor: appConfig.theme.colors.neutrals[600],
    height: '100%',
    maxWidth: '95%',
    maxHeight: '95vh',
    padding: '5px',
  },
  innerPanel: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    height: '80%',
    backgroundColor: appConfig.theme.colors.neutrals[700],
    flexDirection: 'column',
    borderRadius: '5px',
    padding: '5px',
    margin: '5px',
  },
  form: {
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formTextArea: {
    width: '100%',
    marginRight: '5px'

  },
  formButtonsArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: '50%',
    padding: '0 3px 0 0',
    minWidth: '50px',
    minHeight: '50px',
    fontSize: '20px',
    marginBottom: '8px',
    lineHeight: '0',
    display: 'flex',
    marginRight: '5px',
    display: {
      xs: 'none',
      sm: 'flex',
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    width: '100%',
    border: '0',
    resize: 'none',
    borderRadius: '5px',
    padding: '6px 8px',
    backgroundColor: appConfig.theme.colors.neutrals[800],
    marginRight: '12px',
    color: appConfig.theme.colors.neutrals[200],
  },
  buttonStiker: {

  },
  components: {
    header: {
      panel: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px'
      },
      imagePanel: {
        height: '40px',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        borderRadius: '50%',
        height: '100%',
        margin: '0px'
      },
      title: {
        color: appConfig.theme.colors.neutrals['000'],
      }
    },
    messageList: {
      panel: {
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        marginBottom: '16px'
      }
    },
    message: {
      panel: {
        borderRadius: '5px',
        padding: '6px',
        marginBottom: '12px',
        hover: {
          backgroundColor: appConfig.theme.colors.neutrals[600],
        }
      },
      image: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '8px',
      },
      name: {
        color: appConfig.theme.colors.neutrals['000'],
      },
      data: {
        fontSize: '10px',
        marginLeft: '8px',
        color: appConfig.theme.colors.neutrals[300],
      },
      iconErase: {
        marginLeft: '15px',
        width: '16px',
        height: '16px',
        color: appConfig.theme.colors.neutrals['800'],
        hover: {
          color: appConfig.theme.colors.neutrals['000'],
        }
      },
      text: {
        color: appConfig.theme.colors.neutrals['000'],
      },
      stiker: {
        margin: '5px',
        width: '150px',
        boxShadow: '5px 5px 5px -2px rgba(62,53,69,0.7)',
      }
    },

    githubPanel: {
      card: {
        backgroundColor: appConfig.theme.colors.neutrals['800'],
        maxWidth: '380px'
      },
      nameBox: {
        marginBottom: '15px'
      },
      name: {
        color: appConfig.theme.colors.neutrals['000'],
      },
      infosBox: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        with: '100%',
        marginBottom: '15px'
      },
      bio: {
        with: '100%'
      },
      bioText: {

        color: appConfig.theme.colors.neutrals['000'],
        fontSize: 'small'
      },
      gitLink: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5px',
      },
      icon: {
        color: appConfig.theme.colors.neutrals['000'],
      }
    }
  }

}