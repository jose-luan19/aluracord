import React from 'react'
import { Box, Text, Icon } from '@skynexui/components';
import appConfig from '../../config.json';



const GithubInfo = ({ icon, text, number }) => {

    return (
        <Box
            styleSheet={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '10px',
                padding: '2px',
                backgroundColor: appConfig.theme.colors.neutrals["000"],
                border: '1px solid',
                borderColor: appConfig.theme.colors.neutrals[999],
                borderRadius: '10px',
                minWidth: '160px'
            }}>
            <Icon name={icon}
                styleSheet={{
                    marginRight: '2px',
                    marginLeft: '5px',
                    width: '16px'
                }} />
            <Text variant="body4" styleSheet={{
                color: appConfig.theme.colors.neutrals['900'],
                padding: '3px 10px',
                borderRadius: '1000px'
            }}>
                {text}
            </Text>
            <Text variant="body4"
                styleSheet={{
                    color: appConfig.theme.colors.neutrals[200],
                    backgroundColor: appConfig.theme.colors.neutrals[900],
                    padding: '3px 10px',
                    borderRadius: '1000px'
                }}>
                {number}
            </Text>
        </Box>

    )
}

export default GithubInfo;