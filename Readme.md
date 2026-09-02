# Posterizador

Una página web estática, al estilo [Rasterbator](https://rasterbator.net/), que
convierte cualquier imagen en un póster gigante para imprimir en varias hojas
A4 / Carta / Legal / A3 y pegar entre sí.

Todo el procesamiento (recorte en páginas, trama de puntos, exportación a PDF)
ocurre en el propio navegador con `<canvas>`; la imagen nunca se envía a
ningún servidor.

## Uso

Abre `index.html` en un navegador (o sírvelo con cualquier servidor estático,
por ejemplo `python3 -m http.server`).

1. Sube o arrastra una imagen.
2. Elige el tamaño final del póster (cm), el tamaño de papel, el margen de
   impresión y el solape entre hojas para poder pegarlas.
3. Elige un efecto de trama (puntos en blanco y negro, puntos a color, o
   ninguno).
4. Pulsa **Generar póster** para ver la vista previa página por página.
5. Imprime directamente desde el navegador o descarga un PDF con todas las
   páginas ya en su tamaño real.

## Estructura

- `index.html` — estructura de la página y controles.
- `css/style.css` — estilos, incluida la hoja de estilos de impresión.
- `js/app.js` — lógica: carga de imagen, cálculo de la rejilla de páginas,
  efecto de trama (halftone) y exportación a PDF (vía [jsPDF](https://github.com/parallax/jsPDF)).
