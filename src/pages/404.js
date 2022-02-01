// Pagina de erro, caso tente entrar em alguma pgina inexistente ou com erro, aparecera essa pagina automaticamente 

import { Box, Button, Image, Text } from "@skynexui/components";
import { useRouter } from "next/router";

import appConfig from "../../config.json";

import Head from "next/head";

function IndexPage() {
    return (
        <Head>
            <title>404 ERROR | AluraCord - DBZ </title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
    );
}

export default function Custom404() {
    const roteamento = useRouter();

    return (
        <>
            <IndexPage text='404 ERROR | AluraCord - DBZ '/>
            <Box
                styleSheet={{
                    backgroundColor: "black",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text
                    variant="heading1"
                    styleSheet={{
                        color: appConfig.theme.colors.neutrals["050"],
                        marginBottom: "10px",
                    }}
                >
                    ERROR 404
                </Text>

                <Image
                    styleSheet={{
                        height: "50%",
                        marginBottom: "40px",
                    }}
                    src={appConfig.IMAGE_404}
                ></Image>

                <Text
                    variant="heading3"
                    styleSheet={{
                        color: appConfig.theme.colors.neutrals["050"],
                        marginBottom: "10px",
                    }}
                >
                    PAGE NOT FOUND
                </Text>

                <Button
                    type="submit"
                    label="Back to home page"
                    onClick={function (e) {
                        e.preventDefault;
                        roteamento.push("/");
                    }}
                    styleSheet={{
                        marginBottom: "10px",
                    }}
                    buttonColors={{
                        contrastColor: appConfig.theme.colors.neutrals["200"],
                        mainColor: appConfig.theme.colors.primary["700"],
                        mainColorLight: appConfig.theme.colors.primary[400],
                        mainColorStrong: appConfig.theme.colors.primary[600],
                    }}
                />
            </Box>
        </>
    );
}