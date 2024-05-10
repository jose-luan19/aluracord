//Por ser um arquivo criado em pages e exportado o default ele já cria a pagina 
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import Head from "next/head";
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', (respostaLive) => {
      adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

function IndexPage() {
  return (
    <Head>
      <title>Chat | Aluracord DBZ</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
}

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  const router = useRouter();
  const usuarioLogado = router.query.username;

  //Como a requisição a um DB não precisa ser executado em qualquer mudança de estado, ele precisa seguir outro fluxo de execução 
  React.useEffect(() => {
    supabaseClient.
      from('mensagens').
      select('*').
      order('id',{ascending: false}).
      then(({ data }) => {
        setListaDeMensagens(data);
      });

      const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
        // Quero reusar um valor de referencia (objeto/array) 
        // Passar uma função pro setState
  
        setListaDeMensagens((valorAtualDaLista) => {
          return [
            //sintaxe para que os elementos que já tinha no array permaneçam e que não crie um arrey dentro de outro 
            novaMensagem,
            ...valorAtualDaLista,
          ]
        });
      });
  
      return () => {
        subscription.unsubscribe();
      }
    }, []);


  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      texto: novaMensagem,
    };

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ]).then(({data}) => {
      });
    setMensagem('');
  }

  return (
    <>
      <IndexPage />
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: `url(https://images7.alphacoders.com/611/thumbbig-611138.webp)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
          color: appConfig.theme.colors.neutrals['000']
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            borderRadius: '5px',
            backgroundColor: appConfig.theme.colors.neutrals[999],
            height: '100%',
            maxWidth: '95%',
            maxHeight: '95vh',
            padding: '32px',
          }}
        >
          <Header />
          <Box
            styleSheet={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              height: '80%',
              backgroundColor: appConfig.theme.colors.neutrals[600],
              flexDirection: 'column',
              borderRadius: '5px',
              padding: '16px',
            }}
          >
            {/* Passando o array listaDeMensagens como parametro para function MessageList */}
            <MessageList mensagens={listaDeMensagens} />

            <Box
              as="form"
              styleSheet={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* <Box
              styleSheet={{
                display: 'flex',
                width: "calc(100% - 50px)",
                alignItems: 'center',
                justifyContent: "center",
                marginRight: "10px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                borderRadius: '10px',
              }}
            ></Box> */}

              <TextField
                value={mensagem}
                //Arrow function
                onChange={(e) => {
                  setMensagem(e.target.value);
                }}

                // função para verificar o teclado
                onKeyPress={(e) => {
                  if ((mensagem.length > 0) &
                    (e.key === "Enter") &
                    (e.shiftKey === false)) {
                    e.preventDefault();
                    handleNovaMensagem(mensagem);
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  width: '100%',
                  border: '0',
                  resize: 'none',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  marginRight: '12px',
                  color: appConfig.theme.colors.neutrals["050"],
                }}
              />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                // console.log('[USANDO O COMPONENTE] Salva esse sticker no banco', sticker);
                handleNovaMensagem(':sticker: ' + sticker);
              }}
            />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{
        width: '100%',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          color='black'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {/* Mapeando as mensagens que foi recebida como parametro, definindo os 3 atributos id, de, texto */}
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
            </Box>
            {mensagem.texto.startsWith(':sticker:')
              ? (
                <Image src={mensagem.texto.replace(':sticker:', '')} />
              )
              : (
                mensagem.texto
              )}
          </Text>
        );
      })}
    </Box>
  )
}