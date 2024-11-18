/* eslint-disable */

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import { Box, IconButton, List, ListItem, ListItemText, Paper, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Button from '@mui/material/Button';
import { Send } from '@mui/icons-material';
import ReactTypingEffect from 'react-typing-effect';

export default function HelpView() {
  const [historial, setHistorial] = useState([]);
  const [pregunta, setPregunta] = useState('');

  const procesarRespuesta = (respuesta) => {
    const indexCitations = respuesta.indexOf('<citations>');
    if (indexCitations !== -1) {
      respuesta = respuesta.substring(0, indexCitations).trim();
    }

    respuesta = respuesta.replace(/\[\^.*?\]/g, '');

    // Detectar listas numeradas y con viñetas y formatearlas con saltos de línea
    respuesta = respuesta.replace(/(\d+\.\s)/g, '\n$1'); // Listas numeradas
    respuesta = respuesta.replace(/([•-]\s)/g, '\n$1'); // Viñetas con "•" o "-"

    respuesta = respuesta.replace(/\n{2,}/g, '\n');

    return respuesta.trim();
  };

  const handleSendClick = async () => {
    if (pregunta.trim() === '') return;

    const nuevaPregunta = { tipo: 'pregunta', texto: pregunta };

    setHistorial((prevHistorial) => [...prevHistorial, nuevaPregunta]);

    try {
      const response = await fetch(
        'https://api.stack-ai.com/inference/v0/run/e5b03546-8d89-49c3-92f8-5af385fbd762/66f5ac8b920b2aa5274bb26e',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer 563769f1-0408-4543-9178-1be60f8cfac3',
          },
          body: JSON.stringify({
            'in-0': pregunta,
            user_id: 'rubendotru@gmail.com',
          }),
        }
      );

      const data = await response.json();
      const respuestaOriginal = data.outputs['out-0'];
      const respuestaProcesada = procesarRespuesta(respuestaOriginal);

      const nuevaRespuesta = { tipo: 'respuesta', texto: respuestaProcesada };

      setHistorial((prevHistorial) => [...prevHistorial, nuevaRespuesta]);
    } catch (error) {
      console.error('Error al obtener la respuesta de la API:', error);
      const errorRespuesta = {
        tipo: 'respuesta',
        texto: 'Hubo un error al obtener la respuesta. Por favor, inténtalo nuevamente.',
      };
      setHistorial((prevHistorial) => [...prevHistorial, errorRespuesta]);
    }

    setPregunta('');
  };

  return (
    <Container maxWidth="100%">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Pregúntale a Javis
      </Typography>

      <Paper sx={{ p: 2, borderRadius: '8px', height: '60vh', overflowY: 'auto' }}>
        <List>
          {historial.map((item, index) => (
            <ListItem
              key={index}
              sx={{ justifyContent: item.tipo === 'pregunta' ? 'flex-end' : 'flex-start' }}
            >
              <ListItemText
                primary={
                  item.tipo === 'respuesta' ? (
                    <ReactTypingEffect
                      text={item.texto}
                      speed={30}
                      eraseDelay={9999999}
                      typingDelay={0}
                      eraseSpeed={0}
                      cursor={' '}
                      style={{ whiteSpace: 'pre-line' }}
                    />
                  ) : (
                    item.texto
                  )
                }
                primaryTypographyProps={{
                  align: item.tipo === 'pregunta' ? 'right' : 'left',
                  backgroundColor: item.tipo === 'pregunta' ? '#5B36F2' : '#ECF4F9',
                  color: item.tipo === 'pregunta' ? 'white' : 'textSecondary',
                  borderRadius: 1,
                  padding: 1.5,
                  width: 'fit-content',
                  maxWidth: '80%',
                  marginLeft: item.tipo === 'pregunta' ? 'auto' : 0,
                  whiteSpace: 'pre-line',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box display="flex" alignItems="center" marginTop={2} marginBottom={2}>
        <TextField
          name="text"
          placeholder="Pregúntale a Jarvis"
          variant="outlined"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: '50px',
            padding: '0px',
            width: '100%',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          fullWidth
        />
        <IconButton onClick={handleSendClick}>
          <Send sx={{ color: '#5B36F2' }} />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#25D366',
          color: 'white',
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: '#25D366',
          },
        }}
        fullWidth
        startIcon={<WhatsAppIcon />}
        component="a"
        href="https://api.whatsapp.com/send?phone=51915185499&text=Hola,%20tengo%20una%20consulta"
        target="_blank"
      >
        Necesito ayuda orientada
      </Button>
    </Container>
  );
}
