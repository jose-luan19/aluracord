import React from 'react';
import { Box, Button, Text, Image } from '@skynexui/components';
import appConfig from '../../config.json';

import Stycker from './sticker'

export function ButtonSendSticker(props) {
  const [isOpen, setOpenState] = React.useState('');

  const styles = Styles(isOpen);

  const sendStikes = (sticker) => {
    if (Boolean(onStickerClick)) {
      onStickerClick(sticker);
    }
  }

  return (
    <Box styleSheet={styles.panel}>

      <Button styleSheet={styles.sendButton}
        label="😋"
        onClick={() => setOpenState(!isOpen)}
      />

      {isOpen && (
        <Box styleSheet={styles.panelOptions}
          onClick={() => setOpenState(false)}
        >
          <Text styleSheet={styles.panelOptionsText}>
            Stickers
          </Text>

          <Box
            tag="ul"
            styleSheet={styles.stykesList}>
            {appConfig.stickers.map((sticker) => (
              <Text
                tag="li" key={sticker}
                onClick={() => sendStikes(sticker)}
                styleSheet={styles.stykesListLine}
              >
                <Stycker src={sticker} />
              </Text>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

const Styles = (isOpen) => {

  return {
    panel: {
      position: 'relative',

    },
    sendButton: {
      borderRadius: '50%',
      padding: '0 3px 0 0',
      minWidth: '50px',
      minHeight: '50px',
      fontSize: '20px',
      marginBottom: '8px',
      lineHeight: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appConfig.theme.colors.neutrals[300],
      filter: isOpen ? 'grayscale(0)' : 'grayscale(1)',
      hover: {
        filter: 'grayscale(0)',
      }
    },
    panelOptions: {

      display: 'flex',
      flexDirection: 'column',
      borderRadius: '5px',
      position: 'absolute',
      backgroundColor: appConfig.theme.colors.neutrals[800],
      width: {
        xs: '200px',
        sm: '290px',
      },
      height: '300px',
      right: '30px',
      bottom: '30px',
      padding: '10px',

      boxShadow: 'rgba(4, 4, 5, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px',
    },
    panelOptionsText: {
      color: appConfig.theme.colors.neutrals["000"],
      fontWeight: 'bold',
    },
    stykesList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      flex: 1,
      paddingTop: '16px',
      overflowY: 'scroll',
    },
    stykesListLine: {
      width: '50%',
      borderRadius: '5px',
      padding: '10px',
      focus: {
        backgroundColor: appConfig.theme.colors.neutrals[600],
      },
      hover: {
        backgroundColor: appConfig.theme.colors.neutrals[600],
      }
    }
  }
}