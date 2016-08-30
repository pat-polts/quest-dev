#Instruções quest-olaparibe: 

-------------------
| » Dependências: |
-------------------

	*********
	+ NodeJS
	*********

		» https://nodejs.org/en/


	**********
	+ MongoDB 
	**********


		» https://www.mongodb.com/

		| Temporário
		| apenas para termos um fluxo de dados funcionando enquanto
		| a api do banco de dados não ficar pronta.



	********
	+ Bower 
	********


		» https://bower.io/ 

		| Bower precisa ser instalado globalmente via npm
		| para ser utilizado no projeto, caso ocorra erros
		| ao rodar o projeto verifique se o bower foi instalado
		| corretamente, as vezes o comando  "npm install -g bower"
		| não funciona corretamente, varia de acordo com o sistema
		| operacional, se isso ocorrer entre no modo super usuario
		| no terminal e digite o comando



	********
	+ Grunt 
	********


		» http://gruntjs.com/getting-started

		| Grunt precisa ser instalado globalmente via npm
		| mesmo passo feito com o bower caso o comando 
		| "npm install -g grunt-cli"  não instale globalmente
		| importante para rodar o projeto local



-----------------------------
| » Passos para instalação: |
-----------------------------

	
	» Copiar projeto

	» Acessar pasta do projeto via terminal

	» Instalar pacotes:

		+ instalar pacotes node_modules:

			"npm install"

		
		+ instalar pacotes bower:

			"bower install "


		+ ou em um único comando instalar todos pacotes:

			"npm install && bower install" 


		+ rodar tarefas do grunt e iniciar servidor:

			"npm start"


		+ Acesse a url http://localhost:3000/


		***********************************************************
		O comando "npm start" automaticamente roda as tarefas necessárias do grunt mas as vezes após uma mudança em um dos arquivos gerados pelo gruntse faz necessário rodar o comando "grunt" separadamente.
		-----------------------------------------------------------/

		***********************************************************
		Outro comando que pode ser util é o "grunt changes"
		que roda um "grunt watch" e gera um output no terminal de todas as tarefas que o grunt está executando em tempo real.
		-----------------------------------------------------------/



-----------------------
| » Tarefas do grunt: |
-----------------------
	
	» uglify:

		+ minifica arquivos javascript: 

			de: dist/js/global.js

			para: dist/js/global.min.js

	
	» less:

		+ compila arquivos less para css: 

			de: src/styles/stylesheet.less 

			para: src/styles/stylesheet.css 

	
	» cssmin:

		+ minifica arquivos css: 

			de: src/styles/stylesheet.css 

			para: src/styles/stylesheet.min.css 

	
	» wiredep:

		+ injeta dependências do bower nos arquivos necessários: 

			injeta em: views/index.html

	
	» concat:

		+ concatena arquivos javascript em um único arquivo: 

			concatena: 
				src/js/main.js, src/js/controllers.js, 
				src/js/services.js, src/js/directives.js

			para: dist/global.js