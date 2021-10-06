const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};


var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
  var camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);


function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/node3': {
      recuperar(pedido,respuesta);
      break;
    } 
      default : {  
      fs.exists(camino,function(existe){
        if (existe) {
          fs.readFile(camino,function(error,contenido){
            if (error) {
              respuesta.writeHead(500, {'Content-Type': 'text/plain'});
              respuesta.write('Error interno');
              respuesta.end();          
            } else {
              var vec = camino.split('.');
              var extension=vec[vec.length-1];
              var mimearchivo=mime[extension];
              respuesta.writeHead(200, {'Content-Type': mimearchivo});
              respuesta.write(contenido);
              respuesta.end();
            }
          });
        } else {
          respuesta.writeHead(404, {'Content-Type': 'text/html'});
          respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');   
          respuesta.end();
        }
      }); 
    }
  } 
}

const node3 = (actionType, number, str) => {
    const alphabet = 'abcdefghijklmnñopqrstuvwxyz';
    let newStr = '';

 for(let i = 0; i < str.length; i++) {
  let LetterNumber = actionType == 'encrypt' ? alphabet.indexOf(str[i]) + number : alphabet.indexOf(str[i]) - number;
   newStr += alphabet[((LetterNumber % 27) + 27) % 27];
    }

    return newStr;
}



function recuperar(pedido,respuesta) {
    let messageData;
    pedido.on('data', data => {
         messageData = querystring.parse(data.toString());
            messageData['str'] = messageData['str'].toLowerCase();
            messageData['number'] = Number.parseInt(messageData['number']);
    });
    pedido.on('end', function(){
        if(!messageData || messageData['actionType'] == '' || messageData['number'] == null || messageData['str'] == ''){
                respuesta.writeHead(302, {'Location': '/'});
                respuesta.end();
        }else{
                let newStr = node3(messageData['actionType'], messageData['number'], messageData['str']);
                respuesta.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                respuesta.write(`<p>Resultado: ${newStr}</p></br>
                    <a href="/">Retornar</a>`);
                respuesta.end();
            }

        });
    }


console.log('Servidor web iniciado');